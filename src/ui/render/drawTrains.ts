import type { TrainView } from '@/runtime/model/TrainView';
import type { RenderGeometry } from '@/ui/render/buildRenderGeometry';
import type { EdgeOffset } from '@/data/rail/buildEdgeOffsetMap';

let didLogMiss = false;

export function drawTrains(
  ctx: CanvasRenderingContext2D,
  trains: TrainView[],
  geometry: RenderGeometry,
  edgeOffsetMap: Map<string, EdgeOffset>,
) {
  ctx.fillStyle = '#e53935';

  let rendered = 0;

  for (const train of trains) {
    const { aId, bId } = train.edge;

    const stationA = geometry.stations.get(aId);
    const stationB = geometry.stations.get(bId);

    if (!stationA || !stationB) continue;

    const t = Math.max(0, Math.min(1, train.t));

    let x = stationA.x + (stationB.x - stationA.x) * t;
    let y = stationA.y + (stationB.y - stationA.y) * t;

    const key = `${aId}:${bId}:${train.lineId}`;
    const off = edgeOffsetMap.get(key);

    if (off) {
      x += off.sx;
      y += off.sy;
    }

    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();

    rendered++;
  }

  // console.log('🔴 Rendered trains:', rendered);
}
