import type { Train } from '@/data/model/train';
import type { TrainSnapshot } from '@/data/snapshot/trainSnapshot';

export class TrainSnapshotStore {
  private prev = new Map<string, TrainSnapshot>();
  private curr = new Map<string, TrainSnapshot>();

  /**
   * 새로운 Train 배열을 스냅샷으로 반영
   */
  update(trains: Train[], receivedAt: number = Date.now()) {
    // curr → prev로 이동
    this.prev = this.curr;
    this.curr = new Map();

    for (const train of trains) {
      this.curr.set(train.id, {
        train,
        receivedAt,
      });
    }
  }

  /**
   * 현재 스냅샷 반환
   */
  getCurrent(): TrainSnapshot[] {
    return Array.from(this.curr.values());
  }

  /**
   * 특정 열차의 이전/현재 스냅샷 반환
   */
  getPair(trainId: string): {
    prev?: TrainSnapshot;
    curr?: TrainSnapshot;
  } {
    return {
      prev: this.prev.get(trainId),
      curr: this.curr.get(trainId),
    };
  }
}
