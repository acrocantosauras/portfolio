"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { X, Download, Code2, Link2, Mail, Phone, Zap } from "lucide-react";
import { useRecruiterMode } from "./RecruiterModeContext";
import { profile, projects, skillGroups } from "@/data/resume";
import { Chip } from "@/components/ui/Chip";

const TOP_SKILLS = [
  "Python",
  "FastAPI",
  "PostgreSQL",
  "Redis / arq",
  "RAG",
  "LLM Evaluation",
  "Next.js",
  "Docker",
  "CI/CD",
  "Prometheus / Grafana",
];

export function RecruiterDrawer() {
  const { open, setOpen } = useRecruiterMode();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-black/75"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <motion.div
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-label="Recruiter Mode summary"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 260 }}
            className="fixed top-0 right-0 z-[95] flex h-full w-full max-w-md flex-col overflow-y-auto border-l-2 border-paper bg-ink-panel"
          >
            <div className="flex items-center justify-between border-b border-hairline px-6 py-5">
              <div className="flex items-center gap-2 font-mono text-xs tracking-[0.3em] text-signal-red-bright uppercase">
                <Zap size={14} />
                Recruiter Mode
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close recruiter mode"
                className="text-paper-dim transition-colors hover:text-paper"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-1 flex-col gap-8 px-6 py-6">
              <div>
                <h3 className="font-display text-3xl tracking-wide text-paper">
                  {profile.name}
                </h3>
                <p className="mt-1 font-mono text-xs tracking-[0.2em] text-web-blue-bright uppercase">
                  {profile.role}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-paper-dim">
                  {profile.summary}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href={profile.resumeUrl}
                  download
                  className="flex items-center justify-center gap-2 border border-paper bg-paper px-3 py-2.5 font-mono text-[11px] font-semibold tracking-[0.15em] text-ink uppercase transition-colors hover:bg-signal-red-bright hover:text-paper"
                >
                  <Download size={14} /> Resume
                </a>
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center justify-center gap-2 border border-hairline px-3 py-2.5 font-mono text-[11px] tracking-[0.15em] text-paper uppercase transition-colors hover:border-signal-red-bright hover:text-signal-red-bright"
                >
                  <Mail size={14} /> Email
                </a>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 border border-hairline px-3 py-2.5 font-mono text-[11px] tracking-[0.15em] text-paper uppercase transition-colors hover:border-web-blue-bright hover:text-web-blue-bright"
                >
                  <Code2 size={14} /> GitHub
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 border border-hairline px-3 py-2.5 font-mono text-[11px] tracking-[0.15em] text-paper uppercase transition-colors hover:border-web-blue-bright hover:text-web-blue-bright"
                >
                  <Link2 size={14} /> LinkedIn
                </a>
              </div>

              <a
                href={`tel:${profile.phone}`}
                className="-mt-4 flex items-center gap-2 font-mono text-xs text-paper-dim transition-colors hover:text-paper"
              >
                <Phone size={13} /> {profile.phone} · {profile.location}
              </a>

              <div>
                <p className="mb-3 font-mono text-[11px] tracking-[0.25em] text-paper-dim uppercase">
                  Flagship Work
                </p>
                <div className="flex flex-col gap-3">
                  {projects.map((p, i) => (
                    <a
                      key={p.slug}
                      href="#missions"
                      onClick={() => setOpen(false)}
                      className="group border border-hairline p-3 transition-colors hover:border-signal-red/60"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-display text-lg tracking-wide text-paper">
                          {String(i + 1).padStart(2, "0")} · {p.title}
                        </span>
                        {p.status === "flagship" && (
                          <Chip tone="red">Flagship</Chip>
                        )}
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-paper-dim">
                        {p.oneLiner}
                      </p>
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 font-mono text-[11px] tracking-[0.25em] text-paper-dim uppercase">
                  Core Stack
                </p>
                <div className="flex flex-wrap gap-2">
                  {TOP_SKILLS.map((s) => (
                    <Chip key={s}>{s}</Chip>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 font-mono text-[11px] tracking-[0.25em] text-paper-dim uppercase">
                  Full Skill Set
                </p>
                <div className="flex flex-col gap-2">
                  {skillGroups.map((g) => (
                    <div key={g.id} className="text-xs">
                      <span className="text-paper-dim">{g.label}: </span>
                      <span className="text-paper/90">{g.items.join(", ")}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
