// src/data/rail/buildEdgeOffsetMap.ts
import type { RailEdge } from './railEdge';

export type EdgeOffset = {
  sx: number;
  sy: number;
  idx: number;
  total: number;
};

function undirectedStationKey(a: string, b: string) {
  return a < b ? `${a}:${b}` : `${b}:${a}`;
}

/**
 * 같은 "역 A - 역 B" 구간에
 * 여러 라인이 겹치면 렌더링 시 평행 이동
 */
export function buildEdgeOffsetMap(edges: RailEdge[], spacing = 8): Map<string, EdgeOffset> {
  const groups = new Map<string, RailEdge[]>();

  // 1️⃣ 역 ID 기준 그룹핑 (렌더링 관점)
  for (const e of edges) {
    const k = undirectedStationKey(e.aStationId, e.bStationId);
    const arr = groups.get(k) ?? [];
    arr.push(e);
    groups.set(k, arr);
  }

  const out = new Map<string, EdgeOffset>();

  // 2️⃣ 그룹 내부에서만 오프셋 계산
  for (const [k, group] of groups) {
    if (group.length === 1) continue;

    // 안정적인 순서 (라인명 기준)
    const ordered = [...group].sort((a, b) => a.lineId.localeCompare(b.lineId));

    const total = ordered.length;

    for (let i = 0; i < total; i++) {
      const edge = ordered[i];
      const [p0, p1] = edge.path.points;

      const dx = p1.x - p0.x;
      const dy = p1.y - p0.y;
      const len = Math.hypot(dx, dy) || 1;

      // 수직 단위 벡터
      const nx = -dy / len;
      const ny = dx / len;

      const centered = i - (total - 1) / 2;
      const offset = centered * spacing;

      const sx = nx * offset;
      const sy = ny * offset;

      const k1 = `${edge.aStationId}:${edge.bStationId}:${edge.lineId}`;
      const k2 = `${edge.bStationId}:${edge.aStationId}:${edge.lineId}`;

      out.set(k1, { sx, sy, idx: i, total });
      out.set(k2, { sx, sy, idx: i, total });
    }
  }

  return out;
}
