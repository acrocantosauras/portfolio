"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Mark } from "@/components/ui/Mark";
import { profile } from "@/data/resume";

const EASTER_EGG_LINES = [
  "Signal received.",
  "Web-shooters recalibrated.",
  "Spider-sense: nominal.",
  "Okay, you found it. Hi.",
];

export function FinalScene() {
  const [clicks, setClicks] = useState(0);
  const [eggLine, setEggLine] = useState<string | null>(null);

  function handleMarkClick() {
    const next = clicks + 1;
    setClicks(next);
    if (next >= 3) {
      setEggLine(
        EASTER_EGG_LINES[Math.floor(Math.random() * EASTER_EGG_LINES.length)]
      );
      setClicks(0);
      window.setTimeout(() => setEggLine(null), 2600);
    }
  }

  return (
    <footer className="relative overflow-hidden bg-ink py-20">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, var(--color-paper) 0, var(--color-paper) 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, var(--color-paper) 0, var(--color-paper) 1px, transparent 1px, transparent 40px)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-5 text-center sm:px-8">
        <p className="font-mono text-xs tracking-[0.35em] text-paper-dim uppercase">
          End of Issue №01
        </p>
        <h2 className="mt-3 font-display text-5xl tracking-wide text-paper sm:text-7xl">
          TO BE <span className="text-signal-red-bright">CONTINUED</span>
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm text-paper-dim">
          The next issue is already in the queue — more systems, more proof,
          more shipped work.
        </p>

        <button
          type="button"
          onClick={handleMarkClick}
          aria-label="Easter egg"
          className="mx-auto mt-10 flex items-center justify-center opacity-70 transition-opacity hover:opacity-100"
        >
          <Mark className="h-10 w-10" />
        </button>

        <AnimatePresence>
          {eggLine && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 font-mono text-xs tracking-[0.2em] text-web-blue-bright uppercase"
            >
              {eggLine}
            </motion.p>
          )}
        </AnimatePresence>

        <div className="mx-auto mt-10 h-px w-24 bg-hairline" />

        <p className="mt-8 font-mono text-[11px] tracking-[0.15em] text-paper-dim uppercase">
          {profile.name} · {profile.role} · {new Date().getFullYear()}
        </p>
        <p className="mt-1 font-mono text-[10px] text-paper-dim/70">
          Designed &amp; built from scratch — Next.js, TypeScript, Motion.
        </p>
      </div>
    </footer>
  );
}
