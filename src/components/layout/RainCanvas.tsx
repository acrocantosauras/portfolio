"use client";

import { useEffect, useRef } from "react";

type Drop = { x: number; y: number; len: number; speed: number; opacity: number };

export function RainCanvas({ density = 110 }: { density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let drops: Drop[] = [];
    let raf = 0;

    function resize() {
      if (!canvas) return;
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx?.scale(window.devicePixelRatio, window.devicePixelRatio);
      const count = reduceMotion ? 0 : density;
      drops = Array.from({ length: count }, () => spawn());
    }

    function spawn(): Drop {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        len: 10 + Math.random() * 18,
        speed: 5 + Math.random() * 7,
        opacity: 0.08 + Math.random() * 0.22,
      };
    }

    function tick() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = "rgba(200, 210, 235, 1)";
      ctx.lineCap = "round";
      for (const d of drops) {
        ctx.globalAlpha = d.opacity;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 2, d.y + d.len);
        ctx.stroke();
        d.y += d.speed;
        d.x -= 0.6;
        if (d.y > height) {
          d.y = -d.len;
          d.x = Math.random() * width;
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener("resize", resize);
    if (!reduceMotion) {
      raf = requestAnimationFrame(tick);
    }

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
}
