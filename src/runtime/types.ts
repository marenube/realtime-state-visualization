import { TrainSnapshotStore } from '@/data/snapshot/TrainSnapshotStore';

export type TrainScheduler = {
  start: () => Promise<void>;
  stop: () => void;
  store: TrainSnapshotStore;
};
