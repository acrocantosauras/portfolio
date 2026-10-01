"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Chip } from "@/components/ui/Chip";
import { aegisAgents, aegisStages } from "@/data/resume";

const STATUS_CYCLE = ["STANDBY", "INITIALIZING", "ONLINE"] as const;

/**
 * AegisForge — cinematic "system activation" centerpiece.
 * A pipeline diagram draws itself on scroll; agent nodes expand on hover/focus.
 */
export function AegisForge() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // pipeline lights up progressively as you scroll through the section
  const stageProgress = useTransform(scrollYProgress, [0.15, 0.6], [0, aegisStages.length]);
  const [litStages, setLitStages] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);

  useEffect(() => {
    const unsub = stageProgress.on("change", (v) => setLitStages(Math.floor(v)));
    return unsub;
  }, [stageProgress]);

  useEffect(() => {
    if (reduceMotion) return;
    const t = setInterval(() => setStatusIndex((i) => Math.min(i + 1, STATUS_CYCLE.length - 1)), 700);
    return () => clearInterval(t);
  }, [reduceMotion]);

  const displayStatus = reduceMotion ? 2 : statusIndex;

  const active = aegisAgents.find((a) => a.id === activeAgent) ?? null;

  return (
    <section id="aegisforge" ref={ref} className="relative overflow-hidden bg-ink py-24 sm:py-32">
      {/* atmosphere */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, var(--color-paper) 0, var(--color-paper) 1px, transparent 1px, transparent 64px)",
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute top-24 right-0 h-[420px] w-[420px] rounded-full bg-signal-red/10 blur-[130px]" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading eyebrow="SYS.01 / Flagship Platform" title="AEGISFORGE" />
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-2.5 border border-hairline bg-ink-panel/60 px-4 py-2.5"
          >
            <span className="relative flex h-2 w-2">
              <span
                className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                  displayStatus === 2 ? "bg-emerald-400" : "bg-amber"
                }`}
              />
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${
                  displayStatus === 2 ? "bg-emerald-400" : "bg-amber"
                }`}
              />
            </span>
            <span className="font-mono text-[11px] tracking-[0.3em] text-paper uppercase">SYSTEM STATUS</span>
            <span
              className={`font-mono text-[11px] font-bold tracking-[0.3em] ${
                displayStatus === 2 ? "text-emerald-400" : "text-amber"
              }`}
            >
              {STATUS_CYCLE[displayStatus]}
            </span>
          </motion.div>
        </div>

        <p className="mt-6 max-w-3xl text-base leading-relaxed text-paper-dim sm:text-lg">
          A production-grade multi-agent AI platform. Agents plan, delegate, retrieve private knowledge,
          call tools, and evaluate their own output — with checkpointed state and full telemetry.
        </p>

        {/* ---- pipeline ---- */}
        <div className="mt-16 border border-hairline bg-ink-panel/40 p-5 sm:p-8">
          <div className="mb-6 flex items-center justify-between font-mono text-[10px] tracking-[0.3em] text-paper-dim uppercase">
            <span>workflow.pipeline</span>
            <span className="hidden sm:inline">scroll to trace execution →</span>
          </div>

          <ol className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4 lg:grid-cols-8 lg:gap-x-2">
            {aegisStages.map((stage, i) => {
              const lit = i < litStages || reduceMotion;
              return (
                <motion.li
                  key={stage.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="relative flex flex-col items-center gap-2 text-center"
                >
                  {/* connector */}
                  {i < aegisStages.length - 1 && (
                    <span
                      className={`absolute top-4 left-[calc(50%+28px)] hidden h-px w-[calc(100%-56px)] lg:block ${
                        i < litStages - 1 || reduceMotion ? "bg-signal-red-bright" : "bg-hairline"
                      }`}
                      aria-hidden
                    />
                  )}
                  <span
                    className={`flex h-8 w-8 items-center justify-center border font-mono text-[10px] transition-colors duration-500 ${
                      lit
                        ? "border-signal-red-bright bg-signal-red/15 text-signal-red-bright"
                        : "border-hairline text-paper-dim"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={`font-mono text-[10px] font-bold tracking-[0.15em] sm:text-[11px] ${lit ? "text-paper" : "text-paper-dim"}`}>
                    {stage.label}
                  </span>
                  <span className="hidden font-mono text-[9px] tracking-[0.1em] text-paper-dim/70 uppercase sm:block">
                    {stage.sub}
                  </span>
                </motion.li>
              );
            })}
          </ol>
        </div>

        {/* ---- agent graph ---- */}
        <div className="mt-14">
          <p className="mb-5 font-mono text-[11px] tracking-[0.3em] text-web-blue-bright uppercase">
            agent_registry — {aegisAgents.length} registered
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {aegisAgents.map((agent, i) => (
              <motion.button
                key={agent.id}
                type="button"
                data-sense="true"
                aria-pressed={activeAgent === agent.id}
                onClick={() => setActiveAgent((cur) => (cur === agent.id ? null : agent.id))}
                onMouseEnter={() => setActiveAgent(agent.id)}
                onFocus={() => setActiveAgent(agent.id)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: (i % 3) * 0.07 }}
                className={`group relative border p-4 text-left transition-colors ${
                  activeAgent === agent.id
                    ? "border-signal-red-bright bg-signal-red/10"
                    : "border-hairline bg-ink-panel/60 hover:border-web-blue/60"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-paper-dim uppercase">
                    AGT.{String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`h-1.5 w-1.5 rounded-full transition-colors ${
                      activeAgent === agent.id ? "bg-signal-red-bright" : "bg-hairline group-hover:bg-web-blue-bright"
                    }`}
                  />
                </div>
                <h3 className="mt-2 font-display text-xl tracking-wide text-paper">{agent.name}</h3>
                <p className="mt-1 text-xs leading-relaxed text-paper-dim">{agent.role}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {agent.tech.map((t) => (
                    <Chip key={t} tone={activeAgent === agent.id ? "red" : "default"} className="text-[9px]">
                      {t}
                    </Chip>
                  ))}
                </div>
              </motion.button>
            ))}
          </div>

          {/* active agent detail readout */}
          <div className="mt-4 min-h-[72px] border border-hairline bg-ink/80 p-4" role="status">
            {active ? (
              <motion.div key={active.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                <p className="font-mono text-[10px] tracking-[0.25em] text-signal-red-bright uppercase">
                  {active.name} <span className="text-paper-dim">— {active.role}</span>
                </p>
                <p className="mt-1 text-sm text-paper/90">{active.detail}</p>
              </motion.div>
            ) : (
              <p className="font-mono text-xs text-paper-dim">
                Hover or tap an agent to inspect its responsibility.
              </p>
            )}
          </div>
        </div>

        {/* ---- stack strip ---- */}
        <div className="mt-14 flex flex-wrap items-center gap-2">
          <span className="mr-2 font-mono text-[10px] tracking-[0.3em] text-paper-dim uppercase">stack:</span>
          {["LangGraph", "FastAPI", "Next.js", "PostgreSQL + pgvector", "Redis", "MCP", "Docker", "OTel / Prometheus / Grafana"].map(
            (t) => (
              <Chip key={t} tone="blue">
                {t}
              </Chip>
            )
          )}
        </div>
      </div>
    </section>
  );
}
