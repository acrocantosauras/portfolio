"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useReducedMotionSafe } from "@/lib/reduced-motion";
import { cn } from "@/lib/utils";

/**
 * Pulls its child a few pixels toward the pointer while the pointer is near, and
 * lets it spring back on leave. Only for primary calls to action: it is a
 * deliberate, rare moment, not something every control should do. Does nothing
 * for touch (no hover) or reduced motion.
 */
export function Magnetic({
  children,
  strength = 0.28,
  max = 12,
  className,
}: {
  children: ReactNode;
  strength?: number;
  max?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionSafe();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 16, mass: 0.5 });
  const y = useSpring(my, { stiffness: 220, damping: 16, mass: 0.5 });

  if (reduce) return <div className={cn("inline-block", className)}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      className={cn("inline-block", className)}
      onPointerMove={(e) => {
        if (e.pointerType === "touch") return;
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        mx.set(Math.max(-max, Math.min(max, dx * strength)));
        my.set(Math.max(-max, Math.min(max, dy * strength)));
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
