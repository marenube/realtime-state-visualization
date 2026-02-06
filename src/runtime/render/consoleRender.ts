// src/runtime/render/consoleRender.ts

import type { TrainView } from '@/runtime/model/TrainView';

export function consoleRender(views: TrainView[]) {
  if (!views.length) return;

  // 첫 번째 열차만 찍어도 충분
  const v = views[0];
  // console.log(`[${v.id}] progress=${v.progress.toFixed(3)} moving=${v.moving}`);
}
