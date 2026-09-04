import { cn } from "@/lib/utils";

export function Chip({
  children,
  tone = "default",
  className,
}: {
  children: React.ReactNode;
  tone?: "default" | "red" | "blue";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center border font-mono text-[11px] tracking-wide uppercase px-2.5 py-1",
        tone === "default" &&
          "border-hairline bg-ink-soft/60 text-paper-dim",
        tone === "red" &&
          "border-signal-red/60 bg-signal-red/10 text-signal-red-bright",
        tone === "blue" &&
          "border-web-blue/60 bg-web-blue/10 text-web-blue-bright",
        className
      )}
    >
      {children}
    </span>
  );
}
