// src/data/station/findTravelTime.ts
import type { Station } from '@/data/station/station';

export function findTravelTime(fromId: string, toId: string, stations: Station[]): number | null {
  const from = stations.find(s => s.id === fromId);
  if (!from) return null;

  const conn = from.connectsTo?.find(c => c.stationId === toId);
  return conn?.travelTime ?? null;
}
