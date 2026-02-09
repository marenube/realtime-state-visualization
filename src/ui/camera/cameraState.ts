// src/ui/camera/cameraState.ts
export type CameraState = {
  x: number;
  y: number;
  scale: number;
  minScale: number;
  maxScale?: number;
};

export function createInitialCamera(): CameraState {
  return {
    x: 0,
    y: 0,
    scale: 1,
    minScale: 0, // 초기값
  };
}
