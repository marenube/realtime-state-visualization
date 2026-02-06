// src/runtime/derive/utils/progress.ts

import { AVERAGE_TRAVEL_TIME } from '../constants/timing';
import { clamp } from './math';

export function estimateProgress(secondsToArrival: number): number {
  if (secondsToArrival <= 0) return 0;

  return clamp(1 - secondsToArrival / AVERAGE_TRAVEL_TIME, 0, 1);
}
