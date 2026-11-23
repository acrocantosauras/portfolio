import { cn } from "@/lib/utils";

/**
 * A chapter number, set as an oversized outlined letterform that the section
 * crops. The numbers are real: they follow the run from the first chapter at
 * night to the last at morning. Decorative, so hidden from assistive tech.
 * The parent section needs `relative overflow-hidden`.
 */
export function ChapterMark({
  n,
  className,
}: {
  n: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "stroke-text pointer-events-none absolute font-display leading-[0.8] select-none [font-size:clamp(14rem,34vw,34rem)]",
        className
      )}
    >
      {n}
    </span>
  );
}
