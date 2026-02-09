// src/ui/camera/fitCameraToBounds.ts
import type { CameraState } from './cameraState';

export type Bounds = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

type Point = { x: number; y: number };

export function computeBounds(points: Point[]): Bounds {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const p of points) {
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
  }

  return { minX, minY, maxX, maxY };
}

export function fitCameraToBounds(
  camera: CameraState,
  bounds: Bounds,
  canvas: HTMLCanvasElement,
  padding = 600,
) {
  const dpr = window.devicePixelRatio || 1;

  const worldWidth = bounds.maxX - bounds.minX + padding * 2;
  const worldHeight = bounds.maxY - bounds.minY + padding * 2;

  const viewWidth = canvas.width / dpr;
  const viewHeight = canvas.height / dpr;

  const scaleX = viewWidth / worldWidth;
  const scaleY = viewHeight / worldHeight;

  const fitScale = Math.min(scaleX, scaleY);

  camera.scale = fitScale;
  camera.minScale = fitScale;

  const cx = (bounds.minX + bounds.maxX) / 2;
  const cy = (bounds.minY + bounds.maxY) / 2;

  camera.x = viewWidth / 2 - cx * camera.scale;
  camera.y = viewHeight / 2 - cy * camera.scale;
}
