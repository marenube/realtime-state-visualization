// src/runtime/derive/deriveFromDelta.ts

import type { TrainSnapshot } from '@/data/snapshot/trainSnapshot';
import type { TrainView } from '@/runtime/model/TrainView';
import { deriveFromState } from './deriveFromState';
import { clamp, lerp } from './utils/math';
import { estimateProgress } from './utils/progress';
import { MAX_SNAPSHOT_INTERVAL } from './constants/timing';

export function deriveFromDelta(prev: TrainSnapshot, curr: TrainSnapshot, now: number): TrainView {
  const interval = curr.receivedAt - prev.receivedAt;

  // 비정상 스냅샷 → 상태 기반으로 fallback
  if (interval <= 0 || interval > MAX_SNAPSHOT_INTERVAL) {
    return deriveFromState(curr, now);
  }

  const elapsed = now - curr.receivedAt;
  const t = clamp(elapsed / interval, 0, 1);

  // prev / curr 둘 다 상태 기반 progress를 기준점으로 삼음
  const prevProgress = estimateProgress(prev.train.secondsToArrival);
  const currProgress = estimateProgress(curr.train.secondsToArrival);

  const progress = lerp(prevProgress, currProgress, t);

  return {
    id: curr.train.id,
    progress,
    moving: curr.train.secondsToArrival > 0,
    fromStationId: curr.train.fromStationId,
    toStationId: curr.train.toStationId,
  };
}
