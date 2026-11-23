/**
 * AegisForge simulation engine.
 *
 * This is a SIMULATION. It runs entirely in the visitor's browser with scripted
 * timings and canned outputs; it is not connected to any backend. It models the
 * documented AegisForge architecture so the behaviour is faithful:
 *
 *  - a planner produces a plan that is validated (schema, dependency, cycle checks)
 *  - the plan runs as a dependency-ordered task graph with BOUNDED parallelism
 *  - tasks have retries and timeouts; a per-tool circuit breaker guards tools
 *  - a job queue hands tasks to workers; a worker that stops heartbeating has its
 *    claim recovered and the task re-queued
 *  - every finished task is checkpointed, so recovery never re-runs finished work
 *  - tool access is deny-by-default: high-risk tools wait for an approval gate
 *  - a critic scores the output before it is released, then synthesis composes it
 *
 * The engine is pure and deterministic: `step(run, dtMs)` advances time. The UI
 * owns the clock. Nothing here touches the DOM.
 */

export type AgentId = "research" | "knowledge" | "code" | "analysis" | "mcp";

export type TaskDef = {
  id: string;
  label: string;
  agent: AgentId;
  tool: string;
  deps: string[];
  dur: number; // ms of work at 1x
  risk?: "high"; // goes through the approval gate
  output: string; // what it hands to downstream tasks (canned)
};

export type Preset = {
  id: string;
  title: string;
  prompt: string;
  tasks: TaskDef[];
  /** layout: column (dependency depth) and row, derived from the graph */
  result: string;
  /** shown if the approval gate is denied */
  deniedNote: string;
};

export type TaskStatus =
  | "pending" // waiting on dependencies
  | "queued" // ready, waiting for a free worker
  | "approval" // waiting at the approval gate
  | "running"
  | "orphaned" // its worker stopped heartbeating
  | "backoff" // failed, waiting to retry
  | "done"
  | "blocked"; // denied, or depends on something that was

export type TaskState = {
  status: TaskStatus;
  progress: number; // ms of work done in the current attempt
  attempt: number;
  worker: number | null;
  checkpointed: boolean;
  resumedFromCheckpoint: boolean; // recovered after an interruption
  retryAt: number;
  note: string;
};

export type Worker = {
  id: string;
  taskId: string | null;
  alive: boolean;
  lastBeat: number;
  downSince: number | null;
};

export type Breaker = { fails: number; state: "closed" | "open" | "half-open"; openUntil: number };

export type LogKind = "info" | "good" | "warn" | "bad";
export type LogEntry = { t: number; kind: LogKind; text: string };

export type Phase = "idle" | "planning" | "executing" | "evaluating" | "synthesizing" | "done";

export type EvalScore = { label: string; score: number; threshold: number };

export type Run = {
  presetId: string;
  title: string;
  phase: Phase;
  t: number; // ms since start
  phaseT: number; // ms since the current phase began
  checks: { label: string; done: boolean }[];
  tasks: Record<string, TaskState>;
  workers: Worker[];
  breakers: Record<string, Breaker>;
  flakyTool: string | null;
  flakyFails: Record<string, number>;
  approval: { taskId: string; since: number } | null;
  approved: Record<string, boolean>;
  checkpoints: number;
  retries: number;
  recoveries: number;
  log: LogEntry[];
  evals: EvalScore[];
  result: string | null;
  denied: boolean;
  /** a crash was requested while nothing was running: it hits the next task that starts */
  armedCrash: boolean;
};

// ---------------------------------------------------------------- constants

export const MAX_WORKERS = 2; // bounded parallelism
export const HEARTBEAT_TIMEOUT = 2200; // ms without a heartbeat before the claim is recovered
export const RETRY_BACKOFF = 900;
export const MAX_ATTEMPTS = 3;
export const BREAKER_THRESHOLD = 2; // consecutive failures before the breaker opens
export const BREAKER_OPEN_MS = 1800;
export const APPROVAL_AUTO_MS = 9000; // demo only: auto-approve so the run never stalls
const WORKER_RESTART = 1300;
const PLAN_STEP = 700;
const EVAL_MS = 2400;
const SYNTH_MS = 1700;

// ---------------------------------------------------------------- presets

export const PRESETS: Preset[] = [
  {
    id: "incident",
    title: "Summarise last quarter's incident reports and propose fixes",
    prompt: "Summarise last quarter's incident reports and propose fixes",
    tasks: [
      { id: "t1", label: "Retrieve incident reports", agent: "knowledge", tool: "vector_search", deps: [], dur: 2200, output: "41 reports" },
      { id: "t2", label: "Look up known-issue pages", agent: "research", tool: "web_search", deps: [], dur: 2600, output: "6 pages" },
      { id: "t3", label: "Cluster incidents by cause", agent: "analysis", tool: "analyze", deps: ["t1"], dur: 2300, output: "3 causes" },
      { id: "t4", label: "Propose fixes", agent: "analysis", tool: "analyze", deps: ["t3", "t2"], dur: 2100, output: "5 fixes" },
      { id: "t5", label: "File follow-up tickets", agent: "mcp", tool: "tracker_write", deps: ["t4"], dur: 1800, risk: "high", output: "5 tickets" },
    ],
    result:
      "Three recurring causes account for most incidents: unbounded retries, a missing timeout on one downstream call, and alerts that fire too late. Five fixes are proposed, ordered by impact, each linked to the reports that support it. Follow-up tickets were filed.",
    deniedNote: "The follow-up tickets were not filed (action denied at the approval gate). The analysis and fixes are complete.",
  },
  {
    id: "contracts",
    title: "Compare two vendor contracts and flag risky clauses",
    prompt: "Compare two vendor contracts and flag risky clauses",
    tasks: [
      { id: "t1", label: "Read contract A", agent: "knowledge", tool: "vector_search", deps: [], dur: 2000, output: "34 clauses" },
      { id: "t2", label: "Read contract B", agent: "knowledge", tool: "vector_search", deps: [], dur: 2000, output: "29 clauses" },
      { id: "t3", label: "Align matching clauses", agent: "analysis", tool: "analyze", deps: ["t1", "t2"], dur: 2400, output: "22 pairs" },
      { id: "t4", label: "Check standard terms online", agent: "research", tool: "web_search", deps: ["t3"], dur: 2200, output: "4 references" },
      { id: "t5", label: "Write the review to the shared doc", agent: "mcp", tool: "doc_write", deps: ["t3", "t4"], dur: 1700, risk: "high", output: "1 document" },
    ],
    result:
      "22 clauses line up across both contracts. Four differ in ways that matter: liability cap, auto-renewal, data retention and termination notice. Each is listed with the wording from both sides and a note on the usual market term. The review was written to the shared document.",
    deniedNote: "The review was not written to the shared document (action denied at the approval gate). The comparison is complete.",
  },
  {
    id: "review",
    title: "Review this pull request and post feedback",
    prompt: "Review this pull request and post feedback",
    tasks: [
      { id: "t1", label: "Read the diff", agent: "code", tool: "repo_read", deps: [], dur: 1700, output: "12 files" },
      { id: "t2", label: "Run the test suite", agent: "code", tool: "sandbox_run", deps: ["t1"], dur: 2800, output: "tests ran" },
      { id: "t3", label: "Check for security issues", agent: "analysis", tool: "analyze", deps: ["t1"], dur: 2300, output: "2 notes" },
      { id: "t4", label: "Look up the API change notes", agent: "research", tool: "web_search", deps: [], dur: 2100, output: "1 changelog" },
      { id: "t5", label: "Post review comments", agent: "mcp", tool: "pr_comment", deps: ["t2", "t3", "t4"], dur: 1600, risk: "high", output: "4 comments" },
    ],
    result:
      "The change is mostly sound. The tests pass, there are two security notes (an unvalidated input and a missing permission check), and the API change affects one caller. Four review comments were prepared and posted.",
    deniedNote: "The review comments were not posted (action denied at the approval gate). The review itself is complete.",
  },
];

export const CUSTOM_PRESET: Preset = {
  id: "custom",
  title: "Your task",
  prompt: "",
  tasks: [
    { id: "t1", label: "Retrieve relevant context", agent: "knowledge", tool: "vector_search", deps: [], dur: 2100, output: "context" },
    { id: "t2", label: "Look up outside references", agent: "research", tool: "web_search", deps: [], dur: 2400, output: "references" },
    { id: "t3", label: "Analyse what was found", agent: "analysis", tool: "analyze", deps: ["t1", "t2"], dur: 2300, output: "findings" },
    { id: "t4", label: "Publish the result", agent: "mcp", tool: "publish", deps: ["t3"], dur: 1700, risk: "high", output: "published" },
  ],
  result:
    "This is a canned result. In the simulation your text is only displayed: the plan, the agents and the output are a fixed template, so they do not respond to what you wrote.",
  deniedNote: "The result was not published (action denied at the approval gate).",
};

export function presetFor(id: string, custom: string): Preset {
  if (id === "custom") {
    return { ...CUSTOM_PRESET, title: custom.trim() || "Your task", prompt: custom.trim() };
  }
  return PRESETS.find((p) => p.id === id) ?? PRESETS[0];
}

// ---------------------------------------------------------------- layout

/** Dependency depth of each task (0 = no dependencies). Used to lay the graph out in columns. */
export function layers(tasks: TaskDef[]): Record<string, number> {
  const depth: Record<string, number> = {};
  const byId = Object.fromEntries(tasks.map((t) => [t.id, t]));
  function d(id: string): number {
    if (depth[id] !== undefined) return depth[id];
    const t = byId[id];
    depth[id] = t.deps.length === 0 ? 0 : 1 + Math.max(...t.deps.map(d));
    return depth[id];
  }
  tasks.forEach((t) => d(t.id));
  return depth;
}

// ---------------------------------------------------------------- run

function log(run: Run, kind: LogKind, text: string) {
  run.log.push({ t: run.t, kind, text });
  if (run.log.length > 80) run.log.shift();
}

export function createRun(preset: Preset): Run {
  const tasks: Record<string, TaskState> = {};
  for (const t of preset.tasks) {
    tasks[t.id] = {
      status: "pending",
      progress: 0,
      attempt: 0,
      worker: null,
      checkpointed: false,
      resumedFromCheckpoint: false,
      retryAt: 0,
      note: "",
    };
  }
  const run: Run = {
    presetId: preset.id,
    title: preset.title,
    phase: "planning",
    t: 0,
    phaseT: 0,
    checks: [
      { label: "Schema: every task has an agent, a tool and inputs", done: false },
      { label: "Dependencies: every referenced task exists", done: false },
      { label: "Cycles: the graph can be ordered", done: false },
    ],
    tasks,
    workers: Array.from({ length: MAX_WORKERS }, (_, i) => ({
      id: `worker-${String.fromCharCode(65 + i)}`,
      taskId: null,
      alive: true,
      lastBeat: 0,
      downSince: null,
    })),
    breakers: {},
    flakyTool: null,
    flakyFails: {},
    approval: null,
    approved: {},
    checkpoints: 0,
    retries: 0,
    recoveries: 0,
    log: [],
    evals: [],
    result: null,
    denied: false,
    armedCrash: false,
  };
  log(run, "info", `Request received: "${preset.title}"`);
  log(run, "info", "Planner is decomposing the request into tasks");
  return run;
}

function breakerFor(run: Run, tool: string): Breaker {
  return (run.breakers[tool] ??= { fails: 0, state: "closed", openUntil: 0 });
}

function depsDone(run: Run, t: TaskDef) {
  return t.deps.every((d) => run.tasks[d].status === "done");
}
function depsBlocked(run: Run, t: TaskDef) {
  return t.deps.some((d) => run.tasks[d].status === "blocked");
}

/** Advance the simulation by dt milliseconds. Mutates and returns `run`. */
export function step(run: Run, preset: Preset, dt: number): Run {
  if (run.phase === "idle" || run.phase === "done") return run;
  run.t += dt;
  run.phaseT += dt;
  const byId = Object.fromEntries(preset.tasks.map((t) => [t.id, t]));

  // ---------------- planning: validate the plan
  if (run.phase === "planning") {
    run.checks.forEach((c, i) => {
      if (!c.done && run.phaseT >= (i + 1) * PLAN_STEP) {
        c.done = true;
        log(run, "good", `Plan check passed: ${c.label.split(":")[0].toLowerCase()}`);
      }
    });
    if (run.checks.every((c) => c.done) && run.phaseT >= run.checks.length * PLAN_STEP + 350) {
      run.phase = "executing";
      run.phaseT = 0;
      log(run, "info", `Plan accepted: ${preset.tasks.length} tasks, ${MAX_WORKERS} workers`);
    }
    return run;
  }

  // ---------------- executing
  if (run.phase === "executing") {
    // worker heartbeats, worker restarts, claim recovery
    for (const w of run.workers) {
      if (w.alive) {
        w.lastBeat = run.t;
      } else if (w.downSince !== null) {
        const silent = run.t - w.downSince;
        if (w.taskId && silent >= HEARTBEAT_TIMEOUT) {
          const task = run.tasks[w.taskId];
          const def = byId[w.taskId];
          if (task.status === "orphaned") {
            task.status = "queued";
            task.worker = null;
            task.progress = 0;
            task.resumedFromCheckpoint = true;
            task.note = "claim recovered";
            run.recoveries += 1;
            log(
              run,
              "good",
              `Claim recovered: "${def.label}" re-queued. ${run.checkpoints} finished task${run.checkpoints === 1 ? "" : "s"} stay checkpointed and are not re-run`
            );
            w.taskId = null;
          }
        }
        if (silent >= HEARTBEAT_TIMEOUT + WORKER_RESTART && !w.taskId) {
          w.alive = true;
          w.downSince = null;
          w.lastBeat = run.t;
          log(run, "info", `${w.id} restarted and is taking work again`);
        }
      }
    }

    // circuit breakers: open -> half-open after the cool-down
    for (const [tool, b] of Object.entries(run.breakers)) {
      if (b.state === "open" && run.t >= b.openUntil) {
        b.state = "half-open";
        log(run, "info", `Circuit breaker for ${tool} is half-open: one trial call allowed`);
      }
    }

    // approval gate auto-resolve (demo only)
    if (run.approval && run.t - run.approval.since >= APPROVAL_AUTO_MS) {
      resolveApproval(run, preset, true, true);
    }

    // advance running tasks
    for (const t of preset.tasks) {
      const s = run.tasks[t.id];
      if (s.status === "running") {
        const w = run.workers.find((x) => x.taskId === t.id);
        if (!w || !w.alive) continue; // stalled: waiting for the heartbeat timeout
        s.progress += dt;
        // a crash that was armed earlier hits this task once it is well under way
        if (run.armedCrash && s.progress >= t.dur * 0.35) {
          run.armedCrash = false;
          crashWorker(run, w);
          continue;
        }
        const b = breakerFor(run, t.tool);
        const willFail = run.flakyTool === t.tool && (run.flakyFails[t.id] ?? 0) < 2 && s.progress >= t.dur * 0.5;
        if (willFail) {
          run.flakyFails[t.id] = (run.flakyFails[t.id] ?? 0) + 1;
          s.status = "backoff";
          s.retryAt = run.t + RETRY_BACKOFF;
          s.progress = 0;
          s.note = `${t.tool} timed out`;
          w.taskId = null;
          s.worker = null;
          run.retries += 1;
          b.fails += 1;
          log(run, "bad", `"${t.label}" failed: ${t.tool} timed out (attempt ${s.attempt}/${MAX_ATTEMPTS})`);
          if (b.fails >= BREAKER_THRESHOLD && b.state !== "open") {
            b.state = "open";
            b.openUntil = run.t + BREAKER_OPEN_MS;
            log(run, "warn", `Circuit breaker for ${t.tool} is open: calls are rejected for a moment`);
          }
          continue;
        }
        if (s.progress >= t.dur) {
          s.status = "done";
          s.progress = t.dur;
          s.checkpointed = true;
          w.taskId = null;
          s.worker = null;
          run.checkpoints += 1;
          if (b.state === "half-open") {
            b.state = "closed";
            b.fails = 0;
            log(run, "good", `Circuit breaker for ${t.tool} closed: the trial call succeeded`);
          } else {
            b.fails = 0;
          }
          log(run, "good", `Done: "${t.label}" (${t.output}). Checkpoint saved`);
        }
      }
    }

    // backoff -> queued
    for (const t of preset.tasks) {
      const s = run.tasks[t.id];
      if (s.status === "backoff" && run.t >= s.retryAt) {
        s.status = "queued";
        log(run, "info", `Retrying "${t.label}"`);
      }
    }

    // promote pending -> queued / approval / blocked
    for (const t of preset.tasks) {
      const s = run.tasks[t.id];
      if (s.status !== "pending") continue;
      if (depsBlocked(run, t)) {
        s.status = "blocked";
        s.note = "an upstream task was blocked";
        log(run, "warn", `"${t.label}" is blocked: an upstream task did not complete`);
        continue;
      }
      if (!depsDone(run, t)) continue;
      if (t.risk === "high" && !run.approved[t.id]) {
        if (!run.approval) {
          s.status = "approval";
          run.approval = { taskId: t.id, since: run.t };
          log(run, "warn", `Approval needed: "${t.label}" uses ${t.tool} (high risk, denied by default)`);
        }
        continue;
      }
      s.status = "queued";
    }

    // dispatch queued tasks to free, live workers (bounded parallelism)
    for (const t of preset.tasks) {
      const s = run.tasks[t.id];
      if (s.status !== "queued") continue;
      const b = breakerFor(run, t.tool);
      if (b.state === "open") continue; // calls to this tool are rejected for now
      const w = run.workers.find((x) => x.alive && x.taskId === null);
      if (!w) break;
      w.taskId = t.id;
      s.status = "running";
      s.worker = run.workers.indexOf(w);
      s.attempt += 1;
      s.progress = 0;
      if (s.attempt > MAX_ATTEMPTS) {
        s.status = "blocked";
        s.note = "out of attempts";
        w.taskId = null;
        continue;
      }
      log(run, "info", `${w.id} claimed "${t.label}"${s.attempt > 1 ? ` (attempt ${s.attempt})` : ""} via ${t.agent === "mcp" ? "MCP" : t.agent} agent`);
    }

    // finished?
    const all = preset.tasks.every((t) => ["done", "blocked"].includes(run.tasks[t.id].status));
    if (all) {
      run.phase = "evaluating";
      run.phaseT = 0;
      const gap = preset.tasks.some((t) => run.tasks[t.id].status === "blocked");
      run.evals = [
        { label: "Grounded in the retrieved sources", score: 0.93, threshold: 0.8 },
        { label: "Follows the plan", score: gap ? 0.64 : 0.91, threshold: 0.8 },
        { label: "Passes the policy checks", score: 1, threshold: 0.8 },
      ];
      log(run, "info", "All tasks finished. The critic is scoring the output");
    }
    return run;
  }

  // ---------------- evaluating
  if (run.phase === "evaluating") {
    if (run.phaseT >= EVAL_MS) {
      run.phase = "synthesizing";
      run.phaseT = 0;
      const failing = run.evals.filter((e) => e.score < e.threshold);
      if (failing.length) {
        log(run, "warn", `Critic flagged: "${failing[0].label}" is below its threshold`);
      } else {
        log(run, "good", "Critic: all criteria pass");
      }
      log(run, "info", "Synthesis is composing the final result");
    }
    return run;
  }

  // ---------------- synthesizing
  if (run.phase === "synthesizing") {
    if (run.phaseT >= SYNTH_MS) {
      run.phase = "done";
      run.phaseT = 0;
      run.result = run.denied ? `${preset.result.split(". ").slice(0, 2).join(". ")}. ${preset.deniedNote}` : preset.result;
      log(run, "good", "Result delivered");
    }
  }
  return run;
}

// ---------------------------------------------------------------- user actions

export function resolveApproval(run: Run, preset: Preset, ok: boolean, auto = false) {
  if (!run.approval) return;
  const t = preset.tasks.find((x) => x.id === run.approval!.taskId)!;
  const s = run.tasks[t.id];
  run.approval = null;
  if (ok) {
    run.approved[t.id] = true;
    s.status = "pending"; // re-evaluated next step, now approved
    log(run, "good", auto ? `Approval gate: auto-approved "${t.label}" (demo only)` : `Approved: "${t.label}"`);
  } else {
    s.status = "blocked";
    s.note = "denied at the approval gate";
    run.denied = true;
    log(run, "bad", `Denied: "${t.label}". The tool call will not run`);
  }
}

function crashWorker(run: Run, w: Worker) {
  w.alive = false;
  w.downSince = run.t;
  const s = run.tasks[w.taskId!];
  s.status = "orphaned";
  s.note = "worker stopped";
  log(run, "bad", `${w.id} crashed while running a task. Its heartbeat stopped`);
}

/**
 * Crash a worker that is running a task. If nothing is running right now but work
 * remains, arm the crash so it hits the next task that starts (so the control is
 * never a dead button just because the timing was unlucky).
 */
export function killWorker(run: Run): "killed" | "armed" | false {
  if (run.phase !== "executing") return false;
  const w = run.workers.find((x) => x.alive && x.taskId !== null);
  if (w) {
    crashWorker(run, w);
    return "killed";
  }
  const remaining = Object.values(run.tasks).some((s) => s.status !== "done" && s.status !== "blocked");
  if (!remaining || run.armedCrash) return false;
  run.armedCrash = true;
  log(run, "warn", "Crash armed: the next task to start will lose its worker");
  return "armed";
}

/** Whether the crash control can do anything right now. */
export function canCrash(run: Run): boolean {
  if (run.phase !== "executing" || run.armedCrash) return false;
  return Object.values(run.tasks).some((s) => s.status !== "done" && s.status !== "blocked");
}

export function toggleFlaky(run: Run, tool: string | null) {
  run.flakyTool = tool;
  if (tool) log(run, "warn", `${tool} is now unreliable: calls will time out`);
}

/** Tools used by tasks that have not finished: the ones worth making flaky. */
export function flakyCandidates(run: Run, preset: Preset): string[] {
  const set = new Set<string>();
  for (const t of preset.tasks) {
    if (["pending", "queued", "running", "approval"].includes(run.tasks[t.id].status) && !t.risk) set.add(t.tool);
  }
  return [...set];
}
