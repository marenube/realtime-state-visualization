// src/data/station/stationNode.ts
export type StationNode = {
  id: string;
  line: string;

  x: number;
  y: number;

  dwellTime?: number;

  connectsTo: {
    stationId: string;
    line: string;
    travelTime?: number; // ✅ optional로 변경
  }[];
};
