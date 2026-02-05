// src/data/rawStationApi.ts

/**
 * 서울시 지하철 역 기본 정보 API에서 내려오는
 * Raw(가공 전) 역 데이터
 *
 * - 노선별 역 목록 조회 결과
 * - 노선도 좌표, 거리 계산 등의 기준 데이터로 사용
 * - 열차 데이터와 결합되기 전 원본 상태 유지
 */
export type RawStationApiItem = {
  /** =========================
   *  역 기본 식별 정보
   *  ========================= */

  /** 역 고유 코드 (역 ID, 내부 기준 key로 사용) */
  STATION_CD: string;

  /** 역 한글 이름 */
  STATION_NM: string;

  /** 역 영문 이름 */
  STATION_NM_ENG: string;

  /** 역 중국어 이름 */
  STATION_NM_CHN: string;

  /** 역 일본어 이름 */
  STATION_NM_JPN: string;

  /** =========================
   *  노선 / 관리 코드 정보
   *  ========================= */

  /** 노선 번호 (예: "01호선", "09호선") */
  LINE_NUM: string;

  /** 역 관리 코드 (철도청 내부 코드) */
  FR_CODE: string;

  /**
   * API 확장 필드 대비용
   * (문서에 없거나 예고 없이 추가되는 필드 흡수)
   */
  [key: string]: unknown;
};
