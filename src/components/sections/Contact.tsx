"use client";

import { motion } from "motion/react";
import { Mail, Phone, Code2, Link2, MapPin } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { profile } from "@/data/resume";

const CHANNELS = [
  { icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  { icon: Phone, label: "Phone", value: profile.phone, href: `tel:${profile.phone}` },
  { icon: Link2, label: "LinkedIn", value: profile.linkedinLabel, href: profile.linkedin },
  { icon: Code2, label: "GitHub", value: profile.githubLabel, href: profile.github },
];

export function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden bg-ink-soft py-24 sm:py-32">
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal-red/10 blur-[140px]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-4xl px-5 sm:px-8">
        <SectionHeading eyebrow="File 007 / Open Channel" title="MAKE CONTACT" align="center" />
        <p className="mx-auto mt-5 max-w-lg text-center text-paper-dim">
          Building something worth shipping? The signal is open — pick a channel.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group flex items-center gap-4 border border-hairline bg-ink-panel/60 px-5 py-4 transition-colors hover:border-signal-red-bright"
            >
              <c.icon className="shrink-0 text-web-blue-bright" size={20} />
              <div className="min-w-0">
                <p className="font-mono text-[10px] tracking-[0.25em] text-paper-dim uppercase">
                  {c.label}
                </p>
                <p className="truncate text-sm text-paper group-hover:text-signal-red-bright">
                  {c.value}
                </p>
              </div>
            </motion.a>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-center gap-2 font-mono text-xs text-paper-dim">
          <MapPin size={13} /> {profile.location}
        </div>
      </div>
    </section>
  );
}
