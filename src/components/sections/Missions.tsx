"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Chip } from "@/components/ui/Chip";
import { projects, type Project } from "@/data/resume";
import { ProjectDossier } from "./ProjectDossier";
import { cn } from "@/lib/utils";

export function Missions() {
  const [active, setActive] = useState<Project | null>(null);
  const [flagship, ...rest] = projects;

  return (
    <section id="missions" className="relative bg-ink-soft py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow="File 005 / Active Missions" title="THE MISSIONS" />

        <div className="mt-14 flex flex-col gap-6">
          <MissionCard project={flagship} large onOpen={setActive} />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {rest.map((p) => (
              <MissionCard key={p.slug} project={p} onOpen={setActive} />
            ))}
          </div>
        </div>
      </div>

      <ProjectDossier project={active} onClose={() => setActive(null)} />
    </section>
  );
}

function MissionCard({
  project,
  large,
  onOpen,
}: {
  project: Project;
  large?: boolean;
  onOpen: (p: Project) => void;
}) {
  return (
    <motion.button
      type="button"
      data-sense="true"
      onClick={() => onOpen(project)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className={cn(
        "group relative w-full border-2 border-hairline bg-ink-panel/70 p-6 text-left transition-colors hover:border-signal-red-bright sm:p-8",
        large && "sm:p-10"
      )}
    >
      {project.status === "flagship" && (
        <span className="absolute top-0 right-0 border-b-2 border-l-2 border-signal-red-bright bg-signal-red px-3 py-1 font-mono text-[10px] font-bold tracking-[0.25em] text-paper uppercase">
          Flagship
        </span>
      )}

      <p className="font-mono text-[10px] tracking-[0.3em] text-paper-dim uppercase">
        {project.codename} · {project.period}
      </p>

      <h3
        className={cn(
          "mt-2 font-display tracking-wide text-paper",
          large ? "text-4xl sm:text-6xl" : "text-3xl sm:text-4xl"
        )}
      >
        {project.title}
      </h3>

      <p className={cn("mt-3 text-paper-dim", large ? "max-w-2xl text-base sm:text-lg" : "text-sm")}>
        {project.oneLiner}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {project.stack.slice(0, large ? 9 : 5).map((s) => (
          <Chip key={s}>{s}</Chip>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-web-blue-bright uppercase">
        Open Dossier
        <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </motion.button>
  );
}
