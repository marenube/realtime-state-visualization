// src/ui/render/drawStations.ts
import type { Station } from '@/data/station/station';

export function drawStations(ctx: CanvasRenderingContext2D, stations: Station[]) {
  // 점 (역 위치)
  ctx.fillStyle = '#000';

  for (const s of stations) {
    ctx.beginPath();
    ctx.arc(s.x, s.y, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // 역 이름
  ctx.font = '12px system-ui, -apple-system, BlinkMacSystemFont';
  ctx.fillStyle = '#111';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  for (const s of stations) {
    const lx = s.labelX ?? s.x;
    const ly = s.labelY ?? s.y + 6;

    ctx.fillText(s.name, lx, ly);
  }
}
