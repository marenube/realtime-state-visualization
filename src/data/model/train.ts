// src/data/model/train.ts
export type Train = {
  id: string; // btrainNo
  lineId: string; // subwayId
  direction: 'UP' | 'DOWN';
  currentStationId: string; // statnId
  fromStationId: string; // statnFid
  toStationId: string; // statnTid
  secondsToArrival: number; // barvlDt
  timestamp: number; // Date.now()
};
