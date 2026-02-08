// src/ui/canvas/useCanvasZoom.ts
import type { CameraState } from '@/ui/camera/cameraState';
import type { Bounds } from '@/ui/camera/fitCameraToBounds';
import { clampCameraToBounds } from '@/ui/camera/clampCameraToBounds';

const MAX_SCALE = 6;

export function bindCanvasZoom(canvas: HTMLCanvasElement, camera: CameraState, bounds: Bounds) {
  const onWheel = (e: WheelEvent) => {
    e.preventDefault();

    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    const wx = (sx - camera.x) / camera.scale;
    const wy = (sy - camera.y) / camera.scale;

    const zoomFactor = 1.1;
    const direction = e.deltaY < 0 ? 1 : -1;

    const nextScale = direction > 0 ? camera.scale * zoomFactor : camera.scale / zoomFactor;

    // ✅ 핵심: minScale 기준으로만 줌 아웃 제한
    const clampedScale = Math.min(Math.max(nextScale, camera.minScale), MAX_SCALE);

    camera.scale = clampedScale;
    camera.x = sx - wx * camera.scale;
    camera.y = sy - wy * camera.scale;

    clampCameraToBounds(camera, bounds, canvas);
  };

  canvas.addEventListener('wheel', onWheel, { passive: false });

  return () => canvas.removeEventListener('wheel', onWheel);
}
