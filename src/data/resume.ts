// Single source of truth — every fact on this site traces back to the resume
// and the verified project context below. Do not invent claims here.
// File: public/resume/Meet_Jadhav_Resume.pdf
export const profile = {
  name: "Meet Jadhav",
  role: "AI / Backend Engineer",
  tagline: "I build the backend behind LLM apps, and the tests that stop them breaking.",
  location: "Pune, Maharashtra",
  phone: "+91-7397846178",
  email: "meetjadhav2003@gmail.com",
  linkedin: "https://linkedin.com/in/meet-jadhav-05a64b250",
  linkedinLabel: "linkedin.com/in/meet-jadhav-05a64b250",
  github: "https://github.com/acrocantosauras",
  githubLabel: "github.com/acrocantosauras",
  githubLabelShort: "github.com/acrocantosauras",
  portfolioUrl: "https://portfolio.meetjadhav2003.workers.dev",
  resumeUrl: "/resume/Meet_Jadhav_Resume.pdf",
  seeking: "Seeking AI / backend internships and junior roles.",
  // Source: Meet_Jadhav_Resume_ATS_Safe.pdf (Nov 2026). Keep wording in line with the resume.
  // Written in first person on purpose. Every claim still traces to the resume.
  identity: [
    "Most LLM demos work once. I like the part after that: the queues, retries and tests that decide whether the thing survives real use.",
    "Right now I'm building AegisForge. It checks a plan an LLM wrote before running anything, runs the steps in order, and picks up where it stopped if a worker dies. It has 773 tests so far, including ones that simulate a Redis outage and a worker crash.",
    "Before that I built a platform that scores LLM answers and fails the build when quality drops, and a RAG app that answers from your own documents with citations. I finished my B.E. in Electronics and Telecommunication in 2025, and spent a month at Uchit Technology on video analytics models.",
  ],
  summary:
    "AI / Backend engineer (B.E., 2025) in Pune who builds reliable, tested LLM systems in Python. Built a checkpointed multi-agent orchestrator, an LLM evaluation platform with CI quality gates, and a full-stack RAG application, each with automated tests, CI and Docker setups. Seeking AI / backend internships and junior roles.",
} as const;

export type SkillGroup = {
  id: string;
  label: string;
  items: string[];
  featured?: boolean;
};

// Mirrors the TECHNICAL SKILLS block of the current resume (Nov 2026).
export const skillGroups: SkillGroup[] = [
  {
    id: "ai-llm",
    label: "AI / LLM",
    featured: true,
    items: [
      "LangGraph",
      "MCP",
      "RAG",
      "LLM evaluation (LLM-as-a-judge, NLI)",
      "Sentence Transformers",
      "OpenAI API",
    ],
  },
  {
    id: "backend-data",
    label: "Backend & Data",
    featured: true,
    items: ["FastAPI", "REST APIs", "SQLAlchemy", "Alembic", "PostgreSQL", "pgvector", "Redis", "arq", "JWT"],
  },
  {
    id: "testing-ops",
    label: "Testing & Ops",
    featured: true,
    items: ["pytest", "ruff", "mypy", "GitHub Actions", "Docker Compose", "Prometheus", "Grafana", "OpenTelemetry", "Git"],
  },
  {
    id: "languages",
    label: "Languages",
    items: ["Python", "TypeScript", "SQL"],
  },
  {
    id: "frontend",
    label: "Frontend",
    items: ["React", "Next.js"],
  },
];

export type Agent = {
  id: string;
  name: string;
  role: string;
  detail: string;
  tech: string[];
};

export const aegisAgents: Agent[] = [
  {
    id: "planner",
    name: "Planner",
    role: "Decomposes requests into executable plans",
    detail: "Understands the incoming request, decomposes it into ordered work, and routes tasks to the right specialist agent.",
    tech: ["LangGraph", "Structured Outputs"],
  },
  {
    id: "research",
    name: "Research Agent",
    role: "Retrieves and synthesizes external information",
    detail: "Searches external sources, retrieves and synthesizes information needed for downstream steps.",
    tech: ["Tool Calling"],
  },
  {
    id: "knowledge",
    name: "Knowledge / RAG Agent",
    role: "Retrieves relevant private knowledge through RAG",
    detail: "Embeds and searches private document stores via pgvector, grounding every answer in retrievable sources.",
    tech: ["pgvector", "PostgreSQL", "Embeddings"],
  },
  {
    id: "code",
    name: "Code Agent",
    role: "Handles implementation and code-oriented tasks",
    detail: "Writes, refactors, and reasons over code when a task requires implementation.",
    tech: ["Sandboxed Execution"],
  },
  {
    id: "vision",
    name: "Vision Agent",
    role: "Processes images and visual inputs",
    detail: "Handles image understanding tasks — extraction, description, and visual analysis within workflows.",
    tech: ["Multimodal Models"],
  },
  {
    id: "evaluator",
    name: "Evaluation / Critic Agent",
    role: "Critiques and validates generated results",
    detail: "Scores outputs against criteria before results leave the system. Weak results get reworked, not shipped.",
    tech: ["LLM-as-Judge", "Structured Outputs"],
  },
  {
    id: "analysis",
    name: "Analysis Agent",
    role: "Breaks down data and intermediate results",
    detail: "Performs structured analysis of intermediate artifacts — comparing, summarizing, extracting signal.",
    tech: ["Structured Outputs"],
  },
  agent_synthesis(),
  {
    id: "mcp",
    name: "Tools / MCP Layer",
    role: "Connects the graph to external systems",
    detail: "A Model Context Protocol layer gives agents standardized access to tools and external systems.",
    tech: ["MCP", "Tool Calling"],
  },
];

function agent_synthesis(): Agent {
  return {
    id: "synthesis",
    name: "Synthesis Agent",
    role: "Composes the final deliverable",
    detail: "Merges agent outputs into a single coherent result, with state maintained across the workflow via checkpointing.",
    tech: ["LangGraph Checkpointing"],
  };
}

export type AegisStage = {
  id: string;
  label: string;
  sub: string;
  detail: string;
};

export const aegisStages: AegisStage[] = [
  {
    id: "request",
    label: "REQUEST",
    sub: "inbound task",
    detail:
      "An inbound task enters through the FastAPI gateway — authenticated, validated, and queued for the graph.",
  },
  {
    id: "planner",
    label: "PLANNER",
    sub: "decompose + route",
    detail:
      "The planner decomposes the request into ordered work and routes each task to the right specialist agent.",
  },
  {
    id: "graph",
    label: "AGENT GRAPH",
    sub: "specialists execute",
    detail:
      "LangGraph coordinates the specialist agents — research, knowledge, code, vision, analysis — with checkpointed state.",
  },
  {
    id: "tools",
    label: "TOOLS / MCP",
    sub: "external systems",
    detail:
      "A Model Context Protocol layer gives every agent standardized tool access to external systems.",
  },
  {
    id: "rag",
    label: "RAG / KNOWLEDGE",
    sub: "private context",
    detail:
      "Private knowledge is retrieved through pgvector embedding search and grounded into agent context before generation.",
  },
  {
    id: "eval",
    label: "EVALUATION",
    sub: "critic validates",
    detail:
      "The critic agent scores results against explicit criteria — weak results get reworked, not released.",
  },
  {
    id: "synthesis",
    label: "SYNTHESIS",
    sub: "compose result",
    detail:
      "The synthesis agent merges agent outputs into one coherent deliverable, with state preserved via checkpointing.",
  },
  {
    id: "result",
    label: "RESULT",
    sub: "delivered",
    detail:
      "The final result returns through the API — every step of the run is traceable via OpenTelemetry.",
  },
];

export type Project = {
  slug: string;
  codename: string;
  title: string;
  subtitle: string;
  period: string;
  status: "flagship" | "active" | "archived";
  oneLiner: string;
  stack: string[];
  summary: string[];
  architecture: {
    nodes: { id: string; label: string; detail: string; group: string }[];
    flow: [string, string][];
  };
  challenges: { title: string; detail: string }[];
  testing: { title: string; detail: string }[];
  observability?: { title: string; detail: string }[];
  links?: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    slug: "aegisforge",
    codename: "SYS.01",
    title: "AEGISFORGE",
    subtitle: "MULTI-AGENT AI PLATFORM",
    period: "2026 — Present",
    status: "flagship",
    oneLiner:
      "A FastAPI and LangGraph orchestrator that validates LLM-generated plans and runs them as dependency-ordered task graphs, with retries, circuit breakers and resumable checkpoints.",
    stack: [
      "Python",
      "FastAPI",
      "LangGraph",
      "PostgreSQL",
      "Redis",
      "MCP",
      "Docker",
    ],
    summary: [
      "AegisForge is a multi-agent AI orchestration platform. A FastAPI and LangGraph orchestrator validates LLM-generated plans (schema, dependency and cycle checks) and runs them as dependency-ordered task graphs with bounded parallelism, retries and timeouts.",
      "Reliability is designed in: a per-tool circuit breaker, a Redis job queue with heartbeat-based claim recovery, and per-task PostgreSQL checkpoints that resume a run without re-running finished tasks.",
      "Tool access is deny-by-default with approval gates, and MCP risk levels are read from server config. The suite has 773 pytest tests (78% coverage), including failure-injection tests for a Redis outage and a worker crash.",
    ],
    architecture: {
      nodes: [
        { id: "client", label: "Next.js Console", detail: "Mission-control UI over the agent graph.", group: "interface" },
        { id: "api", label: "FastAPI Gateway", detail: "Entry point — auth, validation, workflow submission.", group: "interface" },
        { id: "graph", label: "LangGraph Core", detail: "Orchestrates agents, routes tasks, maintains checkpointed state.", group: "core" },
        { id: "agents", label: "Specialist Agents", detail: "Research, knowledge, code, vision, analysis, synthesis agents.", group: "core" },
        { id: "mcp", label: "Tools / MCP Layer", detail: "Standardized tool access to external systems.", group: "core" },
        { id: "rag", label: "pgvector Retrieval", detail: "Embedding search over private knowledge stores.", group: "data" },
        { id: "pg", label: "PostgreSQL", detail: "Relational state, run history, embeddings.", group: "data" },
        { id: "redis", label: "Redis", detail: "Workflow state and caching layer.", group: "data" },
        { id: "eval", label: "Evaluation Layer", detail: "Critic agent scores outputs before release.", group: "quality" },
        { id: "obs", label: "OTel / Prometheus / Grafana", detail: "Traces, metrics, dashboards for every agent run.", group: "observability" },
      ],
      flow: [
        ["client", "api"],
        ["api", "graph"],
        ["graph", "agents"],
        ["agents", "mcp"],
        ["agents", "rag"],
        ["rag", "pg"],
        ["graph", "redis"],
        ["agents", "eval"],
        ["api", "obs"],
        ["graph", "obs"],
      ],
    },
    challenges: [
      {
        title: "Coordination without chaos",
        detail:
          "Multi-agent systems fail by default. LangGraph's graph model with checkpointing gives deterministic routing and recoverable state instead of a pile of async calls.",
      },
      {
        title: "Grounding every answer",
        detail:
          "Specialist agents are only as trustworthy as their context — the RAG path keeps private knowledge retrievable, cited, and separate from model parametric memory.",
      },
      {
        title: "Trusting the output",
        detail:
          "The evaluation/critic layer treats generated results as untrusted until scored — the same discipline I applied building the LLM Evaluation Platform.",
      },
    ],
    testing: [
      {
        title: "773 pytest tests, 78% coverage",
        detail:
          "Covers plan validation, task-graph execution, permissions and approval gates.",
      },
      {
        title: "Failure injection",
        detail:
          "Tests that simulate a Redis outage and a worker crash, to verify the run recovers from its checkpoints.",
      },
    ],
    links: [{ label: "aegisforge on GitHub", href: "https://github.com/acrocantosauras/aegisforge" }],
  },
  {
    slug: "llm-evaluation-platform",
    codename: "SYS.02",
    title: "LLM Evaluation Platform",
    subtitle: "QUALITY GATES FOR LANGUAGE MODELS",
    period: "2025 – 2026",
    status: "active",
    oneLiner:
      "Scores LLM and RAG outputs and fails the build when quality regresses — 215 automated tests at 83% coverage.",
    stack: ["Python", "FastAPI", "PostgreSQL", "Redis", "arq", "Next.js"],
    summary: [
      "A platform that scores LLM and RAG outputs on relevance, hallucination (NLI), faithfulness, and retrieval precision and recall. Async batch jobs run on Redis and arq, with hashed, project-scoped API keys.",
      "Quality gates compare against a baseline and apply metric-aware regression detection. A GitHub Actions job fails the build when scores fall below thresholds.",
      "215 automated tests (83% coverage), with CI that runs lint and the full suite against real PostgreSQL and Redis.",
    ],
    architecture: {
      nodes: [
        { id: "client", label: "Next.js Dashboard", detail: "Submits evaluation runs, renders live results.", group: "interface" },
        { id: "api", label: "FastAPI Gateway", detail: "API-key authenticated entry; enqueues evaluation jobs.", group: "core" },
        { id: "queue", label: "Redis / arq Workers", detail: "Async batch evaluation off the request path.", group: "core" },
        { id: "judge", label: "LLM-as-a-Judge", detail: "Scores quality, hallucination, faithfulness.", group: "core" },
        { id: "db", label: "PostgreSQL", detail: "Run history, per-metric scores, thresholds.", group: "data" },
        { id: "gate", label: "Quality Gates", detail: "Regression detection — degrading runs fail the build.", group: "quality" },
        { id: "ci", label: "GitHub Actions CI", detail: "Runs the 215-test suite against production Docker Compose.", group: "quality" },
        { id: "obs", label: "Prometheus / Grafana / OTel", detail: "Metrics and traces end to end.", group: "observability" },
      ],
      flow: [
        ["client", "api"],
        ["api", "queue"],
        ["queue", "judge"],
        ["judge", "db"],
        ["db", "gate"],
        ["gate", "ci"],
        ["api", "obs"],
        ["queue", "obs"],
      ],
    },
    challenges: [
      {
        title: "Judging the judge",
        detail:
          "LLM-as-a-judge scoring is inherently noisy — the platform treats metrics as statistical signals with thresholds tuned for regression sensitivity, not pass/fail absolutes.",
      },
      {
        title: "Async at scale",
        detail:
          "Batch runs stay off the request path — Redis/arq workers decouple submission from scoring so the dashboard stays responsive.",
      },
      {
        title: "Ship-blocking gates",
        detail:
          "Gates are only useful if trustworthy enough to block a merge — regression detection compares against historical baselines, not fixed thresholds alone.",
      },
    ],
    testing: [
      { title: "215 automated tests, 83% coverage", detail: "Covers evaluation logic, API contracts, and worker behavior." },
      { title: "CI against real services", detail: "CI runs lint and the full suite against real PostgreSQL and Redis, and fails the build on a quality regression." },
    ],
    links: [{ label: "llm-evaluation-pipeline on GitHub", href: "https://github.com/acrocantosauras/llm-evaluation-pipeline" }],
  },
  {
    slug: "ai-knowledge-assistant",
    codename: "SYS.03",
    title: "AI Knowledge Assistant",
    subtitle: "RAG WITH RECEIPTS",
    period: "2026",
    status: "active",
    oneLiner:
      "A full-stack RAG app that ingests your documents and returns streaming, citation-backed answers using pgvector similarity search.",
    stack: ["Python", "FastAPI", "PostgreSQL", "pgvector", "React", "TypeScript", "Docker"],
    summary: [
      "A full-stack RAG application that ingests PDF, TXT and DOCX files and returns streaming, citation-backed answers using pgvector similarity search.",
      "The API is secured with JWT, Argon2 password hashing, per-user data isolation and rate limiting.",
      "150+ backend tests, CI, Alembic migrations, Docker Compose and a deployment smoke-test script.",
    ],
    architecture: {
      nodes: [
        { id: "ui", label: "React / TS UI", detail: "Document upload, chat, inline citations.", group: "interface" },
        { id: "api", label: "FastAPI Backend", detail: "JWT-authenticated auth, ingestion, query routing.", group: "core" },
        { id: "ingest", label: "Ingestion Pipeline", detail: "Parses and chunks PDF/TXT/DOCX uploads.", group: "core" },
        { id: "pgvector", label: "PostgreSQL + pgvector", detail: "Chunks + embeddings, semantic search.", group: "data" },
        { id: "llm", label: "LLM Generation", detail: "Grounded answers with source citations.", group: "core" },
        { id: "auth", label: "JWT + Argon2", detail: "Auth layer with hashed credential storage.", group: "quality" },
        { id: "obs", label: "Prometheus + Probes", detail: "Metrics and liveness/readiness probes.", group: "observability" },
        { id: "migrate", label: "Alembic Migrations", detail: "Versioned schema migrations.", group: "data" },
      ],
      flow: [
        ["ui", "api"],
        ["api", "auth"],
        ["api", "ingest"],
        ["ingest", "pgvector"],
        ["pgvector", "llm"],
        ["llm", "ui"],
        ["api", "obs"],
        ["pgvector", "migrate"],
      ],
    },
    challenges: [
      {
        title: "Grounded, not generic",
        detail:
          "Every response carries source citations back to the originating document chunk — answers are traceable or they don't ship.",
      },
      {
        title: "Multi-format ingestion",
        detail:
          "PDF, TXT, and DOCX each parse differently; the pipeline normalizes them into a consistent chunking format before embedding.",
      },
      {
        title: "Vectors in Postgres",
        detail:
          "pgvector keeps embeddings and relational data in one instance instead of a separate vector store, simplifying deployment.",
      },
    ],
    testing: [
      { title: "150+ backend tests", detail: "Backed by CI that runs on every change." },
      { title: "Deployable, not just runnable", detail: "Alembic migrations, Docker Compose and a deployment smoke-test script." },
    ],
    links: [{ label: "ai-knowledge-assistant on GitHub", href: "https://github.com/acrocantosauras/ai-knowledge-assistant" }],
  },
  {
    slug: "jarvis",
    codename: "SYS.04",
    title: "J.A.R.V.I.S.",
    subtitle: "MODULAR DESKTOP ASSISTANT",
    period: "2025",
    status: "archived",
    oneLiner:
      "A modular Windows AI assistant with a plugin architecture built to outlive any single feature — 18 command categories.",
    stack: ["Python", "OpenAI API", "Tkinter", "SpeechRecognition", "pyttsx3", "cryptography", "pystray"],
    summary: [
      "A modular Windows AI assistant with GPT-3.5 chat, voice/text interaction, and 18 built-in command categories spanning apps, system controls, web search, and email.",
      "An extensible plugin architecture — built on importlib and a register() interface — separates core routing from independently loadable plugins.",
      "Daemon-threaded background operations keep the assistant responsive; thread-safe GUI updates run through root.after().",
      "Credentials are protected with Fernet-encrypted storage, keyed to a git-ignored key file.",
    ],
    architecture: {
      nodes: [
        { id: "gui", label: "Tkinter GUI", detail: "Thread-safe updates via root.after().", group: "interface" },
        { id: "router", label: "Core Router", detail: "Dispatches commands to plugins by intent.", group: "core" },
        { id: "plugins", label: "Plugin Registry", detail: "importlib + register() — plugins load independently.", group: "core" },
        { id: "voice", label: "SpeechRecognition / pyttsx3", detail: "Voice input capture and TTS output.", group: "interface" },
        { id: "openai", label: "OpenAI API (GPT-3.5)", detail: "Natural-language chat responses.", group: "core" },
        { id: "creds", label: "Fernet-Encrypted Store", detail: "Credentials encrypted at rest.", group: "quality" },
        { id: "threads", label: "Daemon Threads", detail: "Background ops off the main thread.", group: "quality" },
      ],
      flow: [
        ["gui", "router"],
        ["voice", "router"],
        ["router", "plugins"],
        ["router", "openai"],
        ["router", "creds"],
        ["router", "threads"],
      ],
    },
    challenges: [
      {
        title: "Plugins without a restart",
        detail:
          "importlib-based loading with a register() interface lets command categories change independently of the core router.",
      },
      {
        title: "Responsive GUI under async load",
        detail:
          "Voice recognition and API calls run on daemon threads; all GUI mutation is marshaled through root.after().",
      },
      {
        title: "Credentials at rest",
        detail:
          "API keys and secrets are Fernet-encrypted rather than stored in plaintext, with the key file git-ignored.",
      },
    ],
    testing: [
      {
        title: "18 command categories",
        detail: "Apps, system controls, web search, email — each independently loadable and testable.",
      },
    ],
    links: [{ label: "GitHub Profile", href: "https://github.com/acrocantosauras" }],
  },
];

export type Experience = {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  kind: "industry" | "personal";
  domain: string;
  points: string[];
};

export const experience: Experience[] = [
  {
    id: "uchit",
    company: "Uchit Technology",
    role: "Trainee",
    period: "October 2026",
    location: "Pune, India",
    kind: "industry",
    domain: "AI VIDEO ANALYTICS",
    points: [
      "Supported AI model-training and reinforcement-learning workflows for video analytics on the Uchit AI Box.",
    ],
  },
];

export const certifications = [
  { title: "Microsoft Certified: Azure AI Fundamentals (AI-900)", org: "Microsoft, 2024" },
  { title: "Python Certificate", org: "Meta / Coursera, 2025" },
  { title: "Back-End Development", org: "Meta / Coursera, 2025" },
  { title: "Version Control (Git/GitHub)", org: "Meta / Coursera, 2025" },
];

export type EducationItem = {
  id: string;
  title: string;
  org: string;
  location?: string;
  period: string;
};

export const education: EducationItem[] = [
  {
    id: "edu-degree",
    title: "B.E., Electronics & Telecommunication",
    org: "Shrimati Kashibai Navale College of Engineering",
    location: "Pune, Maharashtra",
    period: "Aug 2021 – May 2025",
  },
  {
    id: "edu-highschool",
    title: "Higher Secondary (Science) — 86.66%",
    org: "MGSK Gujarati High School",
    location: "Sangli, Maharashtra",
    period: "2021",
  },
];
