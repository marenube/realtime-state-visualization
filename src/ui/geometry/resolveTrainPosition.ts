// src/ui/geometry/resolveTrainPosition.ts
import type { StationNode } from '@/data/station/stationNode';
import type { TrainView } from '@/ui/train/trainView';

export function resolveTrainPosition(train: TrainView, stationMap: Map<string, StationNode>) {
  const from = stationMap.get(train.fromStationId);
  const to = stationMap.get(train.toStationId);

  if (!from || !to) return null;

  const t = Math.min(Math.max(train.progress, 0), 1);

  return {
    x: from.x + (to.x - from.x) * t,
    y: from.y + (to.y - from.y) * t,
  };
}
