// src/runtime/derive/constants/timing.ts

/**
 * 역 간 평균 이동 시간 (초)
 * - 정확도가 목적이 아님
 * - 첫 프레임 및 fallback용 추정치
 */
export const AVERAGE_TRAVEL_TIME = 120;

/**
 * prev/curr 스냅샷 간 최대 허용 간격 (ms)
 * 이 값을 넘으면 보간 대신 상태 기반으로 fallback
 */
export const MAX_SNAPSHOT_INTERVAL = 60_000;
