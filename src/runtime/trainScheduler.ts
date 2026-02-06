// src/runtime/trainScheduler.ts

import type { TrainSnapshotStore } from '@/data/snapshot/TrainSnapshotStore';
import { fetchTrains } from '@/data/fetchTrains';
import { mergeLatestTrains } from '@/data/preprocess/mergeLatestTrains';
import { normalizeTrains } from '@/data/normalize/normalizeTrain';

type TrainSchedulerOptions = {
  store: TrainSnapshotStore;
  intervalMs?: number;
};

export function createTrainScheduler({ store, intervalMs = 15_000 }: TrainSchedulerOptions) {
  let timer: number | null = null;

  const tick = async () => {
    try {
      const raws = await fetchTrains();
      const merged = mergeLatestTrains(raws);
      const trains = normalizeTrains(merged);
      store.update(trains);
      console.log('[scheduler] update', trains.length);
    } catch (e) {
      console.error('[scheduler] error', e);
    }
  };

  // 최초 1회 즉시 실행
  tick();

  timer = window.setInterval(tick, intervalMs);

  // stop 함수 반환
  return () => {
    if (timer !== null) {
      clearInterval(timer);
      timer = null;
    }
  };
}
