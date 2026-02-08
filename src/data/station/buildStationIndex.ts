// src/data/station/buildStationIndex.ts
import type { RawStation } from './rawStation';
import { deriveStationId } from './deriveStationId';

export function buildStationIndex(raws: RawStation[]) {
  const index = new Map<string, { id: string }>();

  for (const station of raws) {
    const id = deriveStationId(station);

    // 1. 기본 키 (name + line)
    index.set(`${station.name}:${station.line}`, { id });

    // 2. aliases
    if (station.aliases) {
      for (const alias of station.aliases) {
        index.set(`${alias}:${station.line}`, { id });
      }
    }

    // 3. group (환승역 대표명)
    if (station.group) {
      index.set(`${station.group}:${station.line}`, { id });
    }
  }

  return index;
}
