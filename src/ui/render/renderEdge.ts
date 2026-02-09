export interface RenderEdge {
  aStationId: string;
  bStationId: string;
  line: string;

  path: {
    kind: 'line';
    points: { x: number; y: number }[];
  };
}
