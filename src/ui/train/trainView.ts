// src/ui/train/trainView.ts

export type TrainView = {
  id: string;

  fromStationId: string;
  toStationId: string;

  progress: number; // 0 ~ 1

  // (옵션) 디버그 / 확장용
  lineId?: string;
};
