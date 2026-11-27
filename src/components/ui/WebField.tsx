"use client";

import { useEffect, useRef, type RefObject } from "react";
import { drawOrganicStrand, STRAND_LIFE, type OrganicStrand } from "@/lib/organic-web";

type Node = { rx: number; ry: number; x: number; y: number; vx: number; vy: number };

const RADIALS = [98, 112, 126, 141, 156, 172]; // degrees; pointing down-left from the corner
const RINGS = [0.14, 0.27, 0.42, 0.59, 0.78, 1];
const PULL_RADIUS = 170;

/**
 * An interactive spiderweb for the hero. It is anchored to the top-right corner
 * and hangs into the frame. Near the cursor the strands are tugged toward it
 * and spring back; clicking anywhere in the hero fires an organic strand from the
 * nearest lower corner that sticks where you aimed, sags and fades.
 *
 * It runs only while there is something to animate (pointer nearby, strands in
 * flight, nodes still settling), only while the hero is on screen, and renders a
 * single still frame for reduced motion. Geometry is deterministic.
 */
export function WebField({ targetRef }: { targetRef: RefObject<HTMLElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const target = targetRef.current;
    if (!canvas || !target) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0;
    let H = 0;
    let dpr = 1;
    let nodes: Node[][] = [];
    let anchor = { x: 0, y: 0 };
    const strands: OrganicStrand[] = [];
    const pointer = { x: -9999, y: -9999, active: false };
    let raf = 0;
    let running = false;
    let visible = true;

    function build() {
      if (!canvas) return;
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      anchor = { x: W + 10, y: -10 };
      const R = Math.hypot(W, H) * 0.62;
      nodes = RINGS.map((f) =>
        RADIALS.map((deg) => {
          const a = (deg * Math.PI) / 180;
          const x = anchor.x + Math.cos(a) * R * f;
          const y = anchor.y + Math.sin(a) * R * f;
          return { rx: x, ry: y, x, y, vx: 0, vy: 0 };
        })
      );
    }

    function step() {
      let energy = 0;
      for (const ring of nodes) {
        for (const n of ring) {
          let ax = (n.rx - n.x) * 0.06;
          let ay = (n.ry - n.y) * 0.06;
          if (pointer.active) {
            const dx = pointer.x - n.x;
            const dy = pointer.y - n.y;
            const d = Math.hypot(dx, dy);
            if (d < PULL_RADIUS && d > 1) {
              const f = (1 - d / PULL_RADIUS) * 1.5;
              ax += (dx / d) * f;
              ay += (dy / d) * f;
            }
          }
          n.vx = (n.vx + ax) * 0.86;
          n.vy = (n.vy + ay) * 0.86;
          n.x += n.vx;
          n.y += n.vy;
          energy += Math.abs(n.vx) + Math.abs(n.vy) + Math.abs(n.rx - n.x) + Math.abs(n.ry - n.y);
        }
      }
      return energy;
    }

    function drawWeb() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(236, 230, 216, 0.34)";
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      // radials
      for (let j = 0; j < RADIALS.length; j++) {
        ctx.beginPath();
        ctx.moveTo(anchor.x, anchor.y);
        for (let i = 0; i < RINGS.length; i++) ctx.lineTo(nodes[i][j].x, nodes[i][j].y);
        ctx.stroke();
      }
      // rings: strands sag toward the anchor between radials
      for (let i = 0; i < RINGS.length; i++) {
        for (let j = 0; j < RADIALS.length - 1; j++) {
          const a = nodes[i][j];
          const b = nodes[i][j + 1];
          const mx = (a.x + b.x) / 2;
          const my = (a.y + b.y) / 2;
          const cx = anchor.x + (mx - anchor.x) * 0.86;
          const cy = anchor.y + (my - anchor.y) * 0.86;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.quadraticCurveTo(cx, cy, b.x, b.y);
          ctx.stroke();
        }
      }
    }

    function drawStrands(now: number) {
      if (!ctx) return;
      for (let i = strands.length - 1; i >= 0; i--) {
        if (now - strands[i].born > STRAND_LIFE) strands.splice(i, 1);
        else drawOrganicStrand(ctx, strands[i], now);
      }
    }

    function frame(now: number) {
      raf = 0;
      if (!visible) {
        running = false;
        return;
      }
      const energy = step();
      drawWeb();
      drawStrands(now);
      if (pointer.active || strands.length > 0 || energy > 0.6) {
        raf = requestAnimationFrame(frame);
      } else {
        running = false;
      }
    }

    function kick() {
      if (reduce || running || !visible) return;
      running = true;
      raf = requestAnimationFrame(frame);
    }

    function local(e: PointerEvent) {
      const r = canvas!.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    }

    function onMove(e: PointerEvent) {
      if (e.pointerType === "touch") return;
      const p = local(e);
      pointer.x = p.x;
      pointer.y = p.y;
      pointer.active = true;
      kick();
    }
    function onLeave() {
      pointer.active = false;
      kick();
    }
    function onDown(e: PointerEvent) {
      if ((e.target as Element).closest("a, button, [role=button], input, textarea")) return;
      const p = local(e);
      const fromLeft = p.x < W / 2;
      if (strands.length >= 6) strands.shift();
      // fired from the lower corners, as if from a raised wrist
      strands.push({
        fx: fromLeft ? -8 : W + 8,
        fy: H * 0.92,
        tx: p.x,
        ty: p.y,
        born: performance.now(),
        seed: Math.round(p.x * 7 + p.y * 13) % 997,
      });
      kick();
    }

    build();
    drawWeb();

    const ro = new ResizeObserver(() => {
      build();
      drawWeb();
    });
    ro.observe(canvas);

    let io: IntersectionObserver | undefined;
    if (!reduce) {
      target.addEventListener("pointermove", onMove);
      target.addEventListener("pointerleave", onLeave);
      target.addEventListener("pointerdown", onDown);
      io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) kick();
        else {
          cancelAnimationFrame(raf);
          running = false;
        }
      });
      io.observe(target);
    }

    return () => {
      ro.disconnect();
      io?.disconnect();
      cancelAnimationFrame(raf);
      target.removeEventListener("pointermove", onMove);
      target.removeEventListener("pointerleave", onLeave);
      target.removeEventListener("pointerdown", onDown);
    };
  }, [targetRef]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
}
