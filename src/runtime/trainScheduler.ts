import { TrainSnapshotStore } from '@/data/snapshot/TrainSnapshotStore';
import { tickRealtimeTrains } from '@/runtime/tickRealtimeTrains';
import type { TrainScheduler } from '@/runtime/types';

let singleton: TrainScheduler | null = null;
let startedOnce = false;

export function createTrainScheduler(intervalMs: number = 15000): TrainScheduler {
  if (singleton) return singleton;

  const store = new TrainSnapshotStore();
  let timer: number | null = null;
  let fetching = false;

  async function start() {
    // ⭐ StrictMode 중복 mount 방지
    if (startedOnce) return;
    startedOnce = true;

    await safeTick();

    timer = window.setInterval(() => {
      safeTick().catch(console.error);
    }, intervalMs);
  }

  async function safeTick() {
    if (fetching) return;
    fetching = true;
    try {
      await tickRealtimeTrains(store);
    } finally {
      fetching = false;
    }
  }

  function stop() {
    // ❗ 개발모드 StrictMode에서는 stop하지 않는다
    // 실제 앱 종료/페이지 이탈 시만 사용
  }

  singleton = { start, stop, store };
  return singleton;
}
