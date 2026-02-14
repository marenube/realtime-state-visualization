export interface TrainView {
  id: string;
  lineId: string;

  edge: {
    aId: string;
    bId: string;
  };

  t: number; // 0 ~ 1, edge 위 위치
  state: 'STOPPED' | 'MOVING';
}
