// src/ui/camera/applyCamera.ts
import type { CameraState } from './cameraState';

export function applyCamera(ctx: CanvasRenderingContext2D, camera: CameraState) {
  ctx.translate(camera.x, camera.y);
  ctx.scale(camera.scale, camera.scale);
}
