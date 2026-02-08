// src/ui/render/drawStations.ts
import type { StationNode } from '@/data/station/stationNode';

export function drawStations(ctx: CanvasRenderingContext2D, stations: StationNode[]) {
  ctx.fillStyle = '#5f6368';

  for (const s of stations) {
    ctx.beginPath();
    ctx.arc(s.x, s.y, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}
