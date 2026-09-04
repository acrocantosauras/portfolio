"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowDown, Download } from "lucide-react";
import { RainCanvas } from "@/components/layout/RainCanvas";
import { profile } from "@/data/resume";
import { useRecruiterMode } from "@/components/layout/RecruiterModeContext";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const skylineY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
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
        <div className="absolute top-0 left-[8%] h-[520px] w-[520px] -translate-y-1/3 animate-pulse-slow rounded-full bg-signal-red/20 blur-[120px]" />
        <div className="absolute top-0 right-[6%] h-[560px] w-[560px] -translate-y-1/4 animate-pulse-slow rounded-full bg-web-blue/25 blur-[130px] [animation-delay:1.5s]" />
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
        <div className="mb-6 flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] text-paper-dim uppercase">
          <span className="border border-hairline px-2 py-1">Issue №01</span>
          <span>{profile.location}</span>
          <span className="h-1 w-1 rounded-full bg-signal-red-bright" />
          <span>Status: Building</span>
        </div>

        <h1 className="font-display text-[16vw] leading-[0.82] tracking-wide text-paper sm:text-[10vw] md:text-[8rem] lg:text-[9.5rem]">
          MEET
          <br />
          <span className="text-signal-red-bright">JADHAV</span>
        </h1>

        <div className="mt-6 flex flex-col gap-4 sm:mt-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-sm tracking-[0.25em] text-web-blue-bright uppercase sm:text-base">
              {profile.role}
            </p>
            <p className="mt-2 max-w-md text-sm text-paper-dim sm:text-base">
              {profile.tagline}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="#missions"
              data-sense="true"
              className="border-2 border-paper bg-paper px-5 py-3 font-mono text-xs font-semibold tracking-[0.2em] text-ink uppercase transition-colors hover:bg-signal-red-bright hover:border-signal-red-bright hover:text-paper"
            >
              View Missions
            </a>
            <button
              type="button"
              onClick={toggle}
              data-sense="true"
              className="flex items-center gap-2 border-2 border-hairline px-5 py-3 font-mono text-xs tracking-[0.2em] text-paper uppercase transition-colors hover:border-web-blue-bright hover:text-web-blue-bright"
            >
              Recruiter Mode
            </button>
            <a
              href={profile.resumeUrl}
              download
              data-sense="true"
              className="flex items-center gap-2 border-2 border-hairline px-5 py-3 font-mono text-xs tracking-[0.2em] text-paper uppercase transition-colors hover:border-signal-red-bright hover:text-signal-red-bright"
            >
              <Download size={14} /> Resume
            </a>
          </div>
        </div>
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
