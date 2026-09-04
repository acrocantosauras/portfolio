import { cn } from "@/lib/utils";

export function WebDivider({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-16 w-full overflow-hidden", className)} aria-hidden>
      <svg
        viewBox="0 0 1200 60"
        preserveAspectRatio="none"
        className="h-full w-full opacity-40"
      >
        <path
          d="M0 30 C 150 10, 300 50, 450 28 S 750 8, 900 32 S 1100 50, 1200 28"
          fill="none"
          stroke="var(--color-hairline)"
          strokeWidth="1"
        />
        <path
          d="M0 40 C 200 55, 400 15, 600 34 S 900 55, 1200 20"
          fill="none"
          stroke="var(--color-hairline)"
          strokeWidth="1"
        />
        <circle cx="450" cy="28" r="2.5" fill="var(--color-signal-red)" />
        <circle cx="900" cy="32" r="2.5" fill="var(--color-web-blue)" />
      </svg>
    </div>
  );
}
