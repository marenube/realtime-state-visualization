// src/App.tsx
import { useEffect, useRef, useState } from 'react';

import { startRenderLoop } from '@/runtime/loop/startRenderLoop';
import type { TrainView } from '@/runtime/model/TrainView';

import { snapshotStore } from '@/data/snapshot/singleton';

import rawJson from '@/data/rawStations.json';

import { buildRailEdges } from '@/data/rail/buildRailEdges';

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
import { normalizeRawStationJson } from '@/data/station/normalizeRawStationJson';

import '@/styles/global.css';

const stations = normalizeRawStationJson(rawJson);
const railEdges = buildRailEdges(rawJson);

const bounds = computeBounds(stations);

export default function App() {
  const bgCanvasRef = useRef<HTMLCanvasElement>(null); // 선로 + 역
  const fgCanvasRef = useRef<HTMLCanvasElement>(null); // 열차

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

  useEffect(() => {
    const bgCanvas = bgCanvasRef.current!;
    const fgCanvas = fgCanvasRef.current!;

    const bgCtx = setupCanvas(bgCanvas);
    const fgCtx = setupCanvas(fgCanvas);

    const camera = cameraRef.current;

    fitCameraToBounds(camera, bounds, fgCanvas, 600);
    clampCameraToBounds(camera, bounds, fgCanvas);

    const cleanupPan = bindCanvasPan(fgCanvas, camera, bounds);
    const cleanupZoom = bindCanvasZoom(fgCanvas, camera, bounds);

    let bgDirty = true;
    let lastCam = { x: camera.x, y: camera.y, scale: camera.scale };
    const EPS = 1e-6;

    const redrawBackground = () => {
      bgCtx.setTransform(1, 0, 0, 1, 0, 0);
      bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

      applyCamera(bgCtx, camera);
      drawRailEdges(bgCtx, railEdges);
      drawStations(bgCtx, stations);
    };

    let rafId = 0;
    const render = () => {
      const camChanged =
        Math.abs(camera.x - lastCam.x) > EPS ||
        Math.abs(camera.y - lastCam.y) > EPS ||
        Math.abs(camera.scale - lastCam.scale) > EPS;

      if (camChanged) {
        bgDirty = true;
        lastCam = { ...camera };
      }

      if (bgDirty) {
        redrawBackground();
        bgDirty = false;
      }

      fgCtx.setTransform(1, 0, 0, 1, 0, 0);
      fgCtx.clearRect(0, 0, fgCanvas.width, fgCanvas.height);

      applyCamera(fgCtx, camera);
      drawTrains(fgCtx, trainsRef.current, stations);

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
    const bgCanvas = bgCanvasRef.current!;
    const fgCanvas = fgCanvasRef.current!;
    const camera = cameraRef.current;

    const handleResize = () => {
      const centerWorldX = (fgCanvas.clientWidth / 2 - camera.x) / camera.scale;
      const centerWorldY = (fgCanvas.clientHeight / 2 - camera.y) / camera.scale;

      setupCanvas(bgCanvas);
      setupCanvas(fgCanvas);

      camera.x = fgCanvas.clientWidth / 2 - centerWorldX * camera.scale;
      camera.y = fgCanvas.clientHeight / 2 - centerWorldY * camera.scale;

      clampCameraToBounds(camera, bounds, fgCanvas);
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
