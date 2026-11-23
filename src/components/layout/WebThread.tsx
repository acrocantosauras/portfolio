"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useScroll } from "motion/react";
import { useReducedMotionSafe } from "@/lib/reduced-motion";

type Geometry = { d: string; height: number; nodes: number[]; x: number };

/**
 * The page's one web strand. A single line runs down the left gutter, swaying
 * gently between chapters and tying a knot at the start of each. The red part
 * is drawn by scroll position — it is the narrative spine (and the progress
 * indicator), replacing the old repeated dividers.
 *
 * Geometry is measured from the real section positions after mount, so server
 * and client markup match (nothing renders until measured). Reduced motion shows
 * the full grey strand and knots with no scroll-drawn line.
 */
export function WebThread({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionSafe();
  const [geo, setGeo] = useState<Geometry | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 55%"],
  });

  useEffect(() => {
    const wrap = ref.current;
    if (!wrap) return;

    function measure() {
      if (!wrap) return;
      const h = wrap.offsetHeight;
      const wide = window.innerWidth >= 768;
      const x = wide ? 16 : 9;
      const amp = wide ? 9 : 4;
      const base = wrap.getBoundingClientRect().top;
      const tops = Array.from(wrap.querySelectorAll<HTMLElement>("section[id]"))
        .map((s) => Math.round(s.getBoundingClientRect().top - base))
        .filter((t) => t > 0 && t < h);
      const stops = [0, ...tops, h];
      let d = `M ${x} 0`;
      for (let i = 1; i < stops.length; i++) {
        const y0 = stops[i - 1];
        const y1 = stops[i];
        const s = i % 2 === 0 ? 1 : -1;
        d += ` C ${x + amp * s} ${y0 + (y1 - y0) * 0.33}, ${x - amp * s} ${
          y0 + (y1 - y0) * 0.66
        }, ${x} ${y1}`;
      }
      setGeo({ d, height: h, nodes: tops, x });
    }

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      {children}
      {geo && (
        <svg
          className="pointer-events-none absolute top-0 left-0 z-20"
          width={36}
          height={geo.height}
          viewBox={`0 0 36 ${geo.height}`}
          aria-hidden
        >
          <path
            d={geo.d}
            fill="none"
            stroke="rgb(128 136 148 / 0.35)"
            strokeWidth={1}
          />
          {!reduce && (
            <motion.path
              d={geo.d}
              fill="none"
              stroke="var(--color-signal-red-bright)"
              strokeWidth={1.5}
              style={{ pathLength: scrollYProgress }}
            />
          )}
          {geo.nodes.map((y) => (
            <circle
              key={y}
              cx={geo.x}
              cy={y}
              r={2.5}
              fill="var(--color-signal-red-bright)"
            />
          ))}
        </svg>
      )}
    </div>
  );
}
