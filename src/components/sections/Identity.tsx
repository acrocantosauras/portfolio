"use client";

import { motion } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ComicPanel } from "@/components/ui/ComicPanel";
import { WebDivider } from "@/components/ui/WebDivider";
import { profile } from "@/data/resume";

const STATS = [
  { label: "Base of Operations", value: profile.location },
  { label: "Focus", value: "AI Systems / Backend" },
  { label: "Certification", value: "Azure AI-900" },
  { label: "Grad Year", value: "2025 (B.E., E&TC)" },
];

const CAPTIONS = [
  "Graduated 2025 with a B.E. in Electronics & Telecommunication — then went straight into building full-stack and backend systems in Python, not because a class required it, but because the problems were interesting.",
  "The pattern that keeps showing up: RAG pipelines, LLM evaluation, quality gates. Systems that don't just generate answers — systems that can prove the answers are good.",
  "Comfortable across the whole stack: APIs, databases, testing, deployment. Built on a foundation of data structures, algorithms, and OOP that doesn't wobble under pressure.",
];

export function Identity() {
  return (
    <section id="identity" className="relative bg-ink py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow="File 002 / Identity" title="ORIGIN FILE" />

        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <ComicPanel className="relative aspect-[4/5] overflow-hidden">
              <Silhouette />
              <div className="absolute inset-x-0 bottom-0 border-t-2 border-paper bg-ink/85 p-4">
                <p className="font-mono text-[10px] tracking-[0.25em] text-paper-dim uppercase">
                  Subject
                </p>
                <p className="font-display text-2xl tracking-wide text-paper">
                  {profile.name}
                </p>
              </div>
            </ComicPanel>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {STATS.map((s) => (
                <div key={s.label} className="border border-hairline p-3">
                  <p className="font-mono text-[9px] tracking-[0.2em] text-paper-dim uppercase">
                    {s.label}
                  </p>
                  <p className="mt-1 text-sm text-paper">{s.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="flex flex-col justify-center gap-5">
            {CAPTIONS.map((text, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="border-l-2 border-signal-red/70 bg-ink-panel/60 py-3 pl-5 text-base leading-relaxed text-paper/95 sm:text-lg"
              >
                {text}
              </motion.p>
            ))}
          </div>
        </div>
        <WebDivider className="mt-16" />
      </div>
    </section>
  );
}

function Silhouette() {
  return (
    <svg
      viewBox="0 0 400 500"
      className="h-full w-full"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden
    >
      <defs>
        <radialGradient id="spot" cx="50%" cy="20%" r="65%">
          <stop offset="0%" stopColor="#1c2140" />
          <stop offset="100%" stopColor="#08080a" />
        </radialGradient>
        <linearGradient id="rimRed" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-signal-red)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--color-signal-red)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="rimBlue" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stopColor="var(--color-web-blue)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--color-web-blue)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="400" height="500" fill="url(#spot)" />
      <path
        d="M200 120 c34 0 56 26 56 60 c0 22 -10 38 -22 48 c34 12 60 40 66 84 l14 130 h-228 l14 -130 c6 -44 32 -72 66 -84 c-12 -10 -22 -26 -22 -48 c0 -34 22 -60 56 -60 z"
        fill="#0c0c10"
        stroke="#1c1d24"
        strokeWidth="1.5"
      />
      <rect x="60" width="70" height="500" fill="url(#rimRed)" />
      <rect x="270" width="70" height="500" fill="url(#rimBlue)" />
      <g stroke="var(--color-hairline)" strokeWidth="1" opacity="0.5">
        <path d="M0 60 L400 60" />
        <path d="M0 60 L120 220" />
        <path d="M400 60 L280 220" />
      </g>
    </svg>
  );
}
