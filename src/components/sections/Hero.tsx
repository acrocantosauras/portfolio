"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";
import { ArrowDown, Download, FileText, Code2, Mail, RotateCcw } from "lucide-react";
import { RainCanvas } from "@/components/layout/RainCanvas";
import { Skyline } from "@/components/ui/Skyline";
import { SpiderEmblem } from "@/components/intro/SpiderEmblem";
import { useIntro } from "@/components/intro/IntroSequence";
import { profile } from "@/data/resume";
import { useRecruiterMode } from "@/components/layout/RecruiterModeContext";

const TITLE = "MEET JADHAV";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { done, replay } = useIntro();
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const skylineY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // cursor-reactive parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const glowX = useTransform(sx, [-0.5, 0.5], [-30, 30]);
  const glowY = useTransform(sy, [-0.5, 0.5], [-20, 20]);

  useEffect(() => {
    if (reduceMotion) return;
    function onMove(e: PointerEvent) {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my, reduceMotion]);

  const { toggle } = useRecruiterMode();

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex h-[100svh] min-h-[640px] w-full items-end overflow-hidden bg-ink"
    >
      {/* atmosphere */}
      <div className="absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,#151622_0%,#08080a_60%)]" />
        <motion.div
          style={{ x: glowX, y: glowY }}
          className="absolute top-0 left-[8%] h-[520px] w-[520px] -translate-y-1/3 animate-pulse-slow rounded-full bg-signal-red/20 blur-[120px]"
        />
        <motion.div
          style={{ x: glowX, y: glowY }}
          className="absolute top-0 right-[6%] h-[560px] w-[560px] -translate-y-1/4 animate-pulse-slow rounded-full bg-web-blue/25 blur-[130px] [animation-delay:1.5s]"
        />
        {/* technical grid */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, var(--color-paper) 0, var(--color-paper) 1px, transparent 1px, transparent 80px), repeating-linear-gradient(0deg, var(--color-paper) 0, var(--color-paper) 1px, transparent 1px, transparent 80px)",
          }}
        />
      </div>

      {/* faint emblem echo — the emblem never fully leaves the room */}
      <motion.div
        style={{ x: glowX, y: glowY }}
        className="absolute top-[6%] right-[4%] hidden text-paper/[0.05] md:block"
        aria-hidden
      >
        <SpiderEmblem className="h-[42vh] w-[42vh]" />
      </motion.div>

      <motion.div style={{ y: skylineY }} className="absolute inset-x-0 bottom-0" aria-hidden>
        <Skyline className="h-[34vh] w-full text-ink-soft sm:h-[38vh]" />
      </motion.div>

      <RainCanvas />
      <div className="halftone pointer-events-none absolute inset-0 opacity-[0.05]" aria-hidden />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8 sm:pb-28"
      >
        <motion.div
          initial={false}
          animate={done || reduceMotion ? "show" : "hidden"}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: reduceMotion ? 0 : 0.12,
                delayChildren: reduceMotion ? 0 : 0.05,
              },
            },
          }}
          className="ns-fix mb-6 flex flex-wrap items-center gap-3 font-mono text-[11px] tracking-[0.3em] text-paper-dim uppercase"
        >
          <motion.span
            variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
            className="border border-hairline px-2 py-1"
          >
            SYS.001
          </motion.span>
          <motion.span variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}>
            {profile.location}
          </motion.span>
          <motion.span variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }} className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            Systems Online
          </motion.span>
          <motion.button
            type="button"
            variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
            onClick={replay}
            data-sense="true"
            className="flex items-center gap-1.5 border border-hairline px-2 py-1 transition-colors hover:border-signal-red-bright/70 hover:text-signal-red-bright"
            aria-label="Replay the opening title sequence"
          >
            <RotateCcw size={11} /> Replay intro
          </motion.button>
        </motion.div>

        <h1
          className="ns-fix font-display text-[19vw] leading-[0.86] tracking-wide sm:text-[13vw] md:text-[10rem] lg:text-[12rem]"
          aria-label="Meet Jadhav"
        >
          <span className="masthead block">
            <span className="sr-only">{"MEET JADHAV"}</span>
            {TITLE.split("").map((ch, i) => (
              <span
                key={i}
                className="inline-block overflow-hidden pr-[0.05em] pb-[0.16em]"
                aria-hidden
              >
                <motion.span
                  className="block"
                  initial={{ y: "115%" }}
                  animate={done || reduceMotion ? { y: "0%" } : { y: "115%" }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.8,
                    ease: [0.16, 1, 0.3, 1],
                    delay: reduceMotion ? 0 : 0.1 + i * 0.05,
                  }}
                >
                  {ch === " " ? "\u00A0" : ch}
                </motion.span>
              </span>
            ))}
          </span>
        </h1>

        <motion.div
          initial={false}
          animate={done || reduceMotion ? "show" : "hidden"}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: reduceMotion ? 0 : 0.1,
              },
            },
          }}
          className="ns-fix mt-6 flex flex-col gap-4 sm:mt-8 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <motion.p
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
              className="gold-subtitle inline-block -skew-x-12 font-mono text-sm tracking-[0.3em] uppercase sm:text-base"
            >
              {profile.role}
            </motion.p>
            <motion.p
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
              className="mt-3 max-w-md text-sm text-paper-dim sm:text-base"
            >
              {profile.tagline}
            </motion.p>
          </div>

          <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }} className="flex flex-wrap gap-3">
            <a
              href="#aegisforge"
              data-sense="true"
              className="border-2 border-paper bg-paper px-5 py-3 font-mono text-xs font-semibold tracking-[0.2em] text-ink uppercase transition-colors hover:border-signal-red-bright hover:bg-signal-red-bright hover:text-paper"
            >
              View Work
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              data-sense="true"
              aria-label="GitHub profile"
              className="flex items-center gap-2 border-2 border-hairline px-4 py-3 font-mono text-xs tracking-[0.2em] text-paper uppercase transition-colors hover:border-web-blue-bright hover:text-web-blue-bright"
            >
              <Code2 size={14} /> GitHub
            </a>
            <a
              href={profile.resumeUrl}
              download
              data-sense="true"
              className="flex items-center gap-2 border-2 border-hairline px-4 py-3 font-mono text-xs tracking-[0.2em] text-paper uppercase transition-colors hover:border-signal-red-bright hover:text-signal-red-bright"
            >
              <Download size={14} /> Resume
            </a>
            <a
              href={`mailto:${profile.email}`}
              data-sense="true"
              aria-label="Email Meet Jadhav"
              className="flex items-center gap-2 border-2 border-hairline px-4 py-3 font-mono text-xs tracking-[0.2em] text-paper uppercase transition-colors hover:border-signal-red-bright hover:text-signal-red-bright"
            >
              <Mail size={14} /> Contact
            </a>
            <button
              type="button"
              onClick={toggle}
              data-sense="true"
              className="flex items-center gap-2 border-2 border-signal-red/70 bg-signal-red/10 px-4 py-3 font-mono text-xs tracking-[0.2em] text-signal-red-bright uppercase transition-colors hover:bg-signal-red/25"
            >
              <FileText size={14} /> Recruiter
            </button>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-paper-dim"
        aria-hidden
      >
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <ArrowDown size={14} />
      </motion.div>
    </section>
  );
}
