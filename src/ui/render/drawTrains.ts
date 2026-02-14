import type { TrainView } from '@/runtime/model/TrainView';
import type { RenderGeometry } from '@/ui/render/buildRenderGeometry';
import type { EdgeOffset } from '@/data/rail/buildEdgeOffsetMap';
import { subwayLines } from '@/data/subwayLines';

const lineColorMap = new Map(subwayLines.map(l => [l.id, l.color]));

export function drawTrains(
  ctx: CanvasRenderingContext2D,
  trains: TrainView[],
  geometry: RenderGeometry,
  edgeOffsetMap: Map<string, EdgeOffset>,
) {
  for (const train of trains) {
    const { aId, bId } = train.edge;

    const A = geometry.stations.get(aId);
    const B = geometry.stations.get(bId);
    if (!A || !B) continue;

    const t = train.t < 0 ? 0 : train.t > 1 ? 1 : train.t;

    // 1️⃣ 위치
    let x = A.x + (B.x - A.x) * t;
    let y = A.y + (B.y - A.y) * t;

    const key = `${aId}:${bId}:${train.lineId}`;
    const off = edgeOffsetMap.get(key);
    if (off) {
      x += off.sx;
      y += off.sy;
    }

    // 2️⃣ 방향 벡터
    const dx = B.x - A.x;
    const dy = B.y - A.y;
    const len = Math.hypot(dx, dy) || 1;

    const ux = dx / len;
    const uy = dy / len;

    const px = -uy;
    const py = ux;

    // 3️⃣ 열차 비율
    const halfLen = 5; // 길이
    const radius = 3.8; // 폭 (너무 크면 통처럼 보임)

    const color = lineColorMap.get(train.lineId) ?? '#e53935';

    // 앞/뒤 중심점
    const fx = x + ux * halfLen;
    const fy = y + uy * halfLen;
    const bx = x - ux * halfLen;
    const by = y - uy * halfLen;

    // 외곽 점 계산
    const fLx = fx + px * radius;
    const fLy = fy + py * radius;

    const bLx = bx + px * radius;
    const bLy = by + py * radius;
    const bRx = bx - px * radius;
    const bRy = by - py * radius;

    // 🔥 핵심: 정확한 캡슐 경로
    ctx.beginPath();

    // 왼쪽 직선
    ctx.moveTo(bLx, bLy);
    ctx.lineTo(fLx, fLy);

    // 앞 반원 (정방향 반원)
    const frontAngle = Math.atan2(uy, ux);
    ctx.arc(fx, fy, radius, frontAngle + Math.PI / 2, frontAngle - Math.PI / 2, true);

    // 오른쪽 직선
    ctx.lineTo(bRx, bRy);

    // 뒤 반원
    ctx.arc(bx, by, radius, frontAngle - Math.PI / 2, frontAngle + Math.PI / 2, true);

    ctx.closePath();

    ctx.fillStyle = color;
    ctx.fill();

    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(0,0,0,0.35)';
    ctx.stroke();

    // 4️⃣ 중앙 짧은 화살표
    const arrowLen = 2.6;
    const arrowW = 1.8;

    ctx.save();
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = '#ffffff';

    const ax = x + ux * 3.2; // 화살표 위치
    const ay = y + uy * 3.2;

    ctx.beginPath();
    ctx.moveTo(ax + ux * arrowLen, ay + uy * arrowLen);
    ctx.lineTo(ax - ux * arrowLen * 0.6 + px * arrowW, ay - uy * arrowLen * 0.6 + py * arrowW);
    ctx.lineTo(ax - ux * arrowLen * 0.6 - px * arrowW, ay - uy * arrowLen * 0.6 - py * arrowW);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
}
