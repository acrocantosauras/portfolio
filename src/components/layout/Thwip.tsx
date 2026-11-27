"use client";

import { useEffect, useRef, useState } from "react";
import { drawOrganicStrand, STRAND_LIFE, type OrganicStrand } from "@/lib/organic-web";

const WORD = "thwip";

/**
 * An Easter egg: type "thwip" anywhere and two strands shoot up from the bottom
 * corners to wherever the pointer is. Ignored while typing in a field. Never
 * captures the pointer; under reduced motion the strands simply appear.
 */
export function Thwip() {
  const [shot, setShot] = useState<{ x: number; y: number; id: number } | null>(null);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const typed = useRef("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current = { x: e.clientX, y: e.clientY };
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1) return;
      if ((e.target as Element | null)?.closest?.("input, textarea, [contenteditable=true]")) return;
      typed.current = (typed.current + e.key.toLowerCase()).slice(-WORD.length);
      if (typed.current !== WORD) return;
      typed.current = "";
      const at = pointer.current ?? { x: window.innerWidth / 2, y: window.innerHeight * 0.42 };
      setShot({ ...at, id: Date.now() });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!shot || !canvas || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const born = performance.now();
    const strands: OrganicStrand[] = [
      { fx: -8, fy: height + 8, tx: shot.x - 14, ty: shot.y, born, seed: shot.id % 997 },
      { fx: width + 8, fy: height + 8, tx: shot.x + 14, ty: shot.y + 6, born: born + 70, seed: shot.id % 883 },
    ];

    let raf = 0;
    const frame = (now: number) => {
      ctx.clearRect(0, 0, width, height);
      for (const s of strands) if (now >= s.born) drawOrganicStrand(ctx, s, now);
      if (now - born < STRAND_LIFE + 100) raf = requestAnimationFrame(frame);
    };
    if (reduce) strands.forEach((s) => drawOrganicStrand(ctx, s, born, true));
    else raf = requestAnimationFrame(frame);
    const done = window.setTimeout(() => setShot(null), reduce ? 2200 : STRAND_LIFE);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(done);
    };
  }, [shot]);

  if (!shot) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[140]">
      <canvas ref={canvasRef} className="h-full w-full" aria-hidden />
      <p
        role="status"
        className="absolute -translate-x-1/2 -translate-y-full -rotate-6 font-display text-6xl tracking-wide"
        style={{
          left: Math.min(Math.max(shot.x, 110), (typeof window === "undefined" ? 800 : window.innerWidth) - 110),
          top: Math.max(shot.y - 26, 90),
        }}
      >
        <span className="accent-comic">THWIP!</span>
      </p>
    </div>
  );
}
