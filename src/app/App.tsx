// src/App.tsx
import { useEffect, useRef, useState } from 'react';

import { snapshotStore } from '@/data/snapshot/singleton';
import { startRenderLoop } from '@/runtime/loop/startRenderLoop';
import { createTrainScheduler } from '@/runtime/trainScheduler';

import { setupCanvas } from '@/ui/canvas/setupCanvas';
import { drawLines } from '@/ui/render/drawLines';
import { drawStations } from '@/ui/render/drawStations';
import { drawTrains } from '@/ui/render/drawTrains';

import { normalizeStationsWithIds } from '@/data/station/normalizeStations';
import rawJson from '@/data/rawStations.json';
import { normalizeRawStationJson } from '@/data/station/normalizeRawStationJson';

import { createInitialCamera } from '@/ui/camera/cameraState';
import { applyCamera } from '@/ui/camera/applyCamera';
import { fitCameraToBounds, computeBounds } from '@/ui/camera/fitCameraToBounds';
import { clampCameraToBounds } from '@/ui/camera/clampCameraToBounds';
import { bindCanvasPan } from '@/ui/canvas/useCanvasPan';
import { bindCanvasZoom } from '@/ui/canvas/useCanvasZoom';

import type { TrainView } from '@/runtime/model/TrainView';

import '@/styles/global.css';

const rawStations = normalizeRawStationJson(rawJson);
const stations = normalizeStationsWithIds(rawStations);
const bounds = computeBounds(stations);

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraRef = useRef(createInitialCamera());

  const [trains, setTrains] = useState<TrainView[]>([]);
  const trainsRef = useRef<TrainView[]>([]);

  // 최신 trains ref 유지
  useEffect(() => {
    trainsRef.current = trains;
  }, [trains]);

  // snapshot → TrainView
  useEffect(() => {
    const stop = startRenderLoop(snapshotStore, setTrains);
    return stop;
  }, []);

  // train scheduler
  useEffect(() => {
    const scheduler = createTrainScheduler({ store: snapshotStore });
    scheduler.tick();
    return scheduler.stop;
  }, []);

  // canvas + camera 초기 설정
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = setupCanvas(canvas);
    const camera = cameraRef.current;

    // ✅ 최초 1회만 fit
    fitCameraToBounds(camera, bounds, canvas, 600);
    clampCameraToBounds(camera, bounds, canvas);

    const cleanupPan = bindCanvasPan(canvas, camera, bounds);
    const cleanupZoom = bindCanvasZoom(canvas, camera, bounds);

    let rafId = 0;
    const render = () => {
      ctx.setTransform(window.devicePixelRatio || 1, 0, 0, window.devicePixelRatio || 1, 0, 0);
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

      applyCamera(ctx, camera);

      drawLines(ctx, stations);
      drawStations(ctx, stations);
      drawTrains(ctx, trainsRef.current, stations);

      rafId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(rafId);
      cleanupPan();
      cleanupZoom();
    };
  }, []);

  // ✅ 리사이즈 전용 처리 (핵심)
  useEffect(() => {
    const canvas = canvasRef.current!;
    const camera = cameraRef.current;

    const handleResize = () => {
      // 1️⃣ 현재 화면 중심이 가리키는 월드 좌표
      const centerWorldX = (canvas.clientWidth / 2 - camera.x) / camera.scale;
      const centerWorldY = (canvas.clientHeight / 2 - camera.y) / camera.scale;

      // 2️⃣ 캔버스 픽셀 버퍼만 재설정
      setupCanvas(canvas);

      // 3️⃣ 같은 월드 중심을 다시 화면 중앙으로
      camera.x = canvas.clientWidth / 2 - centerWorldX * camera.scale;
      camera.y = canvas.clientHeight / 2 - centerWorldY * camera.scale;

      // 4️⃣ 새 view 기준으로 clamp
      clampCameraToBounds(camera, bounds, canvas);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <main style={{ width: '100vw', height: '100vh' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    </main>
  );
}
