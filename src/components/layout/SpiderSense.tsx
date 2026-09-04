"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/**
 * A cursor-linked glow ("spider-sense"). Any element with data-sense="true"
 * intensifies and shifts the glow blue when the cursor comes near it —
 * signalling "this is interactive / worth your attention."
 *
 * Hidden via CSS (not conditional rendering) for coarse pointers / reduced
 * motion, so mount never needs a setState-in-effect to gate visibility.
 */
export function SpiderSense() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const springX = useSpring(x, { damping: 28, stiffness: 220, mass: 0.4 });
  const springY = useSpring(y, { damping: 28, stiffness: 220, mass: 0.4 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    const isFine = window.matchMedia("(pointer: fine)").matches;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!isFine || reduceMotion) return;

    function onMove(e: PointerEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = (e.target as HTMLElement)?.closest?.(
        '[data-sense="true"]'
      );
      setActive(Boolean(target));
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [x, y]);

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[70] mix-blend-screen [@media(pointer:coarse)]:hidden motion-reduce:hidden"
      style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
    >
      <motion.div
        animate={{
          width: active ? 260 : 140,
          height: active ? 260 : 140,
          opacity: active ? 0.55 : 0.28,
        }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="rounded-full"
        style={{
          background: active
            ? "radial-gradient(circle, rgba(63,99,240,0.55) 0%, rgba(63,99,240,0) 70%)"
            : "radial-gradient(circle, rgba(216,31,44,0.4) 0%, rgba(216,31,44,0) 70%)",
        }}
      />
    </motion.div>
  );
}
