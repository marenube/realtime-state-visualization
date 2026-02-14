// src/runtime/derive/deriveTrainViews.ts

import type { TrainSnapshotStore } from '@/data/snapshot/TrainSnapshotStore';
import type { TrainView } from '@/runtime/model/TrainView';
import type { Station } from '@/data/station/station';
import { findTravelTime } from '@/data/station/findTravelTime';

const DWELL_TIME = 30;

export function deriveTrainViews(
  store: TrainSnapshotStore,
  stations: Station[],
  now: number,
): TrainView[] {
  const views: TrainView[] = [];

  const snaps = store.getCurrent();

  for (const snap of snaps) {
    const t = snap.train;

    const prevId = t.fromStationId;
    const currId = t.currentStationId;
    const nextId = t.toStationId;

    const elapsed = (now - t.timestamp) / 1000;

    let aId: string | undefined;
    let bId: string | undefined;
    let progress = 0;
    let state: 'STOPPED' | 'MOVING' = 'MOVING';

    // =========================
    // 정차 상태 (secondsToArrival === 0)
    // =========================
    if (t.secondsToArrival === 0) {
      const remainDwell = DWELL_TIME - elapsed;

      if (remainDwell > 0) {
        state = 'STOPPED';
        aId = currId;
        bId = nextId;
        progress = 0;
      } else {
        const travelTime = findTravelTime(currId, nextId, stations) ?? 1;

        const moveElapsed = -remainDwell;
        progress = moveElapsed / travelTime;

        aId = currId;
        bId = nextId;
      }
    }

    // =========================
    // 이동 중
    // =========================
    else {
      const travelTime = findTravelTime(prevId, currId, stations) ?? 1;

      progress = elapsed / travelTime;

      aId = prevId;
      bId = currId;
    }

    if (!aId || !bId) continue;
    if (aId === bId) continue;

    views.push({
      id: t.id,
      lineId: t.lineId,
      edge: {
        aId,
        bId,
      },
      t: Math.max(0, Math.min(1, progress)),
      state,
    });
  }

  return views;
}
