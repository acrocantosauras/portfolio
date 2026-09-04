"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, ExternalLink } from "lucide-react";
import type { Project } from "@/data/resume";
import { Chip } from "@/components/ui/Chip";
import { ArchitectureDiagram } from "./ArchitectureDiagram";

export function ProjectDossier({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (project) {
      window.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[90] bg-black/80"
            aria-hidden
          />
          <motion.div
            key="dossier"
            role="dialog"
            aria-modal="true"
            aria-label={`${project.title} dossier`}
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-x-0 top-0 z-[95] h-full overflow-y-auto sm:inset-x-4 sm:top-6 sm:bottom-6 sm:h-auto sm:max-h-[calc(100vh-3rem)] sm:border-2 sm:border-paper md:inset-x-10 lg:inset-x-20"
          >
            <div className="min-h-full bg-ink-panel pb-16">
              <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b-2 border-paper bg-ink-panel px-5 py-5 sm:px-10">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.3em] text-signal-red-bright uppercase">
                    {project.codename} · {project.period}
                  </p>
                  <h3 className="mt-1 font-display text-4xl tracking-wide text-paper sm:text-5xl">
                    {project.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close dossier"
                  className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center border border-hairline text-paper-dim transition-colors hover:border-signal-red-bright hover:text-signal-red-bright"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex flex-col gap-12 px-5 py-10 sm:px-10">
                <div>
                  <div className="flex flex-wrap gap-2">
                    {project.stack.map((s) => (
                      <Chip key={s} tone="blue">
                        {s}
                      </Chip>
                    ))}
                  </div>
                  <div className="mt-6 flex flex-col gap-4">
                    {project.summary.map((s, i) => (
                      <p key={i} className="text-base leading-relaxed text-paper/90 sm:text-lg">
                        {s}
                      </p>
                    ))}
                  </div>
                </div>

                <Block label="Architecture">
                  <ArchitectureDiagram
                    nodes={project.architecture.nodes}
                    flow={project.architecture.flow}
                  />
                </Block>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                  <Block label="Engineering Challenges">
                    <div className="flex flex-col gap-4">
                      {project.challenges.map((c) => (
                        <div key={c.title} className="border-l-2 border-signal-red/60 pl-4">
                          <p className="font-medium text-paper">{c.title}</p>
                          <p className="mt-1 text-sm text-paper-dim">{c.detail}</p>
                        </div>
                      ))}
                    </div>
                  </Block>

                  <Block label="Testing & Evaluation">
                    <div className="flex flex-col gap-4">
                      {project.testing.map((t) => (
                        <div key={t.title} className="border-l-2 border-web-blue/60 pl-4">
                          <p className="font-medium text-paper">{t.title}</p>
                          <p className="mt-1 text-sm text-paper-dim">{t.detail}</p>
                        </div>
                      ))}
                    </div>
                  </Block>
                </div>

                {project.observability && (
                  <Block label="Observability">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      {project.observability.map((o) => (
                        <div key={o.title} className="border border-hairline p-4">
                          <p className="font-medium text-paper">{o.title}</p>
                          <p className="mt-1 text-sm text-paper-dim">{o.detail}</p>
                        </div>
                      ))}
                    </div>
                  </Block>
                )}

                {project.links && (
                  <div className="flex flex-wrap gap-3 border-t border-hairline pt-8">
                    {project.links.map((l) => (
                      <a
                        key={l.href}
                        href={l.href}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 border border-hairline px-4 py-2 font-mono text-xs tracking-[0.15em] text-paper uppercase transition-colors hover:border-signal-red-bright hover:text-signal-red-bright"
                      >
                        {l.label} <ExternalLink size={12} />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-4 font-mono text-[11px] tracking-[0.3em] text-web-blue-bright uppercase">
        {label}
      </p>
      {children}
    </div>
  );
}
