// src/runtime/loop/startRenderLoop.ts
import type { TrainSnapshotStore } from '@/data/snapshot/TrainSnapshotStore';
import type { TrainView } from '@/runtime/model/TrainView';
import { deriveTrainViews } from '@/runtime/derive/deriveTrainViews';
import type { Station } from '@/data/station/station';

type RenderFn = (views: TrainView[]) => void;

export function startRenderLoop(store: TrainSnapshotStore, stations: Station[], render: RenderFn) {
  let rafId = 0;

  // 🔎 디버깅용
  let lastLogTime = 0;
  const LOG_INTERVAL = 2000; // 2초마다만 로그

  const tick = () => {
    const now = Date.now();

    // 🔥 now를 derive에 넘겨줘야 시간 기반 보정 가능
    const views = deriveTrainViews(store, stations, now);

    // 🔎 디버깅 로그 (과도 방지)
    if (now - lastLogTime > LOG_INTERVAL) {
      console.log('[RenderLoop] trains:', views.length);

      if (views.length > 0) {
        const sample = views[0];

        const from = stations.find(s => s.id === sample.edge.aId);
        const to = stations.find(s => s.id === sample.edge.bId);

        console.log('[RenderLoop sample]', {
          id: sample.id,
          line: sample.lineId,
          from: from?.name,
          to: to?.name,
          t: sample.t,
          state: sample.state,
        });
      }

      lastLogTime = now;
    }

    render(views);

    rafId = requestAnimationFrame(tick);
  };

  rafId = requestAnimationFrame(tick);

  return () => cancelAnimationFrame(rafId);
}
