import { cn } from "@/lib/utils";

/**
 * A seam of the suit between chapters: cloth with a clear sheen and raised black
 * web lines. Decorative, so hidden from assistive tech.
 */
export function SuitStrip({
  tone = "red",
  className,
}: {
  tone?: "red" | "blue";
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "h-3 w-full sm:h-4",
        tone === "red" ? "suit-weave" : "suit-weave-blue",
        className
      )}
    />
  );
}
