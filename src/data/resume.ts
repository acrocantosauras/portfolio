// Single source of truth — every fact on this site traces back to the resume.
// File: public/resume/Meet_Jadhav_Resume.pdf
export const profile = {
  name: "Meet Jadhav",
  role: "AI / Backend Engineer",
  tagline: "Systems that ship with proof, not promises.",
  location: "Pune, Maharashtra",
  phone: "+91-7397846178",
  email: "meetjadhav2003@gmail.com",
  linkedin: "https://linkedin.com/in/meet-jadhav-05a64b250",
  linkedinLabel: "linkedin.com/in/meet-jadhav-05a64b250",
  github: "https://github.com/acrocantosauras",
  githubLabel: "github.com/acrocantosauras",
  resumeUrl: "/resume/Meet_Jadhav_Resume.pdf",
  summary:
    "2025 B.E. graduate (Electronics & Telecommunication) with hands-on experience building full-stack and backend systems in Python, including a RAG-based knowledge assistant and an LLM evaluation platform with automated quality checks. Comfortable working across APIs, databases, testing, and deployment, with a solid foundation in data structures, algorithms, and OOP. Microsoft Azure AI-900 certified.",
} as const;

export type SkillGroup = {
  id: string;
  label: string;
  codename: string;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    id: "languages",
    label: "Languages",
    codename: "CORE DIALECTS",
    items: ["Python", "JavaScript", "TypeScript", "SQL", "HTML/CSS"],
  },
  {
    id: "backend",
    label: "Backend & Databases",
    codename: "THE ENGINE ROOM",
    items: [
      "FastAPI",
      "SQLAlchemy",
      "PostgreSQL",
      "pgvector",
      "Alembic",
      "Redis",
      "arq",
      "JWT & API-Key Auth",
    ],
  },
  {
    id: "frontend",
    label: "Frontend",
    codename: "THE INTERFACE",
    items: ["React", "Next.js", "TypeScript", "Vite"],
  },
  {
    id: "ai-ml",
    label: "AI / ML",
    codename: "THE SENSES",
    items: [
      "LLM Integration & Evaluation",
      "LLM-as-a-Judge",
      "RAG",
      "NLP",
      "Hugging Face",
      "Sentence Transformers",
      "PyTorch",
      "TensorFlow",
    ],
  },
  {
    id: "quality",
    label: "Quality Engineering & Observability",
    codename: "THE WATCHTOWER",
    items: [
      "Quality Gates",
      "Regression Detection",
      "Prometheus",
      "Grafana",
      "OpenTelemetry",
      "Structured Logging",
      "Rate Limiting",
    ],
  },
  {
    id: "practices",
    label: "Engineering Practices",
    codename: "FIELD DISCIPLINE",
    items: [
      "Data Structures & Algorithms",
      "OOP",
      "Unit Testing (pytest, 215 tests)",
      "CI/CD (GitHub Actions)",
      "Docker",
    ],
  },
  {
    id: "tools",
    label: "Tools & Cloud",
    codename: "THE UTILITY BELT",
    items: [
      "Git",
      "GitHub",
      "Postman",
      "VS Code",
      "PyCharm",
      "Microsoft Azure AI Fundamentals (AI-900)",
    ],
  },
];

export type Project = {
  slug: string;
  codename: string;
  title: string;
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
    slug: "llm-evaluation-platform",
    codename: "CASE FILE 01",
    title: "LLM Evaluation Platform",
    period: "2025 – 2026",
    status: "flagship",
    oneLiner:
      "Quality gates and regression detection that stop a bad model change before it ships.",
    stack: [
      "Python",
      "FastAPI",
      "PostgreSQL",
      "Redis / arq",
      "Next.js",
      "Prometheus",
      "Grafana",
      "OpenTelemetry",
      "Docker",
    ],
    summary: [
      "A production-oriented LLM/RAG evaluation platform measuring answer quality, hallucination, faithfulness, and retrieval precision/recall — enforcing quality gates and metric-aware regression detection before a change can ship.",
      "Async batch evaluation runs on Redis/arq workers, with LLM-as-a-judge scoring and API-key authentication guarding every call.",
      "A Next.js dashboard surfaces results in real time, with Prometheus and OpenTelemetry wired in for observability end to end.",
      "215 automated tests back the system. A production Docker Compose setup is validated via GitHub Actions CI, where quality gates fail the build on regression — public cloud deployment is in progress.",
    ],
    architecture: {
      nodes: [
        { id: "client", label: "Next.js Dashboard", detail: "Submits evaluation runs, renders live quality-gate results and regression trends.", group: "interface" },
        { id: "api", label: "FastAPI Gateway", detail: "API-key authenticated entry point; validates requests and enqueues evaluation jobs.", group: "core" },
        { id: "queue", label: "Redis / arq Workers", detail: "Async batch evaluation runs off the request path — workers pull jobs and score them in parallel.", group: "core" },
        { id: "judge", label: "LLM-as-a-Judge", detail: "Scores answer quality, hallucination, and faithfulness against reference and retrieved context.", group: "core" },
        { id: "db", label: "PostgreSQL", detail: "Stores run history, per-metric scores, and thresholds used for regression comparison.", group: "data" },
        { id: "gate", label: "Quality Gates", detail: "Metric-aware regression detection — a run that degrades below threshold fails the build.", group: "quality" },
        { id: "ci", label: "GitHub Actions CI", detail: "Runs the 215-test suite and the quality-gate check against a production Docker Compose setup on every change.", group: "quality" },
        { id: "obs", label: "Prometheus / Grafana / OTel", detail: "Metrics and traces from every service, visualized for regression and latency tracking.", group: "observability" },
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
      { title: "Judging the judge", detail: "LLM-as-a-judge scoring is inherently noisy — the platform treats metrics as statistical signals with thresholds tuned for regression sensitivity, not pass/fail absolutes." },
      { title: "Async at scale", detail: "Batch evaluation runs had to stay off the request path. Redis/arq workers decouple submission from scoring so the dashboard stays responsive during large runs." },
      { title: "Ship-blocking gates", detail: "Quality gates are only useful if they're trustworthy enough to actually block a merge — metric-aware regression detection compares against historical baselines, not fixed thresholds alone." },
    ],
    testing: [
      { title: "215 automated tests", detail: "pytest suite covering evaluation logic, API contracts, and worker behavior." },
      { title: "CI-enforced gates", detail: "GitHub Actions runs the full suite and quality gates against a production-shaped Docker Compose setup — regressions fail the build, not just a warning." },
    ],
    observability: [
      { title: "Prometheus metrics", detail: "Service and evaluation-run metrics scraped for dashboards and alerting." },
      { title: "OpenTelemetry tracing", detail: "Distributed traces across the API, queue, and worker boundary." },
      { title: "Grafana dashboards", detail: "Visualizes regression trends and system health over time." },
    ],
    links: [{ label: "GitHub Profile", href: "https://github.com/acrocantosauras" }],
  },
  {
    slug: "ai-knowledge-assistant",
    codename: "CASE FILE 02",
    title: "AI Knowledge Assistant",
    period: "2026",
    status: "active",
    oneLiner:
      "A full-stack RAG assistant that answers from your own documents, with receipts.",
    stack: ["Python", "FastAPI", "PostgreSQL / pgvector", "React", "TypeScript", "Docker", "JWT"],
    summary: [
      "A full-stack RAG knowledge assistant built end-to-end — FastAPI backend, PostgreSQL with pgvector for semantic search, and a React/TypeScript frontend.",
      "Users upload documents and get LLM-powered answers grounded in their own content, with source citations attached to every answer.",
      "JWT authentication with Argon2 password hashing protects the system; document processing pipelines handle PDF, TXT, and DOCX ingestion.",
      "Engineered for production readiness: Prometheus metrics, health probes, Alembic migrations, Docker Compose, and CI — public deployment is in progress.",
    ],
    architecture: {
      nodes: [
        { id: "ui", label: "React / TypeScript UI", detail: "Document upload, chat interface, and inline source citations.", group: "interface" },
        { id: "api", label: "FastAPI Backend", detail: "JWT-authenticated API layer handling auth, ingestion, and query routing.", group: "core" },
        { id: "ingest", label: "Ingestion Pipeline", detail: "Parses and chunks PDF, TXT, and DOCX uploads for embedding.", group: "core" },
        { id: "pgvector", label: "PostgreSQL + pgvector", detail: "Stores document chunks and embeddings; semantic search via vector similarity.", group: "data" },
        { id: "llm", label: "LLM Answer Generation", detail: "Generates grounded answers from retrieved chunks, attaching source citations.", group: "core" },
        { id: "auth", label: "JWT + Argon2", detail: "Authentication layer with Argon2 password hashing for credential storage.", group: "quality" },
        { id: "obs", label: "Prometheus + Health Probes", detail: "Metrics and liveness/readiness probes for production monitoring.", group: "observability" },
        { id: "migrate", label: "Alembic Migrations", detail: "Versioned schema migrations for the Postgres database.", group: "data" },
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
      { title: "Grounded, not generic", detail: "Answers are only useful if they're traceable — every response carries source citations back to the originating document chunk." },
      { title: "Multi-format ingestion", detail: "PDF, TXT, and DOCX each parse differently; the pipeline normalizes them into a consistent chunking format before embedding." },
      { title: "Semantic search at the database layer", detail: "pgvector keeps embeddings and relational data in one Postgres instance instead of a separate vector store, simplifying the deployment surface." },
    ],
    testing: [
      { title: "Production-readiness checks", detail: "Health probes and CI validate the system is deployable, not just runnable locally." },
      { title: "Migration-safe schema", detail: "Alembic migrations keep the database schema versioned and reproducible across environments." },
    ],
    observability: [
      { title: "Prometheus metrics", detail: "Exposes application metrics for monitoring ingestion and query performance." },
      { title: "Health probes", detail: "Liveness/readiness endpoints for orchestration and deployment tooling." },
    ],
    links: [{ label: "GitHub Profile", href: "https://github.com/acrocantosauras" }],
  },
  {
    slug: "jarvis",
    codename: "CASE FILE 03",
    title: "J.A.R.V.I.S.",
    period: "2025",
    status: "archived",
    oneLiner:
      "A modular Windows AI assistant with a plugin architecture built to outlive any single feature.",
    stack: ["Python", "OpenAI API", "Tkinter", "SpeechRecognition", "pyttsx3", "cryptography", "pystray"],
    summary: [
      "A modular Windows AI assistant with GPT-3.5 chat, voice/text interaction, and 18 built-in command categories spanning apps, system controls, web search, and email.",
      "An extensible plugin architecture — built on importlib and a register() interface — separates core routing from independently loadable plugins.",
      "Daemon-threaded background operations keep the assistant responsive; thread-safe GUI updates run through root.after().",
      "Credentials are protected with Fernet-encrypted storage, keyed to a git-ignored key file.",
    ],
    architecture: {
      nodes: [
        { id: "gui", label: "Tkinter GUI", detail: "Thread-safe UI updates via root.after(), voice and text input.", group: "interface" },
        { id: "router", label: "Core Router", detail: "Dispatches commands to the correct plugin based on parsed intent.", group: "core" },
        { id: "plugins", label: "Plugin Registry", detail: "importlib + register() interface — plugins load independently of core routing.", group: "core" },
        { id: "voice", label: "SpeechRecognition / pyttsx3", detail: "Voice input capture and text-to-speech output.", group: "interface" },
        { id: "openai", label: "OpenAI API (GPT-3.5)", detail: "Powers natural-language chat responses.", group: "core" },
        { id: "creds", label: "Fernet-Encrypted Store", detail: "Credential storage encrypted at rest, keyed to a git-ignored key file.", group: "quality" },
        { id: "threads", label: "Daemon Threads", detail: "Background operations run off the main thread without blocking the GUI.", group: "quality" },
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
      { title: "Plugins without a restart", detail: "importlib-based loading with a register() interface lets command categories be added or changed independently of the core router." },
      { title: "A responsive GUI under async load", detail: "Voice recognition and API calls run on daemon threads; all GUI mutation is marshaled back through root.after() to stay thread-safe." },
      { title: "Credentials at rest", detail: "API keys and secrets are Fernet-encrypted rather than stored in plaintext, with the key file itself git-ignored." },
    ],
    testing: [
      { title: "18 command categories", detail: "Covering apps, system controls, web search, and email — each independently loadable and testable as a plugin." },
    ],
    links: [{ label: "GitHub Profile", href: "https://github.com/acrocantosauras" }],
  },
];

export type ExperienceItem = {
  id: string;
  kind: "experience" | "education" | "certification";
  title: string;
  org: string;
  location?: string;
  period: string;
  bullets?: string[];
};

export const timeline: ExperienceItem[] = [
  {
    id: "edu-highschool",
    kind: "education",
    title: "Higher Secondary (Science) — 86.66%",
    org: "MGSK Gujarati High School",
    location: "Sangli, Maharashtra",
    period: "2021",
  },
  {
    id: "edu-degree",
    kind: "education",
    title: "B.E., Electronics & Telecommunication",
    org: "Shrimati Kashibai Navale College of Engineering",
    location: "Pune, Maharashtra",
    period: "Aug 2021 – May 2025",
  },
  {
    id: "cert-azure",
    kind: "certification",
    title: "Azure AI Fundamentals (AI-900)",
    org: "Microsoft",
    period: "2024",
  },
  {
    id: "cert-meta",
    kind: "certification",
    title: "Python Certificate, Back-End Development, Version Control (Git/GitHub)",
    org: "Meta / Coursera",
    period: "2025",
  },
  {
    id: "projects-independent",
    kind: "experience",
    title: "Independent Projects",
    org: "Self-directed",
    period: "Aug 2025 – Present",
    bullets: [
      "LLM Evaluation Platform, AI Knowledge Assistant, and J.A.R.V.I.S. — built and shipped solo.",
    ],
  },
];

export const certifications = [
  { title: "Microsoft Certified: Azure AI Fundamentals (AI-900)", org: "Microsoft, 2024" },
  { title: "Python Certificate", org: "Meta / Coursera, 2025" },
  { title: "Back-End Development", org: "Meta / Coursera, 2025" },
  { title: "Version Control (Git/GitHub)", org: "Meta / Coursera, 2025" },
];
