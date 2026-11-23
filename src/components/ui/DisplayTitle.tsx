"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useReducedMotionSafe } from "@/lib/reduced-motion";

/**
 * DisplayTitle — the interior display-typography system.
 *
 * Derived from the footer's "SYSTEM STANDING BY" treatment: Bebas Neue
 * (--font-display), tight uppercase, heavy condensed proportions, and an
 * optional comic-print accent word (red face + royal-blue offset shadow,
 * echoing .masthead-sm). Words reveal from a hard mask with a staggered
 * rise, like kinetic title cards.
 *
 * The comic shadow is applied to AT MOST one accent word per heading so the
 * treatment keeps its impact. Reduced motion renders the final state directly.
 *
 * The reduced-motion branch flips in only after hydration
 * (see lib/reduced-motion.ts) so server and client trees always match.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

/** "BUILD?" -> "build" — compare words ignoring case and punctuation. */
function normalize(word: string) {
  return word.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
}

export function DisplayTitle({
  text,
  as: Tag = "h2",
  accent,
  className,
  delay = 0,
}: {
  text: string;
  as?: "h2" | "h3" | "p";
  /** Exact word in `text` to receive the comic red-face/blue-offset treatment. */
  accent?: string;
  className?: string;
  /** Base delay before the first word (seconds). */
  delay?: number;
}) {
  const reduce = useReducedMotionSafe();
  const words = text.split(" ");
  const accentNorm = accent ? normalize(accent) : null;

  return (
    <Tag
      className={cn(
        "font-display leading-[0.92] tracking-wide text-paper uppercase",
        className
      )}
    >
      {/* semantic full heading for assistive tech; words are visual units */}
      <span className="sr-only">{text}</span>
      {words.map((word, i) => {
        const isAccent = accentNorm !== null && normalize(word) === accentNorm;
        if (reduce) {
          return (
            <span key={`${word}-${i}`} aria-hidden className="inline-block pr-[0.16em]">
              <span className={cn("block", isAccent && "accent-comic")}>{word}</span>
            </span>
          );
        }
        // The in-view trigger lives on the stable wrapper, not on the word that
        // starts translated outside the clip box (an element clipped away by its
        // parent never reports as intersecting, so it would never reveal).
        return (
          <motion.span
            key={`${word}-${i}`}
            aria-hidden
            className="inline-block overflow-hidden pt-[0.04em] pr-[0.16em] pb-[0.12em] align-bottom"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
          >
            <motion.span
              className={cn("block", isAccent && "accent-comic")}
              variants={{
                hidden: { y: "112%" },
                show: {
                  y: "0%",
                  transition: { duration: 0.6, delay: delay + i * 0.09, ease: EASE },
                },
              }}
            >
              {word}
            </motion.span>
          </motion.span>
        );
      })}
    </Tag>
  );
}
