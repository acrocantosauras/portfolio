"use client";

import { motion } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ChapterMark } from "@/components/ui/ChapterMark";
import { skillGroups } from "@/data/resume";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;
const group = (id: string) => skillGroups.find((g) => g.id === id)!;

/** A ruler along a panel edge: the technical-drawing detail that ties these together. */
function Ruler({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute block h-2 bg-[repeating-linear-gradient(90deg,currentColor_0_1px,transparent_1px_12px)] opacity-40",
        className
      )}
    />
  );
}

function Panel({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className={cn("relative overflow-hidden", className)}
    >
      {children}
    </motion.div>
  );
}

/**
 * Skills, as editorial technical panels. Five different pieces of a spec sheet:
 * two large overlapping panels for the work the projects lean on hardest, a long
 * strip for testing and operations, and two small notes. Mirrors the resume's
 * technical-skills block; the numbering is just the order they appear in.
 */
export function Workshop() {
  const ai = group("ai-llm");
  const be = group("backend-data");
  const ops = group("testing-ops");
  const lang = group("languages");
  const fe = group("frontend");

  return (
    <section id="workshop" className="surface-night-soft relative overflow-hidden py-28 sm:py-40">
      <ChapterMark n="04" className="-top-[0.1em] -right-[0.08em] text-web-blue-bright/[0.12]" />
      <div className="relative mx-auto max-w-7xl px-6 sm:px-12">
        <SectionHeading title="SKILLS" />

        <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
          {/* AI / LLM: the large blue-grid panel */}
          <Panel
            className="panel-a bg-ink-panel px-7 pt-10 pb-16 text-paper sm:px-10 lg:col-span-7"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:linear-gradient(var(--color-web-blue-bright)_1px,transparent_1px),linear-gradient(90deg,var(--color-web-blue-bright)_1px,transparent_1px)] [background-size:36px_36px]"
            />
            <span
              aria-hidden
              className="stroke-text pointer-events-none absolute -right-6 -bottom-12 font-display text-[18rem] leading-none text-web-blue-bright/20"
            >
              AI
            </span>
            <Ruler className="top-0 left-0 w-full text-web-blue-bright" />
            <div className="relative">
              <h3 className="font-serif text-4xl text-paper italic sm:text-5xl">{ai.label}</h3>
              <ol className="mt-7 grid max-w-xl gap-x-8 gap-y-2.5 sm:grid-cols-2">
                {ai.items.map((it, i) => (
                  <li key={it} className="flex items-baseline gap-3 text-lg text-paper">
                    <span className="font-mono text-[11px] text-web-blue-bright">{String(i + 1).padStart(2, "0")}</span>
                    {it}
                  </li>
                ))}
              </ol>
            </div>
          </Panel>

          {/* Backend: overlaps upward, red halftone */}
          <Panel
            delay={0.08}
            className="panel-c bg-[#1a1020] px-7 pt-10 pb-14 text-paper sm:px-10 lg:col-span-6 lg:col-start-7 lg:-mt-12 lg:translate-y-0"
          >
            <span
              aria-hidden
              className="halftone halftone-fade-b pointer-events-none absolute inset-x-0 top-0 h-44 text-signal-red-bright/40"
            />
            <div className="relative">
              <h3 className="font-serif text-4xl text-paper italic sm:text-5xl">{be.label}</h3>
              <ul className="mt-7 flex flex-wrap gap-x-7 gap-y-2.5 text-lg text-paper">
                {be.items.map((it) => (
                  <li key={it} className="relative">
                    {it}
                    <span aria-hidden className="absolute -right-4 text-signal-red-bright/60">
                      /
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Panel>

          {/* Testing & Ops: the long strip with slanted ends */}
          <Panel
            delay={0.05}
            className="bg-paper px-7 py-10 text-dawn-ink [clip-path:polygon(2.5%_0,100%_0,97.5%_100%,0_100%)] sm:px-14 lg:col-span-12"
          >
            <Ruler className="bottom-0 left-0 w-full text-dawn-ink" />
            <div className="grid gap-x-12 gap-y-4 lg:grid-cols-[14rem_1fr] lg:items-baseline">
              <h3 className="font-serif text-4xl text-dawn-ink italic sm:text-5xl">{ops.label}</h3>
              <ul className="flex flex-wrap gap-x-8 gap-y-2 text-xl">
                {ops.items.map((it) => (
                  <li key={it} className="flex items-baseline gap-2">
                    <span aria-hidden className="inline-block h-1.5 w-1.5 -translate-y-[0.15em] bg-signal-red-deep" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          </Panel>

          {/* Languages and Frontend: two small notes at different offsets */}
          <Panel delay={0.05} className="border border-hairline bg-ink px-7 py-8 text-paper lg:col-span-4 lg:col-start-2 lg:-rotate-1">
            <h3 className="font-serif text-3xl text-paper italic">{lang.label}</h3>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-lg text-paper-dim">
              {lang.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </Panel>
          <Panel delay={0.1} className="border border-hairline bg-ink px-7 py-8 text-paper lg:col-span-3 lg:col-start-7 lg:mt-6 lg:rotate-1">
            <h3 className="font-serif text-3xl text-paper italic">{fe.label}</h3>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-lg text-paper-dim">
              {fe.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </section>
  );
}
