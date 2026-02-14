import type { TrainView } from '@/runtime/model/TrainView';
import type { TrainSnapshotPair } from '@/data/snapshot/snapshotTypes';

export function deriveTrainView(pair: TrainSnapshotPair, now: number): TrainView | null {
  const { prev, curr } = pair;
  if (!prev || !curr) return null;

  const train = curr.train;

  // 기본 방어
  if (!train.fromStationId || !train.toStationId) {
    return null;
  }

  const total = 60; // 일단 60초 기준 (추후 실제 travelTime으로 교체)
  const secondsToArrival = train.secondsToArrival ?? 0;

  const t = Math.max(0, Math.min(1, 1 - secondsToArrival / total));

  const state: 'STOPPED' | 'MOVING' = secondsToArrival <= 0 ? 'STOPPED' : 'MOVING';

  return {
    id: train.id,
    lineId: train.lineId,

    edge: {
      aId: train.fromStationId,
      bId: train.toStationId,
    },

    t,
    state,
  };
}
