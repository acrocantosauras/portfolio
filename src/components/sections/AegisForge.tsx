"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ExternalLink } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Chip } from "@/components/ui/Chip";
import { WebCorner } from "@/components/ui/WebCorner";
import { aegisAgents, aegisStages, projects } from "@/data/resume";
import { cn } from "@/lib/utils";

const STATUS_CYCLE = ["STANDBY", "INITIALIZING", "ONLINE"] as const;

const aegis = projects.find((p) => p.slug === "aegisforge")!;

/** Split a stage label into at most two centered lines. */
function wrapLabel(label: string): [string, string | null] {
  const words = label.split(" ");
  if (words.length <= 2 || label.length <= 10) return [label, null];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}

/**
 * AegisForge — the flagship system visualization.
 *
 * A conceptual request-lifecycle pipeline: signal traces run from REQUEST to
 * RESULT while specialist agents wait in the registry below. Nodes are
 * clickable/focusable; a stage inspector explains the selected stage.
 * Clearly labelled as a conceptual simulation, not a live production feed.
 */
export function AegisForge() {
  const ref = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [pinned, setPinned] = useState<number | null>(null);
  const [auto, setAuto] = useState(0);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [statusIndex, setStatusIndex] = useState(0);

  // auto-advance the pipeline, but only while it is on screen and unpinned
  useEffect(() => {
    if (reduceMotion || pinned !== null) return;
    const el = diagramRef.current;
    if (!el) return;
    let interval: number | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && interval === undefined) {
          interval = window.setInterval(
            () => setAuto((a) => (a + 1) % aegisStages.length),
            1800
          );
        } else if (!entry.isIntersecting && interval !== undefined) {
          window.clearInterval(interval);
          interval = undefined;
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (interval !== undefined) window.clearInterval(interval);
    };
  }, [reduceMotion, pinned]);

  useEffect(() => {
    if (reduceMotion) return;
    const t = setInterval(
      () => setStatusIndex((i) => Math.min(i + 1, STATUS_CYCLE.length - 1)),
      700
    );
    return () => clearInterval(t);
  }, [reduceMotion]);

  const displayStatus = reduceMotion ? 2 : statusIndex;
  const activeIdx = reduceMotion ? aegisStages.length : (pinned ?? auto);
  const selected = aegisStages[Math.max(0, Math.min(pinned ?? auto, aegisStages.length - 1))];
  const active = aegisAgents.find((a) => a.id === activeAgent) ?? null;

  function selectStage(i: number) {
    setPinned((cur) => (cur === i ? null : i));
    setAuto(i);
  }

  return (
    <section id="aegisforge" ref={ref} className="relative overflow-hidden bg-ink py-24 sm:py-32">
      {/* atmosphere */}
      <WebCorner
        anchor="tl"
        className="absolute -top-4 -left-4 h-[34vmin] w-[34vmin] text-paper/[0.07]"
        strokeWidth={0.7}
      />
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

        {/* ---- request-lifecycle pipeline ---- */}
        <div ref={diagramRef} className="mt-16 border border-hairline bg-ink-panel/40 p-5 sm:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] tracking-[0.3em] text-paper-dim uppercase">
            <span>workflow.pipeline — request lifecycle</span>
            <span className="hidden lg:inline">
              {pinned === null ? "auto-tracing — tap a stage to inspect" : "pinned — tap again to resume"}
            </span>
          </div>

          {/* desktop: horizontal flow */}
          <div className="hidden lg:block">
            <svg
              viewBox="0 0 1200 210"
              className="w-full"
              role="group"
              aria-label="AegisForge request pipeline, conceptual simulation"
            >
              {/* connectors */}
              {aegisStages.slice(0, -1).map((_, i) => {
                const x1 = 10 + i * 146.6 + 128;
                const x2 = 10 + (i + 1) * 146.6;
                const lit = i < activeIdx;
                return (
                  <g key={`link-${i}`}>
                    <line
                      x1={x1}
                      y1={100}
                      x2={x2}
                      y2={100}
                      stroke={lit ? "var(--color-signal-red)" : "var(--color-hairline)"}
                      strokeWidth={1.5}
                      opacity={lit ? 0.5 : 1}
                    />
                    {lit && !reduceMotion && (
                      <line
                        x1={x1}
                        y1={100}
                        x2={x2}
                        y2={100}
                        stroke="var(--color-signal-red-bright)"
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        className="trace-run"
                      />
                    )}
                    {/* direction chevron */}
                    <path
                      d={`M ${x2 - 9} 95 L ${x2 - 2} 100 L ${x2 - 9} 105`}
                      fill="none"
                      stroke={lit ? "var(--color-signal-red-bright)" : "var(--color-hairline)"}
                      strokeWidth={1.5}
                    />
                  </g>
                );
              })}
              {/* nodes */}
              {aegisStages.map((stage, i) => {
                const x = 10 + i * 146.6;
                const y = 56;
                const isActive = i === activeIdx;
                const isLit = i < activeIdx;
                const [l1, l2] = wrapLabel(stage.label);
                return (
                  <g
                    key={stage.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`${stage.label} — ${stage.detail}`}
                    aria-pressed={pinned === i}
                    onClick={() => selectStage(i)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        selectStage(i);
                      }
                    }}
                    className="cursor-pointer"
                    data-sense="true"
                  >
                    <rect
                      x={x}
                      y={y}
                      width={128}
                      height={88}
                      fill={
                        isActive
                          ? "rgba(224,31,47,0.16)"
                          : isLit
                            ? "rgba(224,31,47,0.07)"
                            : "rgba(17,20,31,0.8)"
                      }
                      stroke={
                        isActive
                          ? "var(--color-signal-red-bright)"
                          : isLit
                            ? "rgba(224,31,47,0.6)"
                            : "var(--color-hairline)"
                      }
                      strokeWidth={isActive ? 2 : 1.2}
                    />
                    {/* HUD corner ticks */}
                    <g
                      stroke={isActive ? "var(--color-gold)" : isLit ? "var(--color-signal-red)" : "var(--color-hairline)"}
                      strokeWidth={1.6}
                      fill="none"
                    >
                      <path d={`M ${x} ${y + 10} L ${x} ${y} L ${x + 10} ${y}`} />
                      <path d={`M ${x + 118} ${y} L ${x + 128} ${y} L ${x + 128} ${y + 10}`} />
                      <path d={`M ${x + 128} ${y + 78} L ${x + 128} ${y + 88} L ${x + 118} ${y + 88}`} />
                      <path d={`M ${x + 10} ${y + 88} L ${x} ${y + 88} L ${x} ${y + 78}`} />
                    </g>
                    <text
                      x={x + 10}
                      y={y + 18}
                      className="font-mono"
                      fontSize={9}
                      fill={isActive ? "var(--color-gold)" : "var(--color-paper-dim)"}
                      letterSpacing="0.15em"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </text>
                    <text
                      x={x + 64}
                      y={l2 ? y + 40 : y + 47}
                      textAnchor="middle"
                      className="font-mono"
                      fontSize={12.5}
                      fontWeight="700"
                      letterSpacing="0.08em"
                      fill={
                        isActive || isLit ? "var(--color-paper)" : "var(--color-paper-dim)"
                      }
                    >
                      {l1}
                    </text>
                    {l2 && (
                      <text
                        x={x + 64}
                        y={y + 56}
                        textAnchor="middle"
                        className="font-mono"
                        fontSize={12.5}
                        fontWeight="700"
                        letterSpacing="0.08em"
                        fill={isActive || isLit ? "var(--color-paper)" : "var(--color-paper-dim)"}
                      >
                        {l2}
                      </text>
                    )}
                    <text
                      x={x + 64}
                      y={y + 76}
                      textAnchor="middle"
                      className="font-mono"
                      fontSize={9}
                      letterSpacing="0.12em"
                      fill="var(--color-paper-dim)"
                      opacity={0.8}
                    >
                      {stage.sub}
                    </text>
                    {/* focus ring */}
                    <rect
                      x={x - 4}
                      y={y - 4}
                      width={136}
                      height={96}
                      fill="none"
                      stroke="var(--color-gold)"
                      strokeWidth={1}
                      className="opacity-0 focus-visible:opacity-100"
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* mobile: vertical flow */}
          <div className="lg:hidden">
            <ol className="flex flex-col">
              {aegisStages.map((stage, i) => {
                const isActive = i === activeIdx;
                const isLit = i < activeIdx;
                return (
                  <li key={stage.id} className="flex flex-col items-stretch">
                    <button
                      type="button"
                      onClick={() => selectStage(i)}
                      aria-pressed={pinned === i}
                      data-sense="true"
                      className={cn(
                        "relative flex items-center gap-3 border px-4 py-3 text-left transition-colors",
                        isActive
                          ? "border-signal-red-bright bg-signal-red/10"
                          : isLit
                            ? "border-signal-red/50 bg-signal-red/[0.05]"
                            : "border-hairline bg-ink-panel/60"
                      )}
                    >
                      <span
                        className={cn(
                          "font-mono text-[10px]",
                          isActive ? "text-gold" : "text-paper-dim"
                        )}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1">
                        <span
                          className={cn(
                            "block font-mono text-[11px] font-bold tracking-[0.15em]",
                            isActive || isLit ? "text-paper" : "text-paper-dim"
                          )}
                        >
                          {stage.label}
                        </span>
                        <span className="block font-mono text-[9px] tracking-[0.1em] text-paper-dim/80 uppercase">
                          {stage.sub}
                        </span>
                      </span>
                      {isActive && (
                        <span className="h-1.5 w-1.5 animate-pulse-slow rounded-full bg-signal-red-bright" aria-hidden />
                      )}
                    </button>
                    {i < aegisStages.length - 1 && (
                      <div className="relative mx-auto h-7 w-px bg-hairline" aria-hidden>
                        {isLit && !reduceMotion && (
                          <span className="absolute top-0 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-signal-red-bright trace-drop" />
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>

          {/* stage inspector */}
          <div className="mt-6 min-h-[76px] border border-hairline bg-ink/80 p-4" role="status" aria-live="polite">
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <p className="font-mono text-[10px] tracking-[0.25em] text-signal-red-bright uppercase">
                STAGE {String(aegisStages.indexOf(selected) + 1).padStart(2, "0")} — {selected.label}
              </p>
              <p className="mt-1 text-sm text-paper/90">{selected.detail}</p>
            </motion.div>
          </div>
          <p className="mt-3 font-mono text-[10px] text-paper-dim/60">
            * conceptual simulation of the request lifecycle — representative of the architecture,
            not a live production connection.
          </p>
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
                Hover, tap or focus an agent to inspect its responsibility.
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
          {aegis.links?.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              data-sense="true"
              className="ml-auto flex items-center gap-2 border border-hairline px-3.5 py-1.5 font-mono text-[10px] tracking-[0.2em] text-paper-dim uppercase transition-colors hover:border-signal-red-bright hover:text-signal-red-bright"
            >
              <ExternalLink size={12} /> {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
