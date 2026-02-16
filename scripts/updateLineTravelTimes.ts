// 3, 4, 7, 8, 9호선 완료

// 그 외 호선 안됨 (일시적 오류인듯)

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const API_KEY = process.env.VITE_SEOUL_API_KEY;
const BASE_URL = process.env.VITE_SEOUL_OPEN_API_HOST;

if (!API_KEY || !BASE_URL) {
  throw new Error('❌ ENV not loaded');
}

const RAW_PATH = path.join(process.cwd(), 'src/data/rawStations.json');
const CACHE_PATH = path.join(process.cwd(), 'src/data/timetableCache.json');

type Station = {
  id: string;
  name: string;
  line: string;
  stationCode: string;
  connectsTo: { stationId: string; travelTime: number }[];
  dwellTime?: number;
};

type SlimRow = {
  TRAIN_NO: string;
  ARRIVETIME: string;
  LEFTTIME: string;
};

/* ============================
   파일 로드
============================ */

function loadRawStations(): Station[] {
  return JSON.parse(fs.readFileSync(RAW_PATH, 'utf-8'));
}

function loadCache(): Record<string, SlimRow[]> {
  if (!fs.existsSync(CACHE_PATH)) return {};
  return JSON.parse(fs.readFileSync(CACHE_PATH, 'utf-8'));
}

function saveCache(cache: any) {
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache));
}

/* ============================
   Slim fetch
============================ */

async function fetchTimetable(stationCode: string) {
  const key = `${stationCode}_1_1`;
  const cache = loadCache();

  if (cache[key]) return { row: cache[key] };

  const url = `${BASE_URL}/${API_KEY}/json/SearchSTNTimeTableByIDService/1/1000/${stationCode}/1/1/`;

  console.log('\n🔎 REQUEST:', stationCode);
  console.log('URL:', url);

  const res = await fetch(url);

  if (!res.ok) {
    console.error('❌ HTTP ERROR:', res.status, 'stationCode:', stationCode);
    throw new Error('HTTP failed');
  }

  const json = await res.json();

  if (!json?.SearchSTNTimeTableByIDService?.row) {
    console.error('❌ API STRUCTURE ERROR stationCode:', stationCode);
    console.error(JSON.stringify(json, null, 2));
    throw new Error('API returned invalid structure');
  }

  const rows = json.SearchSTNTimeTableByIDService.row;

  if (!Array.isArray(rows) || rows.length === 0) {
    console.warn('⚠ EMPTY DATA for station:', stationCode);
  }

  const slim: SlimRow[] = rows
    .filter((r: any) => r?.TRAIN_NO) // TRAIN_NO 없는 row는 매칭 자체가 불가능
    .map((r: any) => ({
      TRAIN_NO: r.TRAIN_NO,
      ARRIVETIME: r.ARRIVETIME,
      LEFTTIME: r.LEFTTIME,
    }));

  cache[key] = slim;
  saveCache(cache);

  return { row: slim };
}

/* ============================
   유틸
============================ */

function toSeconds(t: string) {
  const [h, m, s] = t.split(':').map(Number);
  return h * 3600 + m * 60 + s;
}

function isValidTime(t: any): t is string {
  return typeof t === 'string' && t !== '' && t !== '00:00:00';
}

function addDiffIfValid(diffs: number[], raw: number, daySec: number) {
  let diff = raw;
  if (diff < 0) diff += daySec;
  if (diff > 0 && diff < 900) diffs.push(diff);
}

function mode(diffs: number[]): number | null {
  if (!diffs.length) return null;
  const freq: Record<number, number> = {};
  for (const d of diffs) freq[d] = (freq[d] || 0) + 1;
  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  return Number(sorted[0][0]);
}

/* ============================
   travelTime 계산
============================ */

function computeStableTravelTime(rowsA: SlimRow[], rowsB: SlimRow[]): number | null {
  const diffs: number[] = [];
  const DAY = 24 * 3600;

  const mapB = new Map<string, SlimRow>();
  for (const r of rowsB) {
    if (r.TRAIN_NO) mapB.set(r.TRAIN_NO, r);
  }

  for (const a of rowsA) {
    const trainNo = a.TRAIN_NO;
    if (!trainNo) continue;

    const b = mapB.get(trainNo);
    if (!b) continue;

    // (1) A -> B 후보: B.ARR - A.LEFT
    if (isValidTime(a.LEFTTIME) && isValidTime(b.ARRIVETIME)) {
      addDiffIfValid(diffs, toSeconds(b.ARRIVETIME) - toSeconds(a.LEFTTIME), DAY);
    }

    // (2) B -> A 후보: A.ARR - B.LEFT
    if (isValidTime(b.LEFTTIME) && isValidTime(a.ARRIVETIME)) {
      addDiffIfValid(diffs, toSeconds(a.ARRIVETIME) - toSeconds(b.LEFTTIME), DAY);
    }
  }

  return mode(diffs);
}

/* ============================
   dwellTime 계산
============================ */

function computeStableDwellTime(rows: SlimRow[]): number | null {
  const diffs: number[] = [];
  const DAY = 24 * 3600;

  for (const row of rows) {
    if (!isValidTime(row.ARRIVETIME) || !isValidTime(row.LEFTTIME)) continue;

    let diff = toSeconds(row.LEFTTIME) - toSeconds(row.ARRIVETIME);
    if (diff < 0) diff += DAY;

    if (diff >= 10 && diff <= 180) diffs.push(diff);
  }

  return mode(diffs);
}

/* ============================
   안전한 Dijkstra (🔥 dwellTime 포함)
   - 이동할 때 "다음 역" dwellTime을 더함
============================ */

function computeShortestPath(
  start: Station,
  byId: Map<string, Station>,
  lineName: string,
  includeDwell: boolean,
) {
  const dist = new Map<string, number>();
  const visited = new Set<string>();

  for (const [id, station] of byId.entries()) {
    if (station.line === lineName) {
      dist.set(id, Infinity);
    }
  }

  dist.set(start.id, 0);

  while (true) {
    let currentId: string | null = null;
    let minDist = Infinity;

    for (const [id, d] of dist.entries()) {
      if (!visited.has(id) && d < minDist) {
        minDist = d;
        currentId = id;
      }
    }

    if (!currentId) break;

    visited.add(currentId);

    const station = byId.get(currentId)!;

    for (const edge of station.connectsTo) {
      const neighbor = byId.get(edge.stationId);

      if (!neighbor || neighbor.line !== lineName) continue;
      if (visited.has(neighbor.id)) continue;

      if (typeof edge.travelTime !== 'number') continue;

      const dwell = includeDwell ? (neighbor.dwellTime ?? 0) : 0;
      const newDist = minDist + edge.travelTime + dwell;

      if (newDist < dist.get(neighbor.id)!) {
        dist.set(neighbor.id, newDist);
      }
    }
  }

  return dist;
}

/* ============================
   메인
============================ */

async function updateLine(lineName: string) {
  const stations = loadRawStations();
  const byId = new Map(stations.map(s => [s.id, s] as const));
  const lineStations = stations.filter(s => s.line === lineName);

  console.log(`\n🚇 Updating ${lineName}\n`);

  const pairResults = new Map<string, number>();
  const pairKey = (a: string, b: string) => (a < b ? `${a}-${b}` : `${b}-${a}`);

  /* ===== travelTime 업데이트 (없으면 실패 로그) ===== */

  for (const station of lineStations) {
    for (const edge of station.connectsTo) {
      const target = byId.get(edge.stationId);
      if (!target || target.line !== lineName) continue;

      const pk = pairKey(station.id, target.id);

      console.log(`🔍 ${station.name} ↔ ${target.name}`);

      if (pairResults.has(pk)) {
        const t = pairResults.get(pk)!;
        edge.travelTime = t;

        const reverse = target.connectsTo.find(e => e.stationId === station.id);
        if (reverse) reverse.travelTime = t;

        continue;
      }

      const aRows = (await fetchTimetable(station.stationCode)).row;
      const bRows = (await fetchTimetable(target.stationCode)).row;

      if (!aRows.length || !bRows.length) {
        console.error(
          `❌ FAILED(no rows): ${station.name}(${station.stationCode}) ↔ ${target.name}(${target.stationCode})`,
        );
        continue;
      }

      let travelTime = computeStableTravelTime(aRows, bRows);
      if (travelTime == null) travelTime = computeStableTravelTime(bRows, aRows);

      if (travelTime == null) {
        console.error(
          `❌ FAILED(no matched trains): ${station.name}(${station.stationCode}) ↔ ${target.name}(${target.stationCode})`,
        );
        continue;
      }

      pairResults.set(pk, travelTime);

      edge.travelTime = travelTime;
      const reverse = target.connectsTo.find(e => e.stationId === station.id);
      if (reverse) reverse.travelTime = travelTime;

      console.log(`✅ OK ${station.name} ↔ ${target.name} = ${travelTime}`);
    }
  }

  /* ===== dwellTime 업데이트 (없으면 경고 로그) ===== */

  console.log(`\n🕒 Updating dwellTime for ${lineName}...\n`);

  for (const station of lineStations) {
    const rows = (await fetchTimetable(station.stationCode)).row;

    if (!rows.length) {
      console.warn(`⚠ dwell skipped(empty rows): ${station.name}(${station.stationCode})`);
      continue;
    }

    const dwell = computeStableDwellTime(rows);
    if (dwell == null) {
      console.warn(`⚠ dwell FAILED(no valid diffs): ${station.name}(${station.stationCode})`);
      continue;
    }

    station.dwellTime = dwell;
    console.log(`🕒 ${station.name} dwell = ${dwell}`);
  }

  /* ===== 디버그: 모든 구간 travelTime ===== */

  console.log('\n🔎 All segment travel times:\n');

  for (const station of lineStations) {
    for (const edge of station.connectsTo) {
      const target = byId.get(edge.stationId);
      if (!target || target.line !== lineName) continue;

      if (station.id < target.id && typeof edge.travelTime === 'number') {
        console.log(`${station.name} ↔ ${target.name} = ${edge.travelTime}`);
      }
    }
  }

  /* ===== Branch-aware validation (🔥 dwell 포함/미포함 둘다 출력) ===== */

  console.log('\n🔎 Branch-aware validation (move-only):\n');

  const terminals = lineStations.filter(s => {
    const degree = s.connectsTo.filter(e => byId.get(e.stationId)?.line === lineName).length;
    return degree === 1;
  });

  for (const start of terminals) {
    const distMoveOnly = computeShortestPath(start, byId, lineName, false);
    for (const end of terminals) {
      if (start.id === end.id) continue;
      const time = distMoveOnly.get(end.id);
      if (time !== undefined && time !== Infinity) {
        console.log(`⏱ ${start.name} → ${end.name} = ${time} sec (${(time / 60).toFixed(2)} min)`);
      }
    }
  }

  console.log('\n🔎 Branch-aware validation (move + dwell):\n');

  for (const start of terminals) {
    const distWithDwell = computeShortestPath(start, byId, lineName, true);
    for (const end of terminals) {
      if (start.id === end.id) continue;
      const time = distWithDwell.get(end.id);
      if (time !== undefined && time !== Infinity) {
        console.log(`⏱ ${start.name} → ${end.name} = ${time} sec (${(time / 60).toFixed(2)} min)`);
      }
    }
  }

  /* ===== 저장 ===== */

  fs.writeFileSync(RAW_PATH, JSON.stringify(stations, null, 2));
  console.log(`\n✅ ${lineName} 업데이트 완료`);
}

const lineArg = process.argv[2] ?? '03호선';
updateLine(lineArg).catch(console.error);
