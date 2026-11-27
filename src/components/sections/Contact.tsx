"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ChapterMark } from "@/components/ui/ChapterMark";
import { profile } from "@/data/resume";

const EASE = [0.16, 1, 0.3, 1] as const;

// Secondary channels as stickers: slightly rotated, each its own colour.
const STICKERS = [
  { label: "LinkedIn", value: profile.linkedinLabel, href: profile.linkedin, tilt: "-rotate-2", surface: "bg-web-blue text-paper" },
  { label: "GitHub", value: profile.githubLabelShort, href: profile.github, tilt: "rotate-1", surface: "bg-dawn-ink text-dawn-warm" },
  { label: "Phone", value: profile.phone, href: `tel:${profile.phone}`, tilt: "-rotate-1", surface: "bg-gold text-ink" },
] as const;

/**
 * Contact: the one place the page speaks. A big comic speech balloon holds the
 * question and the email (the largest thing on screen); three stickers carry the
 * other channels. The balloon's tail points back toward the headline.
 */
export function Contact() {
  return (
    <section id="contact" className="surface-morning relative overflow-hidden pt-28 pb-10 sm:pt-36 sm:pb-12">
      <ChapterMark n="08" className="-top-[0.1em] -right-[0.06em] text-dawn-ink/[0.07]" />
      <span
        aria-hidden
        className="halftone halftone-fade-b pointer-events-none absolute inset-x-0 top-0 h-56 text-web-blue/20"
      />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-12">
        <div className="grid grid-cols-1 gap-x-12 gap-y-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading title="SAY HI" tone="dawn" />
            <p className="mt-6 flex items-center gap-2.5 text-base text-dawn-ink">
              <span className="h-2 w-2 shrink-0 rounded-full bg-amber" aria-hidden />
              {profile.seeking}
            </p>
          </div>

          <div className="lg:col-span-8">
            {/* the speech balloon */}
            <motion.div
              initial={{ opacity: 0, y: 24, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: -1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, ease: EASE }}
              className="relative"
            >
              <svg
                aria-hidden
                viewBox="0 0 600 380"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full overflow-visible"
              >
                <path
                  d="M40 8H560a32 32 0 0 1 32 32V290a32 32 0 0 1-32 32H190L70 372 104 322H40A32 32 0 0 1 8 290V40A32 32 0 0 1 40 8Z"
                  fill="#f6f1e6"
                  stroke="#14161b"
                  strokeWidth="3.5"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <div className="relative px-7 pt-10 pb-16 sm:px-12 sm:pt-12 sm:pb-20">
                <p className="max-w-xl font-serif text-2xl leading-snug text-dawn-ink italic sm:text-3xl">
                  Building something with LLMs, or hiring for it? I&rsquo;d like to hear about it.
                </p>
                <a
                  href={`mailto:${profile.email}`}
                  className="group mt-5 inline-flex flex-wrap items-center gap-x-3 font-display text-[clamp(1.5rem,3.7vw,3.1rem)] leading-none tracking-wide break-words text-dawn-ink transition-colors hover:text-signal-red-deep"
                >
                  {profile.email}
                  <ArrowUpRight className="shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" size={34} />
                </a>
              </div>
            </motion.div>

            {/* the stickers */}
            <ul className="mt-10 flex flex-wrap gap-5 pl-2 sm:pl-6">
              {STICKERS.map((s, i) => (
                <motion.li
                  key={s.label}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.07, ease: EASE }}
                >
                  <a
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel={s.href.startsWith("http") ? "noreferrer" : undefined}
                    className={`block ${s.tilt} border-2 border-dawn-ink px-5 py-3 shadow-[5px_5px_0_0_var(--color-dawn-ink)] transition-transform duration-200 hover:-translate-y-1 hover:rotate-0 ${s.surface}`}
                  >
                    <span className="block text-[11px] tracking-[0.18em] uppercase">{s.label}</span>
                    <span className="font-display text-xl tracking-wide break-words sm:text-2xl">{s.value}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
