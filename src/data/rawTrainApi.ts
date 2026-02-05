// src/data/rawTrainApi.ts

/**
 * 서울시 실시간 열차 도착 API에서 내려오는
 * Raw(가공 전) 열차 상태 데이터
 *
 * - 동일 열차(btrainNo)의 과거/현재 상태가 함께 포함될 수 있음
 * - UI 렌더링에 바로 사용하지 않고
 *   preprocess → normalize → snapshot 과정을 거쳐 사용
 */
export type RawTrainApiItem = {
  /** =========================
   *  Paging / Meta 정보
   *  ========================= */

  /** 조회 시작 row (페이징용, 실제 사용하지 않음) */
  beginRow: string | null;

  /** 조회 종료 row (페이징용, 실제 사용하지 않음) */
  endRow: string | null;

  /** 현재 페이지 번호 */
  curPage: string | null;

  /** 페이지당 row 수 */
  pageRow: string | null;

  /** 전체 데이터 개수 */
  totalCount: number;

  /** 전체 결과 중 현재 row 번호 */
  rowNum: number;

  /** 선택된 데이터 개수 */
  selectedCount: number;

  /** =========================
   *  노선 / 방향 정보
   *  ========================= */

  /** 지하철 노선 ID (예: 1009 = 9호선) */
  subwayId: string;

  /** 지하철 노선명 (예: "9호선") */
  subwayNm: string | null;

  /** 상행 / 하행 구분 */
  updnLine: string;

  /** 열차 운행 방향 설명 문자열 (예: "개화행 - 선유도방면") */
  trainLineNm: string | null;

  /** =========================
   *  현재 역 정보
   *  ========================= */

  /** 현재 기준 역 ID */
  statnId: string;

  /** 현재 기준 역 이름 */
  statnNm: string;

  /** 이전 역 ID */
  statnFid: string;

  /** 다음 역 ID */
  statnTid: string;

  /** =========================
   *  열차 식별 정보
   *  ========================= */

  /** 열차 고유 번호 (열차 단위 식별자, snapshot key로 사용) */
  btrainNo: string;

  /** 열차 상태 (일반 / 급행 등) */
  btrainSttus: string;

  /** 정렬용 키 (서버 내부 용도) */
  ordkey: string;

  /** =========================
   *  노선 / 역 경로 정보
   *  ========================= */

  /** 운행 중인 노선 ID 목록 (콤마 구분 문자열) */
  subwayList: string;

  /** 경유 역 ID 목록 (콤마 구분 문자열) */
  statnList: string;

  /** =========================
   *  도착 / 시간 관련 정보
   *  ========================= */

  /** 도착 코드 (정차/진입 등 상태 코드) */
  arvlCd: string;

  /** 도착까지 남은 시간 (초 단위, 문자열) */
  barvlDt: string;

  /** 도착 상태 메시지 (예: "당산 진입") */
  arvlMsg2: string;

  /** 도착 역 이름 메시지 */
  arvlMsg3: string;

  /** =========================
   *  기점 정보
   *  ========================= */

  /** 열차 출발(기점) 역 ID */
  bstatnId: string;

  /** 열차 출발(기점) 역 이름 */
  bstatnNm: string;

  /** =========================
   *  기타 / 메타 정보
   *  ========================= */

  /** 서버 수신 시각 (현재 API에서는 모든 row가 동일하게 내려오는 버그 있음) */
  recptnDt: string;

  /** 환승 횟수 */
  trnsitCo: string | null;

  /** 열차 편성 수 */
  trainCo: string | null;

  /** 막차 여부 (0/1 문자열) */
  lstcarAt: string;

  /**
   * API 확장 필드 대비용
   * (문서에 없거나 예고 없이 추가되는 필드 흡수)
   */
  [key: string]: unknown;
};
