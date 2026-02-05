import { fetchStationsByLine } from '@/data/fetchStations';
import { fetchRealtimeTrains } from '@/data/fetchTrains';
import { normalizeStations } from '@/data/normalize/normalizeStation';
import { mergeLatestTrains } from '@/data/preprocess/mergeLatestTrains';
import { normalizeTrains } from '@/data/normalize/normalizeTrain';
import '@/styles/global.css';
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    let cancelled = false;

    async function run() {
      const raws = await fetchRealtimeTrains();
      const merged = mergeLatestTrains(raws);
      const trains = normalizeTrains(merged);

      if (!cancelled) {
        console.log(merged.length);
        console.log(trains.length);
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function run() {
      const raws = await fetchStationsByLine('9호선');
      const stations = normalizeStations(raws);

      if (mounted) {
        console.log(stations[0], stations.at(-1));
      }
    }

    run();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main>
      <h1>Realtime State Visualization</h1>
    </main>
  );
}
