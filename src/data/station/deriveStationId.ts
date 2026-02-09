// src/data/station/deriveStationId.ts
import type { Station } from './station';

export function deriveStationId(station: Station): string {
  if (station.id) return station.id;

  // fallback: name + line
  return `${station.name}:${station.line}`;
}
