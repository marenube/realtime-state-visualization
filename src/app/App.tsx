import { fetchStationsByLine } from '@/data/fetchStations';
// import { fetchRealtimeTrains } from '@/data/fetchTrains';
import { normalizeStations } from '@/data/normalize/normalizeStation';
// import { normalizeTrains } from '@/data/normalize/normalizeTrain';
import '@/styles/global.css';
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    let mounted = true;

    async function run() {
      // const rawTrains = await fetchRealtimeTrains();
      const raws = await fetchStationsByLine('9호선');
      // const trains = normalizeTrains(rawTrains);
      const stations = normalizeStations(raws);

      if (mounted) {
        // console.log(trains.length, trains[0], trains.at(-1));
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
