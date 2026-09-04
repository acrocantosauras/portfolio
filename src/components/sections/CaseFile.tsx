"use client";

import { motion } from "motion/react";
import { Download, FileText } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { profile, certifications, timeline } from "@/data/resume";

const education = timeline.filter((t) => t.kind === "education");

export function CaseFile() {
  return (
    <section id="casefile" className="relative bg-ink py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow="File 006 / Records" title="THE CASE FILE" />

        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6 border-2 border-hairline bg-ink-panel/60 p-6 sm:p-8"
          >
            <div className="flex items-center gap-3">
              <FileText className="text-signal-red-bright" size={22} />
              <p className="font-display text-2xl tracking-wide text-paper">
                Resume — {profile.name}
              </p>
            </div>

            <div>
              <p className="font-mono text-[10px] tracking-[0.25em] text-web-blue-bright uppercase">
                Education
              </p>
              <div className="mt-2 flex flex-col gap-3">
                {education.map((e) => (
                  <div key={e.id}>
                    <p className="text-sm text-paper">{e.title}</p>
                    <p className="text-xs text-paper-dim">
                      {e.org} · {e.location} · {e.period}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="font-mono text-[10px] tracking-[0.25em] text-web-blue-bright uppercase">
                Certifications
              </p>
              <div className="mt-2 flex flex-col gap-2">
                {certifications.map((c) => (
                  <div key={c.title} className="flex items-baseline justify-between gap-3 border-b border-hairline/60 pb-1.5">
                    <span className="text-sm text-paper">{c.title}</span>
                    <span className="shrink-0 font-mono text-[10px] text-paper-dim">{c.org}</span>
                  </div>
                ))}
              </div>
            </div>

            <a
              href={profile.resumeUrl}
              download
              data-sense="true"
              className="mt-2 flex items-center justify-center gap-2 border-2 border-paper bg-paper px-5 py-3 font-mono text-xs font-semibold tracking-[0.2em] text-ink uppercase transition-colors hover:border-signal-red-bright hover:bg-signal-red-bright hover:text-paper"
            >
              <Download size={14} /> Download Full Resume (PDF)
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative min-h-[420px] border-2 border-hairline bg-ink-panel/40 p-2 sm:min-h-[560px]"
          >
            <object
              data={`${profile.resumeUrl}#toolbar=0`}
              type="application/pdf"
              className="h-full min-h-[400px] w-full sm:min-h-[540px]"
              aria-label="Resume preview"
            >
              <div className="flex h-full min-h-[400px] flex-col items-center justify-center gap-3 text-center">
                <p className="text-sm text-paper-dim">
                  Preview unavailable in this browser.
                </p>
                <a
                  href={profile.resumeUrl}
                  className="font-mono text-xs tracking-[0.2em] text-signal-red-bright uppercase underline"
                >
                  Open resume directly
                </a>
              </div>
            </object>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
