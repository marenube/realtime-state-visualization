// src/ui/canvas/useCanvasPan.ts
import type { CameraState } from '@/ui/camera/cameraState';
import type { Bounds } from '@/ui/camera/fitCameraToBounds';
import { clampCameraToBounds } from '@/ui/camera/clampCameraToBounds';

export function bindCanvasPan(canvas: HTMLCanvasElement, camera: CameraState, bounds: Bounds) {
  let dragging = false;
  let lastX = 0;
  let lastY = 0;

  const dpr = window.devicePixelRatio || 1;

  const onMouseDown = (e: MouseEvent) => {
    dragging = true;
    lastX = e.clientX * dpr;
    lastY = e.clientY * dpr;
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!dragging) return;

    const x = e.clientX * dpr;
    const y = e.clientY * dpr;

    camera.x += x - lastX;
    camera.y += y - lastY;

    clampCameraToBounds(camera, bounds, canvas);

    lastX = x;
    lastY = y;
  };

  const onMouseUp = () => {
    dragging = false;
  };

  // touch
  const onTouchStart = (e: TouchEvent) => {
    if (e.touches.length !== 1) return;

    dragging = true;
    lastX = e.touches[0].clientX * dpr;
    lastY = e.touches[0].clientY * dpr;
  };

  const onTouchMove = (e: TouchEvent) => {
    if (!dragging || e.touches.length !== 1) return;

    const x = e.touches[0].clientX * dpr;
    const y = e.touches[0].clientY * dpr;

    camera.x += x - lastX;
    camera.y += y - lastY;

    clampCameraToBounds(camera, bounds, canvas);

    lastX = x;
    lastY = y;
  };

  const onTouchEnd = () => {
    dragging = false;
  };

  canvas.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);

  canvas.addEventListener('touchstart', onTouchStart, { passive: false });
  canvas.addEventListener('touchmove', onTouchMove, { passive: false });
  canvas.addEventListener('touchend', onTouchEnd);

  return () => {
    canvas.removeEventListener('mousedown', onMouseDown);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);

    canvas.removeEventListener('touchstart', onTouchStart);
    canvas.removeEventListener('touchmove', onTouchMove);
    canvas.removeEventListener('touchend', onTouchEnd);
  };
}
