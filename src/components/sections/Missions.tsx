"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Boxes } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Chip } from "@/components/ui/Chip";
import { WebCorner } from "@/components/ui/WebCorner";
import { projects, type Project } from "@/data/resume";
import { ProjectDossier } from "./ProjectDossier";
import { cn } from "@/lib/utils";

export function Missions() {
  const [active, setActive] = useState<Project | null>(null);
  // flagship (AegisForge) already has its own hero section; keep hierarchy but list all
  const [aegis, ...rest] = projects;

  return (
    <section id="missions" className="relative overflow-hidden bg-ink-soft py-24 sm:py-32">
      <WebCorner
        anchor="br"
        className="absolute -right-4 -bottom-4 h-[32vmin] w-[32vmin] text-signal-red/[0.07]"
        strokeWidth={0.7}
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading eyebrow="SYS / Index" title="SYSTEM REGISTRY" />
          <p className="font-mono text-[11px] tracking-[0.3em] text-paper-dim uppercase">
            {projects.length} systems · select to open dossier
          </p>
        </div>

        <div className="mt-14 flex flex-col gap-5">
          {/* flagship row — reduced weight since AegisForge has its own section */}
          <motion.div
            initial={{ opacity: 0, y: 24, rotateX: 4, transformPerspective: 900 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55 }}
          >
            <MissionCard project={aegis} compact onOpen={setActive} />
          </motion.div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {rest.map((p, i) => (
              <motion.div
                key={p.slug}
                initial={{ opacity: 0, y: 24, rotateX: 5, transformPerspective: 900 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 2) * 0.08 }}
              >
                <MissionCard project={p} onOpen={setActive} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <ProjectDossier project={active} onClose={() => setActive(null)} />
    </section>
  );
}

function MiniArchitecture({ project }: { project: Project }) {
  const nodes = project.architecture.nodes.slice(0, 6);
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-3 opacity-[0.13] transition-opacity duration-300 group-hover:opacity-30" aria-hidden>
      {nodes.map((n, i) => (
        <div key={n.id} className="flex items-center gap-3">
          {i > 0 && <span className="h-px w-6 bg-paper sm:w-10" />}
          <span className="border border-paper px-2 py-1 font-mono text-[8px] tracking-[0.15em] uppercase sm:text-[9px]">
            {n.label.split(" ")[0]}
          </span>
        </div>
      ))}
      <Boxes size={16} className="hidden sm:block" />
    </div>
  );
}

function MissionCard({
  project,
  compact,
  onOpen,
}: {
  project: Project;
  compact?: boolean;
  onOpen: (p: Project) => void;
}) {
  return (
    <button
      type="button"
      data-sense="true"
      onClick={() => onOpen(project)}
      className={cn(
        "group relative block w-full overflow-hidden border border-hairline bg-ink-panel/70 text-left transition-all duration-300 hover:border-signal-red-bright",
        compact ? "p-6 sm:p-8" : "p-5 sm:p-6"
      )}
    >
      {/* ghost architecture visual */}
      <MiniArchitecture project={project} />

      {/* web-thread corner on the flagship row */}
      {compact && (
        <WebCorner
          anchor="tr"
          className="pointer-events-none absolute top-1 right-1 hidden h-24 w-24 text-paper/[0.05] sm:block"
          strokeWidth={0.8}
        />
      )}

      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[10px] tracking-[0.3em] text-paper-dim uppercase">
            {project.codename} · {project.period}
          </p>
          {project.status === "flagship" ? (
            <span className="border border-signal-red-bright bg-signal-red/15 px-2 py-0.5 font-mono text-[9px] font-bold tracking-[0.25em] text-signal-red-bright uppercase">
              Flagship
            </span>
          ) : project.status === "archived" ? (
            <span className="border border-hairline px-2 py-0.5 font-mono text-[9px] tracking-[0.25em] text-paper-dim uppercase">
              Archived
            </span>
          ) : (
            <span className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.25em] text-emerald-400 uppercase">
              <span className="h-1 w-1 rounded-full bg-emerald-400" /> Active
            </span>
          )}
        </div>

        <div className="mt-2 flex flex-wrap items-baseline gap-x-3">
          <h3
            className={cn(
              "font-display tracking-wide transition-colors group-hover:text-signal-red-bright",
              compact
                ? "masthead-sm text-3xl sm:text-5xl"
                : "text-2xl text-paper sm:text-3xl"
            )}
          >
            {project.title}
          </h3>
          <span className="font-mono text-[10px] tracking-[0.25em] text-web-blue-bright uppercase">
            {project.subtitle}
          </span>
        </div>

        <p className={cn("mt-2 max-w-2xl text-paper-dim", compact ? "text-sm sm:text-base" : "text-sm")}>
          {project.oneLiner}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.stack.slice(0, compact ? 9 : 5).map((s) => (
            <Chip key={s}>{s}</Chip>
          ))}
          {project.stack.length > (compact ? 9 : 5) && (
            <span className="font-mono text-[10px] text-paper-dim">
              +{project.stack.length - (compact ? 9 : 5)}
            </span>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-hairline pt-4">
          <span className="flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-web-blue-bright uppercase transition-colors group-hover:text-signal-red-bright">
            Explore
            <ArrowUpRight
              size={14}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
          <span className="font-mono text-[10px] text-paper-dim">
            {project.architecture.nodes.length} nodes
          </span>
        </div>
      </div>

      {/* hover accent bar */}
      <span
        className="absolute top-0 left-0 h-full w-[3px] scale-y-0 bg-signal-red-bright transition-transform duration-300 group-hover:scale-y-100"
        aria-hidden
      />
    </button>
  );
}
