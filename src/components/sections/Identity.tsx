"use client";

import { motion } from "motion/react";
import { ChapterMark } from "@/components/ui/ChapterMark";
import { profile } from "@/data/resume";

const EASE = [0.16, 1, 0.3, 1] as const;

const FACTS = [
  { label: "Based in", value: profile.location },
  { label: "Degree", value: "B.E., Electronics & Telecommunication, 2025" },
  { label: "Certified", value: "Microsoft Azure AI Fundamentals (AI-900)" },
] as const;

/**
 * About: portrait and type overlapping. The headline is set huge and cropped
 * behind the photo, the photo (a real colour photo) is taped to the page at a
 * slight angle with a red print offset, and the text panel overlaps the photo's
 * edge. Nothing here is centred or boxed into a grid cell.
 */
export function Identity() {
  const [lead, ...rest] = profile.identity;

  return (
    <section id="identity" className="surface-predawn relative overflow-hidden py-28 sm:py-40">
      <ChapterMark n="05" className="-top-[0.08em] -left-[0.06em] text-paper/[0.07]" />
      <span
        aria-hidden
        className="halftone halftone-fade-l pointer-events-none absolute top-24 right-0 h-72 w-96 text-signal-red-bright/30"
      />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-12">
        {/* the headline, behind and above the photo */}
        <h2 className="font-display leading-[0.8] tracking-wide uppercase" aria-label="Under the mask">
          <span aria-hidden className="stroke-text block text-paper/80 [font-size:clamp(4.5rem,15vw,13rem)]">
            UNDER
          </span>
          <span aria-hidden className="block text-paper [font-size:clamp(4.5rem,15vw,13rem)] -mt-[0.03em]">
            THE <span className="accent-comic">MASK</span>
          </span>
        </h2>

        <div className="relative mt-[-1.5rem] grid grid-cols-1 gap-y-10 sm:mt-[-2.5rem] lg:mt-[-3.5rem] lg:grid-cols-12">
          {/* the photo: colour, taped, angled, red print offset */}
          <motion.figure
            initial={{ opacity: 0, y: 30, rotate: -4 }}
            whileInView={{ opacity: 1, y: 0, rotate: -2 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: EASE }}
            className="relative z-10 max-w-sm sm:max-w-md lg:col-span-5 lg:max-w-none"
          >
            <div className="relative aspect-[4/5] overflow-hidden border-2 border-paper bg-black shadow-[12px_12px_0_0_var(--color-signal-red)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/meet-jadhav.jpg"
                alt={`Portrait of ${profile.name}`}
                width={600}
                height={692}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-top [filter:contrast(1.04)_saturate(1.06)]"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent via-45% to-transparent"
                aria-hidden
              />
              <figcaption className="absolute inset-x-0 bottom-0 p-5">
                <span className="font-display text-3xl tracking-wide text-paper">{profile.name}</span>
                <span className="mt-1 block text-sm text-paper-dim">{profile.location}</span>
              </figcaption>
            </div>
            {/* strips of tape holding it to the page */}
            <span aria-hidden className="absolute -top-3 -left-5 h-6 w-20 -rotate-[28deg] bg-gold/85" />
            <span aria-hidden className="absolute -top-3 -right-5 h-6 w-20 rotate-[24deg] bg-gold/85" />
          </motion.figure>

          {/* the text panel overlaps the photo's right edge */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="relative z-20 border border-hairline bg-ink/90 px-7 py-9 backdrop-blur-[2px] sm:px-10 lg:col-span-8 lg:col-start-5 lg:mt-24 lg:-ml-10"
          >
            <p className="font-serif text-3xl leading-snug text-paper sm:text-[2.6rem]">{lead}</p>

            <div className="mt-8 flex max-w-xl flex-col gap-5 text-lg leading-relaxed text-paper/90">
              {rest.map((text, i) => (
                <p key={i}>{text}</p>
              ))}
            </div>

            <dl className="mt-10 max-w-xl border-t border-hairline">
              {FACTS.map((f) => (
                <div
                  key={f.label}
                  className="grid grid-cols-[7rem_1fr] gap-x-4 border-b border-hairline py-3 text-sm sm:grid-cols-[9rem_1fr]"
                >
                  <dt className="text-paper-dim">{f.label}</dt>
                  <dd className="text-paper">{f.value}</dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
