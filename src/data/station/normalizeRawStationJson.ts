// src/data/station/normalizeRawStationJson.ts
import type { RawStation } from './rawStation';

export function normalizeRawStationJson(raws: any[]): RawStation[] {
  return raws.map(s => ({
    ...s,
    id: s.id ?? undefined, // null → undefined
  }));
}
