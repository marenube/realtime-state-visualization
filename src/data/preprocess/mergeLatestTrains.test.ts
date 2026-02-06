import { mergeLatestTrains } from './mergeLatestTrains';

describe('mergeLatestTrains', () => {
  it('btrainNo 기준으로 최초 row만 남긴다', () => {
    const raws = [
      { btrainNo: '1', barvlDt: '10' },
      { btrainNo: '1', barvlDt: '20' },
      { btrainNo: '2', barvlDt: '5' },
    ] as any[];

    const merged = mergeLatestTrains(raws);

    expect(merged).toHaveLength(2);
    expect(merged.find(r => r.btrainNo === '1')!.barvlDt).toBe('10');
  });
});
