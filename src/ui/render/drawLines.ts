// src/ui/render/drawLines.ts
import type { StationNode } from '@/data/station/stationNode';

export function drawLines(ctx: CanvasRenderingContext2D, stations: StationNode[]) {
  const map = new Map(stations.map(s => [s.id, s]));
  const drawn = new Set<string>();

  ctx.strokeStyle = '#9aa0a6';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';

  for (const from of stations) {
    for (const conn of from.connectsTo) {
      const to = map.get(conn.stationId);
      if (!to) continue;

      const key = from.id < to.id ? `${from.id}-${to.id}` : `${to.id}-${from.id}`;
      if (drawn.has(key)) continue;
      drawn.add(key);

      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
    }
  }
}
