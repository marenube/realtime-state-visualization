// src/data/rail/buildRailEdges.ts
import type { Station } from '@/data/station/station';
import type { RailEdge } from './railEdge';

export function buildRailEdges(stations: Station[]): RailEdge[] {
  const edges: RailEdge[] = [];

  const stationById = new Map<string, Station>();
  const stationsWithoutId: Station[] = [];

  for (const s of stations) {
    if (!s?.id) {
      stationsWithoutId.push(s);
      continue;
    }
    stationById.set(s.id, s);
  }

  if (stationsWithoutId.length) {
    console.error('[STATION WITHOUT ID]', {
      count: stationsWithoutId.length,
      sample: stationsWithoutId.slice(0, 10).map(s => ({
        name: s?.name,
        line: s?.line,
        x: s?.x,
        y: s?.y,
      })),
    });
  }

  let missConnId = 0;
  let missTarget = 0;

  for (const station of stations) {
    if (!station?.id) continue;
    if (!station.connectsTo?.length) continue;

    for (const conn of station.connectsTo) {
      const toId = (conn as any).stationId as string | undefined;

      if (!toId) {
        missConnId++;
        continue;
      }

      const target = stationById.get(toId);
      if (!target) {
        missTarget++;
        continue;
      }

      // if (station.id > target.id) continue;

      edges.push({
        aStationId: station.id,
        bStationId: target.id,
        line: station.line, // 시각화용 메타
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

  if (missConnId) {
    console.warn('[EDGE SKIP - CONNECT WITHOUT stationId]', missConnId);
  }
  if (missTarget) {
    console.warn('[EDGE MISS - TARGET NOT FOUND]', missTarget);
  }

  return edges;
}
