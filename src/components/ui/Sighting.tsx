"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, type TargetAndTransition } from "motion/react";
import { WebSlinger, type SlingerPose } from "@/components/ui/WebSlinger";
import { useReducedMotionSafe } from "@/lib/reduced-motion";
import { cn } from "@/lib/utils";

const TOTAL = 3;
const LOOK_DELAY = 600; // let the visitor arrive before anything happens

/** Which sightings have been caught during this page visit. */
const caught = new Set<string>();

type Kind = "hang" | "run" | "peek";

type Act = {
  pose: SlingerPose;
  viewBox: string;
  figure: string;
  stay: number;
  enter: TargetAndTransition;
  show: TargetAndTransition;
  leave: TargetAndTransition;
};

const ACTS: Record<Kind, Act> = {
  // drops on a strand, watches the pointer, zips back up
  hang: {
    pose: "hang",
    viewBox: "-42 -4 84 92",
    figure: "h-[84px] w-[76px]",
    stay: 5200,
    enter: { y: "-100%" },
    show: { y: "0%", transition: { type: "spring", stiffness: 90, damping: 12 } },
    leave: { y: "-100%", transition: { duration: 0.45, ease: [0.6, 0, 0.9, 0.4] } },
  },
  // sprints across the strip, behind the cards
  run: {
    pose: "run",
    viewBox: "-42 -92 84 96",
    figure: "h-[96px] w-[84px]",
    stay: 4300,
    enter: { left: "-12%" },
    show: { left: "104%", transition: { duration: 4.2, ease: "linear" } },
    leave: { opacity: 0, transition: { duration: 0.2 } },
  },
  // head up from behind the edge, a look round, and down again
  peek: {
    pose: "stand",
    viewBox: "-42 -92 84 96",
    figure: "h-[96px] w-[84px]",
    stay: 4600,
    enter: { y: 100 },
    show: { y: 0, transition: { type: "spring", stiffness: 150, damping: 15 } },
    leave: { y: 100, transition: { duration: 0.35, ease: "easeIn" } },
  },
};

/**
 * A surprise appearance of the web-slinger. It happens once per visit, when its
 * spot is properly on screen. Click him while he is there and he flips, and the
 * page says you spotted him.
 *
 * The wrapper ignores the pointer, so only the figure itself can be clicked.
 * Under reduced motion nothing drops, runs or pops: he just sits in his spot.
 */
export function Sighting({ id, kind, className }: { id: string; kind: Kind; className: string }) {
  const reduce = useReducedMotionSafe();
  const spot = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"waiting" | "here" | "gone">("waiting");
  const [found, setFound] = useState<number | null>(null);
  const act = ACTS[kind];
  const here = reduce || phase === "here";

  useEffect(() => {
    const el = spot.current;
    if (!el || reduce || phase !== "waiting") return;
    let timer = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        window.clearTimeout(timer);
        if (entry.isIntersecting) timer = window.setTimeout(() => setPhase("here"), LOOK_DELAY);
      },
      // only the middle of the screen counts, so he is not wasted at an edge
      { rootMargin: "-12% 0px -18% 0px" }
    );
    io.observe(el);
    return () => {
      window.clearTimeout(timer);
      io.disconnect();
    };
  }, [reduce, phase]);

  useEffect(() => {
    if (reduce || phase !== "here") return;
    // once caught, he stays just long enough to finish the flip
    const id = window.setTimeout(() => setPhase("gone"), found ? 1500 : act.stay);
    return () => window.clearTimeout(id);
  }, [reduce, phase, found, act.stay]);

  const [toast, setToast] = useState(false);
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(false), 2800);
    return () => window.clearTimeout(t);
  }, [toast]);

  function spotted() {
    caught.add(id);
    setFound(caught.size);
    setToast(true);
  }

  return (
    <div ref={spot} className={cn("pointer-events-none absolute", className)}>
      <AnimatePresence>
        {here && (
          <motion.div
            key="figure"
            initial={reduce ? false : act.enter}
            animate={reduce ? undefined : act.show}
            exit={act.leave}
            className={cn(
              kind === "hang" && "flex h-full w-full flex-col items-center",
              kind === "run" && "absolute bottom-0",
              kind === "run" && reduce && "left-[62%]"
            )}
          >
            {kind === "hang" && <span aria-hidden className="w-0.5 flex-1 bg-paper/80" />}
            <button
              type="button"
              onClick={spotted}
              aria-label="The web-slinger. You spotted him."
              className="pointer-events-auto block shrink-0"
              data-sighting={id}
            >
              <svg viewBox={act.viewBox} className={cn("block overflow-visible", act.figure)} aria-hidden>
                <WebSlinger pose={act.pose} still />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      {toast &&
        createPortal(
          <p
            role="status"
            className="pointer-events-none fixed inset-x-4 bottom-16 z-[135] mx-auto w-fit border border-gold bg-ink px-4 py-2.5 text-center font-mono text-xs tracking-wide text-gold"
          >
            You spotted him. {found} of {TOTAL} sightings.
          </p>,
          document.body
        )}
    </div>
  );
}
