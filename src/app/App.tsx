// src/App.tsx
import { useEffect, useRef, useState } from 'react';

import { startRenderLoop } from '@/runtime/loop/startRenderLoop';
import type { TrainView } from '@/runtime/model/TrainView';

import { snapshotStore } from '@/data/snapshot/singleton';

import rawJson from '@/data/rawStations.json';
import { normalizeRawStationJson } from '@/data/station/normalizeRawStationJson';

import { buildRailEdges } from '@/data/rail/buildRailEdges';
import { buildEdgeOffsetMap } from '@/data/rail/buildEdgeOffsetMap';

import { drawStations } from '@/ui/render/drawStations';
import { drawTrains } from '@/ui/render/drawTrains';
import { drawRailEdges } from '@/ui/render/drawRailEdges';

import { createInitialCamera } from '@/ui/camera/cameraState';
import { applyCamera } from '@/ui/camera/applyCamera';
import { fitCameraToBounds, computeBounds } from '@/ui/camera/fitCameraToBounds';
import { clampCameraToBounds } from '@/ui/camera/clampCameraToBounds';

import { setupCanvas } from '@/ui/canvas/setupCanvas';
import { bindCanvasPan } from '@/ui/canvas/useCanvasPan';
import { bindCanvasZoom } from '@/ui/canvas/useCanvasZoom';

import { buildRenderGeometry } from '@/ui/render/buildRenderGeometry';

import '@/styles/global.css';

// ======================
// 데이터 초기화
// ======================
const stations = normalizeRawStationJson(rawJson);
const railEdges = buildRailEdges(stations);

// ✅ 누락돼 있던 핵심
const renderGeometry = buildRenderGeometry(stations, railEdges);

const edgeOffsetMap = buildEdgeOffsetMap(railEdges, 8);
const bounds = computeBounds(stations);

export default function App() {
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const fgCanvasRef = useRef<HTMLCanvasElement>(null);

  const cameraRef = useRef(createInitialCamera());

  const [trains, setTrains] = useState<TrainView[]>([]);
  const trainsRef = useRef<TrainView[]>([]);

  useEffect(() => {
    trainsRef.current = trains;
  }, [trains]);

  useEffect(() => {
    const stop = startRenderLoop(snapshotStore, setTrains);
    return stop;
  }, []);

  const bgDirtyRef = useRef(true);
  const lastCamRef = useRef({ x: 0, y: 0, scale: 1 });

  const bgCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const fgCtxRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const bgCanvas = bgCanvasRef.current!;
    const fgCanvas = fgCanvasRef.current!;

    bgCtxRef.current = setupCanvas(bgCanvas);
    fgCtxRef.current = setupCanvas(fgCanvas);

    const camera = cameraRef.current;

    fitCameraToBounds(camera, bounds, fgCanvas, 600);
    clampCameraToBounds(camera, bounds, fgCanvas);

    const cleanupPan = bindCanvasPan(fgCanvas, camera, bounds);
    const cleanupZoom = bindCanvasZoom(fgCanvas, camera, bounds);

    lastCamRef.current = { x: camera.x, y: camera.y, scale: camera.scale };
    bgDirtyRef.current = true;

    const EPS = 1e-6;

    const redrawBackground = () => {
      const bgCtx = bgCtxRef.current!;
      const bgCanvasEl = bgCanvasRef.current!;

      bgCtx.setTransform(1, 0, 0, 1, 0, 0);
      bgCtx.clearRect(0, 0, bgCanvasEl.width, bgCanvasEl.height);

      applyCamera(bgCtx, camera);

      // ✅ renderGeometry 정상 전달
      drawRailEdges(bgCtx, renderGeometry);

      // ✅ 기존 시그니처 유지
      drawStations(bgCtx, renderGeometry);
    };

    let rafId = 0;
    const render = () => {
      const lastCam = lastCamRef.current;

      const camChanged =
        Math.abs(camera.x - lastCam.x) > EPS ||
        Math.abs(camera.y - lastCam.y) > EPS ||
        Math.abs(camera.scale - lastCam.scale) > EPS;

      if (camChanged) {
        bgDirtyRef.current = true;
        lastCamRef.current = { x: camera.x, y: camera.y, scale: camera.scale };
      }

      if (bgDirtyRef.current) {
        redrawBackground();
        bgDirtyRef.current = false;
      }

      const fgCtx = fgCtxRef.current!;
      const fgCanvasEl = fgCanvasRef.current!;

      fgCtx.setTransform(1, 0, 0, 1, 0, 0);
      fgCtx.clearRect(0, 0, fgCanvasEl.width, fgCanvasEl.height);

      applyCamera(fgCtx, camera);
      drawTrains(fgCtx, trainsRef.current, stations, edgeOffsetMap);

      rafId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(rafId);
      cleanupPan();
      cleanupZoom();
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const bgCanvas = bgCanvasRef.current!;
      const fgCanvas = fgCanvasRef.current!;
      const camera = cameraRef.current;

      const centerWorldX = (fgCanvas.clientWidth / 2 - camera.x) / camera.scale;
      const centerWorldY = (fgCanvas.clientHeight / 2 - camera.y) / camera.scale;

      bgCtxRef.current = setupCanvas(bgCanvas);
      fgCtxRef.current = setupCanvas(fgCanvas);

      camera.x = fgCanvas.clientWidth / 2 - centerWorldX * camera.scale;
      camera.y = fgCanvas.clientHeight / 2 - centerWorldY * camera.scale;

      clampCameraToBounds(camera, bounds, fgCanvas);

      bgDirtyRef.current = true;
      lastCamRef.current = { x: camera.x, y: camera.y, scale: camera.scale };
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <main style={{ width: '100vw', height: '100vh' }}>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <canvas
          ref={bgCanvasRef}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        />
        <canvas
          ref={fgCanvasRef}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        />
      </div>
    </main>
  );
}
