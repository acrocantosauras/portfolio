"use client";

import { motion } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Chip } from "@/components/ui/Chip";
import { skillGroups } from "@/data/resume";

export function Workshop() {
  return (
    <section id="workshop" className="relative bg-ink py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow="File 004 / Workshop" title="THE UTILITY BELT" />
        <p className="mt-4 max-w-xl text-sm text-paper-dim sm:text-base">
          Every tool that&rsquo;s earned a permanent slot — grouped the way they actually
          get reached for, not alphabetized for show.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group, i) => (
            <motion.div
              key={group.id}
              data-sense="true"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="group relative border border-hairline bg-ink-panel/60 p-5 transition-colors hover:border-signal-red/50"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-[0.25em] text-web-blue-bright uppercase">
                  {group.codename}
                </span>
                <span className="font-mono text-[10px] text-paper-dim">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="font-display text-2xl tracking-wide text-paper">
                {group.label}
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <Chip key={item}>{item}</Chip>
                ))}
              </div>
              <span
                className="absolute top-0 left-0 h-full w-[3px] scale-y-0 bg-signal-red-bright transition-transform duration-300 group-hover:scale-y-100"
                aria-hidden
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
