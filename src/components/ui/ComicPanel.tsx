import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function ComicPanel({
  children,
  className,
  accent = "red",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  accent?: "red" | "blue" | "none";
  as?: "div" | "article" | "section";
}) {
  return (
    <Tag
      className={cn(
        "relative border-2 border-paper/90 bg-ink-panel/90",
        accent === "red" && "shadow-[6px_6px_0_0_var(--color-signal-red)]",
        accent === "blue" && "shadow-[6px_6px_0_0_var(--color-web-blue)]",
        className
      )}
    >
      {children}
    </Tag>
  );
}
