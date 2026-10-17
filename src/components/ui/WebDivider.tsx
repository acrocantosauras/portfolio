import { cn } from "@/lib/utils";

/**
 * A web-thread divider: a main strand sagging across the section break, with
 * attachment threads and anchor nodes — the same strand language as the intro.
 */
export function WebDivider({
  className,
  tone = "mixed",
}: {
  className?: string;
  tone?: "mixed" | "red" | "blue";
}) {
  return (
    <div className={cn("relative h-16 w-full overflow-hidden", className)} aria-hidden>
      <svg
        viewBox="0 0 1200 60"
        preserveAspectRatio="none"
        className="h-full w-full"
      >
        {/* main strand */}
        <path
          d="M0 18 C 180 44, 420 50, 600 44 S 1020 30, 1200 20"
          fill="none"
          stroke="var(--color-hairline)"
          strokeWidth="1.2"
        />
        {/* secondary strands */}
        <path
          d="M0 30 C 220 52, 480 56, 700 48 S 1040 36, 1200 34"
          fill="none"
          stroke="var(--color-hairline)"
          strokeWidth="0.8"
          opacity="0.6"
        />
        {/* attachment threads */}
        <g stroke="var(--color-hairline)" strokeWidth="0.8" opacity="0.75">
          <path d="M150 14 L 190 47" />
          <path d="M380 12 L 420 49" />
          <path d="M600 12 L 600 44" />
          <path d="M820 12 L 780 47" />
          <path d="M1050 14 L 1010 41" />
        </g>
        {/* anchor nodes */}
        <circle cx="190" cy="47" r="2" fill="var(--color-hairline)" />
        <circle cx="420" cy="49" r="2" fill="var(--color-hairline)" />
        <circle cx="600" cy="44" r="2.4" fill="var(--color-gold)" opacity="0.8" />
        <circle cx="780" cy="47" r="2" fill="var(--color-hairline)" />
        <circle cx="1010" cy="41" r="2" fill="var(--color-hairline)" />
        {/* signal accents */}
        {tone !== "blue" && (
          <circle cx="300" cy="47" r="2.6" fill="var(--color-signal-red)" opacity="0.9" />
        )}
        {tone !== "red" && (
          <circle cx="900" cy="38" r="2.6" fill="var(--color-web-blue-bright)" opacity="0.9" />
        )}
      </svg>
    </div>
  );
}
