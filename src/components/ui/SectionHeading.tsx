"use client";

import { motion } from "motion/react";
import { DisplayTitle } from "./DisplayTitle";

/**
 * Section heading — eyebrow (technical mono label) + kinetic condensed
 * display title. By default the LAST word of the title receives the comic
 * red-face/blue-offset accent; pass `accent` to pick another word, or
 * `accent={null}` for a plain paper title.
 */
export function SectionHeading({
  eyebrow,
  title,
  align = "left",
  accent,
  className,
}: {
  eyebrow: string;
  title: string;
  align?: "left" | "center";
  /** Word to accent; defaults to the last word. `null` = no accent. */
  accent?: string | null;
  className?: string;
}) {
  const words = title.split(" ");
  const accentWord =
    accent === null ? undefined : (accent ?? words[words.length - 1]);

  return (
    <div className={align === "center" ? "text-center" : className}>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className={
          "mb-3 flex items-center gap-2.5 font-mono text-xs tracking-[0.35em] text-signal-red uppercase " +
          (align === "center" ? "justify-center" : "")
        }
      >
        <span className="inline-block h-px w-6 bg-signal-red/70" aria-hidden />
        {eyebrow}
      </motion.p>
      <DisplayTitle as="h2" text={title} accent={accentWord} />
    </div>
  );
}
