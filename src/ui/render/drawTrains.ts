// src/ui/render/drawTrains.ts
import type { TrainView } from '@/runtime/model/TrainView';
import type { Station } from '@/data/station/station';
import type { EdgeOffset } from '@/data/rail/buildEdgeOffsetMap';

export function drawTrains(
  ctx: CanvasRenderingContext2D,
  trains: TrainView[],
  stations: Station[],
  edgeOffsetMap: Map<string, EdgeOffset>,
) {
  const stationById = new Map<string, Station>();
  for (const s of stations) stationById.set(s.id, s);

  ctx.fillStyle = '#e53935';

  for (const train of trains) {
    const from = stationById.get(train.fromStationId);
    const to = stationById.get(train.toStationId);

    if (!from || !to) {
      // 매 프레임 폭발 싫으면 여기 로그는 조건부로 줄여도 됨
      // console.warn('[TRAIN STATION MISS]', train);
      continue;
    }

    const t = Math.max(0, Math.min(1, train.progress));

    // 기본 위치(논리)
    let x = from.x + (to.x - from.x) * t;
    let y = from.y + (to.y - from.y) * t;

    // 렌더 오프셋(복선/중첩 구간이면 shift)
    const key = `${train.fromStationId}:${train.toStationId}:${train.lineId}`;
    const off = edgeOffsetMap.get(key);

    if (off) {
      x += off.sx;
      y += off.sy;
    }

    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  }
}
