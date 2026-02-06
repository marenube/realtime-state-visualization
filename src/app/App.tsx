import { useEffect } from 'react';

import { fetchStationsByLine } from '@/data/fetchStations';
import { normalizeStations } from '@/data/normalize/normalizeStation';
import { createTrainScheduler } from '@/runtime/trainScheduler';
import { startRenderLoop } from '@/runtime/loop/startRenderLoop';
import { consoleRender } from '@/runtime/render/consoleRender';
import { snapshotStore } from '@/data/snapshot/singleton'; // 싱글톤이면 OK

import '@/styles/global.css';

export default function App() {
  useEffect(() => {
    const stop = startRenderLoop(snapshotStore, consoleRender);
    return stop;
  }, []);

  useEffect(() => {
    // const stopScheduler = createTrainScheduler({
    //   store: snapshotStore,
    // });
    // return stopScheduler;
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
