// src/data/fetchStations.ts

import { SeoulSubwayApi } from '@/data/api/seoulSubwayApi';
import type { RawStationApiItem } from '@/data/rawStationApi';

type StationApiResponse = {
  SearchSTNBySubwayLineInfo: {
    list_total_count: number;
    row: RawStationApiItem[];
  };
};

export async function fetchStationsByLine(line: string): Promise<RawStationApiItem[]> {
  const url = SeoulSubwayApi.stationsByLine(line);
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch stations (line=${line})`);
  }

  const json = (await res.json()) as StationApiResponse;

  return json.SearchSTNBySubwayLineInfo.row;
}
