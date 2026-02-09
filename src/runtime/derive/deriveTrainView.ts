// src/runtime/derive/deriveTrainView.ts
import type { TrainView } from '@/runtime/model/TrainView';
import type { TrainSnapshotPair } from '@/data/snapshot/snapshotTypes';

export function deriveTrainView(pair: TrainSnapshotPair, now: number): TrainView | null {
  const { prev, curr } = pair;
  if (!prev || !curr) return null;

  const train = curr.train;

  const progress = Math.max(0, Math.min(1, 1 - train.secondsToArrival / 60));

  return {
    id: train.id,
    lineId: train.lineId, // ✅ 여기서 내려줌
    fromStationId: train.fromStationId,
    toStationId: train.toStationId,
    progress,
  };
}
