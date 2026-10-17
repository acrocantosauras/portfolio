"use client";

import { motion } from "motion/react";
import { Mail, Phone, Code2, Link2, MapPin, ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WebCorner } from "@/components/ui/WebCorner";
import { profile } from "@/data/resume";

const CHANNELS = [
  { icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  { icon: Phone, label: "Phone", value: profile.phone, href: `tel:${profile.phone}` },
  { icon: Link2, label: "LinkedIn", value: profile.linkedinLabel, href: profile.linkedin },
  { icon: Code2, label: "GitHub", value: profile.githubLabelShort, href: profile.github },
];

export function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden bg-ink-soft py-28 sm:py-36">
      <WebCorner
        anchor="tl"
        className="absolute -top-4 -left-4 h-[34vmin] w-[34vmin] text-paper/[0.06]"
        strokeWidth={0.7}
      />
      <WebCorner
        anchor="br"
        className="absolute -right-4 -bottom-4 h-[26vmin] w-[26vmin] text-signal-red/[0.08]"
        strokeWidth={0.7}
      />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal-red/10 blur-[150px]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-4xl px-5 sm:px-8">
        <SectionHeading eyebrow="Open Channel / Final Transmission" title="READY TO BUILD?" align="center" />
        <p className="mx-auto mt-5 max-w-lg text-center text-paper-dim">
          Multi-agent systems, RAG pipelines, evaluation infrastructure, or computer vision —
          if it&rsquo;s worth shipping, the signal is open. Pick a channel.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {CHANNELS.map((c, i) => (
            <motion.a
              key={c.label}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel={c.href.startsWith("http") ? "noreferrer" : undefined}
              data-sense="true"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="group relative flex items-center gap-4 overflow-hidden border border-hairline bg-ink-panel/60 px-5 py-5 transition-colors hover:border-signal-red-bright"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-hairline text-web-blue-bright transition-colors group-hover:border-signal-red-bright group-hover:text-signal-red-bright">
                <c.icon size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[10px] tracking-[0.25em] text-paper-dim uppercase">
                  {c.label}
                </p>
                <p className="truncate text-sm text-paper group-hover:text-signal-red-bright">
                  {c.value}
                </p>
              </div>
              <ArrowUpRight
                size={16}
                className="shrink-0 text-paper-dim transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-signal-red-bright"
              />
              <span
                className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-signal-red-bright transition-transform duration-300 group-hover:scale-x-100"
                aria-hidden
              />
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 flex items-center justify-center gap-2 font-mono text-xs text-paper-dim"
        >
          <MapPin size={13} /> {profile.location}
        </motion.div>
      </div>
    </section>
  );
}
