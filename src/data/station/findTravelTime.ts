// src/data/station/findTravelTime.ts
import type { StationNode } from '@/data/station/stationNode';

export function findTravelTime(
  fromId: string,
  toId: string,
  stations: StationNode[],
): number | null {
  const from = stations.find(s => s.id === fromId);
  if (!from) return null;

  const edge = from.connectsTo.find(c => c.stationId === toId);
  return edge?.travelTime ?? null;
}
