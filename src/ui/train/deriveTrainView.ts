// src/ui/train/deriveTrainViews.ts
import type { TrainView } from '@/ui/train/trainView';
import type { Station } from '@/data/station/station';
import type { TrainSnapshotStore } from '@/data/snapshot/TrainSnapshotStore';
import { findTravelTime } from '@/data/station/findTravelTime';

export function deriveTrainViews(store: TrainSnapshotStore, stations: Station[]): TrainView[] {
  const views: TrainView[] = [];

  for (const snap of store.getCurrent()) {
    const train = snap.train;
    const { prev, curr } = store.getPair(train.id);

    if (!prev || !curr) continue;

    const travelTime = findTravelTime(train.fromStationId, train.toStationId, stations) ?? 1; // fallback

    const progress = Math.max(0, Math.min(1, 1 - curr.train.secondsToArrival / travelTime));

    views.push({
      id: train.id,
      fromStationId: train.fromStationId,
      toStationId: train.toStationId,
      progress,
    });
  }

  return views;
}
