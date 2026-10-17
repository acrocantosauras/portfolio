"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import Image from "next/image";
import {
  X,
  Download,
  Code2,
  Link2,
  Mail,
  Phone,
  Zap,
  ArrowRight,
} from "lucide-react";
import { useRecruiterMode } from "./RecruiterModeContext";
import { profile, projects, experience, skillGroups } from "@/data/resume";
import { Chip } from "@/components/ui/Chip";

const TOP_SKILLS = [
  "Python",
  "FastAPI",
  "LangGraph",
  "RAG / pgvector",
  "Multi-Agent Systems",
  "PostgreSQL",
  "Redis",
  "Docker",
  "YOLO / OpenCV",
  "Prometheus / Grafana",
];

const JUMPS = [
  { href: "#aegisforge", label: "AegisForge" },
  { href: "#experience", label: "Experience" },
  { href: "#missions", label: "Projects" },
  { href: "#workshop", label: "Skills" },
  { href: "#casefile", label: "Resume" },
  { href: "#contact", label: "Contact" },
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

  const [flagship, ...rest] = projects;

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

            <div className="flex flex-1 flex-col gap-7 px-6 py-6">
              {/* about */}
              <div className="flex items-center gap-4">
                <div className="relative flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-hairline">
                  <Image
                    src="/images/meet-jadhav.jpg"
                    alt="Meet Jadhav"
                    fill
                    className="object-cover"
                    sizes="72px"
                  />
                </div>
                <div>
                  <h3 className="font-display text-3xl tracking-wide text-paper">
                    {profile.name}
                  </h3>
                  <p className="mt-1 font-mono text-xs tracking-[0.2em] text-web-blue-bright uppercase">
                    {profile.role} · {profile.location}
                  </p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-paper-dim">
                {profile.summary}
              </p>

              {/* 30-second jumps */}
              <div>
                <p className="mb-3 font-mono text-[11px] tracking-[0.25em] text-paper-dim uppercase">
                  Quick Navigation
                </p>
                <div className="flex flex-wrap gap-2">
                  {JUMPS.map((j) => (
                    <a
                      key={j.href}
                      href={j.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-1.5 border border-hairline px-3 py-1.5 font-mono text-[11px] tracking-[0.15em] text-paper uppercase transition-colors hover:border-signal-red-bright hover:text-signal-red-bright"
                    >
                      {j.label} <ArrowRight size={11} />
                    </a>
                  ))}
                </div>
              </div>

              {/* experience */}
              <div>
                <p className="mb-3 font-mono text-[11px] tracking-[0.25em] text-paper-dim uppercase">
                  Industry Experience
                </p>
                {experience.map((e) => (
                  <div key={e.id} className="border border-hairline p-3">
                    <p className="font-display text-lg tracking-wide text-paper">
                      {e.company}
                    </p>
                    <p className="font-mono text-[10px] tracking-[0.2em] text-web-blue-bright uppercase">
                      {e.role}
                    </p>
                    <p className="mt-0.5 font-mono text-[9px] tracking-[0.2em] text-paper-dim uppercase">
                      {e.period}
                    </p>
                    <p className="mt-1 text-xs text-paper-dim">{e.points[0]}</p>
                  </div>
                ))}
              </div>

              {/* flagship */}
              <div>
                <p className="mb-3 font-mono text-[11px] tracking-[0.25em] text-paper-dim uppercase">
                  Flagship
                </p>
                <a
                  href="#aegisforge"
                  onClick={() => setOpen(false)}
                  className="block border border-signal-red/50 bg-signal-red/5 p-3 transition-colors hover:border-signal-red-bright"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xl tracking-wide text-paper">
                      {flagship.title}
                    </span>
                    <Chip tone="red">Flagship</Chip>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-paper-dim">
                    {flagship.oneLiner}
                  </p>
                </a>
              </div>

              {/* other projects */}
              <div>
                <p className="mb-3 font-mono text-[11px] tracking-[0.25em] text-paper-dim uppercase">
                  Other Systems
                </p>
                <div className="flex flex-col gap-3">
                  {rest.map((p) => (
                    <a
                      key={p.slug}
                      href="#missions"
                      onClick={() => setOpen(false)}
                      className="group border border-hairline p-3 transition-colors hover:border-signal-red/60"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-display text-lg tracking-wide text-paper">
                          {p.title}
                        </span>
                        <span className="font-mono text-[10px] text-paper-dim">{p.codename}</span>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-paper-dim">
                        {p.oneLiner}
                      </p>
                    </a>
                  ))}
                </div>
              </div>

              {/* skills */}
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

              {/* contact */}
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
                className="-mt-3 flex items-center gap-2 font-mono text-xs text-paper-dim transition-colors hover:text-paper"
              >
                <Phone size={13} /> {profile.phone} · {profile.location}
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
