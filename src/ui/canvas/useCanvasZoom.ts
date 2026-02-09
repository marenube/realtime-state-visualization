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

  let pinchStartDist = 0;
  let pinchStartScale = 1;

  const getTouchDist = (t1: Touch, t2: Touch) =>
    Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);

  const onTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      pinchStartDist = getTouchDist(e.touches[0], e.touches[1]);
      pinchStartScale = camera.scale;
    }
  };

  const onTouchMove = (e: TouchEvent) => {
    if (e.touches.length !== 2) return;
    e.preventDefault();

    const dist = getTouchDist(e.touches[0], e.touches[1]);
    const scale = pinchStartScale * (dist / pinchStartDist);

    const rect = canvas.getBoundingClientRect();
    const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
    const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;

    const worldX = (cx - camera.x) / camera.scale;
    const worldY = (cy - camera.y) / camera.scale;

    camera.scale = Math.min(Math.max(scale, camera.minScale), camera.maxScale ?? Infinity);

    camera.x = cx - worldX * camera.scale;
    camera.y = cy - worldY * camera.scale;

    clampCameraToBounds(camera, bounds, canvas);
  };

  canvas.addEventListener('touchstart', onTouchStart, { passive: false });
  canvas.addEventListener('touchmove', onTouchMove, { passive: false });
  canvas.addEventListener('wheel', onWheel, { passive: false });

  return () => canvas.removeEventListener('wheel', onWheel);
}
