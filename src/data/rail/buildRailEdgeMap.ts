import type { RailEdge } from './railEdge';

export function buildRailEdgeMap(edges: RailEdge[]): Map<string, RailEdge> {
  const map = new Map<string, RailEdge>();

  for (const edge of edges) {
    const key = `${edge.aStationId}:${edge.bStationId}:${edge.lineId}`;
    map.set(key, edge);

    // 🔁 반대 방향도 등록 (열차 방향 반대일 수 있음)
    const reverseKey = `${edge.bStationId}:${edge.aStationId}:${edge.lineId}`;
    map.set(reverseKey, edge);
  }

  return map;
}
