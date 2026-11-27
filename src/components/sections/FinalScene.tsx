"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Download, RotateCcw } from "lucide-react";
import { Mark } from "@/components/ui/Mark";
import { Skyline } from "@/components/ui/Skyline";
import { WebSlinger } from "@/components/ui/WebSlinger";
import { useIntro } from "@/components/intro/IntroSequence";
import { profile } from "@/data/resume";

const EASE = [0.16, 1, 0.3, 1] as const;

const EGG_LINES = [
  "Thanks for looking closely.",
  "You read the credits. Respect.",
  "Tests pass. Hi.",
  "Okay, you found it. Hi.",
];

/**
 * The ending, which continues the Say Hi chapter rather than starting a new one:
 * the sun comes up over a pale city, the web-slinger who ran the rooftops waves
 * from one of them, and the credits sit underneath in small type. Two Easter eggs
 * live here (click the monogram three times, or click the sun).
 */
export function FinalScene() {
  const [clicks, setClicks] = useState(0);
  const [egg, setEgg] = useState<string | null>(null);
  const [waving, setWaving] = useState(false);
  const { replay } = useIntro();

  useEffect(() => {
    if (!egg) return;
    const id = window.setTimeout(() => setEgg(null), 2800);
    return () => window.clearTimeout(id);
  }, [egg]);

  useEffect(() => {
    if (!waving) return;
    const id = window.setTimeout(() => setWaving(false), 2400);
    return () => window.clearTimeout(id);
  }, [waving]);

  function handleMarkClick() {
    const next = clicks + 1;
    setClicks(next);
    if (next >= 3) {
      setEgg(EGG_LINES[Math.floor(Math.random() * EGG_LINES.length)]);
      setClicks(0);
    }
  }

  return (
    <footer className="surface-morning relative -mt-px overflow-hidden pb-24 sm:pb-16">
      <div
        data-sense="Hosted on Cloudflare Workers, with a content security policy on the pages."
        className="relative h-[430px] sm:h-[470px]"
      >
        {/* first light behind the city */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_30%,rgba(246,214,150,0.55)_75%,rgba(244,184,128,0.7))]"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="relative z-10 px-6 pt-6 text-center"
        >
          <p className="font-serif text-[clamp(2.8rem,7vw,5.5rem)] leading-[0.95] text-dawn-ink italic">
            Thanks for reading.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <a
              href={profile.resumeUrl}
              download
              className="inline-flex items-center gap-2 bg-dawn-ink px-6 py-3 text-sm font-medium text-dawn-warm transition-colors hover:bg-signal-red-deep"
            >
              <Download size={15} /> Resume
            </a>
            <button
              type="button"
              onClick={replay}
              aria-label="Replay the opening title sequence"
              className="inline-flex items-center gap-2 border-2 border-dawn-ink px-5 py-2.5 text-sm text-dawn-ink transition-colors hover:border-signal-red-deep hover:text-signal-red-deep"
            >
              <RotateCcw size={14} /> Replay the run
            </button>
          </div>
        </motion.div>

        {/* the sun, rising as you reach it */}
        <motion.button
          type="button"
          onClick={() => {
            setEgg("Good morning, New York.");
            setWaving(true);
          }}
          aria-label="The sun. Click to say good morning."
          initial={{ y: 90, x: "-50%" }}
          whileInView={{ y: 0, x: "-50%" }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 2.2, ease: EASE }}
          whileHover={{ scale: 1.12 }}
          className="absolute bottom-6 left-1/2 h-40 w-40 rounded-full bg-[radial-gradient(circle,#fff6d2_0%,#ffd27d_45%,#ffb866_55%,rgba(255,184,102,0)_71%)]"
        />

        <Skyline className="pointer-events-none absolute inset-x-0 bottom-0 h-[34%] w-full text-[#a9a3a0]" />

        {/* the nearest roof, and who is standing on it */}
        <div className="absolute bottom-0 left-[6%] w-40 sm:left-[16%] sm:w-52">
          <button
            type="button"
            onClick={() => setWaving(true)}
            onPointerEnter={() => setWaving(true)}
            onFocus={() => setWaving(true)}
            aria-label="The web-slinger on the roof. Click for a wave."
            className="relative mx-auto -mb-1 block h-28 w-24"
          >
            <svg viewBox="-42 -92 84 96" className="h-full w-full overflow-visible" aria-hidden>
              <WebSlinger pose="stand" waving={waving} />
            </svg>
          </button>
          <div aria-hidden className="suit-weave h-2.5" />
          <div
            aria-hidden
            className="h-16 bg-[#20232c] bg-[linear-gradient(90deg,transparent_14px,rgba(242,194,48,0.55)_14px_22px,transparent_22px)] bg-[length:44px_14px] bg-[position:10px_18px] bg-repeat-x"
          />
        </div>

        <AnimatePresence>
          {egg && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              role="status"
              className="absolute right-4 bottom-4 z-10 bg-dawn-ink px-3 py-2 font-mono text-[11px] tracking-wide text-gold sm:right-10"
            >
              {egg}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* the small print */}
      <div className="border-t-2 border-dawn-ink px-6 pt-5 sm:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:pl-24">
          <button
            type="button"
            onClick={handleMarkClick}
            aria-label="Easter egg"
            className="w-fit shrink-0 text-dawn-ink transition-colors hover:text-signal-red-deep"
          >
            <Mark className="h-8 w-8" />
          </button>
          <p className="max-w-xl font-mono text-[11px] leading-relaxed text-dawn-ink/85">
            Written, designed and built by {profile.name}. Set in Bebas Neue, Big Shoulders,
            Instrument Serif, Inter and JetBrains Mono. Built with Next.js, TypeScript and Motion.
          </p>
          <p className="max-w-sm text-[11px] leading-relaxed text-dawn-ink/85 sm:text-right">
            © 2026 {profile.name}. Original artwork with a Spider-Man-inspired direction; not
            affiliated with Marvel or Sony.
          </p>
        </div>
      </div>
    </footer>
  );
}
