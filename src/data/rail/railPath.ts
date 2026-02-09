// src/data/rail/railPath.ts
export type Point = { x: number; y: number };

export type RailPath = {
  kind: 'line'; // 지금은 직선만
  points: [Point, Point];
};
// 나중에 곡선은 kind: 'curve' 추가하면 됨 (points 확장 or controlPoints 추가)
