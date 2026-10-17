import { useMemo } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * A composed radial web corner — concentric strands spanning evenly spaced
 * radials, anchored at one corner. Geometry is deterministic (no randomness),
 * so server and client render identical markup.
 */

const ANGLES = [7, 22, 39, 56, 72, 86]; // degrees from the +x axis
const RADII = [74, 136, 208, 290, 380];
const MAX_R = 430;

function pt(angleDeg: number, r: number): [number, number] {
  const a = (angleDeg * Math.PI) / 180;
  return [Math.cos(a) * r, Math.sin(a) * r];
}

type Strand = { d: string; i: number };

function buildWeb(): { radials: Strand[]; arcs: Strand[] } {
  const radials: Strand[] = ANGLES.map((ang, i) => {
    const [x, y] = pt(ang, MAX_R);
    return { d: `M0 0 L ${x.toFixed(1)} ${y.toFixed(1)}`, i };
  });
  const arcs: Strand[] = [];
  let k = 0;
  for (let ri = 0; ri < RADII.length; ri++) {
    const r = RADII[ri];
    for (let ai = 0; ai < ANGLES.length - 1; ai++) {
      const [x1, y1] = pt(ANGLES[ai], r);
      const [x2, y2] = pt(ANGLES[ai + 1], r);
      // control point pulled toward the anchor: strands sag into the corner
      const cx = ((x1 + x2) / 2) * 0.84;
      const cy = ((y1 + y2) / 2) * 0.84;
      arcs.push({
        d: `M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(
          1
        )} ${x2.toFixed(1)} ${y2.toFixed(1)}`,
        i: k++,
      });
    }
  }
  return { radials, arcs };
}

const ANCHOR_TRANSFORM: Record<string, string | undefined> = {
  tl: undefined,
  tr: "scale(-1,1)",
  bl: "scale(1,-1)",
  br: "scale(-1,-1)",
};

export function WebCorner({
  className,
  anchor = "tl",
  animate = false,
  strokeWidth = 1,
}: {
  className?: string;
  anchor?: "tl" | "tr" | "bl" | "br";
  /** Draw strands on mount (intro). Static otherwise. */
  animate?: boolean;
  strokeWidth?: number;
}) {
  const { radials, arcs } = useMemo(() => buildWeb(), []);
  const transform = ANCHOR_TRANSFORM[anchor];

  const strand = (s: Strand, kind: "radial" | "arc", idx: number) => {
    const delay = kind === "radial" ? 0.3 + s.i * 0.07 : 0.75 + s.i * 0.022;
    if (!animate) {
      return <path key={`${kind}-${s.i}`} d={s.d} />;
    }
    return (
      <motion.path
        key={`${kind}-${s.i}`}
        d={s.d}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: { duration: kind === "radial" ? 0.85 : 0.5, delay },
          opacity: { duration: 0.2, delay },
        }}
        style={{ animationDelay: `${idx * 0.01}s` }}
      />
    );
  };

  return (
    <svg
      viewBox="0 0 400 400"
      className={cn("pointer-events-none", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      aria-hidden
    >
      <g transform={transform}>
        {radials.map((s, i) => strand(s, "radial", i))}
        {arcs.map((s, i) => strand(s, "arc", i))}
      </g>
    </svg>
  );
}
