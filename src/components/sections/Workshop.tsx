"use client";

import { motion } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Chip } from "@/components/ui/Chip";
import { WebCorner } from "@/components/ui/WebCorner";
import { skillGroups } from "@/data/resume";
import { cn } from "@/lib/utils";

export function Workshop() {
  const featured = skillGroups.filter((g) => g.featured);
  const others = skillGroups.filter((g) => !g.featured);

  return (
    <section id="workshop" className="relative overflow-hidden bg-ink py-24 sm:py-32">
      <WebCorner
        anchor="bl"
        className="absolute -bottom-4 -left-4 h-[30vmin] w-[30vmin] text-web-blue-bright/[0.06]"
        strokeWidth={0.7}
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow="Skills / Capability Matrix" title="THE ARSENAL" />

        {/* featured groups — larger, interactive */}
        <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {featured.map((group, i) => (
            <motion.div
              key={group.id}
              data-sense="true"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: (i % 2) * 0.08 }}
              className="group relative border border-hairline bg-ink-panel/60 p-5 transition-colors hover:border-signal-red/50 sm:p-6"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.3em] text-web-blue-bright uppercase">
                    MOD.{String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-1 font-display text-2xl tracking-wide text-paper sm:text-3xl">
                    {group.label}
                  </h3>
                </div>
                <span className="mt-1 shrink-0 font-mono text-[10px] text-paper-dim">
                  {String(group.items.length).padStart(2, "0")} modules
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item, j) => (
                  <motion.span
                    key={item}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.3, delay: j * 0.03 }}
                    className="inline-block"
                  >
                    <Chip tone={j === 0 ? "blue" : "default"}>{item}</Chip>
                  </motion.span>
                ))}
              </div>
              <span
                className="absolute top-0 left-0 h-full w-[3px] scale-y-0 bg-signal-red-bright transition-transform duration-300 group-hover:scale-y-100"
                aria-hidden
              />
            </motion.div>
          ))}
        </div>

        {/* other groups — compact strips */}
        <div className="mt-8 flex flex-col gap-3">
          {others.map((group, i) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={cn(
                "flex flex-col gap-2 border border-l-2 border-hairline bg-ink-panel/40 px-5 py-3.5 transition-colors sm:flex-row sm:items-center sm:gap-6",
                i % 2 === 0
                  ? "border-l-signal-red/60"
                  : "border-l-web-blue-bright/50"
              )}
            >
              <span className="w-40 shrink-0 font-mono text-[11px] tracking-[0.25em] text-paper-dim uppercase">
                {group.label}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <Chip key={item} className="text-[10px]">
                    {item}
                  </Chip>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
