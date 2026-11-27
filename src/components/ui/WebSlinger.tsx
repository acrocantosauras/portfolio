"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useReducedMotionSafe } from "@/lib/reduced-motion";

export type SlingerPose = "crouch" | "stand" | "hang" | "run";

const RED = "#dc3128";
const BLUE = "#1d5fd1";
const INK = "#05060b";
const RIM = "rgba(236, 230, 216, 0.55)";

type Limb = { d: string; colour: string; w: number };

/** Limbs are thick round strokes; the origin is between the feet. */
const BODY: Record<"crouch" | "stand", { legs: Limb[]; torso: Limb[]; arms: Limb[]; head: [number, number] }> = {
  crouch: {
    legs: [
      { d: "M-4 -24L-27 -31", colour: BLUE, w: 10 },
      { d: "M-27 -31L-19 -3", colour: RED, w: 8 },
      { d: "M4 -24L27 -31", colour: BLUE, w: 10 },
      { d: "M27 -31L19 -3", colour: RED, w: 8 },
    ],
    torso: [
      { d: "M0 -25L0 -45", colour: BLUE, w: 17 },
      { d: "M0 -27L0 -46", colour: RED, w: 10 },
    ],
    arms: [
      { d: "M-8 -44L-15 -25L-6 -4", colour: RED, w: 6.5 },
      { d: "M8 -44L15 -25L6 -4", colour: RED, w: 6.5 },
    ],
    head: [0, -57],
  },
  stand: {
    legs: [
      { d: "M-4 -33L-8 -18", colour: BLUE, w: 9 },
      { d: "M-8 -18L-10 -2", colour: RED, w: 7.5 },
      { d: "M4 -33L8 -18", colour: BLUE, w: 9 },
      { d: "M8 -18L10 -2", colour: RED, w: 7.5 },
    ],
    torso: [
      { d: "M0 -34L0 -58", colour: BLUE, w: 17 },
      { d: "M0 -36L0 -59", colour: RED, w: 10 },
    ],
    arms: [{ d: "M-9 -56L-17 -43L-16 -29", colour: RED, w: 6 }],
    head: [0, -71],
  },
};

/** Running: two legs and two arms that swing in opposite phase. */
const STRIDE: { legs: [Limb[], Limb[]]; arms: [Limb[], Limb[]] } = {
  legs: [
    [
      { d: "M-2 -33L-12 -20", colour: BLUE, w: 9 },
      { d: "M-12 -20L-13 -3", colour: RED, w: 7.5 },
    ],
    [
      { d: "M2 -33L12 -20", colour: BLUE, w: 9 },
      { d: "M12 -20L13 -3", colour: RED, w: 7.5 },
    ],
  ],
  arms: [
    [{ d: "M-8 -55L-19 -48L-14 -36", colour: RED, w: 6 }],
    [{ d: "M8 -55L19 -48L14 -36", colour: RED, w: 6 }],
  ],
};

const WAVING_ARM: Limb = { d: "M9 -56L23 -60L25 -77", colour: RED, w: 6 };
const RESTING_ARM: Limb = { d: "M9 -56L17 -43L16 -29", colour: RED, w: 6 };

function Strokes({ limbs }: { limbs: Limb[] }) {
  return (
    <>
      {limbs.map((l) => (
        <path key={`r${l.d}`} d={l.d} stroke={RIM} strokeWidth={l.w + 4.5} />
      ))}
      {limbs.map((l) => (
        <path key={`o${l.d}`} d={l.d} stroke={INK} strokeWidth={l.w + 2.5} />
      ))}
      {limbs.map((l) => (
        <path key={`f${l.d}`} d={l.d} stroke={l.colour} strokeWidth={l.w} />
      ))}
    </>
  );
}

/**
 * A small masked web-slinger, drawn from scratch for this page (no official art,
 * logo or chest emblem). It drops in when it comes into view, turns its head to
 * follow the pointer, and does a flip when clicked. The standing pose can wave.
 *
 * Render it inside an <svg>; the origin is between its feet (for "hang", at the
 * point it hangs from). It is decoration: no focus and no accessible name of its
 * own. Under reduced motion it simply sits still.
 */
export function WebSlinger({
  pose,
  waving = false,
  still = false,
  onPoke,
}: {
  pose: SlingerPose;
  waving?: boolean;
  /** skip the drop-in, for when the parent animates the entrance */
  still?: boolean;
  onPoke?: () => void;
}) {
  const reduce = useReducedMotionSafe();
  const ref = useRef<SVGGElement>(null);
  const [flips, setFlips] = useState(0);
  const lookX = useSpring(useMotionValue(0), { stiffness: 120, damping: 16 });
  const lookY = useSpring(useMotionValue(0), { stiffness: 120, damping: 16 });
  const tilt = useSpring(useMotionValue(0), { stiffness: 90, damping: 14 });

  // watch the pointer, but only while on screen
  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy) || 1;
      // upside down, the head has to turn the other way to face the same point
      const flip = pose === "hang" ? -1 : 1;
      lookX.set((dx / d) * 2.6 * flip);
      lookY.set((dy / d) * 1.8 * flip);
      tilt.set(Math.max(-14, Math.min(14, (dx / 28) * flip)));
    };
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) window.addEventListener("pointermove", onMove, { passive: true });
      else window.removeEventListener("pointermove", onMove);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduce, pose, lookX, lookY, tilt]);

  const body = BODY[pose === "stand" || pose === "run" ? "stand" : "crouch"];
  const [hx, hy] = body.head;

  return (
    <motion.g
      ref={ref}
      initial={still ? false : { y: pose === "hang" ? -90 : -46, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 130, damping: 11 }}
      onClick={() => {
        setFlips((n) => n + 1);
        onPoke?.();
      }}
      className="cursor-pointer"
      style={{ pointerEvents: "visiblePainted" }}
      data-slinger={pose}
    >
      <motion.g
        key={flips}
        animate={flips && !reduce ? { y: [0, pose === "hang" ? 26 : -46, 0], rotate: [0, -360] } : undefined}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <g transform={pose === "hang" ? "translate(0 2) scale(1 -1)" : undefined}>
          <g className="slinger-breathe" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {pose === "run" ? (
              <>
                {STRIDE.legs.map((leg, i) => (
                  <g key={i} className={i ? "slinger-leg-b" : "slinger-leg-a"}>
                    <Strokes limbs={leg} />
                  </g>
                ))}
                <Strokes limbs={body.torso} />
                {STRIDE.arms.map((arm, i) => (
                  <g key={i} className={i ? "slinger-arm-b" : "slinger-arm-a"}>
                    <Strokes limbs={arm} />
                  </g>
                ))}
              </>
            ) : (
              <>
                <Strokes limbs={body.legs} />
                <Strokes limbs={body.torso} />
                <Strokes limbs={body.arms} />
              </>
            )}
            {pose === "stand" && (
              <g className={waving ? "slinger-wave" : undefined}>
                <Strokes limbs={[waving ? WAVING_ARM : RESTING_ARM]} />
              </g>
            )}
            <motion.g style={{ rotate: tilt }}>
              <ellipse cx={hx} cy={hy} rx="13.6" ry="15" fill={RIM} />
              <ellipse cx={hx} cy={hy} rx="12.4" ry="13.8" fill={INK} />
              <ellipse cx={hx} cy={hy} rx="11" ry="12.4" fill={RED} />
              <motion.g style={{ x: lookX, y: lookY }} fill="#f6f1e6" stroke={INK} strokeWidth="1.7">
                <path d={`M${hx - 9.5} ${hy - 4.5}Q${hx - 3} ${hy - 2.5} ${hx - 1.5} ${hy + 4}Q${hx - 9} ${hy + 4} ${hx - 9.5} ${hy - 4.5}Z`} />
                <path d={`M${hx + 9.5} ${hy - 4.5}Q${hx + 3} ${hy - 2.5} ${hx + 1.5} ${hy + 4}Q${hx + 9} ${hy + 4} ${hx + 9.5} ${hy - 4.5}Z`} />
              </motion.g>
            </motion.g>
          </g>
        </g>
      </motion.g>
    </motion.g>
  );
}
