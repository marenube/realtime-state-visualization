import { deriveFromDelta } from './deriveFromDelta';

describe('deriveFromDelta', () => {
  it('시간이 지남에 따라 progress가 증가한다', () => {
    const prev = {
      train: { secondsToArrival: 40, id: '1', fromStationId: 'A', toStationId: 'B' },
      receivedAt: 0,
    } as any;

    const curr = {
      train: { secondsToArrival: 20, id: '1', fromStationId: 'A', toStationId: 'B' },
      receivedAt: 10000,
    } as any;

    const view = deriveFromDelta(prev, curr, 15000);

    expect(view.progress).toBeGreaterThan(0);
  });
});
