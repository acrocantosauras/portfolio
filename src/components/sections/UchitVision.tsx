"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useReducedMotionSafe } from "@/lib/reduced-motion";
import { ChapterMark } from "@/components/ui/ChapterMark";
import { Chip } from "@/components/ui/Chip";
import { experience } from "@/data/resume";

const uchit = experience.find((e) => e.id === "uchit")!;
const EASE = [0.16, 1, 0.3, 1] as const;

type Walker = {
  id: string;
  conf: number;
  lane: number; // 0 = far, 1 = near the camera
  speed: number; // fractions of the frame width per second
  dir: 1 | -1;
  phase: number; // where in the loop it starts, 0..1
};

// Illustrative walkers: each one loops across the frame at its own pace.
const WALKERS: Walker[] = [
  { id: "07", conf: 0.96, lane: 0.55, speed: 0.055, dir: 1, phase: 0.1 },
  { id: "08", conf: 0.92, lane: 0.2, speed: 0.038, dir: -1, phase: 0.62 },
  { id: "09", conf: 0.89, lane: 0.8, speed: 0.07, dir: 1, phase: 0.38 },
  { id: "10", conf: 0.94, lane: 0.4, speed: 0.046, dir: -1, phase: 0.9 },
  { id: "11", conf: 0.91, lane: 0.68, speed: 0.06, dir: -1, phase: 0.22 },
];

const LINE_X = 0.5; // the counting line, as a fraction of the frame width
const SPAN = 1.3; // the loop runs a little beyond both edges so nobody pops in
const PIPELINE = ["Video", "Detection", "Tracking", "Counting", "Analytics"] as const;

/** x of a walker at time t (seconds), as a fraction of the frame width. */
function xAt(w: Walker, t: number) {
  const s = (((w.phase + w.dir * w.speed * t) % 1) + 1) % 1;
  return -0.15 + s * SPAN;
}

function useClock(frozen: boolean) {
  // `null` renders a fixed placeholder on server and client (toTimeString() is
  // timezone-dependent); the real clock starts after hydration.
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    if (frozen) return;
    const first = setTimeout(() => setNow(new Date()), 0);
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => {
      clearTimeout(first);
      clearInterval(t);
    };
  }, [frozen]);
  return now;
}

/**
 * The simulated street. People walk across it at their own speeds, each one
 * wrapped in a tracking box that follows; a counting line flashes and the in/out
 * tally ticks as someone crosses it; a crosshair follows the cursor. It pauses
 * when scrolled away, and reduced motion gets a still frame.
 */
function TrackingFrame({ reduceMotion }: { reduceMotion: boolean }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const walkerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRef = useRef<HTMLDivElement>(null);
  const hairH = useRef<HTMLDivElement>(null);
  const hairV = useRef<HTMLDivElement>(null);
  const coordRef = useRef<HTMLSpanElement>(null);
  const [tally, setTally] = useState({ inn: 0, out: 0 });
  const clock = useClock(reduceMotion);
  const stamp = clock ? clock.toTimeString().slice(0, 8) : "--:--:--";

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    let W = 0;
    let H = 0;
    let raf = 0;
    let visible = true;
    let start = 0;
    let flashUntil = 0;
    const lastX = WALKERS.map((w) => xAt(w, 0));

    function layout() {
      if (!frame) return;
      W = frame.offsetWidth;
      H = frame.offsetHeight;
      WALKERS.forEach((w, i) => {
        const el = walkerRefs.current[i];
        if (!el) return;
        const h = H * (0.3 + 0.28 * w.lane);
        el.style.height = `${h}px`;
        el.style.width = `${h * 0.42}px`;
      });
    }

    function place(t: number, now: number) {
      WALKERS.forEach((w, i) => {
        const el = walkerRefs.current[i];
        if (!el) return;
        const x = xAt(w, t);
        const h = H * (0.3 + 0.28 * w.lane);
        const ground = H * (0.5 + 0.36 * w.lane);
        const bob = Math.sin(t * 7 + w.phase * 10) * h * 0.012;
        el.style.transform = `translate3d(${x * W - h * 0.21}px, ${ground - h + bob}px, 0)`;
        el.style.visibility = "visible";
        // crossing the counting line?
        if (!reduceMotion && (lastX[i] - LINE_X) * (x - LINE_X) < 0 && Math.abs(x - lastX[i]) < 0.2) {
          flashUntil = now + 380;
          setTally((c) => (w.dir === 1 ? { ...c, inn: c.inn + 1 } : { ...c, out: c.out + 1 }));
        }
        lastX[i] = x;
      });
      if (lineRef.current) {
        lineRef.current.style.opacity = now < flashUntil ? "1" : "0.45";
        lineRef.current.style.backgroundColor = now < flashUntil ? "var(--color-signal-red-bright)" : "var(--color-paper)";
      }
    }

    function tick(now: number) {
      if (!start) start = now;
      place((now - start) / 1000, now);
      raf = visible ? requestAnimationFrame(tick) : 0;
    }

    layout();
    // reduced motion: one still frame, mid-loop, no tally changes
    place(reduceMotion ? 4 : 0, 0);

    const ro = new ResizeObserver(() => {
      layout();
      if (reduceMotion) place(4, 0);
    });
    ro.observe(frame);

    let io: IntersectionObserver | undefined;
    if (!reduceMotion) {
      io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        cancelAnimationFrame(raf);
        if (visible) raf = requestAnimationFrame(tick);
      });
      io.observe(frame);
    }

    return () => {
      ro.disconnect();
      io?.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [reduceMotion]);

  function onMove(e: React.PointerEvent) {
    if (reduceMotion || e.pointerType === "touch") return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    if (hairH.current) hairH.current.style.transform = `translateY(${y}px)`;
    if (hairV.current) hairV.current.style.transform = `translateX(${x}px)`;
    if (coordRef.current) {
      coordRef.current.textContent = `${Math.round((x / r.width) * 1920)}, ${Math.round((y / r.height) * 1080)}`;
    }
    if (hairH.current) hairH.current.style.opacity = "1";
    if (hairV.current) hairV.current.style.opacity = "1";
  }
  function onLeave() {
    if (hairH.current) hairH.current.style.opacity = "0";
    if (hairV.current) hairV.current.style.opacity = "0";
    if (coordRef.current) coordRef.current.textContent = "";
  }

  return (
    <div
      ref={frameRef}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="relative aspect-[16/11] overflow-hidden sm:aspect-[21/9]"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#0d1220_0%,#05070f_70%)]" />
      {/* camera optics: scan lines, a vignette, and the viewfinder brackets */}
      <div className="scanlines pointer-events-none absolute inset-0" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.6)_100%)]"
        aria-hidden
      />
      {(["top-2 left-2 border-t border-l", "top-2 right-2 border-t border-r", "bottom-2 left-2 border-b border-l", "right-2 bottom-2 border-r border-b"] as const).map((c) => (
        <span key={c} className={`pointer-events-none absolute h-4 w-4 border-paper/60 ${c}`} aria-hidden />
      ))}

      {/* the street: a kerb line, a lit window, the counting line */}
      <div className="absolute inset-x-0 bottom-[10%] h-px bg-overcast" aria-hidden />
      <span className="absolute top-[14%] left-[27%] h-3 w-2 bg-amber/70" aria-hidden />
      <span className="absolute top-[18%] left-[71%] h-2 w-2 bg-amber/50" aria-hidden />
      <div
        ref={lineRef}
        className="absolute top-0 bottom-0 w-px opacity-45 transition-[opacity,background-color] duration-200"
        style={{ left: `${LINE_X * 100}%`, backgroundColor: "var(--color-paper)" }}
        aria-hidden
      />
      <span
        className="absolute top-2 -translate-x-1/2 font-mono text-[11px] tracking-wide text-paper/70"
        style={{ left: `${LINE_X * 100}%` }}
        aria-hidden
      >
        COUNT LINE
      </span>

      {/* the people being tracked */}
      {WALKERS.map((w, i) => (
        <div
          key={w.id}
          ref={(el) => {
            walkerRefs.current[i] = el;
          }}
          className="absolute top-0 left-0 will-change-transform"
          style={{ visibility: "hidden" }}
          aria-hidden
        >
          {/* the track left behind */}
          <span
            className={`absolute top-1/2 h-px w-[160%] ${
              w.dir === 1
                ? "right-full bg-gradient-to-l from-signal-red-bright/70 to-transparent"
                : "left-full bg-gradient-to-r from-signal-red-bright/70 to-transparent"
            }`}
          />
          <div className="absolute inset-0 border border-paper/85">
            <span className="absolute -top-5 left-0 flex whitespace-nowrap bg-signal-red px-1.5 py-0.5 font-mono text-[11px] font-bold tracking-wide text-white">
              PERSON {w.id}
              <span className="ml-1.5 font-normal opacity-80">{w.conf.toFixed(2)}</span>
            </span>
            <span className="absolute top-[8%] left-1/2 h-[16%] w-[40%] -translate-x-1/2 border border-paper/45" />
          </div>
        </div>
      ))}

      {/* the cursor's crosshair, with frame coordinates */}
      <div
        ref={hairH}
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-paper/25 opacity-0 transition-opacity duration-150"
        aria-hidden
      />
      <div
        ref={hairV}
        className="pointer-events-none absolute inset-y-0 left-0 w-px bg-paper/25 opacity-0 transition-opacity duration-150"
        aria-hidden
      />

      {/* on-screen display */}
      <div className="absolute top-3 left-4 flex items-center gap-2 font-mono text-[11px] tracking-wide text-paper/90">
        <span className="h-1.5 w-1.5 rounded-full bg-signal-red-bright" aria-hidden />
        CAM 04
      </div>
      <div className="absolute top-3 right-4 font-mono text-[11px] tracking-wide text-paper/70">
        {stamp}
      </div>
      <div className="absolute bottom-3 left-4 font-mono text-[11px] tracking-wide text-paper/80">
        IN {String(tally.inn).padStart(2, "0")} · OUT {String(tally.out).padStart(2, "0")}
      </div>
      <span
        ref={coordRef}
        className="absolute right-4 bottom-3 font-mono text-[11px] tracking-wide text-paper/60"
        aria-hidden
      />
    </div>
  );
}

/**
 * UchitVision — "The lens". The factual record is one line of work: a trainee at
 * Uchit Technology supporting model-training and reinforcement-learning
 * workflows for video analytics. The frame is a labeled illustration of the
 * domain (what a tracking overlay does), never presented as footage or output
 * from that work.
 */
export function UchitVision() {
  const reduceMotion = useReducedMotionSafe();

  return (
    <section id="experience" className="surface-night-soft relative overflow-hidden py-28 sm:py-40">
      <ChapterMark n="02" className="-top-[0.12em] -right-[0.1em] text-web-blue-bright/[0.13]" />
      <div className="relative mx-auto max-w-7xl px-8 sm:px-12">
        {/* the title: its own face, cropped like a film title, framed like a camera view */}
        <div className="relative pt-6 pb-4 sm:pt-8">
          {/* corner brackets */}
          {(["top-0 left-0 border-t-2 border-l-2", "top-0 right-0 border-t-2 border-r-2", "bottom-0 left-0 border-b-2 border-l-2", "right-0 bottom-0 border-r-2 border-b-2"] as const).map((c) => (
            <span key={c} className={`absolute h-5 w-5 border-signal-red-bright sm:h-7 sm:w-7 ${c}`} aria-hidden />
          ))}
          <div className="flex flex-col gap-6 px-5 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="font-vision leading-[0.8] font-black tracking-tight text-paper uppercase" aria-label="Video analytics">
              <span aria-hidden className="stroke-text block text-paper/90 [font-size:clamp(4.2rem,17vw,14rem)]">
                VIDEO
              </span>
              <span aria-hidden className="relative -mt-[0.04em] block [font-size:clamp(4.2rem,17vw,14rem)]">
                ANALYTICS
                <span className="scanlines pointer-events-none absolute inset-0" />
              </span>
            </h2>
            {/* marginal annotations: what a camera view prints at its edge */}
            <dl className="mb-2 grid shrink-0 grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-mono text-[11px] tracking-wide text-paper-dim">
              <dt className="text-signal-red-bright">REC</dt>
              <dd className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-signal-red-bright" aria-hidden /> SIMULATED FEED
              </dd>
              <dt>VIEW</dt>
              <dd>CAM 04 · 1920×1080 · 25 FPS</dd>
              <dt>MODE</dt>
              <dd>DETECT / TRACK / COUNT</dd>
              <dt>ROLE</dt>
              <dd>MODEL-TRAINING SUPPORT</dd>
            </dl>
          </div>
        </div>

        <motion.figure data-sense="This tracking view is a drawn illustration animated on this page. It is not footage."
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mt-12 border border-hairline bg-black"
        >
          <TrackingFrame reduceMotion={Boolean(reduceMotion)} />
          <figcaption className="border-t border-hairline px-4 py-2.5 text-xs text-paper-dim">
            An animated illustration of people tracking and counting, drawn for this page. Not
            footage or output from the work below. Move your cursor over it.
          </figcaption>
        </motion.figure>

        <div className="mt-16 grid grid-cols-1 gap-x-16 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="font-vision leading-[0.9] font-black tracking-tight uppercase">
              <span className="block text-signal-red-bright [font-size:clamp(2.4rem,6vw,4.4rem)]">
                {uchit.role}
              </span>
              <span className="stroke-text mt-1 block text-paper/90 [font-size:clamp(1.9rem,4.6vw,3.4rem)]">
                {uchit.company}
              </span>
            </p>
            <p className="mt-4 font-mono text-[11px] tracking-[0.2em] text-paper-dim uppercase">
              {uchit.period} · {uchit.location}
            </p>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-paper/90">
              {uchit.points[0]}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["AI model training", "Reinforcement learning", "Video analytics", "Uchit AI Box"].map(
                (t) => (
                  <Chip key={t}>{t}</Chip>
                )
              )}
            </div>
          </div>

          <div className="lg:col-span-5">
            <p className="text-sm text-paper-dim">How a video-analytics pipeline is usually laid out</p>
            <ol className="mt-4 border-t border-hairline">
              {PIPELINE.map((stage, i) => (
                <li
                  key={stage}
                  className="flex items-baseline justify-between border-b border-hairline py-3 text-paper"
                >
                  <span className="text-lg">{stage}</span>
                  <span className="font-mono text-xs text-paper-dim">{i + 1}/5</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
