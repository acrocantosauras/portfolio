"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ChapterMark } from "@/components/ui/ChapterMark";
import { Mark } from "@/components/ui/Mark";
import { ForgetTiles } from "@/components/sections/ForgetTiles";
import PixelTransition from "@/components/ui/PixelTransition";
import { profile } from "@/data/resume";

const EASE = [0.16, 1, 0.3, 1] as const;

const FORGET_MS = 5200;
// the secret handshake: tap the tape strips in this order
const HANDSHAKE = ["left", "right", "left", "right"] as const;

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
  const [forgotten, setForgotten] = useState(false);
  const [shook, setShook] = useState(false);
  const taps = useRef<string[]>([]);

  // nothing stays forgotten: it all comes back on its own
  useEffect(() => {
    if (!forgotten) return;
    const id = window.setTimeout(() => setForgotten(false), FORGET_MS);
    return () => window.clearTimeout(id);
  }, [forgotten]);

  useEffect(() => {
    if (!shook) return;
    const id = window.setTimeout(() => setShook(false), 4200);
    return () => window.clearTimeout(id);
  }, [shook]);

  function tapTape(side: (typeof HANDSHAKE)[number]) {
    taps.current = [...taps.current, side].slice(-HANDSHAKE.length);
    if (HANDSHAKE.every((s, i) => taps.current[i] === s)) {
      taps.current = [];
      setForgotten(false);
      setShook(true);
    }
  }

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
            className="relative z-10 max-w-sm sm:max-w-md lg:col-span-5 lg:col-start-1 lg:row-start-1 lg:max-w-none lg:self-start"
          >
            <div
              data-sense="The pixel mask is a React Bits component, adapted for this page. It adds no packages."
              className="relative aspect-[4/5] overflow-hidden border-2 border-paper bg-black shadow-[12px_12px_0_0_var(--color-signal-red)]">
              <PixelTransition
                className="!absolute inset-0 h-full"
                aspectRatio="4 / 5"
                label="Portrait. Hover, focus or tap to look at the mask."
                gridSize={18}
                pattern="ripple"
                pixelAnimation="grow"
                pixelColor="var(--color-signal-red)"
                mosaic={0.35}
                animationStepDuration={0.35}
                firstContent={
                  <>
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
                  </>
                }
                secondContent={
                  <div aria-hidden className="suit-weave flex h-full w-full items-center justify-center">
                    <Mark className="h-2/5 w-2/5 text-paper" />
                  </div>
                }
              />
              <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] p-5">
                <span className="font-display text-3xl tracking-wide text-paper">
                  <span className="sr-only">{profile.name}</span>
                  {profile.name.split("").map((ch, i) => (
                    <span
                      key={i}
                      aria-hidden
                      className="forget-letter whitespace-pre"
                      style={{ opacity: forgotten ? 0 : 1, transitionDelay: `${((i * 7) % 11) * 70}ms` }}
                    >
                      {ch}
                    </span>
                  ))}
                </span>
                <span className="mt-1 block text-sm text-paper-dim">{profile.location}</span>
              </figcaption>
              <ForgetTiles active={forgotten} />
              {(forgotten || shook) && (
                <p
                  aria-hidden
                  className="forget-line pointer-events-none absolute inset-x-4 top-1/2 lg:right-[34%] z-[4] -translate-y-1/2 text-center font-serif text-3xl leading-snug text-paper italic"
                >
                  {shook ? "You remembered the handshake." : "Nobody here remembers that name."}
                </p>
              )}
            </div>
            {/* strips of tape holding it to the page */}
            <button
              type="button"
              onClick={() => tapTape("left")}
              aria-label="Strip of tape, left corner"
              className="absolute -top-3 -left-5 z-[5] h-6 w-20 -rotate-[28deg] bg-gold/85 transition-[filter] hover:brightness-110"
            />
            <button
              type="button"
              onClick={() => tapTape("right")}
              aria-label="Strip of tape, right corner"
              className="absolute -top-3 -right-5 z-[5] h-6 w-20 rotate-[24deg] bg-gold/85 transition-[filter] hover:brightness-110"
            />
            <button
              type="button"
              onClick={() => {
                setShook(false);
                setForgotten((v) => !v);
              }}
              className="mt-7 border border-paper/50 px-4 py-2.5 text-sm text-paper transition-colors hover:border-signal-red-bright hover:text-signal-red-bright"
            >
              {forgotten ? "Remind them" : "What if everyone forgot?"}
            </button>
            <p role="status" className="sr-only">
              {shook ? "You remembered the handshake." : forgotten ? "Nobody here remembers that name." : ""}
            </p>
          </motion.figure>

          {/* the text panel overlaps the photo's right edge */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="relative z-20 border border-hairline bg-ink/90 px-7 py-9 backdrop-blur-[2px] sm:px-10 lg:col-span-8 lg:col-start-5 lg:row-start-1 lg:mt-24 lg:-ml-10"
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
