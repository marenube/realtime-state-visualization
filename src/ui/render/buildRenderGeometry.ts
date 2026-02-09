// src/ui/render/buildRenderGeometry.ts
import type { Station } from '@/data/station/station';
import type { RailEdge } from '@/data/rail/railEdge';

const EPS = 0.01;

function coordKey(p0: { x: number; y: number }, p1: { x: number; y: number }) {
  const x0 = Math.round(p0.x / EPS) * EPS;
  const y0 = Math.round(p0.y / EPS) * EPS;
  const x1 = Math.round(p1.x / EPS) * EPS;
  const y1 = Math.round(p1.y / EPS) * EPS;

  // 방향 무시
  if (x0 < x1 || (x0 === x1 && y0 <= y1)) {
    return `${x0},${y0}:${x1},${y1}`;
  }
  return `${x1},${y1}:${x0},${y0}`;
}

export type RenderStation = {
  id: string;
  name: string;
  x: number;
  y: number;
  labelX?: number;
  labelY?: number;
  degree: number; // ✅ 좌표 기준 복선/환승 밀도
};

export type RenderEdge = {
  aId: string;
  bId: string;
  lineId: string;
  p0: { x: number; y: number };
  p1: { x: number; y: number };
};

export type RenderGeometry = {
  stations: Map<string, RenderStation>;
  edges: RenderEdge[];
};

export function buildRenderGeometry(stations: Station[], edges: RailEdge[]): RenderGeometry {
  const stationMap = new Map<string, RenderStation>();

  // 1️⃣ station 생성
  for (const s of stations) {
    stationMap.set(s.id, {
      id: s.id,
      name: s.name,
      x: s.x,
      y: s.y,
      labelX: s.labelX,
      labelY: s.labelY,
      degree: 1, // 기본값
    });
  }

  // 2️⃣ RenderEdge 생성 + 좌표 기준 그룹핑
  const renderEdges: RenderEdge[] = [];
  const edgeGroups = new Map<string, RenderEdge[]>();

  for (const e of edges) {
    const a = stationMap.get(e.aStationId);
    const b = stationMap.get(e.bStationId);
    if (!a || !b) continue;

    const re: RenderEdge = {
      aId: a.id,
      bId: b.id,
      lineId: e.lineId,
      p0: { x: a.x, y: a.y },
      p1: { x: b.x, y: b.y },
    };

    renderEdges.push(re);

    const key = coordKey(re.p0, re.p1);
    const arr = edgeGroups.get(key) ?? [];
    arr.push(re);
    edgeGroups.set(key, arr);
  }

  // 3️⃣ 좌표 기준 degree 반영
  for (const group of edgeGroups.values()) {
    const degree = group.length;

    for (const e of group) {
      const a = stationMap.get(e.aId);
      const b = stationMap.get(e.bId);
      if (a) a.degree = Math.max(a.degree, degree);
      if (b) b.degree = Math.max(b.degree, degree);
    }
  }

  console.log('[RenderGeometry]', {
    stations: stationMap.size,
    edges: renderEdges.length,
    transferStations: [...stationMap.values()].filter(s => s.degree >= 2).length,
  });

  return {
    stations: stationMap,
    edges: renderEdges,
  };
}
