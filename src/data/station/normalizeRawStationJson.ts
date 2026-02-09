// src/data/station/normalizeRawStationJson.ts
import type { Station } from './station';

export function normalizeRawStationJson(raws: Station[]): Station[] {
  return raws.map(raw => {
    if (!raw.id) {
      throw new Error(`Station without id detected: ${raw.name}`);
    }

    return {
      id: raw.id,
      name: raw.name,
      line: raw.line,
      x: raw.x,
      y: raw.y,

      aliases: raw.aliases ?? [],

      connectsTo: (raw.connectsTo ?? []).map(c => ({
        stationId: c.stationId,
        travelTime: c.travelTime,
      })),

      frCode: raw.frCode,
      stationCode: raw.stationCode,
      labelX: raw.labelX,
      labelY: raw.labelY,
      dwellTime: raw.dwellTime,
    };
  });
}
