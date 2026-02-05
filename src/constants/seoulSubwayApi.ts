/**
 * 서울 지하철 공공 API endpoint path 정의
 * - host, fetch, env 접근 ❌
 * - 순수 문자열 상수만 관리
 */

export const SEOUL_SUBWAY_API_PATH = {
  REALTIME_ARRIVAL_ALL: '/api/subway/{API_KEY}/json/realtimeStationArrival/ALL',

  STATIONS_BY_LINE: '/{API_KEY}/json/SearchSTNBySubwayLineInfo/1/999/%20/%20/{LINE}',
} as const;
