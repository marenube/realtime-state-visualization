// src/ui/camera/clampCameraToBounds.ts
import type { CameraState } from './cameraState';
import type { Bounds } from './fitCameraToBounds';

export function clampCameraToBounds(
  camera: CameraState,
  bounds: Bounds,
  canvas: HTMLCanvasElement,
) {
  const viewWidth = canvas.clientWidth; // ✅ CSS px
  const viewHeight = canvas.clientHeight; // ✅ CSS px

  const SAFE = 40; // CSS px, 20~60 권장

  const minX = viewWidth - bounds.maxX * camera.scale - SAFE;
  const maxX = -bounds.minX * camera.scale + SAFE;

  const minY = viewHeight - bounds.maxY * camera.scale - SAFE;
  const maxY = -bounds.minY * camera.scale + SAFE;

  camera.x = Math.min(Math.max(camera.x, minX), maxX);
  camera.y = Math.min(Math.max(camera.y, minY), maxY);
}
