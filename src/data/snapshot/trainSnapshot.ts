import type { Train } from '@/data/model/train';

export type TrainSnapshot = {
  train: Train;
  receivedAt: number; // snapshot을 받은 시각 (Date.now())
};
