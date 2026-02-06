// src/runtime/derive/deriveTrainViews.ts

import type { TrainSnapshotStore } from '@/data/snapshot/TrainSnapshotStore';
import type { TrainView } from '@/runtime/model/TrainView';
import { deriveTrainView } from './deriveTrainView';

export function deriveTrainViews(store: TrainSnapshotStore, now: number): TrainView[] {
  const views: TrainView[] = [];

  const pairs = store.getAllPairs();

  for (const pair of pairs) {
    const view = deriveTrainView(pair, now);
    if (view) {
      views.push(view);
    }
  }

  return views;
}
