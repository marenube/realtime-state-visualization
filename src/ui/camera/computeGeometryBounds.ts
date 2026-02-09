// src/ui/camera/computeGeometryBounds.ts
import type { RenderGeometry } from '@/ui/render/buildRenderGeometry';

export function computeGeometryBounds(geometry: RenderGeometry) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const e of geometry.edges) {
    minX = Math.min(minX, e.p0.x, e.p1.x);
    minY = Math.min(minY, e.p0.y, e.p1.y);
    maxX = Math.max(maxX, e.p0.x, e.p1.x);
    maxY = Math.max(maxY, e.p0.y, e.p1.y);
  }

  return { minX, minY, maxX, maxY };
}
