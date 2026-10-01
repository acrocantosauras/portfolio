"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Chip } from "@/components/ui/Chip";
import { experience } from "@/data/resume";

const uchit = experience.find((e) => e.id === "uchit")!;

type TrackedPerson = {
  id: string;
  // static "frame" positions in % — boxes drift subtly via animation
  x: number;
  y: number;
  w: number;
  h: number;
  delay: number;
};

const PEOPLE: TrackedPerson[] = [
  { id: "07", x: 12, y: 30, w: 14, h: 44, delay: 0 },
  { id: "08", x: 38, y: 22, w: 15, h: 50, delay: 0.4 },
  { id: "09", x: 63, y: 34, w: 13, h: 42, delay: 0.9 },
  { id: "10", x: 82, y: 26, w: 12, h: 46, delay: 1.3 },
];

const PIPELINE = ["VIDEO", "DETECTION", "TRACKING", "COUNTING", "ANALYTICS"];

const PIPELINE_DETAIL: Record<string, string> = {
  VIDEO: "RTSP streams from CCTV feeds",
  DETECTION: "YOLO — person / head detection",
  TRACKING: "object tracking across frames",
  COUNTING: "person & head counting logic",
  ANALYTICS: "real-time occupancy analytics",
};

export function UchitVision() {
  const reduceMotion = useReducedMotion();
  const count = PEOPLE.length;
  const peak = 13;
  const [activePipe, setActivePipe] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const t = setInterval(() => {
      setActivePipe((p) => (p + 1) % PIPELINE.length);
    }, 1600);
    return () => clearInterval(t);
  }, [reduceMotion]);

  return (
    <section id="experience" className="relative overflow-hidden bg-ink-soft py-24 sm:py-32">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading eyebrow="INDUSTRY / Computer Vision" title="UCHIT TECHNOLOGY" />
          <p className="font-mono text-[11px] tracking-[0.3em] text-paper-dim uppercase">
            {uchit.domain} · {uchit.location}
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          {/* ---- simulated feed ---- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="relative border-2 border-hairline bg-black"
            data-sense="true"
          >
            {/* header bar */}
            <div className="flex items-center justify-between border-b border-hairline bg-ink-panel px-4 py-2.5">
              <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] uppercase">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal-red-bright opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal-red-bright" />
                </span>
                <span className="text-paper">CAM.04</span>
                <span className="text-paper-dim">— RTSP // 25 FPS</span>
              </div>
              <span className="font-mono text-[10px] tracking-[0.2em] text-paper-dim uppercase">
                visual representation
              </span>
            </div>

            {/* frame */}
            <div className="relative aspect-[16/9] overflow-hidden">
              {/* dark scene with faint structure */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,#141821_0%,#050507_70%)]" />
              <div
                className="absolute inset-0 opacity-[0.07]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, var(--color-paper) 0, var(--color-paper) 1px, transparent 1px, transparent 44px), repeating-linear-gradient(90deg, var(--color-paper) 0, var(--color-paper) 1px, transparent 1px, transparent 44px)",
                }}
                aria-hidden
              />
              {/* scanlines */}
              <div
                className="pointer-events-none absolute inset-0 opacity-15"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 1px, transparent 1px, transparent 3px)",
                }}
                aria-hidden
              />
              {/* sweep line */}
              {!reduceMotion && (
                <motion.div
                  className="pointer-events-none absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-emerald-400/10 to-transparent"
                  animate={{ top: ["-10%", "110%"] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  aria-hidden
                />
              )}

              {/* tracked boxes */}
              {PEOPLE.map((p) => (
                <motion.div
                  key={p.id}
                  className="absolute border border-emerald-400/90"
                  style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.w}%`, height: `${p.h}%` }}
                  animate={reduceMotion ? undefined : { x: [0, 6, -4, 0], y: [0, -3, 3, 0] }}
                  transition={{ duration: 6 + p.delay, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span className="absolute -top-5 left-0 whitespace-nowrap bg-emerald-400/90 px-1.5 py-0.5 font-mono text-[9px] font-bold tracking-[0.15em] text-black">
                    PERSON ID:{p.id}
                  </span>
                  {/* head indicator */}
                  <span className="absolute top-[8%] left-1/2 h-[18%] w-[26%] -translate-x-1/2 border border-emerald-400/50" aria-hidden />
                </motion.div>
              ))}

              {/* corner ticks */}
              <div className="pointer-events-none absolute inset-3" aria-hidden>
                <span className="absolute top-0 left-0 h-4 w-4 border-t-2 border-l-2 border-emerald-400/60" />
                <span className="absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2 border-emerald-400/60" />
                <span className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-emerald-400/60" />
                <span className="absolute right-0 bottom-0 h-4 w-4 border-r-2 border-b-2 border-emerald-400/60" />
              </div>

              {/* timestamp */}
              <div className="absolute bottom-2 left-3 font-mono text-[9px] tracking-[0.2em] text-emerald-400/80">
                LIVE FEED — ANALYTICS ACTIVE
              </div>
            </div>

            {/* telemetry bar */}
            <div className="grid grid-cols-3 divide-x divide-hairline border-t border-hairline bg-ink-panel">
              {[
                { label: "CURRENT COUNT", value: String(count).padStart(2, "0"), accent: "text-emerald-400" },
                { label: "PEAK COUNT", value: String(peak).padStart(2, "0"), accent: "text-paper" },
                { label: "STREAM", value: "LIVE*", accent: "text-signal-red-bright" },
              ].map((s) => (
                <div key={s.label} className="px-4 py-3 text-center">
                  <p className="font-mono text-[9px] tracking-[0.25em] text-paper-dim uppercase">{s.label}</p>
                  <p className={`mt-1 font-display text-3xl tracking-wide ${s.accent}`}>{s.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ---- description ---- */}
          <div className="flex flex-col justify-center gap-5">
            <div className="border-l-2 border-emerald-400/70 bg-ink-panel/60 py-3 pl-5">
              <p className="font-display text-2xl tracking-wide text-paper">{uchit.role}</p>
              <p className="mt-1 font-mono text-[11px] tracking-[0.2em] text-paper-dim uppercase">
                {uchit.company} · {uchit.period}
              </p>
            </div>
            {uchit.points.map((point, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="border-l-2 border-hairline py-1 pl-5 text-sm leading-relaxed text-paper/90 sm:text-base"
              >
                {point}
              </motion.p>
            ))}
            <div className="mt-2 flex flex-wrap gap-2">
              {["YOLO", "OpenCV", "Object Tracking", "RTSP", "Person Counting", "Edge AI"].map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </div>
          </div>
        </div>

        {/* ---- pipeline ---- */}
        <div className="mt-14 border border-hairline bg-ink-panel/40 p-5 sm:p-8">
          <div className="mb-6 flex items-center justify-between font-mono text-[10px] tracking-[0.3em] text-paper-dim uppercase">
            <span>cv.pipeline</span>
            <span className="hidden sm:inline">stage {String(activePipe + 1).padStart(2, "0")}/05</span>
          </div>
          <ol className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-0">
            {PIPELINE.map((stage, i) => {
              const active = i === activePipe || reduceMotion;
              return (
                <li key={stage} className="flex flex-col gap-1 sm:flex-1 sm:flex-row sm:items-center">
                  <div
                    className={`border px-4 py-3 text-center font-mono text-[11px] font-bold tracking-[0.2em] transition-colors duration-300 sm:flex-1 ${
                      active
                        ? "border-emerald-400 bg-emerald-400/10 text-emerald-400"
                        : "border-hairline text-paper-dim"
                    }`}
                  >
                    {stage}
                  </div>
                  {i < PIPELINE.length - 1 && (
                    <span className={`mx-2 hidden h-px w-6 sm:block ${i < activePipe ? "bg-emerald-400" : "bg-hairline"}`} aria-hidden />
                  )}
                </li>
              );
            })}
          </ol>
          <p className="mt-4 font-mono text-[11px] text-paper-dim">
            <span className="text-emerald-400">›</span> {PIPELINE_DETAIL[PIPELINE[activePipe]]}
          </p>
          <p className="mt-1 font-mono text-[10px] text-paper-dim/60">
            * simulated telemetry — representative of the type of pipeline worked on, not a live feed.
          </p>
        </div>
      </div>
    </section>
  );
}
