// src/data/normalize/normalizeTrain.ts

import type { RawTrainApiItem } from '@/data/rawTrainApi';
import type { Train } from '@/data/model/train';
import { subwayIdToLineIdMap } from '@/data/subwayLines';

export function normalizeTrain(raw: RawTrainApiItem, now: number = Date.now()): Train {
  const lineId = subwayIdToLineIdMap.get(raw.subwayId) ?? raw.subwayId;
  return {
    id: raw.btrainNo,
    lineId,
    direction: raw.updnLine === '상행' ? 'UP' : 'DOWN',
    currentStationId: raw.statnId,
    fromStationId: raw.statnFid,
    toStationId: raw.statnTid,
    secondsToArrival: Number(raw.barvlDt),
    timestamp: now,
  };
}

export function normalizeTrains(raws: RawTrainApiItem[], now: number = Date.now()): Train[] {
  return raws.map(r => normalizeTrain(r, now));
}
