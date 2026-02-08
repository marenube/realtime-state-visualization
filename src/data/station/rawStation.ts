// src/data/station/rawStation.ts
export type RawStation = {
  name: string;
  line: string;

  x: number;
  y: number;

  connectsTo?: {
    name: string;
    line: string;
    travelTime?: number;
  }[];

  // optional metadata
  id?: string | null;
  stationCode?: string;
  frCode?: string;

  aliases?: string[];
  group?: string;

  labelX?: number;
  labelY?: number;

  dwellTime?: number;
};
