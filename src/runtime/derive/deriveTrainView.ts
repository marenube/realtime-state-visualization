// src/runtime/derive/deriveTrainView.ts

import type { TrainSnapshot } from '@/data/snapshot/trainSnapshot';
import type { TrainView } from '@/runtime/model/TrainView';
import { deriveFromState } from './deriveFromState';
import { deriveFromDelta } from './deriveFromDelta';

export function deriveTrainView(
  pair: {
    prev?: TrainSnapshot;
    curr?: TrainSnapshot;
  },
  now: number,
): TrainView | null {
  if (!pair.curr) return null;

  if (!pair.prev) {
    return deriveFromState(pair.curr, now);
  }

  return deriveFromDelta(pair.prev, pair.curr, now);
}
