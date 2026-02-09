import { deriveFromState } from './deriveFromState';

describe('deriveFromState', () => {
  it('도착 시간이 남아 있으면 moving 상태다', () => {
    const snapshot = {
      train: {
        id: '1',
        secondsToArrival: 30,
        fromStationId: 'A',
        toStationId: 'B',
      },
      receivedAt: 0,
    } as any;

    const view = deriveFromState(snapshot, 0);

    expect(view.progress).toBeGreaterThan(0);
  });
});
