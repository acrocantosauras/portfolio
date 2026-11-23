"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ChapterMark } from "@/components/ui/ChapterMark";
import { Chip } from "@/components/ui/Chip";
import { WebCorner } from "@/components/ui/WebCorner";
import { projects, type Project } from "@/data/resume";
import { ProjectDossier } from "./ProjectDossier";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

const STATUS_LABEL: Record<Project["status"], string> = {
  flagship: "Flagship",
  active: "Active",
  archived: "Archived",
};

/**
 * Each project is presented as its own comic panel: a different colour world,
 * size, crop and edge, so the four read as four pieces of work and not one
 * repeated card. The oversized figures are real numbers from the resume.
 */
const PANEL: Record<
  string,
  { wrap: string; surface: string; ink: string; edge: string; tilt?: string }
> = {
  aegisforge: {
    wrap: "lg:col-span-8",
    surface: "bg-[linear-gradient(140deg,#2a0d12_0%,#10152a_62%,#0a0f1e_100%)]",
    ink: "text-paper",
    edge: "panel-a",
  },
  "llm-evaluation-platform": {
    wrap: "lg:col-span-4 lg:mt-12",
    surface: "bg-[#0e2a63]",
    ink: "text-paper",
    edge: "panel-b",
    tilt: "lg:rotate-[0.7deg]",
  },
  "ai-knowledge-assistant": {
    wrap: "lg:col-span-5",
    surface: "bg-paper",
    ink: "text-dawn-ink",
    edge: "panel-c",
    tilt: "lg:-rotate-[0.8deg]",
  },
  jarvis: {
    wrap: "lg:col-span-7 lg:mt-14",
    surface:
      "bg-[repeating-linear-gradient(135deg,#0f1424_0_16px,#0b0f1c_16px_32px)]",
    ink: "text-paper",
    edge: "panel-a",
  },
};

export function Missions() {
  const [active, setActive] = useState<Project | null>(null);
  // hovering a panel shows its architecture beside the cursor (mouse only)
  const [peek, setPeek] = useState<Project | null>(null);
  const cx = useMotionValue(0);
  const cy = useMotionValue(0);
  const px = useSpring(cx, { stiffness: 260, damping: 28 });
  const py = useSpring(cy, { stiffness: 260, damping: 28 });
  // snap to the cursor when the card first appears; only the follow is sprung
  const fresh = useRef(true);

  function track(e: React.PointerEvent) {
    if (e.pointerType !== "mouse") return;
    const w = 300;
    const nx = Math.min(e.clientX + 28, window.innerWidth - w - 16);
    const ny = Math.min(e.clientY + 20, window.innerHeight - 190);
    cx.set(nx);
    cy.set(ny);
    if (fresh.current) {
      px.jump(nx);
      py.jump(ny);
      fresh.current = false;
    }
  }

  return (
    <section id="missions" className="surface-night relative overflow-hidden py-28 sm:py-40">
      <ChapterMark n="03" className="-bottom-[0.18em] -left-[0.06em] text-signal-red-bright/[0.1]" />
      <WebCorner
        anchor="br"
        className="absolute -right-4 -bottom-4 h-[40vmin] w-[40vmin] text-signal-red-bright/[0.12]"
        strokeWidth={1}
      />
      <div className="relative mx-auto max-w-7xl px-6 sm:px-12">
        <SectionHeading title="ALL PROJECTS" />
        <p className="mt-5 max-w-lg text-base text-paper-dim">
          Click a project to see how it&rsquo;s put together and how I tested it.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6" onPointerMove={track}>
          {projects.map((p, i) => {
            const s = PANEL[p.slug] ?? PANEL.jarvis;
            const light = p.slug === "ai-knowledge-assistant";
            return (
              <motion.div
                key={p.slug}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: (i % 2) * 0.08, ease: EASE }}
                className={cn(s.wrap, s.tilt)}
              >
                <button
                  type="button"
                  onClick={() => {
                    setPeek(null);
                    setActive(p);
                  }}
                  onPointerEnter={(e) => e.pointerType === "mouse" && setPeek(p)}
                  onPointerLeave={() => {
                    setPeek(null);
                    fresh.current = true;
                  }}
                  className={cn(
                    "group relative block h-full min-h-[22rem] w-full overflow-hidden px-7 pt-9 pb-14 text-left transition-[filter,transform] duration-300 hover:-translate-y-1 hover:brightness-110 sm:px-10 sm:pt-11",
                    p.status === "flagship" && "lg:min-h-[28rem]",
                    s.surface,
                    s.ink,
                    s.edge
                  )}
                >
                  {/* per-project crop: a real number, an outlined mark, or a print screen */}
                  {p.slug === "aegisforge" && (
                    <>
                      <span
                        aria-hidden
                        className="halftone halftone-fade-l pointer-events-none absolute -top-4 -right-4 h-64 w-72 text-signal-red-bright/45"
                      />
                      <span
                        aria-hidden
                        className="stroke-text pointer-events-none absolute -right-6 -bottom-16 font-display text-[16rem] leading-none text-paper/[0.07]"
                      >
                        773
                      </span>
                    </>
                  )}
                  {p.slug === "llm-evaluation-platform" && (
                    <span
                      aria-hidden
                      className="stroke-text pointer-events-none absolute -right-4 -bottom-10 font-display text-[15rem] leading-none text-paper/[0.22]"
                    >
                      215
                    </span>
                  )}
                  {light && (
                    <span
                      aria-hidden
                      className="halftone halftone-fade-b pointer-events-none absolute inset-x-0 top-0 h-40 text-dawn-ink/25"
                    />
                  )}

                  <div className="relative">
                    <h3
                      className={cn(
                        "font-display leading-[0.92] tracking-wide",
                        p.status === "flagship" ? "masthead text-6xl sm:text-8xl" : "text-4xl sm:text-6xl",
                        p.slug === "jarvis" && "text-paper/75"
                      )}
                    >
                      {p.title}
                    </h3>
                    <p className={cn("mt-3 text-sm", light ? "text-dawn-ink/70" : "text-paper-dim")}>
                      {p.period} · {STATUS_LABEL[p.status]}
                    </p>
                    <p
                      className={cn(
                        "mt-5 max-w-md text-base leading-relaxed",
                        light ? "text-dawn-ink/90" : "text-paper/90"
                      )}
                    >
                      {p.oneLiner}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {p.stack.slice(0, p.status === "flagship" ? 7 : 5).map((t) => (
                        <Chip
                          key={t}
                          className={light ? "border-dawn-ink/30 text-dawn-ink/80" : undefined}
                        >
                          {t}
                        </Chip>
                      ))}
                    </div>
                  </div>

                  <span
                    className={cn(
                      // the diagonal edge slopes away on the right of panel-a, so its link sits on the left
                      "absolute bottom-6 inline-flex items-center gap-1.5 text-sm transition-colors",
                      s.edge === "panel-a" ? "left-7 sm:left-10" : "right-7 sm:right-10",
                      light ? "text-dawn-ink group-hover:text-signal-red-deep" : "text-paper group-hover:text-signal-red-bright"
                    )}
                  >
                    Open
                    <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>

                  {p.slug === "jarvis" && (
                    <span
                      aria-hidden
                      className="absolute top-5 -right-10 rotate-[8deg] bg-gold px-12 py-1 font-display text-lg tracking-[0.2em] text-ink"
                    >
                      ARCHIVED
                    </span>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* the peek: how it flows, shown beside the cursor */}
      <AnimatePresence>
        {peek && (
          <motion.div
            key={peek.slug}
            style={{ x: px, y: py }}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.16, ease: EASE }}
            className="pointer-events-none fixed top-0 left-0 z-[60] w-[300px] border border-hairline bg-ink-panel p-4 text-paper shadow-[0_18px_40px_-18px_rgba(0,0,0,0.8)]"
            aria-hidden
          >
            <p className="text-xs text-paper-dim">How it flows</p>
            <ol className="mt-2 flex flex-col gap-1">
              {peek.architecture.nodes.slice(0, 5).map((n, i) => (
                <li key={n.id} className="flex items-center gap-2 text-[13px]">
                  <span className="font-mono text-[10px] text-signal-red-bright">{i + 1}</span>
                  <span>{n.label}</span>
                  {i < 4 && <ArrowRight size={11} className="ml-auto text-paper-dim" />}
                </li>
              ))}
            </ol>
            <p className="mt-3 text-xs text-paper-dim">Click for the full breakdown</p>
          </motion.div>
        )}
      </AnimatePresence>

      <ProjectDossier project={active} onClose={() => setActive(null)} />
    </section>
  );
}
