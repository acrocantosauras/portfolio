"use client";

import { DisplayTitle } from "./DisplayTitle";
import { cn } from "@/lib/utils";

/**
 * Section heading — the title carries its own weight (no eyebrow label).
 * One word, the last by default, is set in the comic masthead lettering (red
 * face, dark outline, blue depth block); pass `accent` to pick another word or
 * `accent={null}` for none. `tone="dawn"` switches to dark type for the light,
 * morning surfaces.
 */
export function SectionHeading({
  title,
  align = "left",
  accent,
  tone = "night",
  className,
}: {
  title: string;
  align?: "left" | "center";
  /** Word to accent; defaults to the last word. `null` = no accent. */
  accent?: string | null;
  tone?: "night" | "dawn";
  className?: string;
}) {
  const words = title.split(" ");
  const accentWord = accent === null ? undefined : (accent ?? words[words.length - 1]);

  return (
    <div className={cn(align === "center" && "text-center", className)}>
      <DisplayTitle
        as="h2"
        text={title}
        accent={accentWord}
        className={cn(
          "[font-size:clamp(2.75rem,8vw,6rem)] text-balance",
          tone === "dawn" && "text-dawn-ink"
        )}
      />
    </div>
  );
}
