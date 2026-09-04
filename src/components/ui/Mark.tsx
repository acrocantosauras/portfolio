import { cn } from "@/lib/utils";

/** Original circuit-web monogram — not derived from any existing brand mark. */
export function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={cn("h-8 w-8", className)}
      aria-hidden
    >
      <rect x="1" y="1" width="38" height="38" stroke="var(--color-paper)" strokeWidth="1.5" fill="none" />
      <path
        d="M4 20 H14 M26 20 H36 M20 4 V14 M20 26 V36 M9 9 L16 16 M24 24 L31 31 M31 9 L24 16 M16 24 L9 31"
        stroke="var(--color-hairline)"
        strokeWidth="1"
      />
      <circle cx="20" cy="20" r="7" fill="var(--color-ink)" stroke="var(--color-signal-red)" strokeWidth="1.5" />
      <text
        x="20"
        y="24"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontSize="11"
        fill="var(--color-paper)"
      >
        MJ
      </text>
      <circle cx="14" cy="20" r="1.4" fill="var(--color-web-blue-bright)" />
      <circle cx="26" cy="20" r="1.4" fill="var(--color-web-blue-bright)" />
    </svg>
  );
}
