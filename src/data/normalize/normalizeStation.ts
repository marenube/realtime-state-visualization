import type { RawStationApiItem } from '@/data/rawStationApi';
import type { Station } from '@/data/model/station';

export function normalizeStation(raw: RawStationApiItem): Station {
  return {
    id: raw.STATION_CD,
    name: raw.STATION_NM,
    nameEn: raw.STATION_NM_ENG,
    line: raw.LINE_NUM,
    order: Number(raw.FR_CODE),
  };
}

export function normalizeStations(raws: RawStationApiItem[]): Station[] {
  return raws.map(normalizeStation).sort((a, b) => a.order - b.order);
}
