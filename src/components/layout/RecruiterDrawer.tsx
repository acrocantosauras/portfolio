"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { X, Download, Code2, Link2, Mail, Phone, ArrowUpRight } from "lucide-react";
import { useRecruiterMode } from "./RecruiterModeContext";
import { profile, projects, experience, skillGroups } from "@/data/resume";

const JUMPS = [
  { href: "#aegisforge", label: "AegisForge" },
  { href: "#experience", label: "Experience" },
  { href: "#missions", label: "Projects" },
  { href: "#workshop", label: "Skills" },
  { href: "#casefile", label: "Resume" },
  { href: "#contact", label: "Contact" },
];

function Label({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 text-sm font-medium text-paper">{children}</p>;
}

/**
 * Recruiter view — the whole profile in one scroll, mirroring the resume:
 * who, where, what was built (with real repo links), skills, and how to reach me.
 */
export function RecruiterDrawer() {
  const { open, setOpen } = useRecruiterMode();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) closeRef.current?.focus();
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
            aria-label="Recruiter view"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 34, stiffness: 280 }}
            className="fixed top-0 right-0 z-[95] flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-hairline bg-ink-panel text-paper"
          >
            <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
              <p className="font-serif text-2xl italic">Recruiter view</p>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close recruiter view"
                className="p-1 text-paper-dim transition-colors hover:text-paper"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-1 flex-col gap-8 px-6 py-6">
              {/* about */}
              <div className="flex items-center gap-4">
                <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden border border-hairline">
                  <Image
                    src="/images/meet-jadhav.jpg"
                    alt="Meet Jadhav"
                    fill
                    className="object-cover object-top"
                    sizes="72px"
                  />
                </div>
                <div>
                  <h3 className="font-display text-3xl tracking-wide">{profile.name}</h3>
                  <p className="mt-1 text-sm text-paper-dim">
                    {profile.role} · {profile.location}
                  </p>
                </div>
              </div>
              <p className="-mt-3 text-[15px] leading-relaxed text-paper/90">{profile.summary}</p>

              <div>
                <Label>Jump to</Label>
                <div className="flex flex-wrap gap-2">
                  {JUMPS.map((j) => (
                    <a
                      key={j.href}
                      href={j.href}
                      onClick={() => setOpen(false)}
                      className="border border-hairline px-3 py-1.5 text-sm text-paper transition-colors hover:border-signal-red-bright hover:text-signal-red-bright"
                    >
                      {j.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* experience */}
              <div>
                <Label>Experience</Label>
                {experience.map((e) => (
                  <div key={e.id} className="border-t border-hairline py-3">
                    <p className="text-base font-medium">
                      {e.role}, {e.company}
                    </p>
                    <p className="text-sm text-paper-dim">
                      {e.period} · {e.location}
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-paper/90">{e.points[0]}</p>
                  </div>
                ))}
              </div>

              {/* projects */}
              <div>
                <Label>Projects</Label>
                <div className="border-b border-hairline">
                  {projects.map((p) => {
                    const repo = p.links?.[0]?.href;
                    return (
                      <div key={p.slug} className="border-t border-hairline py-3">
                        <div className="flex items-baseline justify-between gap-3">
                          <p className="text-base font-medium">{p.title}</p>
                          <p className="shrink-0 text-xs text-paper-dim">{p.period}</p>
                        </div>
                        <p className="mt-1 text-sm leading-relaxed text-paper-dim">{p.oneLiner}</p>
                        <p className="mt-2 flex items-center gap-4 text-sm">
                          <a
                            href="#missions"
                            onClick={() => setOpen(false)}
                            className="text-paper underline decoration-hairline transition-colors hover:text-signal-red-bright hover:decoration-signal-red-bright"
                          >
                            Details
                          </a>
                          {repo && (
                            <a
                              href={repo}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-paper underline decoration-hairline transition-colors hover:text-signal-red-bright hover:decoration-signal-red-bright"
                            >
                              GitHub <ArrowUpRight size={13} />
                            </a>
                          )}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* skills */}
              <div>
                <Label>Skills</Label>
                <dl className="flex flex-col gap-2.5 text-sm">
                  {skillGroups.map((g) => (
                    <div key={g.id}>
                      <dt className="inline text-paper-dim">{g.label}: </dt>
                      <dd className="inline text-paper/90">{g.items.join(", ")}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* contact */}
              <div>
                <Label>Contact</Label>
                <p className="mb-4 text-sm text-paper-dim">{profile.seeking}</p>
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={profile.resumeUrl}
                    download
                    className="flex items-center justify-center gap-2 bg-paper px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-signal-red-bright hover:text-paper"
                  >
                    <Download size={15} /> Resume
                  </a>
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex items-center justify-center gap-2 border border-hairline px-3 py-2.5 text-sm text-paper transition-colors hover:border-signal-red-bright hover:text-signal-red-bright"
                  >
                    <Mail size={15} /> Email
                  </a>
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 border border-hairline px-3 py-2.5 text-sm text-paper transition-colors hover:border-signal-red-bright hover:text-signal-red-bright"
                  >
                    <Code2 size={15} /> GitHub
                  </a>
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 border border-hairline px-3 py-2.5 text-sm text-paper transition-colors hover:border-signal-red-bright hover:text-signal-red-bright"
                  >
                    <Link2 size={15} /> LinkedIn
                  </a>
                </div>
                <a
                  href={`tel:${profile.phone}`}
                  className="mt-4 flex items-center gap-2 text-sm text-paper-dim transition-colors hover:text-paper"
                >
                  <Phone size={14} /> {profile.phone} · {profile.location}
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
