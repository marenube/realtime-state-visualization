// src/data/rawTrainApi.ts

export type RawTrainApiItem = {
  // paging / meta
  beginRow: string | null;
  endRow: string | null;
  curPage: string | null;
  pageRow: string | null;
  totalCount: number;
  rowNum: number;
  selectedCount: number;

  // line / direction
  subwayId: string;
  subwayNm: string | null;
  updnLine: string;
  trainLineNm: string | null;

  // station
  statnId: string;
  statnNm: string;
  statnFid: string;
  statnTid: string;

  // train identity
  btrainNo: string;
  btrainSttus: string;
  ordkey: string;

  // routing
  subwayList: string;
  statnList: string;

  // arrival / time
  arvlCd: string;
  barvlDt: string;
  arvlMsg2: string;
  arvlMsg3: string;

  // origin
  bstatnId: string;
  bstatnNm: string;

  // etc
  recptnDt: string;
  trnsitCo: string | null;
  trainCo: string | null;
  lstcarAt: string;

  [key: string]: unknown;
};

export type TrainSnapshot = {
  trainId: string;
  lineId: string;
  direction: 'UP' | 'DOWN';

  currentStationId: string;
  prevStationId: string;
  nextStationId: string;

  arrivalState: 'APPROACHING' | 'ARRIVED' | 'DEPARTED';
  remainingSeconds: number;

  receivedAt: number;
};
