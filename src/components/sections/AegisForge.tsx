"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Chip } from "@/components/ui/Chip";
import { WebCorner } from "@/components/ui/WebCorner";
import { AegisSimulator } from "./AegisSimulator";
import { aegisAgents, projects } from "@/data/resume";
import { cn } from "@/lib/utils";

const aegis = projects.find((p) => p.slug === "aegisforge")!;
const EASE = [0.16, 1, 0.3, 1] as const;

// Proof, not decoration: every line is a claim from the resume.
const PROOF = [
  {
    title: "Plans are validated before they run",
    detail: "Schema, dependency and cycle checks on every LLM-generated plan.",
  },
  {
    title: "Runs resume where they stopped",
    detail:
      "Per-task PostgreSQL checkpoints, a Redis job queue with heartbeat-based claim recovery, and a per-tool circuit breaker.",
  },
  {
    title: "Tools are denied by default",
    detail: "Approval gates, with MCP risk levels read from server config.",
  },
  {
    title: "773 pytest tests, 78% coverage",
    detail: "Including failure-injection tests for a Redis outage and a worker crash.",
  },
] as const;

/**
 * AegisForge — the flagship, shown as engineering you can poke.
 * The claims first, then the system itself as a simulation you can run and break
 * (clearly labelled as a simulation), then the specialist agents.
 */
export function AegisForge() {
  const [agentId, setAgentId] = useState<string>(aegisAgents[0].id);

  return (
    <section id="aegisforge" className="surface-night relative overflow-x-clip py-28 sm:py-40">
      <WebCorner
        anchor="tr"
        className="absolute -top-4 -right-4 h-[46vmin] w-[46vmin] text-web-blue-bright/[0.14]"
        strokeWidth={1}
      />
      <div className="relative mx-auto max-w-7xl px-8 sm:px-12">
        <div className="grid grid-cols-1 gap-x-16 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading title="AEGISFORGE" />
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: EASE }}
              className="mt-6 font-serif text-2xl leading-snug text-paper sm:text-3xl"
            >
              A FastAPI and LangGraph orchestrator that validates LLM-generated plans and runs
              them as dependency-ordered task graphs.
            </motion.p>
            <div className="mt-6 flex flex-wrap gap-2">
              {aegis.stack.map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </div>
            {aegis.links?.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-1.5 text-sm text-paper underline decoration-signal-red-bright underline-offset-4 transition-colors hover:text-signal-red-bright"
              >
                {link.label} <ArrowUpRight size={14} />
              </a>
            ))}
          </div>

          <dl className="grid grid-cols-1 gap-x-10 sm:grid-cols-2 lg:col-span-7">
            {PROOF.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
                className="border-t border-hairline py-4"
              >
                <dt className="text-base font-medium text-paper">{p.title}</dt>
                <dd className="mt-1 max-w-md text-sm leading-relaxed text-paper-dim">{p.detail}</dd>
              </motion.div>
            ))}
          </dl>
        </div>

        {/* the system, runnable */}
        <AegisSimulator />

        {/* specialist agents */}
        <div className="mt-24 grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-12">
          <h3 className="font-display text-3xl tracking-wide text-paper sm:text-4xl lg:col-span-4">
            Specialist agents
          </h3>
          <ul className="border-b border-hairline lg:col-span-8">
            {aegisAgents.map((agent) => {
              const open = agent.id === agentId;
              return (
                <li key={agent.id} className="border-t border-hairline">
                  <button
                    type="button"
                    onClick={() => setAgentId(agent.id)}
                    aria-expanded={open}
                    className="group flex w-full items-baseline justify-between gap-6 py-3.5 text-left"
                  >
                    <span
                      className={cn(
                        "text-lg font-medium transition-colors",
                        open ? "text-paper" : "text-paper-dim group-hover:text-paper"
                      )}
                    >
                      {agent.name}
                    </span>
                    <span
                      className={cn(
                        "hidden text-sm transition-colors sm:block",
                        open ? "text-paper-dim" : "text-paper-dim/60"
                      )}
                    >
                      {agent.role}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <div className="pb-5">
                          <p className="max-w-xl text-[15px] leading-relaxed text-paper/90">
                            {agent.detail}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {agent.tech.map((t) => (
                              <Chip key={t}>{t}</Chip>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
