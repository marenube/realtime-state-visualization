import type { RailEdge } from '@/data/rail/railEdge';
import { subwayLineColorMap } from '@/data/subwayLines';

export function drawRailEdges(ctx: CanvasRenderingContext2D, edges: RailEdge[]) {
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';

  for (const edge of edges) {
    const [p0, p1] = edge.path.points;

    const color = subwayLineColorMap.get(edge.line) ?? '#999';

    if (!subwayLineColorMap.has(edge.line)) {
      console.warn('[LINE COLOR MISS]', edge.line);
    }

    ctx.strokeStyle = color;

    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();
  }
}
