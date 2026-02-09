// src/ui/canvas/setupCanvas.ts
export function setupCanvas(canvas: HTMLCanvasElement) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  // 🔑 비트맵 해상도만 키운다
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);

  const ctx = canvas.getContext('2d')!;

  // 🔥 transform은 절대 여기서 걸지 않는다
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  ctx.imageSmoothingEnabled = false;

  return ctx;
}
