// src/data/fetchTrains.ts

import { SeoulSubwayApi } from '@/data/api/seoulSubwayApi';
import type { RawTrainApiItem } from '@/data/rawTrainApi';

type RealtimeArrivalResponse = {
  realtimeArrivalList: RawTrainApiItem[];
};

export async function fetchRealtimeTrains(): Promise<RawTrainApiItem[]> {
  const res = await fetch(SeoulSubwayApi.realtimeArrivalAll());

  if (!res.ok) {
    throw new Error('Failed to fetch realtime arrivals');
  }

  const json = (await res.json()) as RealtimeArrivalResponse;
  return json.realtimeArrivalList;
}
