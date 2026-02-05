import type { TrainSnapshot } from '@/data/snapshot/trainSnapshot';

export type TrainDelta = {
  deltaSeconds: number;
  elapsedMs: number;
};

/**
 * 두 스냅샷 간 시간 변화 계산
 */
export function calcTrainDelta(prev: TrainSnapshot, curr: TrainSnapshot): TrainDelta {
  return {
    deltaSeconds: prev.train.secondsToArrival - curr.train.secondsToArrival,
    elapsedMs: curr.receivedAt - prev.receivedAt,
  };
}
