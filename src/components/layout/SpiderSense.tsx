"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotionSafe } from "@/lib/reduced-motion";

const SEQUENCE = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

/**
 * An Easter egg: the Konami code sets off the spider-sense: rings ripple out
 * from the centre and a line of text confirms it. One-shot, a couple of seconds,
 * and rings are skipped for reduced motion. There is no hint anywhere on the
 * page; it is for whoever tries it.
 */
export function SpiderSense() {
  const reduce = useReducedMotionSafe();
  const [on, setOn] = useState(false);
  const idx = useRef(0);

  useEffect(() => {
    let timer = 0;
    function onKey(e: KeyboardEvent) {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (k === SEQUENCE[idx.current]) {
        idx.current += 1;
        if (idx.current === SEQUENCE.length) {
          idx.current = 0;
          setOn(true);
          window.clearTimeout(timer);
          timer = window.setTimeout(() => setOn(false), 2600);
        }
      } else {
        idx.current = k === SEQUENCE[0] ? 1 : 0;
      }
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <AnimatePresence>
      {on && (
        <motion.div
          key="sense"
          className="pointer-events-none fixed inset-0 z-[150] flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="status"
        >
          {!reduce &&
            [0, 0.18, 0.36].map((d) => (
              <motion.span
                key={d}
                className="absolute h-40 w-40 rounded-full border-2 border-signal-red-bright"
                initial={{ scale: 0.2, opacity: 0.9 }}
                animate={{ scale: 9, opacity: 0 }}
                transition={{ duration: 1.5, delay: d, ease: [0.16, 1, 0.3, 1] }}
              />
            ))}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="bg-ink/85 px-5 py-2.5 font-mono text-xs tracking-[0.22em] text-signal-red-bright"
          >
            SPIDER-SENSE: TINGLING
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
