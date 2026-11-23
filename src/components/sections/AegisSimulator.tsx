"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Check, Pause, Play, RotateCcw, ShieldAlert, Skull, Zap } from "lucide-react";
import { aegisAgents } from "@/data/resume";
import {
  BREAKER_OPEN_MS,
  HEARTBEAT_TIMEOUT,
  MAX_ATTEMPTS,
  MAX_WORKERS,
  PRESETS,
  canCrash,
  createRun,
  flakyCandidates,
  killWorker,
  layers,
  presetFor,
  resolveApproval,
  step,
  toggleFlaky,
  type Phase,
  type Run,
  type TaskState,
  type TaskStatus,
} from "@/lib/aegis-sim";
import { useReducedMotionSafe } from "@/lib/reduced-motion";
import { cn } from "@/lib/utils";

const AGENT_NAME: Record<string, string> = Object.fromEntries(
  aegisAgents.map((a) => [a.id === "mcp" ? "mcp" : a.id, a.name])
);

const PHASES: { id: Phase; label: string }[] = [
  { id: "planning", label: "Plan" },
  { id: "executing", label: "Execute" },
  { id: "evaluating", label: "Evaluate" },
  { id: "synthesizing", label: "Synthesise" },
  { id: "done", label: "Result" },
];

const STATUS_LABEL: Record<TaskStatus, string> = {
  pending: "waiting on dependencies",
  queued: "queued for a worker",
  approval: "needs approval",
  running: "running",
  orphaned: "worker down: heartbeat lost",
  backoff: "failed, will retry",
  done: "done, checkpoint saved",
  blocked: "blocked",
};

function statusStyle(s: TaskState, breakerOpen: boolean) {
  switch (s.status) {
    case "running":
      return "border-paper bg-ink-panel";
    case "done":
      return "border-web-blue-bright bg-ink-panel";
    case "queued":
      return breakerOpen ? "border-gold/70 border-dashed bg-ink-panel/60" : "border-web-blue-bright/60 bg-ink-panel/60";
    case "approval":
      return "border-gold bg-gold/10";
    case "orphaned":
      return "border-signal-red-bright border-dashed bg-signal-red/10";
    case "backoff":
      return "border-gold border-dashed bg-ink-panel/60";
    case "blocked":
      return "border-signal-red-bright bg-signal-red/10";
    default:
      return "border-hairline bg-ink-panel/30";
  }
}

type Edge = { key: string; d: string; from: string; to: string };

/**
 * AegisForge simulator. A SIMULATION: it runs in the visitor's browser with
 * scripted timings and canned outputs and is never connected to a backend. The
 * behaviour it shows (bounded workers, plan validation, retries, a per-tool
 * circuit breaker, heartbeat claim recovery, checkpoints, approval gates, a
 * critic) follows the documented AegisForge architecture.
 */
export function AegisSimulator() {
  const reduceMotion = useReducedMotionSafe();
  const [presetId, setPresetId] = useState<string>(PRESETS[0].id);
  const [custom, setCustom] = useState("");
  const [speed, setSpeed] = useState<1 | 3>(1);
  const [paused, setPaused] = useState(false);
  const [, force] = useState(0);
  // The run is mutated in place by the clock below; `force` re-renders after each tick.
  const [run, setRun] = useState<Run | null>(null);
  const runRef = useRef<Run | null>(null);
  const visibleRef = useRef(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLOListElement>(null);

  const preset = presetFor(presetId, custom);
  const presetRef = useRef(preset);
  useEffect(() => {
    presetRef.current = preset;
  });

  const rerender = useCallback(() => force((n) => n + 1), []);

  // the clock: only advances while visible, running and not paused
  useEffect(() => {
    let last = performance.now();
    const id = window.setInterval(() => {
      const now = performance.now();
      const dt = Math.min(120, now - last);
      last = now;
      const r = runRef.current;
      if (!r || paused || !visibleRef.current || r.phase === "idle" || r.phase === "done") return;
      step(r, presetRef.current, dt * speed);
      rerender();
    }, 80);
    return () => window.clearInterval(id);
  }, [paused, speed, rerender]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      visibleRef.current = e.isIntersecting;
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // keep the log scrolled to the newest entry (inside the log, not the page)
  const logLen = run?.log.length ?? 0;
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [logLen]);

  function start() {
    const r = createRun(preset);
    runRef.current = r;
    setRun(r);
    setPaused(false);
  }
  function reset() {
    runRef.current = null;
    setRun(null);
    setPaused(false);
  }
  function choose(id: string) {
    setPresetId(id);
    runRef.current = null;
    setRun(null);
  }

  // ---------------- graph layout (desktop): measured once per preset / resize
  const depth = layers(preset.tasks);
  const columns = Math.max(...Object.values(depth)) + 1;
  const byCol: string[][] = Array.from({ length: columns }, () => []);
  preset.tasks.forEach((t) => byCol[depth[t.id]].push(t.id));

  const graphRef = useRef<HTMLDivElement>(null);
  const nodeEls = useRef<Record<string, HTMLDivElement | null>>({});
  const [edges, setEdges] = useState<Edge[]>([]);

  const measure = useCallback(() => {
    const g = graphRef.current;
    if (!g) return;
    const gr = g.getBoundingClientRect();
    const out: Edge[] = [];
    for (const t of presetFor(presetId, "").tasks) {
      const to = nodeEls.current[t.id];
      if (!to) continue;
      for (const dep of t.deps) {
        const from = nodeEls.current[dep];
        if (!from) continue;
        const a = from.getBoundingClientRect();
        const b = to.getBoundingClientRect();
        const x1 = a.right - gr.left;
        const y1 = a.top + a.height / 2 - gr.top;
        const x2 = b.left - gr.left;
        const y2 = b.top + b.height / 2 - gr.top;
        const mx = (x1 + x2) / 2;
        out.push({ key: `${dep}-${t.id}`, d: `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`, from: dep, to: t.id });
      }
    }
    setEdges(out);
  }, [presetId]);

  useLayoutEffect(() => {
    measure();
    const g = graphRef.current;
    if (!g) return;
    const ro = new ResizeObserver(measure);
    ro.observe(g);
    return () => ro.disconnect();
  }, [measure]);

  const phaseIndex = run ? PHASES.findIndex((p) => p.id === run.phase) : -1;
  const executing = run?.phase === "executing";
  const candidates = run && executing ? flakyCandidates(run, preset) : [];
  const running = run && run.phase !== "idle" && run.phase !== "done";

  return (
    <div ref={rootRef} className="mt-16 border border-hairline bg-ink-soft">
      {/* the honesty banner: always visible */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-gold/40 bg-gold/[0.07] px-4 py-3 sm:px-6">
        <span className="border border-gold px-2 py-0.5 font-mono text-[10px] font-bold tracking-[0.18em] text-gold">
          SIMULATION
        </span>
        <p className="text-sm text-paper/90">
          Runs in your browser with scripted timings. It is <strong className="font-medium">not</strong>{" "}
          connected to the AegisForge backend.
        </p>
      </div>

      {/* controls */}
      <div className="flex flex-col gap-4 border-b border-hairline px-4 py-5 sm:px-6">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Choose a sample task">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => choose(p.id)}
              disabled={Boolean(running)}
              aria-pressed={presetId === p.id}
              className={cn(
                "border px-3.5 py-2 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                presetId === p.id
                  ? "border-signal-red-bright bg-signal-red/15 text-paper"
                  : "border-hairline text-paper-dim hover:border-paper/50 hover:text-paper"
              )}
            >
              {p.title}
            </button>
          ))}
          <button
            type="button"
            onClick={() => choose("custom")}
            disabled={Boolean(running)}
            aria-pressed={presetId === "custom"}
            className={cn(
              "border px-3.5 py-2 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50",
              presetId === "custom"
                ? "border-signal-red-bright bg-signal-red/15 text-paper"
                : "border-hairline text-paper-dim hover:border-paper/50 hover:text-paper"
            )}
          >
            Write your own
          </button>
        </div>

        {presetId === "custom" && (
          <label className="flex flex-col gap-1.5">
            <span className="text-sm text-paper-dim">
              Your text is only displayed. The plan and output are a fixed template.
            </span>
            <input
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              disabled={Boolean(running)}
              maxLength={120}
              placeholder="e.g. Research competitors and write a short brief"
              className="w-full max-w-xl border border-hairline bg-ink px-3 py-2 text-sm text-paper placeholder:text-paper-dim/60 focus:border-signal-red-bright focus:outline-none"
            />
          </label>
        )}

        <div className="flex flex-wrap items-center gap-3">
          {!running ? (
            <button
              type="button"
              onClick={start}
              className="suit-weave inline-flex items-center gap-2 border-2 border-ink px-5 py-2.5 text-sm font-semibold text-paper [text-shadow:0_1px_0_rgba(0,0,0,0.6)] transition-[filter] hover:brightness-110"
            >
              <Play size={15} /> {run?.phase === "done" ? "Run again" : "Run it"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              className="inline-flex items-center gap-2 border-2 border-paper/70 px-5 py-2.5 text-sm text-paper transition-colors hover:border-gold hover:text-gold"
            >
              {paused ? <Play size={15} /> : <Pause size={15} />} {paused ? "Resume" : "Pause"}
            </button>
          )}
          {run && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 px-3 py-2.5 text-sm text-paper-dim transition-colors hover:text-paper"
            >
              <RotateCcw size={14} /> Reset
            </button>
          )}
          <div className="ml-auto flex items-center gap-1 text-sm text-paper-dim" role="group" aria-label="Simulation speed">
            <span className="mr-1">Speed</span>
            {([1, 3] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSpeed(s)}
                aria-pressed={speed === s}
                className={cn(
                  "border px-2.5 py-1 font-mono text-xs transition-colors",
                  speed === s ? "border-paper text-paper" : "border-hairline hover:text-paper"
                )}
              >
                {s}×
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* ---------------- the run ---------------- */}
        <div className="px-4 py-6 sm:px-6 lg:col-span-8">
          {/* phase strip */}
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm" aria-label="Run phase">
            {PHASES.map((p, i) => (
              <li key={p.id} className="flex items-center gap-2">
                <span
                  className={cn(
                    "transition-colors",
                    run && i === phaseIndex
                      ? "font-medium text-signal-red-bright"
                      : run && i < phaseIndex
                        ? "text-paper"
                        : "text-paper-dim/60"
                  )}
                >
                  {p.label}
                </span>
                {i < PHASES.length - 1 && <span className="text-paper-dim/40" aria-hidden>/</span>}
              </li>
            ))}
          </ol>

          {/* plan validation */}
          <div className="mt-4 min-h-[5.5rem]">
            {run ? (
              <ul className="flex flex-col gap-1.5">
                {run.checks.map((c) => (
                  <li key={c.label} className="flex items-center gap-2.5 text-sm">
                    <span
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center border transition-colors",
                        c.done ? "border-web-blue-bright bg-web-blue/40 text-paper" : "border-hairline"
                      )}
                      aria-hidden
                    >
                      {c.done && <Check size={11} />}
                    </span>
                    <span className={c.done ? "text-paper" : "text-paper-dim"}>{c.label}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="max-w-lg text-sm leading-relaxed text-paper-dim">
                Pick a task and press <strong className="font-medium text-paper">Run it</strong>. The
                planner will split it into tasks, check the plan, and hand the tasks to two workers.
                While it runs you can crash a worker or make a tool unreliable and watch it recover.
              </p>
            )}
          </div>

          {/* the task graph: columns with measured edges on desktop, a list on mobile */}
          <div ref={graphRef} className="relative mt-5">
            <svg className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block" aria-hidden>
              {edges.map((e) => {
                const src = run?.tasks[e.from]?.status;
                const dst = run?.tasks[e.to]?.status;
                const lit = src === "done";
                const live = lit && (dst === "running" || dst === "queued");
                return (
                  <g key={e.key}>
                    <path d={e.d} fill="none" stroke="var(--color-hairline)" strokeWidth={1.25} />
                    {lit && (
                      <path
                        d={e.d}
                        fill="none"
                        stroke="var(--color-signal-red-bright)"
                        strokeWidth={live ? 2 : 1.5}
                        opacity={live ? 1 : 0.55}
                        className={live && !reduceMotion ? "trace-run" : undefined}
                      />
                    )}
                  </g>
                );
              })}
            </svg>

            <div
              className="relative grid gap-x-3 gap-y-6 lg:gap-x-12"
              style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
            >
              {byCol.map((ids, ci) => (
                <div key={ci} className="col-span-full flex flex-col justify-center gap-3 lg:col-span-1">
                  {ids.map((id) => {
                    const t = preset.tasks.find((x) => x.id === id)!;
                    const s = run?.tasks[id];
                    const state: TaskState = s ?? {
                      status: "pending",
                      progress: 0,
                      attempt: 0,
                      worker: null,
                      checkpointed: false,
                      resumedFromCheckpoint: false,
                      retryAt: 0,
                      note: "",
                    };
                    const breaker = run?.breakers[t.tool];
                    const breakerOpen = breaker?.state === "open";
                    const pct = state.status === "running" ? Math.min(100, (state.progress / t.dur) * 100) : state.status === "done" ? 100 : 0;
                    return (
                      <div
                        key={id}
                        ref={(el) => {
                          nodeEls.current[id] = el;
                        }}
                        className={cn(
                          "relative min-h-[6.5rem] border-2 px-3.5 py-3 transition-colors duration-200",
                          statusStyle(state, Boolean(breakerOpen))
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[15px] leading-snug font-medium text-paper">{t.label}</p>
                          {state.status === "done" && <Check size={15} className="mt-0.5 shrink-0 text-web-blue-bright" aria-label="done" />}
                          {state.status === "approval" && <ShieldAlert size={15} className="mt-0.5 shrink-0 text-gold" aria-label="needs approval" />}
                          {(state.status === "orphaned" || state.status === "blocked") && (
                            <Skull size={15} className="mt-0.5 shrink-0 text-signal-red-bright" aria-label="stopped" />
                          )}
                        </div>
                        <p className="mt-1 text-xs text-paper-dim">
                          {AGENT_NAME[t.agent]} · <span className="font-mono">{t.tool}</span>
                        </p>
                        {t.deps.length > 0 && (
                          <p className="mt-0.5 text-[11px] text-paper-dim/70 lg:hidden">
                            after: {t.deps.map((d) => preset.tasks.find((x) => x.id === d)!.label).join(", ")}
                          </p>
                        )}
                        <p
                          className={cn(
                            "mt-2 text-[11px]",
                            state.status === "running" || state.status === "done"
                              ? "text-paper"
                              : state.status === "orphaned" || state.status === "blocked"
                                ? "text-signal-red-bright"
                                : state.status === "approval" || state.status === "backoff"
                                  ? "text-gold"
                                  : "text-paper-dim/70"
                          )}
                        >
                          {run
                            ? state.status === "queued" && breakerOpen
                              ? "waiting: circuit breaker is open"
                              : STATUS_LABEL[state.status]
                            : "ready"}
                          {state.attempt > 1 && state.status !== "done" && ` · attempt ${Math.min(state.attempt, MAX_ATTEMPTS)}/${MAX_ATTEMPTS}`}
                          {state.status === "done" && state.attempt > 1 && ` · took ${state.attempt} attempts`}
                          {state.status === "done" && state.resumedFromCheckpoint && " · recovered"}
                        </p>
                        <div className="mt-2 h-[3px] w-full bg-hairline" aria-hidden>
                          <div
                            className={cn("h-full transition-[width] duration-100", state.status === "done" ? "bg-web-blue-bright" : "bg-signal-red-bright")}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* workers */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(run?.workers ?? Array.from({ length: MAX_WORKERS }, (_, i) => ({ id: `worker-${String.fromCharCode(65 + i)}`, taskId: null, alive: true, lastBeat: 0, downSince: null as number | null }))).map((w) => {
              const task = w.taskId ? preset.tasks.find((t) => t.id === w.taskId) : null;
              const silent = w.downSince !== null && run ? Math.max(0, run.t - w.downSince) : 0;
              return (
                <div key={w.id} className={cn("border px-3.5 py-2.5 transition-colors", w.alive ? "border-hairline" : "border-signal-red-bright bg-signal-red/10")}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="flex items-center gap-2 font-mono text-xs text-paper">
                      <span
                        className={cn(
                          "h-2 w-2 rounded-full",
                          w.alive ? (task && !reduceMotion ? "animate-pulse bg-web-blue-bright" : "bg-web-blue-bright") : "bg-signal-red-bright"
                        )}
                        aria-hidden
                      />
                      {w.id}
                    </span>
                    <span className={cn("text-xs", w.alive ? "text-paper-dim" : "text-signal-red-bright")}>
                      {w.alive
                        ? task
                          ? `running: ${task.label}`
                          : run
                            ? "idle"
                            : "ready"
                        : `crashed · no heartbeat ${(Math.min(silent, HEARTBEAT_TIMEOUT) / 1000).toFixed(1)}s / ${(HEARTBEAT_TIMEOUT / 1000).toFixed(1)}s`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* approval gate */}
          {run?.approval && (
            <div className="mt-5 border-2 border-gold bg-gold/10 p-4" role="alert">
              <p className="flex items-center gap-2 text-sm font-medium text-gold">
                <ShieldAlert size={16} /> Approval gate
              </p>
              <p className="mt-1.5 max-w-xl text-sm text-paper">
                &ldquo;{preset.tasks.find((t) => t.id === run.approval!.taskId)!.label}&rdquo; wants to call{" "}
                <span className="font-mono text-xs">{preset.tasks.find((t) => t.id === run.approval!.taskId)!.tool}</span>, a
                high-risk tool. Tool access is denied by default, so it waits for you.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    resolveApproval(run, preset, true);
                    rerender();
                  }}
                  className="bg-paper px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-signal-red-bright hover:text-paper"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resolveApproval(run, preset, false);
                    rerender();
                  }}
                  className="border border-paper/60 px-4 py-2 text-sm text-paper transition-colors hover:border-signal-red-bright hover:text-signal-red-bright"
                >
                  Deny
                </button>
                <span className="text-xs text-paper-dim">Demo only: auto-approves after 9 seconds so the run never stalls.</span>
              </div>
            </div>
          )}

          {/* break it */}
          <div className="mt-6 border-t border-hairline pt-5">
            <p className="text-sm font-medium text-paper">Break it</p>
            <p className="mt-1 text-xs text-paper-dim">
              Available once the plan is running. If nothing is running at that instant, the crash is armed and hits the next task.
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <button
                type="button"
                disabled={!run || !canCrash(run)}
                onClick={() => {
                  if (run) killWorker(run);
                  rerender();
                }}
                className="inline-flex items-center gap-2 border border-signal-red-bright/70 px-4 py-2 text-sm text-signal-red-bright transition-colors hover:bg-signal-red/15 disabled:cursor-not-allowed disabled:border-hairline disabled:text-paper-dim/50 disabled:hover:bg-transparent"
              >
                <Skull size={15} /> {run?.armedCrash ? "Crash armed" : "Crash a worker"}
              </button>
              <button
                type="button"
                disabled={!executing || (candidates.length === 0 && !run?.flakyTool)}
                onClick={() => {
                  if (!run) return;
                  if (run.flakyTool) {
                    toggleFlaky(run, null);
                  } else if (candidates[0]) {
                    toggleFlaky(run, candidates[0]);
                  }
                  rerender();
                }}
                aria-pressed={Boolean(run?.flakyTool)}
                className="inline-flex items-center gap-2 border border-gold/70 px-4 py-2 text-sm text-gold transition-colors hover:bg-gold/10 disabled:cursor-not-allowed disabled:border-hairline disabled:text-paper-dim/50 disabled:hover:bg-transparent"
              >
                <Zap size={15} />
                {run?.flakyTool ? `Fix ${run.flakyTool}` : candidates[0] ? `Make ${candidates[0]} flaky` : "Make a tool flaky"}
              </button>
            </div>
          </div>
        </div>

        {/* ---------------- the system's state ---------------- */}
        <aside className="border-t border-hairline px-4 py-6 sm:px-6 lg:col-span-4 lg:border-t-0 lg:border-l">
          <dl className="grid grid-cols-3 gap-3 text-center">
            {[
              { k: "Checkpoints", v: run?.checkpoints ?? 0 },
              { k: "Retries", v: run?.retries ?? 0 },
              { k: "Recoveries", v: run?.recoveries ?? 0 },
            ].map((m) => (
              <div key={m.k} className="border border-hairline px-2 py-2.5">
                <dd className="font-display text-3xl leading-none tracking-wide text-paper">{String(m.v).padStart(2, "0")}</dd>
                <dt className="mt-1 text-[11px] text-paper-dim">{m.k}</dt>
              </div>
            ))}
          </dl>

          {run && Object.keys(run.breakers).length > 0 && (
            <ul className="mt-4 flex flex-col gap-1.5">
              {Object.entries(run.breakers).map(([tool, b]) => (
                <li key={tool} className="flex items-center justify-between text-xs">
                  <span className="font-mono text-paper-dim">{tool}</span>
                  <span
                    className={cn(
                      b.state === "closed" ? "text-paper-dim" : b.state === "open" ? "text-signal-red-bright" : "text-gold"
                    )}
                  >
                    breaker {b.state}
                    {b.state === "open" && ` (${(BREAKER_OPEN_MS / 1000).toFixed(1)}s)`}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <p className="mt-6 text-sm font-medium text-paper">Event log</p>
          <ol
            ref={logRef}
            className="mt-2 h-72 overflow-y-auto border border-hairline bg-ink px-3 py-2 font-mono text-[11.5px] leading-relaxed"
            aria-label="Simulation event log"
          >
            {run?.log.length ? (
              run.log.map((l, i) => (
                <li
                  key={i}
                  className={cn(
                    "py-0.5",
                    l.kind === "good" && "text-web-blue-bright",
                    l.kind === "bad" && "text-signal-red-bright",
                    l.kind === "warn" && "text-gold",
                    l.kind === "info" && "text-paper-dim"
                  )}
                >
                  <span className="text-paper-dim/50">{(l.t / 1000).toFixed(1).padStart(5, " ")}s </span>
                  {l.text}
                </li>
              ))
            ) : (
              <li className="text-paper-dim/60">Waiting for a run. Everything here is simulated.</li>
            )}
          </ol>
        </aside>
      </div>

      {/* evaluation + result */}
      {run && (run.phase === "evaluating" || run.phase === "synthesizing" || run.phase === "done") && (
        <div className="border-t border-hairline px-4 py-6 sm:px-6">
          <div className="grid grid-cols-1 gap-x-12 gap-y-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="text-sm font-medium text-paper">Critic scores</p>
              <ul className="mt-3 flex flex-col gap-3">
                {run.evals.map((e) => {
                  const shown = run.phase === "evaluating" ? Math.min(e.score, (run.phaseT / 1800) * e.score) : e.score;
                  return (
                    <li key={e.label}>
                      <div className="flex items-baseline justify-between text-sm">
                        <span className="text-paper/90">{e.label}</span>
                        <span className={cn("font-mono text-xs", e.score < e.threshold ? "text-signal-red-bright" : "text-paper")}>
                          {shown.toFixed(2)}
                        </span>
                      </div>
                      <div className="relative mt-1.5 h-[5px] w-full bg-hairline" aria-hidden>
                        <div
                          className={cn("h-full", e.score < e.threshold ? "bg-signal-red-bright" : "bg-web-blue-bright")}
                          style={{ width: `${shown * 100}%` }}
                        />
                        <span className="absolute top-[-3px] h-[11px] w-px bg-paper/70" style={{ left: `${e.threshold * 100}%` }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-2 text-[11px] text-paper-dim">The thin marker is the pass threshold.</p>
            </div>

            <div className="lg:col-span-7">
              <p className="text-sm font-medium text-paper">Result</p>
              {run.phase === "done" && run.result ? (
                <>
                  <p className="mt-3 max-w-xl font-serif text-2xl leading-snug text-paper sm:text-[1.7rem]">{run.result}</p>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-paper-dim">
                    <span className="text-paper">What just happened:</span> {run.checkpoints} task{run.checkpoints === 1 ? "" : "s"} were
                    checkpointed
                    {run.recoveries > 0 && `, ${run.recoveries} claim${run.recoveries === 1 ? "" : "s"} recovered after a crash with no finished work re-run`}
                    {run.retries > 0 && `, ${run.retries} failed call${run.retries === 1 ? "" : "s"} retried with backoff`}
                    {run.denied && ", and one tool call was denied at the approval gate"}. The output is canned: this was a simulation.
                  </p>
                </>
              ) : (
                <p className="mt-3 text-sm text-paper-dim">
                  {run.phase === "evaluating" ? "The critic is scoring the output against its criteria…" : "Synthesis is composing the final result…"}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* what is modelled, for engineers */}
      <details className="border-t border-hairline px-4 py-4 text-sm sm:px-6">
        <summary className="cursor-pointer text-paper-dim transition-colors hover:text-paper">
          What this models in the real system
        </summary>
        <ul className="mt-3 grid max-w-3xl list-disc gap-1.5 pl-5 text-paper-dim marker:text-signal-red-bright">
          <li>The plan is validated (schema, dependency and cycle checks) before anything runs.</li>
          <li>Tasks run as a dependency-ordered graph with bounded parallelism ({MAX_WORKERS} workers here), plus retries and timeouts.</li>
          <li>A per-tool circuit breaker rejects calls to a tool that keeps failing, then allows one trial call.</li>
          <li>A queue hands tasks to workers. A worker that stops heartbeating has its claim recovered and the task re-queued.</li>
          <li>Per-task checkpoints mean a run resumes without re-running finished tasks.</li>
          <li>Tool access is deny-by-default, with approval gates for high-risk tools.</li>
          <li>A critic scores the output before it is released.</li>
        </ul>
        <p className="mt-3 max-w-3xl text-paper-dim">
          What is <em>not</em> real here: the timings, the task outputs and the scores are all scripted, nothing leaves your browser, and
          there is no model, queue or database behind it. The real system and its 773 tests are in the repository.
        </p>
      </details>
    </div>
  );
}
