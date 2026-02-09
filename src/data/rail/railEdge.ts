// src/data/rail/railEdge.ts
export type RailPath = {
  kind: 'line';
  points: { x: number; y: number }[];
};

export type RailEdge = {
  aStationId: string;
  bStationId: string;

  // ✅ 노선 문자열 ("04호선", "GTX-A", "서해선" ...)
  lineId: string;

  path: RailPath;

  travelTime?: number;
};
