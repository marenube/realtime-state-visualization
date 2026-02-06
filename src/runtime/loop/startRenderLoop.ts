// src/runtime/loop/startRenderLoop.ts

import type { TrainSnapshotStore } from '@/data/snapshot/TrainSnapshotStore';
import type { TrainView } from '@/runtime/model/TrainView';
import { deriveTrainViews } from '@/runtime/derive/deriveTrainViews';

type RenderFn = (views: TrainView[]) => void;

export function startRenderLoop(store: TrainSnapshotStore, render: RenderFn) {
  let rafId = 0;

  const tick = () => {
    const now = Date.now();
    const views = deriveTrainViews(store, now);
    render(views);
    rafId = requestAnimationFrame(tick);
  };

  rafId = requestAnimationFrame(tick);

  // stop 핸들 반환 (언마운트/정리용)
  return () => cancelAnimationFrame(rafId);
}
