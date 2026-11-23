"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { RotateCcw } from "lucide-react";
import { Mark } from "@/components/ui/Mark";
import { Skyline } from "@/components/ui/Skyline";
import { useIntro } from "@/components/intro/IntroSequence";
import { profile } from "@/data/resume";

const EASE = [0.16, 1, 0.3, 1] as const;

const EGG_LINES = [
  "Thanks for looking closely.",
  "You read the credits. Respect.",
  "Tests pass. Hi.",
  "Okay, you found it. Hi.",
];

const CREDITS: [string, string][] = [
  ["Written, designed and built by", "Meet Jadhav"],
  ["Set in", "Bebas Neue, Big Shoulders, Instrument Serif, Inter, JetBrains Mono"],
  ["Built with", "Next.js, TypeScript, Motion"],
  ["Shown on", "Cloudflare Workers"],
];

const link =
  "text-paper underline decoration-paper/30 underline-offset-4 transition-colors hover:text-signal-red-bright hover:decoration-signal-red-bright";

/**
 * The end card. A letterboxed film frame: the last of the web strand drops from
 * the top edge to the sun coming up over the rooftops, the thank-you is set big,
 * and the credits roll as a film's would. Two Easter eggs live here (click the
 * monogram three times, or click the sun); a third, the Konami code, works
 * anywhere on the page.
 */
export function FinalScene() {
  const [clicks, setClicks] = useState(0);
  const [egg, setEgg] = useState<string | null>(null);
  const { replay } = useIntro();

  function say(line: string) {
    setEgg(line);
    window.setTimeout(() => setEgg(null), 2800);
  }
  function handleMarkClick() {
    const next = clicks + 1;
    setClicks(next);
    if (next >= 3) {
      say(EGG_LINES[Math.floor(Math.random() * EGG_LINES.length)]);
      setClicks(0);
    }
  }

  return (
    <footer className="surface-morning relative overflow-hidden px-4 pt-2 pb-16 sm:px-8 sm:pb-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: EASE }}
        className="relative mx-auto min-h-[32rem] max-w-7xl overflow-hidden bg-ink text-paper sm:aspect-[2.39/1] sm:min-h-[26rem]"
      >
        {/* sunrise behind the rooftops */}
        <div
          className="absolute inset-0 bg-[radial-gradient(60%_70%_at_50%_100%,rgba(255,196,120,0.55),rgba(255,120,80,0.18)_45%,transparent_72%),linear-gradient(to_bottom,#04060d,#131a2e_70%,#2a2f44)]"
          aria-hidden
        />
        <Skyline className="pointer-events-none absolute inset-x-0 bottom-0 h-[34%] w-full text-[#080b14]" />

        {/* the last of the thread: from the top edge down to the sun */}
        <motion.span
          aria-hidden
          className="absolute top-0 left-1/2 h-[74%] w-px origin-top bg-signal-red-bright"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, delay: 0.4, ease: EASE }}
        />
        <button
          type="button"
          onClick={() => say("Good morning, New York.")}
          aria-label="The sun. Click to say good morning."
          className="absolute bottom-[26%] left-1/2 h-14 w-14 -translate-x-1/2 translate-y-1/2 rounded-full bg-[radial-gradient(circle,#fff3c4_0%,#ffc878_55%,rgba(255,170,100,0)_72%)] transition-transform duration-300 hover:scale-125"
        />

        {/* letterbox bars */}
        <span aria-hidden className="absolute inset-x-0 top-0 h-3 bg-black sm:h-5" />
        <span aria-hidden className="absolute inset-x-0 bottom-0 h-3 bg-black sm:h-5" />

        <div className="relative grid h-full grid-cols-1 content-between gap-10 px-6 pt-12 pb-12 sm:grid-cols-12 sm:px-12 sm:pt-16 sm:pb-14">
          <div className="sm:col-span-7">
            <p className="font-serif text-[clamp(2.8rem,7vw,6rem)] leading-[0.95] text-paper italic">
              Thanks for reading.
            </p>
            <nav className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-2 text-base" aria-label="Footer">
              <a href={profile.github} target="_blank" rel="noreferrer" className={link}>
                GitHub
              </a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className={link}>
                LinkedIn
              </a>
              <a href={profile.resumeUrl} download className={link}>
                Resume
              </a>
              <a href={`mailto:${profile.email}`} className={link}>
                Email
              </a>
              <button
                type="button"
                onClick={replay}
                aria-label="Replay the opening title sequence"
                className="inline-flex items-center gap-2 text-paper-dim transition-colors hover:text-signal-red-bright"
              >
                <RotateCcw size={14} /> Replay the run
              </button>
            </nav>
          </div>

          {/* the credits, as a film would roll them */}
          <dl className="space-y-3 font-mono text-[11px] leading-relaxed sm:col-span-5 sm:justify-self-end sm:text-right">
            {CREDITS.map(([k, v]) => (
              <div key={k}>
                <dt className="tracking-[0.2em] text-paper-dim uppercase">{k}</dt>
                <dd className="text-paper">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* lower strip: the monogram (egg), the line it says, the legal line */}
        <div className="absolute inset-x-0 bottom-3 flex items-end justify-between gap-4 px-5 sm:bottom-6 sm:px-10">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleMarkClick}
              aria-label="Easter egg"
              className="shrink-0 text-paper opacity-70 transition-opacity hover:opacity-100"
            >
              <Mark className="h-8 w-8" />
            </button>
            <AnimatePresence>
              {egg && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="font-mono text-[11px] tracking-wide text-gold"
                  role="status"
                >
                  {egg}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <p className="hidden max-w-sm text-right text-[10px] leading-snug text-paper-dim sm:block">
            © 2026 {profile.name}. Original artwork with a Spider-Man-inspired direction; not affiliated with Marvel or Sony.
          </p>
        </div>
      </motion.div>

      <p className="mx-auto mt-4 max-w-7xl text-center text-[11px] leading-snug text-dawn-ink/60 sm:hidden">
        © 2026 {profile.name}. Original artwork with a Spider-Man-inspired direction; not affiliated with Marvel or Sony.
      </p>
    </footer>
  );
}
