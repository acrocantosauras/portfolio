/**
 * An organic web strand: not one clean line but a bundle of uneven fibres with
 * thin filaments between them, which overshoots, wobbles, then sags under its
 * own weight, and splats where it lands. Original canvas artwork.
 */
export type OrganicStrand = {
  fx: number;
  fy: number;
  tx: number;
  ty: number;
  born: number;
  seed: number;
};

export const STRAND_GROW = 210; // ms to reach the target
export const STRAND_HOLD = 2600; // ms it stays before fading
export const STRAND_FADE = 900;
export const STRAND_LIFE = STRAND_GROW + STRAND_HOLD + STRAND_FADE;

const SEGMENTS = 22;
const FIBRES = 3;

/** A cheap deterministic 0..1 value, so a strand keeps its shape between frames. */
function noise(seed: number, n: number): number {
  const v = Math.sin(seed * 12.9898 + n * 78.233) * 43758.5453;
  return v - Math.floor(v);
}

/** Draws one strand at the given age. `still` draws it landed and settled. */
export function drawOrganicStrand(
  ctx: CanvasRenderingContext2D,
  s: OrganicStrand,
  now: number,
  still = false
) {
  const age = still ? STRAND_GROW + 900 : now - s.born;
  const grow = Math.min(1, age / STRAND_GROW);
  const reach = 1 - Math.pow(1 - grow, 3);
  const landed = Math.max(0, age - STRAND_GROW);
  const fade =
    age < STRAND_GROW + STRAND_HOLD ? 1 : Math.max(0, 1 - (age - STRAND_GROW - STRAND_HOLD) / STRAND_FADE);

  const dx = s.tx - s.fx;
  const dy = s.ty - s.fy;
  const length = Math.hypot(dx, dy) || 1;
  const nx = -dy / length;
  const ny = dx / length;
  // gravity takes it slowly; the impact rings through it and dies away
  const sag = Math.min(46, length * 0.07) * (1 - Math.exp(-landed / 520));
  const wobble = still ? 0 : Math.sin(landed / 38) * Math.exp(-landed / 230) * 11;

  const fibres: [number, number][][] = [];
  for (let f = 0; f < FIBRES; f++) {
    const points: [number, number][] = [];
    for (let i = 0; i <= SEGMENTS; i++) {
      const u = (i / SEGMENTS) * reach;
      const belly = Math.sin(Math.PI * (i / SEGMENTS));
      // fibres are bound together at both ends and part in the middle
      const spread = (f - 1) * 3.4 * belly + (noise(s.seed + f, i) - 0.5) * 3.2 * belly;
      const shake = wobble * belly;
      points.push([
        s.fx + dx * u + nx * (spread + shake),
        s.fy + dy * u + ny * (spread + shake) + sag * belly,
      ]);
    }
    fibres.push(points);
  }

  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  fibres.forEach((points, f) => {
    ctx.strokeStyle = `rgba(236, 230, 216, ${(f === 1 ? 0.95 : 0.6) * fade})`;
    ctx.lineWidth = f === 1 ? 1.8 : 0.8;
    ctx.beginPath();
    points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.stroke();
  });

  // cross filaments
  ctx.strokeStyle = `rgba(236, 230, 216, ${0.45 * fade})`;
  ctx.lineWidth = 0.6;
  ctx.beginPath();
  for (let i = 2; i < SEGMENTS - 1; i += 2) {
    const a = fibres[noise(s.seed, i * 3) > 0.5 ? 0 : 2][i];
    const b = fibres[1][i + 1];
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(b[0], b[1]);
  }
  ctx.stroke();

  if (grow < 1) return;

  // the splat: uneven tendrils, a few joined by film, each ending in a bead
  const spreadOut = Math.min(1, 0.4 + landed / 160);
  const tips: [number, number][] = [];
  for (let k = 0; k < 9; k++) {
    const angle = (k / 9) * Math.PI * 2 + (noise(s.seed, 100 + k) - 0.5) * 0.6;
    const r = (7 + noise(s.seed, 200 + k) * 20) * spreadOut;
    const x = s.tx + Math.cos(angle) * r;
    const y = s.ty + Math.sin(angle) * r;
    tips.push([x, y]);
    ctx.strokeStyle = `rgba(236, 230, 216, ${0.85 * fade})`;
    ctx.lineWidth = 0.7 + noise(s.seed, 300 + k) * 1.1;
    ctx.beginPath();
    ctx.moveTo(s.tx, s.ty);
    ctx.quadraticCurveTo((s.tx + x) / 2 + (noise(s.seed, 400 + k) - 0.5) * 8, (s.ty + y) / 2, x, y);
    ctx.stroke();
    ctx.fillStyle = `rgba(236, 230, 216, ${0.8 * fade})`;
    ctx.beginPath();
    ctx.arc(x, y, 0.8 + noise(s.seed, 500 + k) * 1.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = `rgba(236, 230, 216, ${0.22 * fade})`;
  for (let k = 0; k < tips.length; k += 3) {
    const a = tips[k];
    const b = tips[(k + 1) % tips.length];
    ctx.beginPath();
    ctx.moveTo(s.tx, s.ty);
    ctx.lineTo(a[0], a[1]);
    ctx.quadraticCurveTo(s.tx, s.ty, b[0], b[1]);
    ctx.fill();
  }

  // one slow drip
  const drip = Math.min(20, landed / 70);
  ctx.strokeStyle = `rgba(236, 230, 216, ${0.6 * fade})`;
  ctx.lineWidth = 0.9;
  ctx.beginPath();
  ctx.moveTo(s.tx + 2, s.ty + 3);
  ctx.lineTo(s.tx + 2, s.ty + 3 + drip);
  ctx.stroke();

  ctx.fillStyle = `rgba(255, 84, 69, ${fade})`;
  ctx.beginPath();
  ctx.arc(s.tx, s.ty, 3, 0, Math.PI * 2);
  ctx.fill();
}
