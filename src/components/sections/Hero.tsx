"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useReducedMotionSafe } from "@/lib/reduced-motion";
import { ArrowDown, Download, RotateCcw } from "lucide-react";
import { RainCanvas } from "@/components/layout/RainCanvas";
import { Skyline } from "@/components/ui/Skyline";
import { WebField } from "@/components/ui/WebField";
import { Magnetic } from "@/components/ui/Magnetic";
import { useIntro } from "@/components/intro/IntroSequence";
import { profile } from "@/data/resume";
import { useRecruiterMode } from "@/components/layout/RecruiterModeContext";

const LINES = ["MEET", "JADHAV"] as const;
const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Hero — the title card, and the first thing you can play with.
 *
 * - The web in the corner is tugged toward your cursor and springs back; click
 *   anywhere and an organic strand fires from the nearest lower corner and sticks.
 * - The name tilts in 3D toward the pointer, and each letter lifts when touched.
 * - The skyline drifts against the pointer for depth, and scrolls away slower
 *   than the page.
 * - The two main buttons are magnetic.
 *
 * All of it is pointer-driven, so touch screens get the still composition, and
 * reduced motion gets no tilt, no web physics and no magnets.
 */
export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { done, replay } = useIntro();
  const reduceMotion = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const skylineY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const { toggle } = useRecruiterMode();

  // pointer position across the hero, -0.5 .. 0.5
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 90, damping: 20 });
  const sy = useSpring(py, { stiffness: 90, damping: 20 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-5, 5]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [3.5, -3.5]);
  const skylineX = useTransform(sx, [-0.5, 0.5], [14, -14]);

  const show = done || reduceMotion;

  return (
    <section
      id="top"
      data-sense="These webs are drawn on a canvas with simple spring physics. No WebGL, and it pauses off screen."
      ref={ref}
      onPointerMove={(e) => {
        if (reduceMotion || e.pointerType === "touch") return;
        const r = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width - 0.5);
        py.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
      className="relative flex h-[100svh] min-h-[680px] w-full items-end overflow-hidden bg-ink"
    >
      {/* the night, lit from the edges: blue from above-right, red from below-left */}
      <div
        className="absolute inset-0 bg-[radial-gradient(70%_55%_at_88%_-5%,rgba(29,95,209,0.34),transparent_70%),radial-gradient(60%_50%_at_-5%_105%,rgba(224,52,43,0.26),transparent_70%),linear-gradient(to_bottom,#0b1222_0%,#05070f_55%,#04060d_100%)]"
        aria-hidden
      />

      <WebField targetRef={ref} />

      {/* the city: flat rooftops, a few lit windows, drifting against the pointer */}
      <motion.div
        style={{ y: skylineY, x: skylineX }}
        className="absolute inset-x-[-20px] bottom-3 sm:bottom-4"
        aria-hidden
      >
        <Skyline className="h-[30vh] w-full text-[#0a1020] sm:h-[34vh]" />
      </motion.div>

      <RainCanvas density={80} />

      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 sm:px-12 sm:pb-24"
      >
        <motion.h1
          style={{
            rotateX,
            rotateY,
            transformPerspective: 1100,
            transformOrigin: "left bottom",
          }}
          className="font-display leading-[0.84]"
          aria-label="Meet Jadhav"
        >
          {LINES.map((line, w) => {
            const offset = LINES.slice(0, w).reduce((n, x) => n + x.length, 0);
            return (
              <span
                key={line}
                // .masthead lives here, on the element that owns the font-size: its
                // depth block and outline are in em, so they scale with this size
                className="masthead block whitespace-nowrap [font-size:min(27vw,26vh,14rem)]"
                aria-hidden
              >
                {line.split("").map((ch, j) => (
                  // the wrapper lifts on hover; the clip lives on this same element's
                  // child, so the letter itself is never cut off while it moves
                  <motion.span
                    key={j}
                    className="inline-block"
                    whileHover={
                      reduceMotion
                        ? undefined
                        : { y: "-7%", rotate: -2.5, transition: { type: "spring", stiffness: 420, damping: 14 } }
                    }
                  >
                    <span className="inline-block overflow-hidden pt-[0.04em] pr-[0.1em] pb-[0.12em] -mr-[0.06em]">
                      <motion.span
                        className="block"
                        initial={{ y: "112%" }}
                        animate={show ? { y: "0%" } : { y: "112%" }}
                        transition={{
                          duration: reduceMotion ? 0 : 0.9,
                          ease: EASE,
                          delay: reduceMotion ? 0 : 0.05 + (offset + j) * 0.055,
                        }}
                      >
                        {ch}
                      </motion.span>
                    </span>
                  </motion.span>
                ))}
              </span>
            );
          })}
        </motion.h1>

        <motion.div
          initial={false}
          animate={show ? "show" : "hidden"}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: reduceMotion ? 0 : 0.1,
                delayChildren: reduceMotion ? 0 : 0.9,
              },
            },
          }}
          className="mt-6 flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-xl">
            <motion.p
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
              className="gold-subtitle text-[clamp(1.25rem,3.4vw,1.9rem)] leading-none"
            >
              {profile.role}
            </motion.p>
            <motion.p
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
              className="mt-4 max-w-md font-serif text-[1.65rem] leading-snug text-paper italic sm:text-3xl"
            >
              {profile.tagline}
            </motion.p>
            <motion.p
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
              className="mt-4 flex items-center gap-2.5 text-sm text-paper-dim"
            >
              <span className="h-2 w-2 shrink-0 rounded-full bg-amber" aria-hidden />
              {profile.location} · {profile.seeking}
            </motion.p>
          </div>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            className="flex flex-col items-start gap-4 md:items-end"
          >
            <div className="flex flex-wrap gap-3">
              <Magnetic>
                <a
                  href="#aegisforge"
                  className="suit-weave inline-flex items-center gap-2 border-2 border-ink px-6 py-3 text-sm font-semibold text-white [text-shadow:0_1px_0_rgba(0,0,0,0.6)] transition-[filter] hover:brightness-110"
                >
                  View work <ArrowDown size={15} />
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href={profile.resumeUrl}
                  download
                  className="inline-flex items-center gap-2 border-2 border-paper/70 px-6 py-3 text-sm text-paper transition-colors hover:border-gold hover:text-gold"
                >
                  <Download size={15} /> Resume
                </a>
              </Magnetic>
            </div>
            <p className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-paper-dim">
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="underline decoration-hairline transition-colors hover:text-signal-red-bright hover:decoration-signal-red-bright"
              >
                GitHub
              </a>
              <a
                href={`mailto:${profile.email}`}
                className="underline decoration-hairline transition-colors hover:text-signal-red-bright hover:decoration-signal-red-bright"
              >
                Email
              </a>
              <button
                type="button"
                onClick={toggle}
                className="underline decoration-hairline transition-colors hover:text-signal-red-bright hover:decoration-signal-red-bright"
              >
                Recruiter view
              </button>
              <button
                type="button"
                onClick={replay}
                aria-label="Replay the opening title sequence"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-paper"
              >
                <RotateCcw size={12} /> Replay intro
              </button>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* a seam of the suit: red cloth, raised black web lines */}
      <div className="suit-weave absolute inset-x-0 bottom-0 h-3 sm:h-4" aria-hidden />
    </section>
  );
}
