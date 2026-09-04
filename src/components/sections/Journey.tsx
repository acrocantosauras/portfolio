"use client";

import { motion } from "motion/react";
import { GraduationCap, Award, Briefcase } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { timeline } from "@/data/resume";
import { cn } from "@/lib/utils";

const ICONS = {
  education: GraduationCap,
  certification: Award,
  experience: Briefcase,
} as const;

const TONE = {
  education: "blue",
  certification: "red",
  experience: "red",
} as const;

export function Journey() {
  return (
    <section id="journey" className="relative bg-ink-soft py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <SectionHeading eyebrow="File 003 / Case Board" title="THE JOURNEY" />

        <div className="relative mt-16">
          <div
            className="absolute top-0 bottom-0 left-[19px] w-px bg-gradient-to-b from-signal-red via-hairline to-web-blue sm:left-1/2 sm:-translate-x-1/2"
            aria-hidden
          />

          <ol className="flex flex-col gap-10">
            {timeline.map((item, i) => {
              const Icon = ICONS[item.kind];
              const tone = TONE[item.kind];
              const alignRight = i % 2 === 1;
              return (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
                  className={cn(
                    "relative flex items-start gap-5 pl-12 sm:pl-0",
                    "sm:grid sm:grid-cols-2 sm:gap-10"
                  )}
                >
                  <div
                    className={cn(
                      "absolute top-1 left-0 z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-ink sm:left-1/2 sm:-translate-x-1/2",
                      tone === "red" ? "border-signal-red-bright text-signal-red-bright" : "border-web-blue-bright text-web-blue-bright"
                    )}
                  >
                    <Icon size={16} />
                  </div>

                  <div className={cn("hidden sm:block", alignRight && "sm:order-2")} />

                  <div className={cn(!alignRight && "sm:text-right", alignRight && "sm:col-start-2")}>
                    <div
                      className={cn(
                        "inline-block w-full border border-hairline bg-ink-panel/70 p-4 text-left sm:max-w-md",
                        tone === "red" ? "hover:border-signal-red/60" : "hover:border-web-blue/60",
                        "transition-colors"
                      )}
                    >
                      <p className="font-mono text-[10px] tracking-[0.25em] text-paper-dim uppercase">
                        {item.period}
                      </p>
                      <p className="mt-1 font-display text-xl tracking-wide text-paper">
                        {item.title}
                      </p>
                      <p className="text-sm text-paper-dim">
                        {item.org}
                        {item.location ? ` · ${item.location}` : ""}
                      </p>
                      {item.bullets && (
                        <ul className="mt-2 flex flex-col gap-1.5">
                          {item.bullets.map((b, bi) => (
                            <li key={bi} className="text-xs leading-relaxed text-paper/85">
                              {b}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
