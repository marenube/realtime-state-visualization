// src/data/station/deriveStationId.ts
import type { RawStation } from './rawStation';

export function deriveStationId(station: RawStation): string {
  if (station.id) return station.id;

  // fallback: name + line
  return `${station.name}:${station.line}`;
}
