// src/ui/render/buildRenderEdges.ts
import type { RailEdge } from '@/data/rail/railEdge';
import type { Station } from '@/data/station/station';

const EDGE_OFFSET_PX = 6;

// ✅ RenderEdge 따로 쓰지 말고, RailEdge 그대로 리턴 (path만 offset)
export function buildRenderEdges(edges: RailEdge[], stations: Station[]): RailEdge[] {
  const stationMap = new Map(stations.map(s => [s.id, s]));

  // ✅ A-B(무방향) 기준 그룹핑: 같은 구간에 여러 lineId가 있으면 group에 여러 개가 모임
  const groupMap = new Map<string, RailEdge[]>();

  for (const edge of edges) {
    const key =
      edge.aStationId < edge.bStationId
        ? `${edge.aStationId}:${edge.bStationId}`
        : `${edge.bStationId}:${edge.aStationId}`;

    const list = groupMap.get(key) ?? [];
    list.push(edge);
    groupMap.set(key, list);
  }

  const renderEdges: RailEdge[] = [];

  for (const group of groupMap.values()) {
    const center = (group.length - 1) / 2;

    for (let i = 0; i < group.length; i++) {
      const edge = group[i];

      const a = stationMap.get(edge.aStationId);
      const b = stationMap.get(edge.bStationId);
      if (!a || !b) continue;

      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const len = Math.hypot(dx, dy) || 1;

      // 수직 방향 단위벡터
      const nx = -dy / len;
      const ny = dx / len;

      const offset = (i - center) * EDGE_OFFSET_PX;

      renderEdges.push({
        ...edge,
        // ✅ lineId 그대로 유지
        lineId: edge.lineId,
        // ✅ path만 offset된 것으로 교체
        path: {
          kind: 'line',
          points: [
            { x: a.x + nx * offset, y: a.y + ny * offset },
            { x: b.x + nx * offset, y: b.y + ny * offset },
          ],
        },
      });
    }
  }

  return renderEdges;
}
