"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { motion } from "motion/react";
import { WebCorner } from "@/components/ui/WebCorner";

/**
 * The opening is a title card: web strands draw in from the corners of a
 * city-night frame, then the name lands in the red-and-blue comic lettering
 * with the gold subtitle beneath it, as in a film's title treatment. Short on
 * purpose (~3.6s), always skippable (button, Escape, Enter) and bypassed
 * entirely for prefers-reduced-motion. Runs once per session; replayable from
 * the hero.
 */

const SEEN_KEY = "mj-bnd-title-seen";

const T = {
  name: 1.2,
  role: 2.0,
  exit: 3.1,
  total: 3.8,
} as const;

type IntroCtx = { done: boolean; replay: () => void };
const IntroContext = createContext<IntroCtx | null>(null);

export function useIntro() {
  const ctx = useContext(IntroContext);
  if (!ctx) throw new Error("useIntro must be used within IntroProvider");
  return ctx;
}

function readSeen() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function writeSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    /* storage unavailable — intro simply replays next load */
  }
}

/* ------------------------------------------------------------------
   Whether the intro should be skipped is external, session-scoped state
   (media query + sessionStorage), so it is read with useSyncExternalStore:
   the server snapshot is `null`, which keeps SSR and hydration markup
   identical (no overlay), and the client snapshot resolves right after
   hydration without a setState-in-effect flash.
   ------------------------------------------------------------------ */
function subscribeIntroSeen(onStoreChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  window.addEventListener("storage", onStoreChange);
  mq.addEventListener("change", onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    mq.removeEventListener("change", onStoreChange);
  };
}

function getIntroSnapshot(): boolean {
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches || readSeen()
  );
}

function getServerIntroSnapshot(): boolean | null {
  return null;
}

export function IntroProvider({ children }: { children: ReactNode }) {
  // null until hydration resolves: true  = intro already seen (or reduced
  // motion), false = first visit. See subscribeIntroSeen above.
  const initSeen = useSyncExternalStore(
    subscribeIntroSeen,
    getIntroSnapshot,
    getServerIntroSnapshot
  );
  // Explicit session overrides; null = follow initSeen.
  const [override, setOverride] = useState<boolean | null>(null);
  const [run, setRun] = useState(0);

  const active = override !== null ? override : initSeen === false;
  const done = override !== null ? !override : initSeen === true;

  // Deep-link guard: if the page was opened with a #section and the intro
  // locked scrolling before the browser could honor the fragment, restore the
  // target once, right after the lock releases. Guarded so replays never yank
  // the visitor away from wherever they are.
  const hashRestoredRef = useRef(false);

  const finish = useCallback(() => {
    writeSeen();
    setOverride(false);
    if (!hashRestoredRef.current) {
      hashRestoredRef.current = true;
      const hash = window.location.hash.replace(/^#/, "");
      if (hash) {
        window.setTimeout(() => {
          const target = document.getElementById(decodeURIComponent(hash));
          if (target && window.scrollY < 8) {
            const reduce = window.matchMedia(
              "(prefers-reduced-motion: reduce)"
            ).matches;
            target.scrollIntoView({
              behavior: reduce ? "auto" : "smooth",
              block: "start",
            });
          }
        }, 120);
      }
    }
  }, []);

  const replay = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    window.scrollTo({ top: 0 });
    setRun((r) => r + 1);
    setOverride(true);
  }, []);

  // Lock scrolling while the sequence is on screen.
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);

  return (
    <IntroContext.Provider value={{ done, replay }}>
      {/* content is inert while the intro covers it */}
      <div inert={active || undefined}>{children}</div>
      {active && <Sequence key={run} onDone={finish} />}
    </IntroContext.Provider>
  );
}

function Sequence({ onDone }: { onDone: () => void }) {
  const skipRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const t = window.setTimeout(onDone, T.total * 1000);
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" || e.key === "Enter") onDone();
    }
    window.addEventListener("keydown", onKey);
    skipRef.current?.focus();
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [onDone]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Opening title sequence"
      className="fixed inset-0 z-[100] overflow-hidden bg-ink"
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 1, 0] }}
      transition={{
        duration: T.total,
        times: [0, T.exit / T.total, 1],
        ease: "easeOut",
      }}
    >
      {/* city night, lit red and blue from the edges */}
      <div
        className="absolute inset-0 bg-[radial-gradient(60%_50%_at_88%_0%,rgba(29,95,209,0.30),transparent),radial-gradient(55%_45%_at_0%_100%,rgba(224,52,43,0.24),transparent)]"
        aria-hidden
      />

      {/* web strands draw in from the corners */}
      <WebCorner anchor="tl" animate className="absolute -top-4 -left-4 h-[52vmin] w-[52vmin] text-paper/30" />
      <WebCorner anchor="tr" animate className="absolute -top-4 -right-4 h-[40vmin] w-[40vmin] text-web-blue-bright/35" />
      <WebCorner anchor="bl" animate className="absolute -bottom-4 -left-4 h-[36vmin] w-[36vmin] text-paper/20" />
      <WebCorner anchor="br" animate className="absolute -right-4 -bottom-4 h-[46vmin] w-[46vmin] text-signal-red-bright/35" />

      {/* the title card */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        animate={{ scale: [1, 1, 1.3] }}
        transition={{
          duration: T.total - T.exit + 0.3,
          delay: T.exit - 0.3,
          times: [0, 0.01, 1],
          ease: [0.7, 0, 0.84, 0],
        }}
      >
        <h1
          className="masthead font-display text-[clamp(3.6rem,15vw,9.5rem)] leading-[0.9]"
          aria-label="Meet Jadhav"
        >
          {"MEET JADHAV".split("").map((ch, i) => (
            <span
              key={i}
              aria-hidden
              className="inline-block overflow-hidden pt-[0.04em] pr-[0.09em] pb-[0.12em] -mr-[0.05em]"
            >
              <motion.span
                className="block"
                initial={{ y: "115%" }}
                animate={{ y: "0%" }}
                transition={{
                  duration: 0.6,
                  delay: T.name + i * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {ch === " " ? " " : ch}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p
          className="gold-subtitle mt-5 text-[clamp(0.7rem,2.2vw,1.05rem)]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: T.role }}
        >
          AI / Backend Engineer
        </motion.p>
        <motion.p
          className="mt-3 text-sm tracking-wide text-paper-dim"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: T.role + 0.35 }}
        >
          Pune, Maharashtra
        </motion.p>
      </motion.div>

      <button
        ref={skipRef}
        type="button"
        onClick={onDone}
        className="absolute right-4 bottom-6 z-10 px-3 py-2.5 text-sm text-paper-dim underline decoration-hairline underline-offset-4 transition-colors hover:text-paper hover:decoration-signal-red-bright sm:right-6"
      >
        Skip intro
      </button>
    </motion.div>
  );
}
