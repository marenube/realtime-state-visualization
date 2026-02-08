// src/runtime/trainScheduler.ts

import type { TrainSnapshotStore } from '@/data/snapshot/TrainSnapshotStore';
import { fetchTrains } from '@/data/fetchTrains';
import { mergeLatestTrains } from '@/data/preprocess/mergeLatestTrains';
import { normalizeTrains } from '@/data/normalize/normalizeTrain';

type TrainSchedulerOptions = {
  store: TrainSnapshotStore;
  intervalMs?: number;
};

export function createTrainScheduler({ store, intervalMs = 30_000 }: TrainSchedulerOptions) {
  let timer: number | null = null;
  let inFlight = false;

  const tick = async () => {
    if (inFlight) return;
    inFlight = true;

    try {
      const raws = await fetchTrains();
      const merged = mergeLatestTrains(raws);
      const trains = normalizeTrains(merged);
      store.update(trains);
      console.log('[scheduler] update', trains.length);
    } catch (e) {
      console.error('[scheduler] error', e);
    } finally {
      inFlight = false;
    }
  };

  const start = () => {
    if (timer !== null) return;
    timer = window.setInterval(tick, intervalMs);
  };

  const stop = () => {
    if (timer === null) return;
    clearInterval(timer);
    timer = null;
  };

  return { tick, start, stop };
}
