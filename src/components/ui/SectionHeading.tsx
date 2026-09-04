"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  align = "left",
  className,
}: {
  eyebrow: string;
  title: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="mb-2 font-mono text-xs tracking-[0.35em] text-signal-red uppercase"
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="font-display text-5xl leading-[0.95] tracking-wide text-paper sm:text-6xl md:text-7xl"
      >
        {title}
      </motion.h2>
    </div>
  );
}
