// Single source of truth — every fact on this site traces back to the resume
// and the verified project context below. Do not invent claims here.
// File: public/resume/Meet_Jadhav_Resume.pdf
export const profile = {
  name: "Meet Jadhav",
  role: "AI / Backend Engineer",
  tagline: "Building intelligent systems that reason, retrieve, execute and observe.",
  location: "Pune, India",
  phone: "+91-7397846178",
  email: "meetjadhav2003@gmail.com",
  linkedin: "https://linkedin.com/in/meet-jadhav-05a64b250",
  linkedinLabel: "linkedin.com/in/meet-jadhav-05a64b250",
  github: "https://github.com/acrocantosauras",
  githubLabel: "github.com/aegisforge",
  githubLabelShort: "github.com/acrocantosauras",
  resumeUrl: "/resume/Meet_Jadhav_Resume.pdf",
  identity: [
    "Engineer focused on AI systems and backend infrastructure — multi-agent orchestration, retrieval pipelines, evaluation, and observability. I build the plumbing that makes LLMs behave like production software.",
    "Currently building AegisForge, a production-grade multi-agent AI platform: FastAPI, LangGraph, pgvector, Redis, OpenTelemetry — the full systems stack wrapped around language models.",
    "Industry experience in computer vision: real-time video analytics, detection and tracking pipelines with YOLO and OpenCV. Comfortable on both sides — the model and the system serving it.",
  ],
  summary:
    "AI / Backend engineer building production-grade multi-agent systems — LangGraph orchestration, RAG, LLM evaluation and full observability. Computer vision experience with real-time video analytics. Microsoft Azure AI-900 certified.",
} as const;

export type SkillGroup = {
  id: string;
  label: string;
  items: string[];
  featured?: boolean;
};

export const skillGroups: SkillGroup[] = [
  {
    id: "ai-ml",
    label: "AI / ML",
    featured: true,
    items: [
      "LangGraph",
      "Multi-Agent Orchestration",
      "RAG",
      "MCP",
      "LLM Evaluation",
      "OpenAI / Anthropic APIs",
      "NLP",
      "Hugging Face",
      "PyTorch",
    ],
  },
  {
    id: "backend",
    label: "Backend",
    featured: true,
    items: ["Python", "FastAPI", "SQLAlchemy", "PostgreSQL", "pgvector", "Redis", "Alembic", "JWT Auth"],
  },
  {
    id: "frontend",
    label: "Frontend",
    items: ["TypeScript", "React", "Next.js", "Vite", "HTML/CSS"],
  },
  {
    id: "data",
    label: "Data",
    items: ["PostgreSQL", "pgvector", "SQL", "Alembic Migrations", "Embeddings", "Vector Search"],
  },
  {
    id: "infrastructure",
    label: "Infrastructure",
    featured: true,
    items: ["Docker", "GitHub Actions CI/CD", "Prometheus", "Grafana", "OpenTelemetry", "Structured Logging"],
  },
  {
    id: "vision",
    label: "Computer Vision",
    featured: true,
    items: ["YOLO", "OpenCV", "Object Tracking", "RTSP", "Real-Time Analytics"],
  },
  {
    id: "languages",
    label: "Languages",
    items: ["Python", "TypeScript", "JavaScript", "SQL", "HTML/CSS"],
  },
  {
    id: "testing",
    label: "Quality & Testing",
    items: ["pytest", "Unit Testing", "Quality Gates", "Regression Detection", "Rate Limiting", "Docker Compose"],
  },
  {
    id: "tools",
    label: "Tools",
    items: ["Git", "GitHub", "Postman", "VS Code", "PyCharm", "Azure AI-900"],
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
};

export const aegisStages: AegisStage[] = [
  { id: "request", label: "REQUEST", sub: "inbound task" },
  { id: "planner", label: "PLANNER", sub: "decompose + route" },
  { id: "graph", label: "AGENT GRAPH", sub: "specialists execute" },
  { id: "tools", label: "TOOLS / MCP", sub: "external systems" },
  { id: "rag", label: "RAG / KNOWLEDGE", sub: "private context" },
  { id: "eval", label: "EVALUATION", sub: "critic validates" },
  { id: "synthesis", label: "SYNTHESIS", sub: "compose result" },
  { id: "result", label: "RESULT", sub: "delivered" },
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
    period: "2025 — Present",
    status: "flagship",
    oneLiner:
      "Production-grade multi-agent AI platform — agents that plan, delegate, retrieve, use tools, and evaluate their own output before anything ships.",
    stack: [
      "Python",
      "FastAPI",
      "Next.js",
      "LangGraph",
      "PostgreSQL",
      "pgvector",
      "Redis",
      "Docker",
      "MCP",
      "OpenAI / Anthropic",
      "OpenTelemetry",
      "Prometheus",
      "Grafana",
    ],
    summary: [
      "AegisForge is a production-oriented multi-agent AI platform designed to understand requests, plan work, delegate to specialized agents, retrieve private knowledge, use tools, process information, evaluate results, and maintain state across workflows.",
      "A LangGraph orchestration core coordinates specialist agents — research, knowledge/RAG, code, vision, evaluation, analysis, synthesis — connected through a Model Context Protocol tool layer with structured outputs and checkpointed state.",
      "The backend runs FastAPI on PostgreSQL with pgvector for private-knowledge retrieval and Redis for workflow state. The Next.js frontend is a mission-control view over the agent graph.",
      "Phases 0–5 are complete and baselined; Phase 6 reliability/hardening work is substantially implemented. Current focus: final validation, concurrency and failure testing, and a performance baseline. OpenTelemetry, Prometheus, and Grafana cover observability.",
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
        title: "Reliability hardening (Phase 6)",
        detail:
          "Concurrency and failure-path testing, final validation, and a performance baseline close out the hardening phase.",
      },
      {
        title: "Evaluation-driven",
        detail:
          "Agent outputs pass through the evaluation layer — results that don't meet criteria get reworked, not released.",
      },
    ],
    observability: [
      { title: "OpenTelemetry", detail: "Distributed traces across API, graph, and agent boundaries." },
      { title: "Prometheus", detail: "Run metrics, queue depth, agent latency exposed for scraping." },
      { title: "Grafana", detail: "Dashboards for workflow health and agent performance." },
    ],
    links: [{ label: "GitHub Profile", href: "https://github.com/acrocantosauras" }],
  },
  {
    slug: "llm-evaluation-platform",
    codename: "SYS.02",
    title: "LLM Evaluation Platform",
    subtitle: "QUALITY GATES FOR LANGUAGE MODELS",
    period: "2025 – 2026",
    status: "active",
    oneLiner:
      "Quality gates and regression detection that stop a bad model change before it ships — 215 automated tests, CI-enforced.",
    stack: ["Python", "FastAPI", "PostgreSQL", "Redis / arq", "Next.js", "Prometheus", "Grafana", "OpenTelemetry", "Docker"],
    summary: [
      "A production-oriented LLM/RAG evaluation platform measuring answer quality, hallucination, faithfulness, and retrieval precision/recall — enforcing quality gates and metric-aware regression detection before a change can ship.",
      "Async batch evaluation runs on Redis/arq workers, with LLM-as-a-judge scoring and API-key authentication guarding every call.",
      "A Next.js dashboard surfaces results in real time. Prometheus and OpenTelemetry are wired in for observability end to end.",
      "215 automated tests back the system. A production Docker Compose setup is validated via GitHub Actions CI, where quality gates fail the build on regression.",
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
      { title: "215 automated tests", detail: "pytest suite covering evaluation logic, API contracts, and worker behavior." },
      { title: "CI-enforced gates", detail: "Regressions fail the build, not just a warning." },
    ],
    observability: [
      { title: "Prometheus metrics", detail: "Service and evaluation-run metrics scraped for dashboards and alerting." },
      { title: "OpenTelemetry tracing", detail: "Distributed traces across API, queue, and worker boundary." },
      { title: "Grafana dashboards", detail: "Regression trends and system health over time." },
    ],
    links: [{ label: "GitHub Profile", href: "https://github.com/acrocantosauras" }],
  },
  {
    slug: "ai-knowledge-assistant",
    codename: "SYS.03",
    title: "AI Knowledge Assistant",
    subtitle: "RAG WITH RECEIPTS",
    period: "2026",
    status: "active",
    oneLiner:
      "A full-stack RAG assistant that answers from your own documents, with source citations attached to every answer.",
    stack: ["Python", "FastAPI", "PostgreSQL / pgvector", "React", "TypeScript", "Docker", "JWT"],
    summary: [
      "A full-stack RAG knowledge assistant built end-to-end — FastAPI backend, PostgreSQL with pgvector for semantic search, and a React/TypeScript frontend.",
      "Users upload documents and get LLM-powered answers grounded in their own content, with source citations attached to every answer.",
      "JWT authentication with Argon2 password hashing protects the system; pipelines handle PDF, TXT, and DOCX ingestion.",
      "Built for production readiness: Prometheus metrics, health probes, Alembic migrations, Docker Compose, and CI.",
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
      { title: "Production-readiness checks", detail: "Health probes and CI validate deployability, not just local runnability." },
      { title: "Migration-safe schema", detail: "Alembic keeps the schema versioned and reproducible." },
    ],
    observability: [
      { title: "Prometheus metrics", detail: "Ingestion and query performance metrics." },
      { title: "Health probes", detail: "Liveness/readiness endpoints for orchestration." },
    ],
    links: [{ label: "GitHub Profile", href: "https://github.com/acrocantosauras" }],
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
    role: "Computer Vision / AI Video Analytics",
    period: "Industry Experience",
    location: "Pune, India",
    kind: "industry",
    domain: "REAL-TIME VIDEO ANALYTICS",
    points: [
      "Worked on CCTV / video analytics systems — real-time person detection, object tracking, and person/head counting pipelines.",
      "Detection and tracking with YOLO and OpenCV across live RTSP video streams.",
      "Built CV pipelines that turn raw video into real-time analytics: detect, track, count, report.",
      "Hands-on with edge AI concepts — running inference where the cameras are, not just in the cloud.",
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
