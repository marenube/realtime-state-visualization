// src/data/preprocess/mergeLatestTrains.ts

import type { RawTrainApiItem } from '@/data/rawTrainApi';

/**
 * realtimeStationArrival API는
 * 동일한 열차(btrainNo)의 과거/현재 상태를 함께 반환한다.
 *
 * 현재 API 응답에서는 recptnDt가 모두 동일하게 내려와
 * 시간 비교가 불가능하므로,
 * 응답 배열에서 최초 등장한 row를 최신 상태로 간주한다.
 *
 * 병합 기준:
 * - btrainNo (열차 식별자)
 * - 응답 순서 (first win)
 */
export function mergeLatestTrains(raws: RawTrainApiItem[]): RawTrainApiItem[] {
  const map = new Map<string, RawTrainApiItem>();

  for (const raw of raws) {
    if (!map.has(raw.btrainNo)) {
      map.set(raw.btrainNo, raw);
    }
  }

  return Array.from(map.values());
}
