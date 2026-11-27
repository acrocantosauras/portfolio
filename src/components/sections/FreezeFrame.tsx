"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { HEARTBEAT_TIMEOUT, type Run } from "@/lib/aegis-sim";

/** How long the "resumed" caption stays up after the claim is recovered. */
const RESUMED_MS = 1800;

/**
 * The freeze: while a crashed worker's task is orphaned, the page holds still and
 * drains of colour, with broken strands hanging in mid-air. Only the pointer still
 * moves them. It lifts the moment the simulator recovers the claim, so its length
 * is the heartbeat timeout, not a decorative delay. An original effect, inspired
 * by the film's frozen-city moment.
 *
 * It never captures the pointer, never flashes, and under reduced motion it is a
 * still tint with the same caption.
 */
export function FreezeFrame({
  run,
  inView,
  reduceMotion,
}: {
  run: Run | null;
  inView: boolean;
  reduceMotion: boolean;
}) {
  const orphaned = run ? Object.values(run.tasks).some((t) => t.status === "orphaned") : false;
  const frozen = orphaned && inView;
  const dead = run?.workers.find((w) => !w.alive && w.downSince !== null);
  const silent =
    run && dead && dead.downSince !== null
      ? Math.min(HEARTBEAT_TIMEOUT, Math.max(0, run.t - dead.downSince))
      : 0;

  // "resumed" caption: shown briefly each time the recovery counter goes up
  const recoveries = run?.recoveries ?? 0;
  const [seen, setSeen] = useState(0);
  const resumed = recoveries > seen && inView;
  useEffect(() => {
    if (recoveries === seen) return;
    // a reset run drops the counter back to zero: catch up at once
    const id = window.setTimeout(() => setSeen(recoveries), recoveries > seen ? RESUMED_MS : 0);
    return () => window.clearTimeout(id);
  }, [recoveries, seen]);

  // hold every CSS animation on the page while frozen
  useEffect(() => {
    if (!frozen) return;
    const root = document.documentElement;
    root.classList.add("is-frozen");
    return () => root.classList.remove("is-frozen");
  }, [frozen]);

  if (!frozen && !resumed) return null;

  return createPortal(
    <>
      {frozen && (
        <div aria-hidden className="freeze-veil pointer-events-none fixed inset-0 z-[120]">
          {!reduceMotion && <Shards />}
        </div>
      )}
      <div
        role="status"
        className="pointer-events-none fixed inset-x-0 bottom-14 z-[121] flex justify-center px-4"
      >
        {frozen ? (
          <p className="border border-signal-red-bright bg-ink px-4 py-2.5 text-center font-mono text-xs leading-relaxed tracking-wide text-paper">
            <span className="font-bold tracking-[0.2em] text-signal-red-bright">FROZEN</span>
            {" · "}
            {dead?.id ?? "worker"} lost
            {/* the countdown is visual only, so screen readers hear one message */}
            <span aria-hidden>
              {" · no heartbeat "}
              {(silent / 1000).toFixed(1)}s / {(HEARTBEAT_TIMEOUT / 1000).toFixed(1)}s
            </span>
            <span className="block text-paper-dim">Simulation: waiting to recover its task</span>
          </p>
        ) : (
          <p className="border border-web-blue-bright bg-ink px-4 py-2.5 text-center font-mono text-xs leading-relaxed tracking-wide text-paper">
            <span className="font-bold tracking-[0.2em] text-web-blue-bright">RESUMED</span>
            {" · task re-queued"}
            <span className="block text-paper-dim">
              {run?.checkpoints ?? 0} checkpointed task{run?.checkpoints === 1 ? "" : "s"} not re-run
            </span>
          </p>
        )}
      </div>
    </>,
    document.body
  );
}

type Shard = {
  x: number;
  y: number;
  angle: number;
  len: number;
  sag: number;
  ox: number;
  oy: number;
  red: boolean;
};

/** Broken strands stopped in mid-air. Static, except that the pointer nudges them. */
function Shards() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const count = Math.round(Math.min(110, (width * height) / 11000));
    const shards: Shard[] = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      angle: Math.random() * Math.PI,
      len: 8 + Math.random() * 34,
      sag: (Math.random() - 0.5) * 14,
      ox: 0,
      oy: 0,
      red: i % 7 === 0,
    }));

    let px = -999;
    let py = -999;
    let raf = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      let moving = false;
      for (const s of shards) {
        const dx = s.x - px;
        const dy = s.y - py;
        const d = Math.hypot(dx, dy);
        const push = d < 130 ? (1 - d / 130) * 34 : 0;
        const tx = push ? (dx / (d || 1)) * push : 0;
        const ty = push ? (dy / (d || 1)) * push : 0;
        s.ox += (tx - s.ox) * 0.18;
        s.oy += (ty - s.oy) * 0.18;
        if (Math.abs(tx - s.ox) + Math.abs(ty - s.oy) > 0.2) moving = true;

        const cx = s.x + s.ox;
        const cy = s.y + s.oy;
        const hx = (Math.cos(s.angle) * s.len) / 2;
        const hy = (Math.sin(s.angle) * s.len) / 2;
        const colour = s.red ? "rgba(255,84,69,0.95)" : "rgba(236,230,216,0.6)";
        ctx.beginPath();
        ctx.moveTo(cx - hx, cy - hy);
        ctx.quadraticCurveTo(cx - hy * 0.2, cy + s.sag, cx + hx, cy + hy);
        ctx.strokeStyle = colour;
        ctx.lineWidth = s.red ? 1.6 : 1;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx + hx, cy + hy, 1.4, 0, Math.PI * 2);
        ctx.fillStyle = colour;
        ctx.fill();
      }
      raf = moving ? requestAnimationFrame(draw) : 0;
    };

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!raf) raf = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={ref} className="h-full w-full" />;
}
