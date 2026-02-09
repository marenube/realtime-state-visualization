import type { RenderGeometry, RenderEdge } from '@/ui/render/buildRenderGeometry';
import { subwayLines } from '@/data/subwayLines';

const lineByName = new Map(subwayLines.map(l => [l.name, l.color]));
const warned = new Set<string>();

const EDGE_OFFSET_PX = 6;
const EPS = 0.01;

/**
 * 같은 좌표(A-B, 방향 무시) 기준 키
 */
function coordKey(p0: { x: number; y: number }, p1: { x: number; y: number }) {
  const x0 = Math.round(p0.x / EPS) * EPS;
  const y0 = Math.round(p0.y / EPS) * EPS;
  const x1 = Math.round(p1.x / EPS) * EPS;
  const y1 = Math.round(p1.y / EPS) * EPS;

  if (x0 < x1 || (x0 === x1 && y0 <= y1)) {
    return `${x0},${y0}:${x1},${y1}`;
  }
  return `${x1},${y1}:${x0},${y0}`;
}

let didLogSummary = false;

export function drawRailEdges(ctx: CanvasRenderingContext2D, geometry: RenderGeometry) {
  const edges = geometry.edges;

  // 1️⃣ 좌표 기준 그룹핑 (복선/삼복선)
  const groups = new Map<string, RenderEdge[]>();

  for (const e of edges) {
    const k = coordKey(e.p0, e.p1);
    const arr = groups.get(k) ?? [];
    arr.push(e);
    groups.set(k, arr);
  }

  if (!didLogSummary) {
    didLogSummary = true;
  }

  // 2️⃣ 렌더
  ctx.lineWidth = 3;

  for (const group of groups.values()) {
    const count = group.length;
    const center = (count - 1) / 2;

    // lineId 기준 정렬 (줌/리렌더 시 흔들림 방지)
    group.sort((a, b) => a.lineId.localeCompare(b.lineId));

    for (let i = 0; i < count; i++) {
      const e = group[i];
      const { p0, p1 } = e;

      const color = lineByName.get(e.lineId) ?? '#444';
      if (!lineByName.has(e.lineId) && !warned.has(e.lineId)) {
        warned.add(e.lineId);
        console.warn('[LINE COLOR MISS]', e.lineId);
      }
      ctx.strokeStyle = color;

      const dx = p1.x - p0.x;
      const dy = p1.y - p0.y;
      const len = Math.hypot(dx, dy) || 1;

      const nx = -dy / len;
      const ny = dx / len;

      const offset = (i - center) * EDGE_OFFSET_PX;

      ctx.beginPath();
      ctx.moveTo(p0.x + nx * offset, p0.y + ny * offset);
      ctx.lineTo(p1.x + nx * offset, p1.y + ny * offset);
      ctx.stroke();
    }
  }
}
