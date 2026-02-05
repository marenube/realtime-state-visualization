import { fetchRealtimeTrains } from '@/data/fetchTrains';
import { mergeLatestTrains } from '@/data/preprocess/mergeLatestTrains';
import { normalizeTrains } from '@/data/normalize/normalizeTrain';
import { TrainSnapshotStore } from '@/data/snapshot/TrainSnapshotStore';
import { calcTrainDelta } from '@/data/snapshot/calcTrainDelta';

export async function tickRealtimeTrains(store: TrainSnapshotStore): Promise<void> {
  const raws = await fetchRealtimeTrains();
  const merged = mergeLatestTrains(raws);
  const trains = normalizeTrains(merged);

  store.update(trains);

  for (const train of trains) {
    const { prev, curr } = store.getPair(train.id);
    if (!prev || !curr) continue;

    const delta = calcTrainDelta(prev, curr);

    console.log(
      `[${train.id}]`,
      `arrival=${curr.train.secondsToArrival}s`,
      `Δsec=${delta.deltaSeconds}`,
      `Δms=${delta.elapsedMs}`,
    );
  }
}
