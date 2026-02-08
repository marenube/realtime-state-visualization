import { useEffect, useState, useRef } from 'react';

import { fetchStationsByLine } from '@/data/fetchStations';
import { normalizeStations } from '@/data/normalize/normalizeStation';
import { createTrainScheduler } from '@/runtime/trainScheduler';
import { startRenderLoop } from '@/runtime/loop/startRenderLoop';
import { snapshotStore } from '@/data/snapshot/singleton';

import { CanvasLayer } from '@/ui/CanvasLayer';
import { TrainView } from '@/runtime/model/TrainView';

import { setupCanvas } from '@/ui/canvas/setupCanvas';
import { drawLines } from '@/ui/render/drawLines';
import { drawStations } from '@/ui/render/drawStations';

import { normalizeStationsWithIds } from '@/data/station/normalizeStations';
import rawJson from '@/data/rawStations.json';
import { normalizeRawStationJson } from '@/data/station/normalizeRawStationJson';
import { drawTrains } from '@/ui/render/drawTrains';

const rawStations = normalizeRawStationJson(rawJson);
const stations = normalizeStationsWithIds(rawStations);

import '@/styles/global.css';

export default function App() {
  const [trains, setTrains] = useState<TrainView[]>([]);

  useEffect(() => {
    const stop = startRenderLoop(snapshotStore, setTrains);
    return stop;
  }, []);

  useEffect(() => {
    const stopScheduler = createTrainScheduler({
      store: snapshotStore,
    });
    stopScheduler.tick();
    stopScheduler.start();
    return stopScheduler.stop;
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

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 매 프레임 다시 그림
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawLines(ctx, stations);
    drawStations(ctx, stations);
    drawTrains(ctx, trains, stations);
  }, [trains]);

  return (
    <main style={{ width: '100vw', height: '100vh' }}>
      <canvas
        ref={canvasRef}
        width={4000}
        height={4000}
        style={{ width: '100%', height: '100%' }}
      />
    </main>
  );
}
