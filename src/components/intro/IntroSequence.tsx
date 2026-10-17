"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { motion } from "motion/react";
import { EmblemShapes, EMBLEM_PARTS } from "./SpiderEmblem";
import { WebCorner } from "@/components/ui/WebCorner";
import { Skyline } from "@/components/ui/Skyline";

/**
 * The opening sequence: a near-black city night, composed web strands drawing
 * in from the corners, red/blue light blooming, an original spider emblem
 * tracing itself into existence, a light sweep, an impact pulse (spider-sense),
 * kinetic masthead typography, and a zoom-through into the hero.
 *
 * Runs once per session (replayable on demand), always skippable, and is
 * bypassed entirely for prefers-reduced-motion.
 */

const SEEN_KEY = "mj-bnd-intro-seen";

const T = {
  blooms: 0.75,
  emblem: 1.2,
  leg: (i: number) => 1.2 + i * 0.08,
  body: (i: number) => 1.55 + i * 0.13,
  palps: 2.15,
  fills: 2.45,
  sweep: 2.7,
  impact: 3.05,
  type: 3.25,
  subtitle: 3.9,
  location: 4.15,
  exit: 4.75,
  total: 5.5,
} as const;

const TITLE = "MEET JADHAV";

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

  const finish = useCallback(() => {
    writeSeen();
    setOverride(false);
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
      {active && <Sequence key={run} runId={run} onDone={finish} />}
    </IntroContext.Provider>
  );
}

function Sequence({ onDone }: { runId: number; onDone: () => void }) {
  const uid = useId().replace(/:/g, "");
  const skipRef = useRef<HTMLButtonElement>(null);
  const { LEGS, BODY, PALPS } = EMBLEM_PARTS;

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

  const trace = (delay: number, duration = 0.45) => ({
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1 },
    transition: {
      pathLength: { duration, delay },
      opacity: { duration: 0.15, delay },
    },
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Opening title sequence"
      className="fixed inset-0 z-[100] overflow-hidden bg-ink"
    >
      {/* ---------- city ambience ---------- */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9 }}
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_115%,#151b33_0%,#0a0c14_45%,#06070b_78%)]" />
        <div className="absolute inset-x-0 bottom-[20vh] h-48 bg-gradient-to-t from-amber/10 to-transparent" />
        <Skyline className="absolute inset-x-0 bottom-0 h-[22vh] w-full text-[#090b13]" />
        <motion.div
          className="absolute -top-[10%] -left-[8%] h-[42vmin] w-[42vmin] rounded-full bg-signal-red/25 blur-[120px]"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: T.blooms }}
        />
        <motion.div
          className="absolute -top-[6%] -right-[8%] h-[46vmin] w-[46vmin] rounded-full bg-web-blue/30 blur-[130px]"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: T.blooms + 0.2 }}
        />
      </motion.div>

      {/* ---------- drifting dust ---------- */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        aria-hidden
      >
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            className="absolute h-[2px] w-[2px] rounded-full bg-paper/70 animate-dust"
            style={{
              left: `${(i * 7.3 + 5) % 92}%`,
              top: `${(i * 17.1 + 12) % 80}%`,
              animationDelay: `${(i * 0.9) % 9}s`,
              animationDuration: `${10 + (i % 5) * 2}s`,
            }}
          />
        ))}
      </motion.div>

      {/* ---------- composed web strands ---------- */}
      <motion.div
        className="absolute -top-4 -left-4 h-[50vmin] w-[50vmin] text-paper/25"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        aria-hidden
      >
        <WebCorner anchor="tl" animate />
      </motion.div>
      <motion.div
        className="absolute -top-4 -right-4 h-[38vmin] w-[38vmin] text-paper/15"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        aria-hidden
      >
        <WebCorner anchor="tr" animate />
      </motion.div>
      <motion.div
        className="absolute -bottom-4 -left-4 h-[34vmin] w-[34vmin] text-web-blue-bright/25"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        aria-hidden
      >
        <WebCorner anchor="bl" animate />
      </motion.div>
      <motion.div
        className="absolute -right-4 -bottom-4 h-[44vmin] w-[44vmin] text-signal-red/25"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.45 }}
        aria-hidden
      >
        <WebCorner anchor="br" animate />
      </motion.div>

      {/* ---------- impact flash (gentle, single pulse) ---------- */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-paper"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.08, 0] }}
        transition={{ duration: 0.4, delay: T.impact }}
        aria-hidden
      />

      {/* ---------- center stack: emblem + type ---------- */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, scale: [1, 1, 1.45] }}
        transition={{
          opacity: { duration: 0.6 },
          scale: {
            duration: 0.7,
            delay: T.exit,
            ease: [0.7, 0, 0.84, 0],
            times: [0, 0.15, 1],
          },
        }}
        exit={{ opacity: 0 }}
      >
        {/* emblem */}
        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: T.emblem }}
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.55, delay: T.impact, ease: "easeOut" }}
            className="relative"
          >
            <svg
              viewBox="0 0 240 240"
              className="h-[min(52vmin,400px)] w-[min(52vmin,400px)] min-w-[210px]"
              aria-hidden
            >
              <defs>
                <linearGradient id={`face-${uid}`} x1="0" y1="0" x2="0.7" y2="1">
                  <stop offset="0%" stopColor="#ff4553" />
                  <stop offset="46%" stopColor="#e01f2f" />
                  <stop offset="100%" stopColor="#7c0d18" />
                </linearGradient>
                <linearGradient id={`shine-${uid}`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#fff" stopOpacity="0" />
                  <stop offset="50%" stopColor="#fff" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                </linearGradient>
                <mask id={`mask-${uid}`}>
                  <EmblemShapes fill="white" />
                </mask>
              </defs>

              {/* 1. trace — legs, then body */}
              <motion.g
                fill="none"
                stroke="var(--color-paper-dim)"
                strokeWidth="1.4"
                strokeLinejoin="round"
              >
                {LEGS.map((d, i) => (
                  <motion.path key={`tl-${d}`} d={d} {...trace(T.leg(i))} />
                ))}
                <g transform="translate(240,0) scale(-1,1)">
                  {LEGS.map((d, i) => (
                    <motion.path key={`tr-${d}`} d={d} {...trace(T.leg(i) + 0.04)} />
                  ))}
                </g>
                {BODY.map((d, i) => (
                  <motion.path key={`tb-${d}`} d={d} {...trace(T.body(i), 0.5)} />
                ))}
                {PALPS.map((d) => (
                  <motion.path key={`tp-${d}`} d={d} {...trace(T.palps, 0.3)} />
                ))}
                <g transform="translate(240,0) scale(-1,1)">
                  {PALPS.map((d) => (
                    <motion.path key={`tpr-${d}`} d={d} {...trace(T.palps + 0.05, 0.3)} />
                  ))}
                </g>
              </motion.g>

              {/* 2. fill — blue depth block, dark separation, red face */}
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: T.fills }}
              >
                <g transform="translate(5,7)">
                  <EmblemShapes fill="var(--color-web-blue)" />
                </g>
                <g transform="translate(2.5,3.5)">
                  <EmblemShapes fill="rgba(3,3,6,0.9)" />
                </g>
                <EmblemShapes fill={`url(#face-${uid})`} />
              </motion.g>

              {/* 3. light sweep, masked to the emblem */}
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: T.sweep }}
                mask={`url(#mask-${uid})`}
                style={{ mixBlendMode: "screen" }}
              >
                <motion.rect
                  x={0}
                  y={-50}
                  width={140}
                  height={340}
                  fill={`url(#shine-${uid})`}
                  initial={{ x: -300 }}
                  animate={{ x: 330 }}
                  transition={{ duration: 0.8, delay: T.sweep, ease: "easeInOut" }}
                />
              </motion.g>
            </svg>

            {/* spider-sense impact ring */}
            <motion.span
              className="pointer-events-none absolute top-1/2 left-1/2 h-[52%] w-[52%] rounded-full border border-paper/60"
              initial={{ opacity: 0, scale: 0.5, x: "-50%", y: "-50%" }}
              animate={{ opacity: [0, 0.8, 0], scale: 2.5 }}
              transition={{ duration: 0.85, delay: T.impact, ease: "easeOut" }}
              aria-hidden
            />
          </motion.div>
        </motion.div>

        {/* kinetic masthead typography */}
        <h1
          className="mt-8 font-display text-[13.5vw] leading-none tracking-wide sm:text-6xl md:text-7xl lg:text-8xl"
          aria-label="Meet Jadhav"
        >
          <span className="masthead">
            {TITLE.split("").map((ch, i) => (
              <span
                key={i}
                className="ns-fix inline-block overflow-hidden pr-[0.06em] pb-[0.14em]"
                aria-hidden
              >
                <motion.span
                  className="block"
                  initial={{ y: "115%" }}
                  animate={{ y: "0%" }}
                  transition={{
                    duration: 0.6,
                    delay: T.type + i * 0.045,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {ch === " " ? "\u00A0" : ch}
                </motion.span>
              </span>
            ))}
          </span>
        </h1>

        <motion.p
          className="gold-subtitle mt-5 inline-block -skew-x-12 font-mono text-[11px] tracking-[0.35em] uppercase sm:text-sm"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: T.subtitle }}
        >
          AI / Backend Engineer
        </motion.p>

        <motion.p
          className="mt-3 font-mono text-[10px] tracking-[0.4em] text-paper-dim/80 uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: T.location }}
        >
          Pune, Maharashtra · India
        </motion.p>
      </motion.div>

      {/* ---------- skip + progress ---------- */}
      <button
        ref={skipRef}
        type="button"
        onClick={onDone}
        className="absolute right-4 bottom-6 z-10 border border-hairline bg-ink/70 px-4 py-2.5 font-mono text-[11px] tracking-[0.25em] text-paper-dim uppercase backdrop-blur-sm transition-colors hover:border-signal-red-bright hover:text-signal-red-bright sm:right-6"
      >
        Skip intro <span aria-hidden>»</span>
      </button>

      <motion.div
        className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-gradient-to-r from-signal-red via-paper to-web-blue"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: T.exit, ease: "linear" }}
        aria-hidden
      />
    </div>
  );
}
