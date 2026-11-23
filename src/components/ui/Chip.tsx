import { cn } from "@/lib/utils";

/** Small plain-text tag. Sans, not mono — mono is reserved for real data. */
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
        "inline-flex items-center border px-2.5 py-1 text-xs leading-none tracking-wide",
        tone === "default" && "border-hairline text-paper-dim",
        tone === "red" && "border-signal-red/60 text-signal-red-bright",
        tone === "blue" && "border-web-blue text-web-blue-bright",
        className
      )}
    >
      {children}
    </span>
  );
}
