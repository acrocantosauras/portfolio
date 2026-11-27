"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Eye, EyeOff } from "lucide-react";

const HOLD_MS = 550;
const NOTE_W = 260;

type Mark = { key: string; text: string; top: number; left: number; width: number; height: number; noteTop: number; noteLeft: number };

/** Reads every [data-sense] element on screen and places its note without overlaps. */
function readMarks(): Mark[] {
  const vw = document.documentElement.clientWidth;
  const vh = window.innerHeight;
  const marks: Mark[] = [];
  let floor = 84; // below the header
  const found = Array.from(document.querySelectorAll<HTMLElement>("[data-sense]"))
    .map((el) => ({ el, r: el.getBoundingClientRect() }))
    .filter(({ r }) => r.width > 0 && r.bottom > 140 && r.top < vh - 150)
    .sort((a, b) => a.r.top - b.r.top);

  for (const { el, r } of found) {
    const text = el.dataset.sense ?? "";
    const top = Math.max(r.top, 72);
    const width = Math.min(NOTE_W, vw - 24);
    const noteTop = Math.max(top + 12, floor);
    if (noteTop > vh - 120) continue;
    floor = noteTop + 112;
    marks.push({
      key: `${marks.length}-${text}`,
      text,
      top,
      left: Math.max(r.left, 6),
      width: Math.min(r.right, vw - 6) - Math.max(r.left, 6),
      height: Math.min(r.bottom, vh - 6) - top,
      noteTop,
      noteLeft: Math.min(Math.max(r.left + 12, 12), vw - width - 12),
    });
  }
  return marks;
}

/**
 * Heightened senses: the page dims and notes about how each part was built light
 * up. Hold Shift (on its own) to look, or use the button to keep it on; Escape
 * turns it off. Inspired by the film's heightened senses; the notes are plain
 * facts about this site.
 */
export function HeightenedSenses() {
  const [pinned, setPinned] = useState(false);
  const [held, setHeld] = useState(false);
  const [marks, setMarks] = useState<Mark[]>([]);
  const on = pinned || held;

  useEffect(() => {
    let timer = 0;
    const release = () => {
      window.clearTimeout(timer);
      timer = 0;
      setHeld(false);
    };
    const down = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPinned(false);
        release();
        return;
      }
      if (e.key !== "Shift") {
        // Shift is being used to type or select, not to look around
        release();
        return;
      }
      if (e.repeat || timer) return;
      if ((e.target as Element | null)?.closest?.("input, textarea, [contenteditable=true]")) return;
      timer = window.setTimeout(() => setHeld(true), HOLD_MS);
    };
    const up = (e: KeyboardEvent) => {
      if (e.key === "Shift") release();
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", release);
    window.addEventListener("pointerdown", release);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", release);
      window.removeEventListener("pointerdown", release);
    };
  }, []);

  useEffect(() => {
    if (!on) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      setMarks(readMarks());
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    queue();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
    };
  }, [on]);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setPinned((v) => !v);
          setHeld(false);
        }}
        aria-pressed={on}
        aria-label="Heightened senses"
        title="Heightened senses (or hold Shift)"
        className={`fixed bottom-6 left-3 z-[131] inline-flex h-11 min-w-11 items-center justify-center gap-2 border px-3 font-mono text-[11px] tracking-[0.16em] transition-colors sm:left-6 ${
          on
            ? "border-signal-red-bright bg-signal-red-deep text-white"
            : "border-paper/40 bg-ink/85 text-paper hover:border-signal-red-bright"
        }`}
      >
        {on ? <EyeOff size={15} aria-hidden /> : <Eye size={15} aria-hidden />}
        <span className="hidden sm:inline">SENSES</span>
      </button>

      {on &&
        createPortal(
          <div className="senses pointer-events-none fixed inset-0 z-[130]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(4,6,13,0.55),rgba(0,0,0,0.86))]" aria-hidden />
            <p role="status" className="sr-only">
              Heightened senses on. {marks.length} {marks.length === 1 ? "note" : "notes"} on this screen.
            </p>
            {marks.map((m) => (
              <div key={m.key}>
                <span
                  aria-hidden
                  className="senses-ring absolute border border-signal-red-bright"
                  style={{ top: m.top, left: m.left, width: m.width, height: m.height }}
                />
                <p
                  className="senses-note absolute border border-signal-red-bright bg-ink px-3 py-2.5 font-mono text-xs leading-relaxed text-paper"
                  style={{ top: m.noteTop, left: m.noteLeft, width: `min(${NOTE_W}px, calc(100vw - 24px))` }}
                >
                  {m.text}
                </p>
              </div>
            ))}
            {marks.length === 0 && (
              <p className="absolute inset-x-4 top-1/2 text-center font-mono text-xs tracking-wide text-paper">
                Nothing hidden on this screen. Keep scrolling.
              </p>
            )}
          </div>,
          document.body
        )}
    </>
  );
}
