// src/data/station/normalizeStations.ts
import { buildStationIndex } from './buildStationIndex';
import { deriveStationId } from './deriveStationId';
import type { RawStation } from './rawStation';
import type { StationNode } from './stationNode';

export function normalizeStationsWithIds(raws: RawStation[]): StationNode[] {
  const index = buildStationIndex(raws);

  return raws.map(station => {
    const id = deriveStationId(station);

    return {
      id,
      line: station.line,
      x: station.x,
      y: station.y,
      dwellTime: station.dwellTime,

      connectsTo: (station.connectsTo ?? []).flatMap(conn => {
        const key = `${conn.name}:${conn.line}`;
        const target = index.get(key);

        if (!target) {
          console.warn('[station normalize] 연결 실패', {
            from: `${station.name}:${station.line}`,
            to: key,
          });
          return [];
        }

        return [
          {
            stationId: target.id,
            line: conn.line,
            ...(conn.travelTime !== undefined ? { travelTime: conn.travelTime } : {}),
          },
        ];
      }),
    };
  });
}
