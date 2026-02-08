// src/ui/canvas/setupCanvas.ts
export function setupCanvas(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2d context not supported');

  const dpr = window.devicePixelRatio || 1;

  const { width, height } = canvas.getBoundingClientRect();

  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);

  // 이후 좌표계를 CSS px 기준으로 쓰고 싶으면 스케일을 되돌림
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  return ctx;
}
