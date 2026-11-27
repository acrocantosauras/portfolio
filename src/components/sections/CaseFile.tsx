"use client";

import { motion } from "motion/react";
import { Download } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Sighting } from "@/components/ui/Sighting";
import { ChapterMark } from "@/components/ui/ChapterMark";
import { profile, projects, skillGroups } from "@/data/resume";

const EASE = [0.16, 1, 0.3, 1] as const;
const repos = projects.filter((p) => p.links?.[0] && p.slug !== "jarvis");
const languages = skillGroups.find((g) => g.id === "languages")!.items.join(" · ");

/**
 * The resume, as a case file: a folder tab, a blueprint-paper sheet, typewriter
 * field labels, the actual document pinned to it with dimension lines, and a
 * stamp. The labels are facts (one page, three projects, linked repos); nothing
 * is redacted or invented.
 */
export function CaseFile() {
  const fields: [string, React.ReactNode][] = [
    ["NAME", profile.name],
    ["ROLE", profile.role],
    ["BASE", profile.location],
    ["STATUS", profile.seeking],
    ["LANGUAGES", languages],
    [
      "REPOS",
      <span key="r" className="flex flex-col gap-0.5">
        {repos.map((p) => (
          <a
            key={p.slug}
            href={p.links![0].href}
            target="_blank"
            rel="noreferrer"
            className="underline decoration-dawn-ink/40 underline-offset-2 transition-colors hover:text-signal-red-deep hover:decoration-signal-red-deep"
          >
            {p.links![0].href.replace("https://github.com/", "")}
          </a>
        ))}
      </span>,
    ],
  ];

  return (
    <section id="casefile" className="surface-dawn relative overflow-hidden py-28 sm:py-36">
      <ChapterMark n="07" className="-bottom-[0.14em] -left-[0.05em] text-dawn-ink/[0.07]" />
      <div className="relative mx-auto max-w-7xl px-6 sm:px-12">
        <SectionHeading title="THE RESUME" tone="dawn" />

        <div className="mt-14">
          {/* the folder tab */}
          <div className="inline-block bg-dawn-ink px-5 py-2 font-mono text-[11px] tracking-[0.22em] text-dawn-warm [clip-path:polygon(0_0,92%_0,100%_100%,0_100%)] pr-9">
            DOSSIER · MJ-2026
          </div>

          <div className="blueprint relative border-2 border-dawn-ink px-5 py-9 sm:px-10 sm:py-12">
            {/* registration marks at the corners, like a drawing sheet */}
            {(["top-2 left-2", "top-2 right-2", "bottom-2 left-2", "right-2 bottom-2"] as const).map((c) => (
              <span key={c} aria-hidden className={`absolute h-3 w-3 ${c} text-dawn-ink/60`}>
                <span className="absolute top-1/2 left-0 h-px w-full bg-current" />
                <span className="absolute top-0 left-1/2 h-full w-px bg-current" />
              </span>
            ))}

            <div className="grid grid-cols-1 gap-x-14 gap-y-12 lg:grid-cols-12">
              {/* the field sheet */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, ease: EASE }}
                className="lg:col-span-5"
              >
                <dl className="font-mono text-[13px] text-dawn-ink">
                  {fields.map(([k, v]) => (
                    <div key={k} className="grid grid-cols-[6.5rem_1fr] gap-x-3 border-b border-dawn-ink/30 py-3">
                      <dt className="tracking-[0.18em] text-dawn-ink/80">{k}</dt>
                      <dd className="leading-relaxed">{v}</dd>
                    </div>
                  ))}
                </dl>

                <p className="mt-8 font-serif text-2xl leading-snug text-dawn-ink">
                  One page, no padding. Every project on it links to its repo, so you can read the
                  code and the tests yourself.
                </p>

                <a
                  href={profile.resumeUrl}
                  download
                  className="mt-8 inline-flex items-center gap-2 bg-dawn-ink px-6 py-3.5 text-sm font-medium text-dawn-warm transition-colors hover:bg-signal-red-deep"
                >
                  <Download size={16} /> Download resume (PDF)
                </a>
              </motion.div>

              {/* the document, pinned, with dimension lines */}
              <motion.div
                initial={{ opacity: 0, y: 28, rotate: 1.4 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0.6 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.9, delay: 0.08, ease: EASE }}
                className="relative lg:col-span-7"
              >
                {/* dimension line along the top */}
                <div aria-hidden className="mb-3 flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-dawn-ink/70">
                  <span className="h-2 w-px bg-current" />
                  <span className="h-px flex-1 bg-current" />
                  <span>ONE PAGE</span>
                  <span className="h-px flex-1 bg-current" />
                  <span className="h-2 w-px bg-current" />
                </div>

                {/* a sighting: he looks over the top of the document */}
                <div className="relative h-0">
                  <Sighting id="resume" kind="peek" className="-top-[62px] right-[38%] sm:right-[23%] h-[96px] w-[84px]" />
                </div>

                <div className="relative z-10 border border-dawn-ink/40 bg-dawn-warm p-2 shadow-[0_28px_48px_-28px_rgba(20,22,27,0.5)]" data-sense="The PDF is served without the frame-blocking header, so it can preview here.">
                  <object
                    data={`${profile.resumeUrl}#toolbar=0`}
                    type="application/pdf"
                    className="h-[420px] w-full sm:h-[600px]"
                    aria-label="Resume preview"
                  >
                    <div className="flex h-[420px] flex-col items-center justify-center gap-3 text-center">
                      <p className="text-sm text-dawn-ink/70">Preview unavailable in this browser.</p>
                      <a href={profile.resumeUrl} className="text-sm text-signal-red-deep underline underline-offset-4">
                        Open the resume directly
                      </a>
                    </div>
                  </object>
                  {/* tape */}
                  <span aria-hidden className="absolute -top-3 left-8 h-6 w-20 -rotate-[8deg] bg-gold/80" />
                  <span aria-hidden className="absolute -top-3 right-8 h-6 w-20 rotate-[6deg] bg-gold/80" />
                </div>

                {/* callout bracket */}
                <p
                  aria-hidden
                  className="mt-3 flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-dawn-ink/70"
                >
                  <span className="h-px w-8 bg-current" /> 3 PROJECTS · REPOS LINKED
                </p>

                {/* the stamp */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-2 bottom-24 hidden -rotate-12 border-[3px] border-signal-red-deep px-4 py-1.5 text-center font-display text-3xl leading-none tracking-[0.12em] text-signal-red-deep opacity-85 sm:block"
                >
                  ON FILE
                  <span className="mt-1 block font-mono text-[11px] tracking-[0.2em]">NOV 2026</span>
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
