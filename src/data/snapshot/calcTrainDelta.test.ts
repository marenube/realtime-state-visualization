// src/data/snapshot/calcTrainDelta.test.ts

import { calcTrainDelta } from './calcTrainDelta';
import type { TrainSnapshot } from './trainSnapshot';

describe('calcTrainDelta', () => {
  it('이전/현재 스냅샷 간 경과 시간과 도착 시간 변화량을 계산한다', () => {
    const prev: TrainSnapshot = {
      train: {
        id: '123',
        secondsToArrival: 30,
        fromStationId: 'A',
        toStationId: 'B',
      } as any,
      receivedAt: 1_000,
    };

    const curr: TrainSnapshot = {
      train: {
        id: '123',
        secondsToArrival: 20,
        fromStationId: 'A',
        toStationId: 'B',
      } as any,
      receivedAt: 6_000,
    };

    const delta = calcTrainDelta(prev, curr);

    expect(delta.elapsedMs).toBe(5_000);
    expect(delta.deltaSeconds).toBe(10);
  });

  it('도착 시간이 증가해도 delta를 계산한다', () => {
    const prev = {
      train: { secondsToArrival: 10 },
      receivedAt: 1_000,
    } as any;

    const curr = {
      train: { secondsToArrival: 15 },
      receivedAt: 4_000,
    } as any;

    const delta = calcTrainDelta(prev, curr);

    expect(delta.elapsedMs).toBe(3_000);
    expect(delta.deltaSeconds).toBe(-5);
  });
});
