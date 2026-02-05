// src/data/rawStationApi.ts

export type RawStationApiItem = {
  STATION_CD: string;
  STATION_NM: string;
  STATION_NM_ENG: string;
  STATION_NM_CHN: string;
  STATION_NM_JPN: string;

  LINE_NUM: string;
  FR_CODE: string;

  [key: string]: unknown;
};
