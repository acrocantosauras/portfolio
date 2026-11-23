import { cn } from "@/lib/utils";

/**
 * Original monogram. Draws in `currentColor`, so it follows the surrounding
 * text colour (light on night surfaces, dark on the morning ones). Set
 * `--mark-bg` on a parent when it sits on a light surface.
 */
export function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={cn("h-8 w-8", className)}
      aria-hidden
    >
      <rect x="1" y="1" width="38" height="38" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path
        d="M4 20 H14 M26 20 H36 M20 4 V14 M20 26 V36 M9 9 L16 16 M24 24 L31 31 M31 9 L24 16 M16 24 L9 31"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.35"
      />
      <circle
        cx="20"
        cy="20"
        r="7"
        fill="var(--mark-bg, var(--color-ink))"
        stroke="var(--color-signal-red-bright)"
        strokeWidth="1.5"
      />
      <text
        x="20"
        y="24"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontSize="11"
        fill="currentColor"
      >
        MJ
      </text>
    </svg>
  );
}
