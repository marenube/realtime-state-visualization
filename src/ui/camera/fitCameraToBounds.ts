// src/ui/camera/fitCameraToBounds.ts

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
