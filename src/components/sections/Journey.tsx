"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Sighting } from "@/components/ui/Sighting";
import { ChapterMark } from "@/components/ui/ChapterMark";
import { certifications, education, experience } from "@/data/resume";
import { cn } from "@/lib/utils";

const uchit = experience.find((e) => e.id === "uchit")!;
const degree = education.find((e) => e.id === "edu-degree")!;
const EASE = [0.16, 1, 0.3, 1] as const;

type Entry = {
  id: string;
  period: string;
  title: string;
  org: string;
  detail?: string;
};

// Newest first. Every line traces back to the resume.
const ENTRIES: Entry[] = [
  {
    id: "uchit",
    period: uchit.period,
    title: uchit.role,
    org: `${uchit.company} · ${uchit.location}`,
    detail: uchit.points[0],
  },
  {
    id: "independent",
    period: "2025 – Present",
    title: "Independent project work",
    org: "Self-directed",
    detail:
      "AegisForge, the LLM Evaluation Platform and the AI Knowledge Assistant: each built with automated tests, CI and Docker setups.",
  },
  ...certifications.map((c, i) => ({
    id: `cert-${i}`,
    period: c.org.split(", ").pop() ?? "",
    title: c.title,
    org: c.org.split(", ")[0],
  })),
  {
    id: "degree",
    period: degree.period,
    title: degree.title,
    org: `${degree.org} · ${degree.location}`,
  },
];

// Each panel is a different shape and colour, like frames on a comic page.
const FRAMES = [
  { edge: "panel-a", surface: "bg-[#1b0f18] text-paper", cap: "bg-gold text-ink" },
  { edge: "panel-b", surface: "bg-paper text-dawn-ink", cap: "bg-dawn-ink text-paper" },
  { edge: "panel-c", surface: "bg-[#0e2a63] text-paper", cap: "bg-gold text-ink" },
  { edge: "panel-b", surface: "bg-ink-panel text-paper", cap: "bg-signal-red text-paper" },
] as const;

const year = (period: string) => period.match(/\d{4}/)?.[0] ?? period;

/**
 * Journey: a sequential storytelling rail. The chapters are panels on one
 * horizontal strip you swipe or scroll across (or step with the arrows), each a
 * different shape and colour, each with a caption box like a comic frame. The year
 * is set huge and cropped. On every width it scrolls sideways; it is a real
 * scrollable region you can also focus and move with the arrow keys.
 */
export function Journey() {
  const rail = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  function step(dir: 1 | -1) {
    const el = rail.current;
    if (!el) return;
    const panel = el.querySelector<HTMLElement>("[data-panel]");
    el.scrollBy({ left: dir * ((panel?.offsetWidth ?? 380) + 24), behavior: "smooth" });
  }

  return (
    <section id="journey" className="surface-overcast relative overflow-hidden py-28 sm:py-40">
      <ChapterMark n="06" className="-top-[0.1em] -right-[0.08em] text-paper/[0.08]" />
      <div className="relative">
        <div className="mx-auto flex max-w-7xl items-end justify-between gap-6 px-6 sm:px-12">
          <SectionHeading title="JOURNEY" />
          <div className="mb-3 hidden items-center gap-3 sm:flex">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous panel"
              className="flex h-11 w-11 items-center justify-center border border-paper/40 text-paper transition-colors hover:border-signal-red-bright hover:text-signal-red-bright"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next panel"
              className="flex h-11 w-11 items-center justify-center border border-paper/40 text-paper transition-colors hover:border-signal-red-bright hover:text-signal-red-bright"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* a sighting: he sprints along behind the timeline cards */}
        <div className="relative h-0">
          <Sighting id="journey" kind="run" className="inset-x-0 -top-5 h-[96px] overflow-hidden" />
        </div>

        <div
          ref={rail}
 data-sense="A real scroll region: swipe it, or focus it and use the arrow keys."          tabIndex={0}
          role="region"
          aria-label="Timeline of education and experience. Scroll sideways."
          onScroll={(e) => {
            const el = e.currentTarget;
            const max = el.scrollWidth - el.clientWidth;
            setProgress(max > 0 ? el.scrollLeft / max : 0);
          }}
          className="relative z-10 mt-12 flex snap-x snap-proximity gap-6 overflow-x-auto px-6 pb-6 [scrollbar-width:none] sm:px-12 [&::-webkit-scrollbar]:hidden"
        >
          {ENTRIES.map((item, i) => {
            const f = FRAMES[i % FRAMES.length];
            return (
              <motion.article
                key={item.id}
                data-panel
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "0px 0px 0px -60px" }}
                transition={{ duration: 0.7, delay: Math.min(i, 3) * 0.06, ease: EASE }}
                className={cn(
                  "relative flex min-h-[27rem] w-[82vw] shrink-0 snap-start flex-col justify-end overflow-hidden px-7 pt-10 pb-12 sm:w-[26rem]",
                  f.edge,
                  f.surface
                )}
              >
                {/* the year, huge and cropped by the panel */}
                <span
                  aria-hidden
                  className="stroke-text pointer-events-none absolute -top-6 -left-3 font-display text-[11rem] leading-none opacity-30"
                >
                  {year(item.period)}
                </span>
                <span aria-hidden className="absolute top-5 right-6 font-mono text-[11px] opacity-60">
                  {i + 1}/{ENTRIES.length}
                </span>

                <div className="relative">
                  <p className={cn("inline-block px-3 py-1 font-display text-lg tracking-wider", f.cap)}>
                    {item.period}
                  </p>
                  <h3 className="mt-4 text-2xl leading-tight font-medium sm:text-[1.7rem]">{item.title}</h3>
                  <p className="mt-2 text-sm opacity-75">{item.org}</p>
                  {item.detail && <p className="mt-4 text-[15px] leading-relaxed opacity-90">{item.detail}</p>}
                </div>
              </motion.article>
            );
          })}
          <div aria-hidden className="w-6 shrink-0 sm:w-12" />
        </div>

        {/* progress along the strip */}
        <div className="mx-auto mt-4 max-w-7xl px-6 sm:px-12" aria-hidden>
          <div className="relative h-px w-full bg-paper/25">
            <div
              className="absolute top-1/2 h-[3px] -translate-y-1/2 bg-signal-red-bright"
              style={{ width: `${12 + progress * 88}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
