"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";
import { ArrowDown, Download, FileText, Code2, Mail } from "lucide-react";
import { RainCanvas } from "@/components/layout/RainCanvas";
import { profile } from "@/data/resume";
import { useRecruiterMode } from "@/components/layout/RecruiterModeContext";

const BOOT_LINES = [
  "MJSYS v2.6 — initializing",
  "loading kernel: reasoning.core",
  "mounting /knowledge /agents /tools",
  "telemetry: ONLINE",
  "identity verified",
];

/** Boot sequence overlay — ~1.4s total, skippable, reduced-motion aware. */
function BootSequence({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onDone();
      return;
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    BOOT_LINES.forEach((_, i) => {
      timers.push(setTimeout(() => setStep(i + 1), 120 + i * 180));
    });
    timers.push(setTimeout(() => setExiting(true), 120 + BOOT_LINES.length * 180 + 250));
    timers.push(setTimeout(onDone, 120 + BOOT_LINES.length * 180 + 550));
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink"
      initial={{ opacity: 1 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      aria-hidden
    >
      <div className="font-mono text-[11px] leading-6 tracking-[0.15em] text-web-blue-bright/80 sm:text-xs">
        {BOOT_LINES.slice(0, step).map((line, i) => (
          <motion.p key={line} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.1 }}>
            <span className="text-signal-red-bright">{"> "}</span>
            {line}
            {i === step - 1 && <span className="ml-1 animate-pulse">▊</span>}
          </motion.p>
        ))}
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="h-px w-40 overflow-hidden bg-hairline">
          <motion.div
            className="h-full bg-signal-red-bright"
            initial={{ width: "0%" }}
            animate={{ width: exiting || step >= BOOT_LINES.length ? "100%" : `${(step / BOOT_LINES.length) * 100}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </div>
    </motion.div>
  );
}

const TITLE_LINES = ["MEET", "JADHAV"];

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const [booted, setBooted] = useState(false);
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
  const titleX = useTransform(sx, [-0.5, 0.5], [12, -12]);
  const titleY = useTransform(sy, [-0.5, 0.5], [8, -8]);

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
      {!booted && <BootSequence onDone={() => setBooted(true)} />}

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

      <motion.div style={{ y: skylineY }} className="absolute inset-x-0 bottom-0" aria-hidden>
        <Skyline />
      </motion.div>

      <RainCanvas />
      <div className="halftone pointer-events-none absolute inset-0 opacity-[0.05]" aria-hidden />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8 sm:pb-28"
      >
        <motion.div
          initial={false}
          animate={booted ? "show" : "hidden"}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } } }}
          className="mb-6 flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] text-paper-dim uppercase"
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
        </motion.div>

        <motion.h1
          style={{ x: titleX, y: titleY }}
          className="font-display text-[19vw] leading-[0.82] tracking-wide text-paper sm:text-[13vw] md:text-[10rem] lg:text-[12rem]"
          aria-label="Meet Jadhav"
        >
          {TITLE_LINES.map((line, li) => (
            <span key={line} className="block overflow-hidden" aria-hidden>
              <motion.span
                className={li === 1 ? "block text-signal-red-bright" : "block"}
                initial={{ y: "110%" }}
                animate={booted ? { y: "0%" } : { y: "110%" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 + li * 0.14 }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        <motion.div
          initial={false}
          animate={booted ? "show" : "hidden"}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          className="mt-6 flex flex-col gap-4 sm:mt-8 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <motion.p
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
              className="font-mono text-sm tracking-[0.25em] text-web-blue-bright uppercase sm:text-base"
            >
              {profile.role}
            </motion.p>
            <motion.p
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
              className="mt-2 max-w-md text-sm text-paper-dim sm:text-base"
            >
              {profile.tagline}
            </motion.p>
          </div>

          <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }} className="flex flex-wrap gap-3">
            <a
              href="#work"
              data-sense="true"
              className="border-2 border-paper bg-paper px-5 py-3 font-mono text-xs font-semibold tracking-[0.2em] text-ink uppercase transition-colors hover:bg-signal-red-bright hover:border-signal-red-bright hover:text-paper"
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

function Skyline() {
  return (
    <svg
      viewBox="0 0 1440 260"
      preserveAspectRatio="none"
      className="h-[34vh] w-full text-ink-soft sm:h-[38vh]"
      aria-hidden
    >
      <rect x="0" y="120" width="60" height="140" fill="currentColor" />
      <rect x="70" y="60" width="40" height="200" fill="currentColor" />
      <rect x="120" y="150" width="80" height="110" fill="currentColor" />
      <rect x="215" y="90" width="50" height="170" fill="currentColor" />
      <rect x="280" y="20" width="46" height="240" fill="currentColor" />
      <rect x="335" y="130" width="70" height="130" fill="currentColor" />
      <rect x="420" y="70" width="55" height="190" fill="currentColor" />
      <rect x="490" y="160" width="90" height="100" fill="currentColor" />
      <rect x="595" y="40" width="42" height="220" fill="currentColor" />
      <rect x="650" y="100" width="65" height="160" fill="currentColor" />
      <rect x="730" y="0" width="50" height="260" fill="currentColor" />
      <rect x="795" y="140" width="75" height="120" fill="currentColor" />
      <rect x="880" y="70" width="48" height="190" fill="currentColor" />
      <rect x="940" y="160" width="90" height="100" fill="currentColor" />
      <rect x="1045" y="30" width="46" height="230" fill="currentColor" />
      <rect x="1100" y="110" width="60" height="150" fill="currentColor" />
      <rect x="1175" y="150" width="80" height="110" fill="currentColor" />
      <rect x="1265" y="60" width="45" height="200" fill="currentColor" />
      <rect x="1320" y="130" width="120" height="130" fill="currentColor" />
      <g fill="var(--color-amber)" opacity="0.55">
        <rect x="85" y="80" width="4" height="4" />
        <rect x="230" y="120" width="4" height="4" />
        <rect x="295" y="60" width="4" height="4" />
        <rect x="440" y="110" width="4" height="4" />
        <rect x="610" y="90" width="4" height="4" />
        <rect x="745" y="40" width="4" height="4" />
        <rect x="900" y="110" width="4" height="4" />
        <rect x="1060" y="70" width="4" height="4" />
        <rect x="1190" y="190" width="4" height="4" />
        <rect x="1345" y="170" width="4" height="4" />
      </g>
    </svg>
  );
}
