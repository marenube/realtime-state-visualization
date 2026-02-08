// src/ui/canvas/setupCanvas.ts
export function setupCanvas(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!;
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  // 실제 픽셀 버퍼만 dpr로 키우고
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);

  // 이후 카메라/이벤트 수학은 CSS(px) 기준으로 할 거라
  // ctx를 CSS 좌표계로 맞춰둔다 (1 unit = 1 CSS px)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  return ctx;
}
