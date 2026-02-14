// src/App.tsx
import { useEffect, useMemo, useRef, useState } from 'react';

import { startRenderLoop } from '@/runtime/loop/startRenderLoop';
import { createTrainScheduler } from '@/runtime/trainScheduler';
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
import { clampCameraToBounds } from '@/ui/camera/clampCameraToBounds';

import { setupCanvas } from '@/ui/canvas/setupCanvas';
import { bindCanvasPan } from '@/ui/canvas/useCanvasPan';
import { bindCanvasZoom } from '@/ui/canvas/useCanvasZoom';

import { buildRenderGeometry } from '@/ui/render/buildRenderGeometry';

import { computeGeometryBounds } from '@/ui/camera/computeGeometryBounds';

import '@/styles/global.css';

const EPS = 1e-6;
// ======================
// 데이터 초기화
// ======================
const stations = normalizeRawStationJson(rawJson);
const railEdges = buildRailEdges(stations);

const edgeOffsetMap = buildEdgeOffsetMap(railEdges, 8);

export default function App() {
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const fgCanvasRef = useRef<HTMLCanvasElement>(null);

  const cameraRef = useRef(createInitialCamera());

  const [trains, setTrains] = useState<TrainView[]>([]);
  const trainsRef = useRef<TrainView[]>([]);

  const renderGeometry = useMemo(() => {
    return buildRenderGeometry(stations, railEdges);
  }, [stations, railEdges]);
  const bounds = computeGeometryBounds(renderGeometry);

  useEffect(() => {
    trainsRef.current = trains;
  }, [trains]);

  useEffect(() => {
    const scheduler = createTrainScheduler({
      store: snapshotStore,
      intervalMs: 60_000,
    });

    scheduler.tick();
    scheduler.start();

    const stopRenderLoop = startRenderLoop(snapshotStore, stations, setTrains);

    return () => {
      scheduler.stop();
      stopRenderLoop();
    };
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

    const cx = (bounds.minX + bounds.maxX) / 2;
    const cy = (bounds.minY + bounds.maxY) / 2;

    // 🔑 핵심: 초기 scale을 작게 잡지 않는다
    camera.scale = 1;
    camera.minScale = 0.05; // 줌아웃 허용 범위

    camera.x = fgCanvas.clientWidth / 2 - cx * camera.scale;
    camera.y = fgCanvas.clientHeight / 2 - cy * camera.scale;

    const cleanupPan = bindCanvasPan(fgCanvas, camera, bounds);
    const cleanupZoom = bindCanvasZoom(fgCanvas, camera, bounds);

    lastCamRef.current = { x: camera.x, y: camera.y, scale: camera.scale };
    bgDirtyRef.current = true;

    const redrawBackground = () => {
      const bgCtx = bgCtxRef.current!;
      const bgCanvasEl = bgCanvasRef.current!;

      bgCtx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
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

      fgCtx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
      fgCtx.clearRect(0, 0, fgCanvasEl.width, fgCanvasEl.height);

      applyCamera(fgCtx, camera);
      drawTrains(
        fgCtx,
        trainsRef.current,
        renderGeometry, // ✅ stations 대신 geometry
        edgeOffsetMap,
      );

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
