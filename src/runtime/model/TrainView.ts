// src/runtime/model/TrainView.ts

export type TrainView = {
  id: string;

  /**
   * 역 A → B 사이 상대 위치
   * 0 = fromStation
   * 1 = toStation
   */
  progress: number;

  /** 현재 이동 중인지 */
  moving: boolean;

  fromStationId: string;
  toStationId: string;
};
