// src/data/rail/buildRailEdges.ts
import type { Station } from '@/data/station/station';
import type { RailEdge } from './railEdge';

function undirectedKey(a: string, b: string, lineId: string) {
  const ab = a < b ? `${a}:${b}` : `${b}:${a}`;
  return `${ab}:${lineId}`;
}

export function buildRailEdges(stations: Station[]): RailEdge[] {
  const edges: RailEdge[] = [];

  const stationById = new Map<string, Station>();
  for (const s of stations) {
    if (s?.id) stationById.set(s.id, s);
  }

  console.log('[buildRailEdges] stations count:', stations.length);

  // 같은 (A,B,lineId)는 1개만 유지
  const seen = new Set<string>();

  for (const station of stations) {
    if (!station?.id) continue;
    if (!station.connectsTo?.length) continue;

    for (const conn of station.connectsTo) {
      const toId = (conn as any).stationId as string | undefined;
      if (!toId) {
        console.warn('[SKIP] connectsTo without stationId', {
          from: station.id,
          conn,
        });
        continue;
      }

      const target = stationById.get(toId);
      if (!target) {
        console.warn('[SKIP] target not found', {
          from: station.id,
          toId,
        });
        continue;
      }

      // 🔑 핵심 수정: lineId는 connection 기준
      const lineId = (conn as any).lineId ?? (conn as any).line ?? station.line;

      const key = undirectedKey(station.id, target.id, lineId);
      if (seen.has(key)) continue;
      seen.add(key);

      edges.push({
        aStationId: station.id,
        bStationId: target.id,
        lineId,
        path: {
          kind: 'line',
          points: [
            { x: station.x, y: station.y },
            { x: target.x, y: target.y },
          ],
        },
        travelTime: (conn as any).travelTime,
      });
    }
  }

  // ===== 디버깅: A-B 구간별 라인 수 =====
  const abLineMap = new Map<string, Set<string>>();
  for (const e of edges) {
    const ab =
      e.aStationId < e.bStationId
        ? `${e.aStationId}:${e.bStationId}`
        : `${e.bStationId}:${e.aStationId}`;

    const set = abLineMap.get(ab) ?? new Set<string>();
    set.add(e.lineId);
    abLineMap.set(ab, set);
  }

  let multiLineCount = 0;
  for (const [ab, lines] of abLineMap) {
    if (lines.size > 1) {
      multiLineCount++;
      console.log('[MULTI-LINE]', ab, [...lines]);
    }
  }

  return edges;
}
