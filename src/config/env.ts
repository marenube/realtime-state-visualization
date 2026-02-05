/**
 * 환경 변수 접근 레이어
 * - import.meta.env 직접 접근 금지
 * - 여기서만 읽도록 통제
 */

export const ENV = {
  SEOUL: {
    REALTIME_API_HOST: import.meta.env.VITE_SEOUL_REALTIME_API_HOST,
    OPEN_API_HOST: import.meta.env.VITE_SEOUL_OPEN_API_HOST,
    API_KEY: import.meta.env.VITE_SEOUL_API_KEY,
  },
} as const;
