/**
 * Rooftop Run: shared data for the layered New York scenes that sit between the
 * chapters. Everything here is pure and deterministic (seeded), so server and
 * client render identical markup.
 *
 * `t` is time of night for a scene: 0 = deep night, 1 = full morning. It drives
 * the sky, the skyline colours, how many windows are lit, and the sun.
 */

export const SURFACE = {
  night: "#04060d",
  nightSoft: "#090d19",
  overcast: "#252d3f",
  dawn: "#c9ccd0",
  morning: "#e6dfd0",
} as const;

// ---------------------------------------------------------------- colour

function hex(n: number) {
  return Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, "0");
}
function parse(c: string): [number, number, number] {
  const h = c.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
export function mix(a: string, b: string, k: number) {
  const [r1, g1, b1] = parse(a);
  const [r2, g2, b2] = parse(b);
  return `#${hex(r1 + (r2 - r1) * k)}${hex(g1 + (g2 - g1) * k)}${hex(b1 + (b2 - b1) * k)}`;
}

type Stop = {
  t: number;
  skyMid: string;
  skyHor: string;
  far: string;
  mid: string;
  obj: string;
  lights: number; // fraction of windows lit
  sun: number; // sun glow strength
};

// Night to morning. Between stops everything is interpolated.
const STOPS: Stop[] = [
  { t: 0.0, skyMid: "#0a1020", skyHor: "#18264a", far: "#0e1630", mid: "#080c18", obj: "#04060d", lights: 1, sun: 0 },
  { t: 0.3, skyMid: "#0f1830", skyHor: "#243860", far: "#131d38", mid: "#0a0f1d", obj: "#05070d", lights: 0.85, sun: 0 },
  { t: 0.6, skyMid: "#2a3550", skyHor: "#566686", far: "#323d58", mid: "#1c2438", obj: "#0d111c", lights: 0.45, sun: 0.1 },
  { t: 0.8, skyMid: "#8a7f8a", skyHor: "#e3a46f", far: "#7d7383", mid: "#4a4a5c", obj: "#1b1d28", lights: 0.12, sun: 0.65 },
  { t: 1.0, skyMid: "#e6dfd0", skyHor: "#f6dca4", far: "#c9c3bd", mid: "#8f8d93", obj: "#20232c", lights: 0, sun: 1 },
];

export type Palette = Omit<Stop, "t">;

export function palette(t: number): Palette {
  const x = Math.max(0, Math.min(1, t));
  let i = 0;
  while (i < STOPS.length - 2 && x > STOPS[i + 1].t) i++;
  const a = STOPS[i];
  const b = STOPS[i + 1];
  const k = (x - a.t) / (b.t - a.t);
  return {
    skyMid: mix(a.skyMid, b.skyMid, k),
    skyHor: mix(a.skyHor, b.skyHor, k),
    far: mix(a.far, b.far, k),
    mid: mix(a.mid, b.mid, k),
    obj: mix(a.obj, b.obj, k),
    lights: a.lights + (b.lights - a.lights) * k,
    sun: a.sun + (b.sun - a.sun) * k,
  };
}

// ---------------------------------------------------------------- skyline

/** Small deterministic PRNG so server and client agree. */
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const VB_W = 1600;
export const VB_H = 520;

export type Building = { x: number; w: number; top: number; step: boolean; spire: boolean };

function buildings(r: () => number, minW: number, maxW: number, topMin: number, topMax: number): Building[] {
  const out: Building[] = [];
  let x = -30;
  while (x < VB_W + 30) {
    const w = minW + r() * (maxW - minW);
    out.push({ x, w, top: topMin + r() * (topMax - topMin), step: r() > 0.75, spire: r() > 0.88 });
    x += w - r() * 5;
  }
  return out;
}

/** The building silhouettes as one SVG path (one DOM node per layer). */
export function skylinePath(bs: Building[]): string {
  let d = "";
  for (const b of bs) {
    d += `M${b.x.toFixed(1)} ${VB_H}V${b.top.toFixed(1)}`;
    if (b.step) {
      const sw = b.w * 0.34;
      d += `H${(b.x + b.w * 0.18).toFixed(1)}V${(b.top - 26).toFixed(1)}H${(b.x + b.w * 0.18 + sw).toFixed(1)}V${b.top.toFixed(1)}`;
    }
    if (b.spire) {
      const cx = b.x + b.w * 0.55;
      d += `H${(cx - 3).toFixed(1)}V${(b.top - 38).toFixed(1)}H${(cx + 3).toFixed(1)}V${b.top.toFixed(1)}`;
    }
    d += `H${(b.x + b.w).toFixed(1)}V${VB_H}Z`;
  }
  return d;
}

export type SceneData = {
  farPath: string;
  midPath: string;
  windowsPath: string;
  stars: { x: number; y: number; r: number }[];
};

export function buildScene(seed: number, lights: number): SceneData {
  const r = rng(seed * 9973 + 17);
  const far = buildings(r, 46, 110, 250, 360);
  const mid = buildings(r, 56, 130, 300, 430);

  // windows: only on the middle layer, only the lit ones, one path for all of them
  let w = "";
  for (const b of mid) {
    const cols = Math.max(1, Math.floor((b.w - 14) / 13));
    const rows = Math.min(7, Math.floor((VB_H - b.top - 20) / 17));
    for (let cx = 0; cx < cols; cx++) {
      for (let cy = 0; cy < rows; cy++) {
        const roll = r(); // consume in a fixed order so t never changes the layout
        if (roll < 0.4 * lights) {
          const x = b.x + 8 + cx * 13;
          const y = b.top + 12 + cy * 17;
          w += `M${x.toFixed(1)} ${y.toFixed(1)}h6v8h-6z`;
        }
      }
    }
  }

  const stars = Array.from({ length: 34 }, () => ({ x: r() * VB_W, y: r() * 200, r: 0.6 + r() * 1.1 }));

  return { farPath: skylinePath(far), midPath: skylinePath(mid), windowsPath: w, stars };
}

// ---------------------------------------------------------------- scenes

export type Variant =
  | "antenna"
  | "bridge"
  | "watertower"
  | "billboard"
  | "fireescape"
  | "spire"
  | "chimney"
  | "rooftop"
  | "skyline";

export type SceneSpec = {
  from: string; // colour of the chapter above
  to: string; // colour of the chapter below (the foreground becomes its floor)
  t: number;
  variant: Variant;
  seed: number;
};

/**
 * The eight scenes of the run, in order, one before each chapter after the hero:
 * from the last of the night to the first of the morning.
 */
export const SCENES: SceneSpec[] = [
  { from: SURFACE.night, to: SURFACE.night, t: 0.04, variant: "antenna", seed: 1 },
  { from: SURFACE.night, to: SURFACE.nightSoft, t: 0.12, variant: "bridge", seed: 2 },
  { from: SURFACE.nightSoft, to: SURFACE.night, t: 0.2, variant: "watertower", seed: 3 },
  { from: SURFACE.night, to: SURFACE.nightSoft, t: 0.3, variant: "billboard", seed: 4 },
  { from: SURFACE.nightSoft, to: SURFACE.nightSoft, t: 0.4, variant: "fireescape", seed: 5 },
  { from: SURFACE.overcast, to: SURFACE.overcast, t: 0.58, variant: "spire", seed: 6 },
  { from: SURFACE.overcast, to: SURFACE.dawn, t: 0.78, variant: "chimney", seed: 7 },
  { from: SURFACE.dawn, to: SURFACE.morning, t: 0.9, variant: "rooftop", seed: 8 },
];

/** Where the web strand attaches in each scene (in the 1600x520 scene space). */
export const ANCHORS: Record<Variant, { x: number; y: number }> = {
  antenna: { x: 1190, y: 170 },
  bridge: { x: 430, y: 196 },
  watertower: { x: 1010, y: 318 },
  billboard: { x: 880, y: 262 },
  fireescape: { x: 1140, y: 336 },
  spire: { x: 1090, y: 148 },
  chimney: { x: 930, y: 332 },
  rooftop: { x: 1010, y: 412 },
  skyline: { x: 960, y: 300 },
};
