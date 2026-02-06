// src/runtime/derive/deriveFromState.ts

import type { TrainSnapshot } from '@/data/snapshot/trainSnapshot';
import type { TrainView } from '@/runtime/model/TrainView';
import { AVERAGE_TRAVEL_TIME } from './constants/timing';

export function deriveFromState(snapshot: TrainSnapshot, now: number): TrainView {
  const { train } = snapshot;

  let progress = 0;
  let moving = false;

  if (train.secondsToArrival > 0) {
    // 이동 중 → 상태 기반 추정
    progress = clamp(1 - train.secondsToArrival / AVERAGE_TRAVEL_TIME, 0, 1);
    moving = true;
  }

  return {
    id: train.id,
    progress,
    moving,
    fromStationId: train.fromStationId,
    toStationId: train.toStationId,
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
