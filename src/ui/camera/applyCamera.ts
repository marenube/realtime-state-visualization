// src/ui/camera/applyCamera.ts
import type { CameraState } from './cameraState';

export function applyCamera(ctx: CanvasRenderingContext2D, camera: CameraState) {
  const dpr = window.devicePixelRatio || 1;

  ctx.setTransform(camera.scale * dpr, 0, 0, camera.scale * dpr, camera.x * dpr, camera.y * dpr);
}
