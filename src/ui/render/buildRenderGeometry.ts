// src/ui/render/buildRenderGeometry.ts
import type { Station } from '@/data/station/station';
import type { RailEdge } from '@/data/rail/railEdge';

const EPS = 0.01;

function coordKey(p0: { x: number; y: number }, p1: { x: number; y: number }) {
  const x0 = Math.round(p0.x / EPS) * EPS;
  const y0 = Math.round(p0.y / EPS) * EPS;
  const x1 = Math.round(p1.x / EPS) * EPS;
  const y1 = Math.round(p1.y / EPS) * EPS;

  if (x0 < x1 || (x0 === x1 && y0 <= y1)) {
    return `${x0},${y0}:${x1},${y1}`;
  }
  return `${x1},${y1}:${x0},${y0}`;
}

function edgeKey(aId: string, bId: string, lineId: string) {
  return `${aId}:${bId}:${lineId}`;
}

export type RenderStation = {
  id: string;
  name: string;
  x: number;
  y: number;
  labelX?: number;
  labelY?: number;
  degree: number;
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

  // 🔥 추가: O(1) 조회용 인덱스
  edgeIndex: Map<string, RenderEdge>;
};

export function buildRenderGeometry(stations: Station[], edges: RailEdge[]): RenderGeometry {
  const stationMap = new Map<string, RenderStation>();

  for (const s of stations) {
    stationMap.set(s.id, {
      id: s.id,
      name: s.name,
      x: s.x,
      y: s.y,
      labelX: s.labelX,
      labelY: s.labelY,
      degree: 1,
    });
  }

  const renderEdges: RenderEdge[] = [];
  const edgeGroups = new Map<string, RenderEdge[]>();
  const edgeIndex = new Map<string, RenderEdge>();

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

    // 🔥 양방향 등록 (중요)
    edgeIndex.set(edgeKey(a.id, b.id, e.lineId), re);
    edgeIndex.set(edgeKey(b.id, a.id, e.lineId), re);

    const key = coordKey(re.p0, re.p1);
    const arr = edgeGroups.get(key) ?? [];
    arr.push(re);
    edgeGroups.set(key, arr);
  }

  for (const group of edgeGroups.values()) {
    const degree = group.length;

    for (const e of group) {
      const a = stationMap.get(e.aId);
      const b = stationMap.get(e.bId);
      if (a) a.degree = Math.max(a.degree, degree);
      if (b) b.degree = Math.max(b.degree, degree);
    }
  }

  return {
    stations: stationMap,
    edges: renderEdges,
    edgeIndex,
  };
}
