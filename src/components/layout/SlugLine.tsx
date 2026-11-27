"use client";

import { useEffect, useRef } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";

const START = 2 * 60 + 41; // 2:41 AM, the hero
const END = 7 * 60 + 12; // 7:12 AM, the last chapter

function format(progress: number) {
  const minutes = Math.round(START + Math.max(0, Math.min(1, progress)) * (END - START));
  const h = Math.floor(minutes / 60);
  const m = String(minutes % 60).padStart(2, "0");
  return `NEW YORK · ${h}:${m} AM`;
}

/**
 * A film-style slug line that tells the time: 2:41 AM at the top of the page,
 * 7:12 AM at the bottom. It is the one place the whole run's progress is named.
 * Updated through a ref (no React re-render per scroll frame); decorative.
 */
export function SlugLine() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    if (ref.current) ref.current.textContent = format(scrollYProgress.get());
  }, [scrollYProgress]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (ref.current) ref.current.textContent = format(v);
  });

  return (
    <p
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed right-4 bottom-4 z-40 font-mono text-[11px] tracking-[0.16em] text-white mix-blend-difference sm:right-6 sm:bottom-5 sm:text-[11px]"
    >
      {format(0)}
    </p>
  );
}
