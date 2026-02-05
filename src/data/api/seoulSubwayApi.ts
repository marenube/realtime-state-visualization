/**
 * 서울 지하철 API URL 빌더
 * - env + constants를 조합
 * - 네트워크 요청 ❌
 */

import { ENV } from '@/config/env';
import { SEOUL_SUBWAY_API_PATH } from '@/constants/seoulSubwayApi';

const { REALTIME_API_HOST, OPEN_API_HOST, API_KEY } = ENV.SEOUL;

function withApiKey(path: string) {
  return path.replace('{API_KEY}', API_KEY);
}

export const SeoulSubwayApi = {
  realtimeArrivalAll(): string {
    return REALTIME_API_HOST + withApiKey(SEOUL_SUBWAY_API_PATH.REALTIME_ARRIVAL_ALL);
  },

  stationsByLine(line: string): string {
    return (
      OPEN_API_HOST + withApiKey(SEOUL_SUBWAY_API_PATH.STATIONS_BY_LINE.replace('{LINE}', line))
    );
  },
};
