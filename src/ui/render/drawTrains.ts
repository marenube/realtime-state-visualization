// src/ui/render/drawTrains.ts
import type { TrainView } from '@/ui/train/trainView';
import type { StationNode } from '@/data/station/stationNode';
import { resolveTrainPosition } from '@/ui/geometry/resolveTrainPosition';

export function drawTrains(
  ctx: CanvasRenderingContext2D,
  trains: TrainView[],
  stations: StationNode[],
) {
  const stationMap = new Map(stations.map(s => [s.id, s]));

  ctx.fillStyle = '#e53935';

  for (const train of trains) {
    const pos = resolveTrainPosition(train, stationMap);
    if (!pos) continue;

    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 5, 0, Math.PI * 2);
    ctx.fill();
  }
}
