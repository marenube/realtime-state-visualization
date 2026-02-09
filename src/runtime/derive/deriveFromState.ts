// src/runtime/derive/deriveFromState.ts

import type { TrainSnapshot } from '@/data/snapshot/trainSnapshot';
import type { TrainView } from '@/runtime/model/TrainView';
import { AVERAGE_TRAVEL_TIME } from './constants/timing';

export function deriveFromState(snapshot: TrainSnapshot, now: number): TrainView {
  const { train } = snapshot;

  let progress = 0;

  if (train.secondsToArrival > 0) {
    progress = clamp(1 - train.secondsToArrival / AVERAGE_TRAVEL_TIME, 0, 1);
  }

  return {
    id: train.id,
    progress,
    fromStationId: train.fromStationId,
    toStationId: train.toStationId,
    lineId: train.lineId, // ⚠️ 누락돼 있었다면 반드시 포함
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
