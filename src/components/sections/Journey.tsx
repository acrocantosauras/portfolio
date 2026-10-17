"use client";

import { motion } from "motion/react";
import { GraduationCap, Award, Building2, FolderGit2 } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { certifications, experience } from "@/data/resume";
import { cn } from "@/lib/utils";

const uchit = experience.find((e) => e.id === "uchit")!;

type Entry = {
  id: string;
  icon: typeof GraduationCap;
  period: string;
  title: string;
  org: string;
  location?: string;
  detail?: string;
  tone: "red" | "blue";
};

const ENTRIES: Entry[] = [
  {
    id: "uchit",
    icon: Building2,
    period: uchit.period,
    title: uchit.role,
    org: uchit.company,
    location: uchit.location,
    detail: uchit.points[0],
    tone: "red",
  },
  {
    id: "independent",
    icon: FolderGit2,
    period: "Aug 2025 – Present",
    title: "Independent Systems Buildout",
    org: "Self-directed",
    detail: "AegisForge, LLM Evaluation Platform, AI Knowledge Assistant, J.A.R.V.I.S. — designed, built and hardened solo.",
    tone: "red",
  },
  {
    id: "edu-degree",
    icon: GraduationCap,
    period: "Aug 2021 – May 2025",
    title: "B.E., Electronics & Telecommunication",
    org: "Shrimati Kashibai Navale College of Engineering",
    location: "Pune, Maharashtra",
    tone: "blue",
  },
  {
    id: "edu-highschool",
    icon: GraduationCap,
    period: "2021",
    title: "Higher Secondary (Science) — 86.66%",
    org: "MGSK Gujarati High School",
    location: "Sangli, Maharashtra",
    tone: "blue",
  },
  ...certifications.map((c, i) => ({
    id: `cert-${i}`,
    icon: Award,
    period: c.org,
    title: c.title,
    org: "Certification",
    tone: "blue" as const,
  })),
];

export function Journey() {
  return (
    <section id="journey" className="relative bg-ink-soft py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <SectionHeading eyebrow="Timeline / Service Record" title="THE JOURNEY" />

        <div className="relative mt-16">
          <div
            className="absolute top-0 bottom-0 left-[19px] w-px bg-gradient-to-b from-signal-red via-hairline to-web-blue sm:left-1/2 sm:-translate-x-1/2"
            aria-hidden
          />

          <ol className="flex flex-col gap-10">
            {ENTRIES.map((item, i) => {
              const Icon = item.icon;
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
                      item.tone === "red"
                        ? "border-signal-red-bright text-signal-red-bright"
                        : "border-web-blue-bright text-web-blue-bright"
                    )}
                  >
                    <Icon size={16} />
                  </div>

                  <div className={cn("hidden sm:block", alignRight && "sm:order-2")} />

                  <div className={cn(!alignRight && "sm:text-right", alignRight && "sm:col-start-2")}>
                    <div
                      className={cn(
                        "inline-block w-full border border-hairline bg-ink-panel/70 p-4 text-left sm:max-w-md",
                        item.tone === "red" ? "hover:border-signal-red/60" : "hover:border-web-blue/60",
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
                      {item.detail && (
                        <p className="mt-2 text-xs leading-relaxed text-paper/85">{item.detail}</p>
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
