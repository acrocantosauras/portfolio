"use client";

const COLS = 12;
const ROWS = 15;

/** A fixed scatter order, so the server and the browser agree on it. */
const ORDER = Array.from({ length: COLS * ROWS }, (_, i) => {
  const v = Math.sin((i + 1) * 91.7) * 43758.5453;
  return v - Math.floor(v);
});

/**
 * Tiles that cover the portrait one by one while it is "forgotten", and lift
 * again when it is remembered. Under reduced motion they change all at once.
 */
export function ForgetTiles({ active }: { active: boolean }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[3] grid"
      style={{
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        gridTemplateRows: `repeat(${ROWS}, 1fr)`,
      }}
    >
      {ORDER.map((n, i) => (
        <span
          key={i}
          className="forget-tile bg-ink-soft"
          style={{
            // a hair of overlap hides the seams between tiles
            outline: "1px solid var(--color-ink-soft)",
            opacity: active ? 1 : 0,
            transitionDelay: `${Math.round(n * 900)}ms`,
          }}
        />
      ))}
    </div>
  );
}
