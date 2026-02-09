// src/ui/render/drawTrains.ts
import type { TrainView } from '@/runtime/model/TrainView';
import type { Station } from '@/data/station/station';

export function drawTrains(
  ctx: CanvasRenderingContext2D,
  trains: TrainView[],
  stations: Station[],
) {
  const stationMap = new Map(stations.map(s => [s.id, s]));

  ctx.fillStyle = '#e53935';

  for (const train of trains) {
    const from = stationMap.get(train.fromStationId);
    const to = stationMap.get(train.toStationId);

    if (!from || !to) {
      // 지금은 로그도 꺼두는 게 좋아
      // console.warn('[TRAIN STATION MISS]', train);
      continue;
    }

    const t = Math.max(0, Math.min(1, train.progress));

    const x = from.x + (to.x - from.x) * t;
    const y = from.y + (to.y - from.y) * t;

    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  }
}
