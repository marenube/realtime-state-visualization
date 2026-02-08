// src/ui/CanvasLayer.tsx

import { useEffect, useRef } from 'react';
import type { TrainView } from '@/runtime/model/TrainView';

type Props = {
  trains: TrainView[];
};

export function CanvasLayer({ trains }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 임시 렌더: progress를 x좌표로 사용
    trains.forEach(train => {
      const x = train.progress * canvas.width;
      const y = 100;

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = 'red';
      ctx.fill();
    });
  }, [trains]);

  return <canvas ref={canvasRef} width={800} height={200} style={{ border: '1px solid #ccc' }} />;
}
