// src/data/rail/railEdge.ts
export interface RailEdge {
  aStationId: string;
  bStationId: string;

  /** 시각화/메타용 (노선명) */
  line: string;

  path: {
    kind: 'line';
    points: { x: number; y: number }[];
  };

  travelTime?: number;
}
