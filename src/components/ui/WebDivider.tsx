"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useReducedMotionSafe } from "@/lib/reduced-motion";

/**
 * A web-thread divider: a main strand sagging across the section break, with
 * attachment threads and anchor nodes — the same strand language as the intro.
 * Strands draw themselves in as the visitor scrolls into the divider.
 */
export function WebDivider({
  className,
  tone = "mixed",
}: {
  className?: string;
  tone?: "mixed" | "red" | "blue";
}) {
  const reduce = useReducedMotionSafe();

  // One-shot path-draw for a strand; renders the final state for reduced motion.
  const draw = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { pathLength: 0, opacity: 0 },
          whileInView: { pathLength: 1, opacity: 1 },
          viewport: { once: true, margin: "-40px" },
          transition: {
            pathLength: { duration: 1.4, delay, ease: "easeInOut" as const },
            opacity: { duration: 0.25, delay },
          },
        };

  const nodeIn = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, scale: 0.4 },
          whileInView: { opacity: 1, scale: 1 },
          viewport: { once: true, margin: "-40px" },
          transition: { duration: 0.35, delay, type: "spring" as const },
        };

  return (
    <div className={cn("relative h-16 w-full overflow-hidden", className)} aria-hidden>
      <svg
        viewBox="0 0 1200 60"
        preserveAspectRatio="none"
        className="h-full w-full"
      >
        {/* main strand */}
        <motion.path
          d="M0 18 C 180 44, 420 50, 600 44 S 1020 30, 1200 20"
          fill="none"
          stroke="var(--color-hairline)"
          strokeWidth="1.2"
          {...draw(0)}
        />
        {/* secondary strands */}
        <motion.path
          d="M0 30 C 220 52, 480 56, 700 48 S 1040 36, 1200 34"
          fill="none"
          stroke="var(--color-hairline)"
          strokeWidth="0.8"
          opacity="0.6"
          {...draw(0.3)}
        />
        {/* attachment threads */}
        <g stroke="var(--color-hairline)" strokeWidth="0.8" opacity="0.75">
          <motion.path d="M150 14 L 190 47" {...draw(0.7)} />
          <motion.path d="M380 12 L 420 49" {...draw(0.78)} />
          <motion.path d="M600 12 L 600 44" {...draw(0.86)} />
          <motion.path d="M820 12 L 780 47" {...draw(0.94)} />
          <motion.path d="M1050 14 L 1010 41" {...draw(1.02)} />
        </g>
        {/* anchor nodes */}
        <motion.circle cx="190" cy="47" r="2" fill="var(--color-hairline)" {...nodeIn(1.15)} />
        <motion.circle cx="420" cy="49" r="2" fill="var(--color-hairline)" {...nodeIn(1.2)} />
        <motion.circle cx="600" cy="44" r="2.4" fill="var(--color-gold)" opacity="0.8" {...nodeIn(1.25)} />
        <motion.circle cx="780" cy="47" r="2" fill="var(--color-hairline)" {...nodeIn(1.3)} />
        <motion.circle cx="1010" cy="41" r="2" fill="var(--color-hairline)" {...nodeIn(1.35)} />
        {/* signal accents */}
        {tone !== "blue" && (
          <motion.circle cx="300" cy="47" r="2.6" fill="var(--color-signal-red)" opacity="0.9" {...nodeIn(1.3)} />
        )}
        {tone !== "red" && (
          <motion.circle cx="900" cy="38" r="2.6" fill="var(--color-web-blue-bright)" opacity="0.9" {...nodeIn(1.35)} />
        )}
      </svg>
    </div>
  );
}
