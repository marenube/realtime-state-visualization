// src/ui/render/drawStations.ts
import type { RenderGeometry } from '@/ui/render/buildRenderGeometry';

export function drawStations(ctx: CanvasRenderingContext2D, geometry: RenderGeometry) {
  // =========================
  // 1️⃣ 역 원 (환승/복선 반영)
  // =========================
  for (const s of geometry.stations.values()) {
    // 최소 1
    const degree = Math.max(s.degree, 1);

    /**
     * 시각 규칙
     * - 단일 노선: 작은 원
     * - 환승/복선: 점점 커짐
     */
    const BASE_RADIUS = 3;
    const EXTRA_PER_LINE = 2;
    const MAX_EXTRA = 8;

    const radius = BASE_RADIUS + Math.min((degree - 1) * EXTRA_PER_LINE, MAX_EXTRA);

    ctx.beginPath();
    ctx.arc(s.x, s.y, radius, 0, Math.PI * 2);

    // 내부는 항상 흰색
    ctx.fillStyle = '#fff';
    ctx.fill();

    // 환승역은 테두리를 조금 더 강조
    ctx.strokeStyle = '#000';
    ctx.lineWidth = degree >= 2 ? 1.5 : 1;
    ctx.stroke();
  }

  // =========================
  // 2️⃣ 역 이름
  // =========================
  ctx.font = '12px system-ui, -apple-system, BlinkMacSystemFont';
  ctx.fillStyle = '#111';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  for (const s of geometry.stations.values()) {
    const lx = s.labelX ?? s.x;
    const ly = s.labelY ?? s.y + 6;

    /**
     * ⚠️ 여기 중요
     * - RenderStation에 name이 있어야 함
     * - 없으면 id로 fallback
     */
    const label = (s as any).name ?? s.id;

    ctx.fillText(label, lx, ly);
  }
}
