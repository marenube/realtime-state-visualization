// src/data/snapshot/snapshotTypes.ts
import type { TrainSnapshot } from './trainSnapshot';

export type TrainSnapshotPair = {
  prev?: TrainSnapshot;
  curr?: TrainSnapshot;
};
