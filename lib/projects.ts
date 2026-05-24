import { ADVISORY_VENTURES, getAdvisoryById, type AdvisoryVenture } from '@/lib/advisory'
import type { ProjectStory } from '@/lib/project-story'
import { PRISM_STORY } from '@/lib/stories/prism'
import { SOCIALHUB_STORY } from '@/lib/stories/socialhub'
import { TALEWEAVER_STORY } from '@/lib/stories/taleweaver'
import { FOOTBALL_ANALYTICS_STORY } from '@/lib/stories/football-analytics'
import { IDEA_INTERNAL_STORY } from '@/lib/stories/idea-internal'

export type ProjectLink = {
  label: string
  href: string
}

export type ProjectScreenshot = {
  src: string
  alt: string
  caption?: string
}

export type ProjectMetric = {
  label: string
  value: string
}

export type ProjectArchitectureNode = {
  title: string
  detail: string
}

export type Project = {
  id: string
  title: string
  tagline: string
  role: string
  period: string
  status: 'Live' | 'Production' | 'Building' | 'Research' | 'Open source'
  description: string
  highlights: string[]
  stack: string[]
  links?: ProjectLink[]
  featured?: boolean
  /** Cover / hover preview — e.g. `/projects/getzoned/preview.jpg` */
  cover?: string
  preview?: string

  /** Optional rich content rendered on /projects/[slug] when filled in. */
  overview?: string[]
  problem?: string
  solution?: string
  architecture?: ProjectArchitectureNode[]
  metrics?: ProjectMetric[]
  screenshots?: ProjectScreenshot[]
  learnings?: string[]
  /** Narrative case study — renders as story, not spec sheet */
  story?: ProjectStory
}

function advisoryToProject(venture: AdvisoryVenture): Project {
  return { ...venture, featured: false }
}

const PROJECT_ID_ALIASES: Record<string, string> = {
  'idea-internal': 'content-phase',
  dbaas: 'content-phase',
}

/** Old slugs → canonical id (for redirects) */
export const LEGACY_PROJECT_SLUGS: Record<string, string> = {
  dbaas: 'content-phase',
  'idea-internal': 'content-phase',
}

export function getProjectById(id: string): Project | undefined {
  const resolvedId = PROJECT_ID_ALIASES[id] ?? id
  const project = PROJECTS.find((p) => p.id === resolvedId)
  if (project) return project

  const venture = getAdvisoryById(resolvedId)
  return venture ? advisoryToProject(venture) : undefined
}

export const PROJECTS: Project[] = [
  {
    id: 'socialhub',
    featured: true,
    title: 'Multi-Channel GenOps',
    tagline: 'GenOps for social — AI agents, OAuth publish, multi-platform calendars',
    role: 'Builder · GenOps',
    period: '2024 — 2025',
    status: 'Production',
    description:
      'Production GenOps platform for social — GPT-4o copy, DALL-E 3 / Fal.ai images, RAG brand docs, visual planner, and scheduled publish to Facebook, Instagram, X, LinkedIn, and Reddit.',
    highlights: [
      '500K+ posts generated, 12M+ assets managed (per product metrics)',
      'Direct OAuth — post image & caption only; no stored passwords',
      'AI Content Studio, smart calendar, UGC editor, document intelligence, Telegram approvals',
      'Open-source lineage: content-phase1 on GitHub',
    ],
    stack: [
      'FastAPI',
      'Next.js',
      'GPT-4o',
      'DALL-E 3',
      'Fal.ai',
      'RAG',
      'OAuth 2.0',
      'n8n',
      'Telegram',
    ],
    story: SOCIALHUB_STORY,
  },
  {
    id: 'prism',
    title: 'Recruitment AI',
    tagline:
      'AI recruitment automation — résumé screening, scoring, and interview scheduling',
    role: 'Forward Deploy AI Engineer',
    period: '2024 — 2025',
    status: 'Production',
    description:
      'AI hiring copilot built as a custom FastAPI service: Gmail API intake, document parsing pipeline, GPT-4 résumé extraction with strict JSON schemas, weighted scoring engine, candidate database, and Google Calendar interview scheduling with recruiter-facing dashboard.',
    highlights: [
      'Custom FastAPI + Celery pipeline — Gmail intake → parse → score → schedule',
      'GPT-4 structured extraction with JSON-schema validation and retry on schema fail',
      'Weighted scoring engine: skills · experience · seniority · cultural-fit signals',
      '80–85% reduction in manual screening; 15–30 min saved per candidate',
    ],
    stack: [
      'FastAPI',
      'Python',
      'Celery',
      'Redis',
      'PostgreSQL',
      'OpenAI GPT-4',
      'Gmail API',
      'Google Calendar API',
      'Next.js',
    ],
    story: PRISM_STORY,
  },
  {
    id: 'content-phase',
    title: 'Content Phase',
    tagline:
      'GenOps social platform — AI generation, calendar planning, and multi-platform publishing',
    role: 'Forward Deploy AI Engineer',
    period: '2024 — 2025',
    status: 'Production',
    description:
      'Full-stack social media AI manager: React + Vite SPA, FastAPI on Apex SaaS, PostgreSQL, Docker Compose. AI copy and images, monthly content calendar, persona agents (Flux + IP-Adapter), UGC editor, PDF brand extraction, OAuth to five platforms, and a Telegram bot with dashboard parity.',
    highlights: [
      'Production monorepo — React 19 + Vite 7 frontend, FastAPI backend, Docker Compose deploy',
      'Routes: AI content, calendar, agents, UGC, scheduled posts, social posting, credentials',
      'GPT-4o + DALL·E 3 + Fal.ai (Nano Banana / Flux); Gemini for UGC edits',
      'APScheduler worker publishes due posts; Fernet-encrypted OAuth tokens',
      'Production GenOps stack — Docker Compose deploy',
    ],
    stack: [
      'React 19',
      'Vite 7',
      'FastAPI',
      'Apex SaaS',
      'PostgreSQL',
      'Alembic',
      'GPT-4o',
      'Fal.ai',
      'Docker',
      'Telegram',
    ],
    metrics: [
      { label: 'Platforms', value: '5' },
      { label: 'Deploy', value: 'Docker' },
      { label: 'Channels', value: 'Web + Telegram' },
    ],
    story: IDEA_INTERNAL_STORY,
  },
  {
    id: 'sugarcane-health-ml',
    title: 'Sugarcane ML',
    tagline:
      'Comparative CNN & classical ML on crop health — VGG19, ResNet, SVM with faculty',
    role: 'Research · VIT Bhopal',
    period: '2023 — 2024',
    status: 'Research',
    description:
      'Academic research with college faculty on a sugarcane health detection dataset: trained and compared deep models (VGG19, ResNet) against classical pipelines (SVM and related baselines) for disease/stress classification. Documented methodology, metrics, and model trade-offs in a formal research report.',
    highlights: [
      'Built and labeled sugarcane health image database for controlled experiments',
      'Side-by-side evaluation: transfer-learning CNNs vs SVM / traditional feature pipelines',
      'VGG19 and ResNet fine-tuning with augmentation and class-imbalance handling',
      'Research paper / report co-authored with faculty — reproducible train–eval splits',
    ],
    stack: [
      'Python',
      'TensorFlow / Keras',
      'VGG19',
      'ResNet',
      'SVM',
      'scikit-learn',
      'OpenCV',
    ],
    metrics: [
      { label: 'Models compared', value: 'VGG19 · ResNet · SVM' },
      { label: 'Domain', value: 'Agri-health' },
      { label: 'Output', value: 'Research doc' },
    ],
  },
  {
    id: 'unify',
    title: 'Unify',
    tagline: 'Omni-channel L1 platform — NestJS platform + FastAPI agent, multi-tenant',
    role: 'Full-stack builder',
    period: '2024 — 2025',
    status: 'Production',
    description:
      'Production omni-channel support SaaS (`l-1-bot` / kalamandir-l1 on Samsung archive): NestJS platform + FastAPI agent for saree-brand sales on WhatsApp, Telegram, and Instagram — RAG catalog, vision matching, multilingual inbox, and human takeover.',
    highlights: [
      'Source tree: `l-1-bot/` — `backend/app/` (LLM, RAG, channel integrations) + React agent dashboard',
      'Multilingual EN / Telugu / Hindi-Hinglish; image-based product recommendations',
      'Multi-tenant JWT + PostgreSQL RLS, BullMQ, WebSockets for live inbox',
      'Docker deploy docs; parallels kalamandir-l1 monorepo in production',
    ],
    stack: [
      'NestJS 11',
      'FastAPI',
      'PostgreSQL',
      'pgvector',
      'Redis',
      'BullMQ',
      'TypeORM',
      'React',
    ],
    links: [{ label: 'Portfolio · engineering', href: '/projects/unify' }],
  },
  {
    id: 'taleweaver',
    title: 'AI Book Studio',
    tagline: 'Tweet to Bookgen — AI eBooks, author EPUB fine-tuning, voice-locked prose',
    role: 'Builder',
    period: '2024 — 2025',
    status: 'Production',
    description:
      'Taleweaver powers Bookgen (EBOOK stack on disk): React + FastAPI + dedicated LLM service with Fitzgerald LoRA on Qwen2.5-3B. Outline → chapter WebSocket streaming → EPUB/PDF export — born from one viral tweet into a live product.',
    highlights: [
      'Three-tier deploy: `frontend/`, `backend/` (FastAPI), `llm-service/` (GPU inference) + Docker Compose',
      'Fitzgerald-style LoRA — 5 ePub sources → 3,762 training examples (companion `finetune/` pipeline)',
      'Outline → chapter WebSocket streaming → EPUB/PDF export APIs',
      'Voice-locked prose tuned for reader trust, not generic LLM tone',
    ],
    stack: [
      'React',
      'Vite',
      'FastAPI',
      'Qwen2.5-3B',
      'PEFT / LoRA',
      'PyTorch',
      'Docker',
      'EPUB / PDF',
    ],
    links: [{ label: 'Portfolio experience', href: '/projects/taleweaver' }],
    story: TALEWEAVER_STORY,
  },
  {
    id: 'linkedin-job-scraper',
    title: 'AI Jobs Export',
    tagline: 'USA & UAE AI/ML jobs → Claude-structured Excel via guest API',
    role: 'Builder',
    period: '2025',
    status: 'Open source',
    description:
      'Python pipeline that scrapes AI-related LinkedIn postings through the public guest API (no login), applies anti-ban delays and UA rotation, and uses OpenRouter Claude 3.5 Sonnet to extract ten structured fields into a formatted spreadsheet.',
    highlights: [
      'Modules: `linkedin_scraper.py`, `ai_extractor.py`, `excel_writer.py` — CLI `main.py`',
      '10 fields per row: company, role, skills, salary, mode, full JD, and more',
      'Session caps + random delays (`MAX_JOBS_PER_SESSION`) to reduce blocks',
      'Output: `linkedin_ai_jobs.xlsx` — sourced from Samsung `source code/Linkedin-job/`',
    ],
    stack: [
      'Python',
      'BeautifulSoup',
      'OpenRouter',
      'Claude 3.5',
      'openpyxl',
      'requests',
    ],
  },
  {
    id: 'b2b-lead-platform',
    title: 'Lead Intelligence',
    tagline: 'Multi-API lead scoring, enrichment, and discovery dashboard',
    role: 'Builder',
    period: '2025',
    status: 'Building',
    description:
      'FastAPI + PostgreSQL platform that scores B2B prospects from hiring, funding, competition, and growth signals across 7+ data APIs. Modular collectors, weighted lead-scoring engine, async discovery jobs, and Streamlit/FastAPI frontends.',
    highlights: [
      'Scoring weights: hiring 25%, funding 25%, competition 20%, growth 20%, contact 10%',
      'Integrations: Muse, News API, Guardian, Alpha Vantage (per README)',
      'SQLAlchemy ORM + Alembic migrations; background async discovery',
      'Samsung archive: `Storage/code/leads/`',
    ],
    stack: [
      'FastAPI',
      'PostgreSQL',
      'SQLAlchemy',
      'Alembic',
      'Streamlit',
      'Python',
    ],
  },
  {
    id: 'madhost',
    title: 'Rental Ops Bot',
    tagline: 'Airbnb ops bot — WhatsApp guest welcome, Telegram cleaning on checkout',
    role: 'Builder',
    period: '2025',
    status: 'Production',
    description:
      'Minimal FastAPI + SQLite app for short-term rental hosts: add a guest number → automated WhatsApp welcome; checkout → Telegram task to cleaners. Single-page maintenance UI served from the backend.',
    highlights: [
      'Flow: booking form → guest record → WhatsApp Business API message',
      'Checkout button fires Telegram cleaning task (`CLEANER_TELEGRAM_CHAT_ID`)',
      '`backend/app/` API + `frontend/index.html`; PRD dated Feb 2025',
      'Samsung archive: `source code/madhost/`',
    ],
    stack: [
      'FastAPI',
      'SQLAlchemy',
      'SQLite',
      'WhatsApp Business API',
      'Telegram Bot API',
    ],
  },
  {
    id: 'ai-twitter-post-generator',
    title: 'Social Post AI',
    tagline: 'AI news scrape → persona tweets + Fal Flux images → approve & post',
    role: 'Builder',
    period: '2025',
    status: 'Open source',
    description:
      'FastAPI backend with static approval UI: researches AI news (HN, TechCrunch, MIT, OpenAI feeds), drafts persona-styled tweets, generates Fal Flux images, and posts approved items via Tweepy.',
    highlights: [
      '`/api/research` → generate → approve/reject → `/api/twitter/post` pipeline',
      'Persona config in `backend/app/persona/persona.json`',
      'Anthropic Claude + Fal.ai + BeautifulSoup/feedparser',
      'Samsung archive: `source code/twiter posting/`',
    ],
    stack: [
      'FastAPI',
      'Claude',
      'Fal.ai',
      'Tweepy',
      'BeautifulSoup',
      'feedparser',
    ],
  },
  {
    id: 'fitzgerald-lora-pipeline',
    title: 'Author Fine-Tune',
    tagline: 'ePub extract → instruction dataset → Qwen2.5-3B style adapter',
    role: 'ML engineer',
    period: '2024 — 2025',
    status: 'Research',
    description:
      'Offline training pipeline that turns Fitzgerald ePub corpora into a LoRA adapter for Bookgen: extract → segment → instruction generation → `dataset.jsonl` → PEFT training. Ships trained weights in `fitzgerald_lora/`.',
    highlights: [
      'Scripts: `extract.py`, `segment.py`, `generate_instructions.py`, `build_dataset.py`',
      '5 books → 3,762 instruction examples (per project README)',
      'Trained adapter ~479 MB; notebooks for author-style experiments',
      'Samsung archive: `source code/finetune/` — feeds Bookgen `llm-service/`',
    ],
    stack: [
      'Python',
      'ebooklib',
      'Transformers',
      'PEFT',
      'Qwen2.5-3B',
      'Jupyter',
    ],
  },
  {
    id: 'getzoned-marketing',
    title: 'Discovery Marketing',
    tagline: 'Next.js 14 — 300m map, micro-events, 3D hero, early-access flows',
    role: 'Co-founder & CTO',
    period: '2024 — Present',
    status: 'Live',
    description:
      'Marketing and waitlist site for GetZoned (`zoned/` on Samsung SSD): hyper-local social discovery with Framer Motion, React Three Fiber / Spline visuals, product lanes in `data/products.ts`, and Google Sheets/Gmail hooks for registration and feedback.',
    highlights: [
      'App Router modals: early access, host event, choice flows + Lenis smooth scroll',
      'API routes: `app/api/register`, `app/api/feedback` with Apps Script integration',
      'Static export `out/` build; pairs with live app at getzoned.in',
      'Samsung archive: `source code/zoned/`',
    ],
    stack: [
      'Next.js 14',
      'TypeScript',
      'Tailwind CSS',
      'Framer Motion',
      'React Three Fiber',
      'Spline',
    ],
    links: [
      { label: 'getzoned.in', href: 'https://getzoned.in' },
    ],
  },
  {
    id: 'football-analytics',
    title: 'Football Intelligence',
    tagline:
      'Trust & development — AI for injury risk, player valuation, performance, and team intelligence',
    role: 'Builder · AI for sport',
    period: '2025 — Present',
    status: 'Building',
    description:
      'Football Analytics uses AI to maximize player development, predict value growth, and help prevent injuries. Four modules — injury risk, valuation projection, performance tracking, and team management — give clubs one shared view for medical, performance, and coaching decisions.',
    highlights: [
      'Unleash the power of AI in football — development, valuation, and injury prevention',
      'Injury risk: multi-signal intelligence before breakdown; €750M+ annual cost context in top leagues',
      'Valuation: 2–5 season projections from career trajectories; 45–55% transfer miss rate addressed',
      'Performance: early drift detection, load optimization, training-to-match alignment',
      'Team: medical, performance, athletic, and coaching aligned on availability and results',
      'Product site: championsgen.framer.website (integrated platform in progress)',
    ],
    stack: [
      'AI / ML',
      'Sports analytics',
      'Injury intelligence',
      'Valuation models',
      'Performance data',
      'Team intelligence',
    ],
    links: [
      {
        label: 'Product site',
        href: 'https://championsgen.framer.website/',
      },
    ],
    metrics: [
      { label: 'Top-league injury cost', value: '€750M+/yr' },
      { label: 'Transfers off-target', value: '45–55%' },
      { label: 'Injury value hit', value: '20–50%' },
    ],
    story: FOOTBALL_ANALYTICS_STORY,
  },
  {
    id: 'yolo-sports-tracking',
    title: 'Sports Tracking CV',
    tagline: 'Real-time sports vision — YOLO detection and multi-object tracking',
    role: 'ML engineer',
    period: '2024',
    status: 'Research',
    description:
      'Computer-vision pipeline to detect and track players and the ball in match footage using YOLO-family detectors plus tracking logic. Built for frame-level trajectories, team-side heuristics, and downstream analytics on possession and movement patterns.',
    highlights: [
      'YOLO-based detection tuned for small/fast ball and crowded player scenes',
      'Multi-frame tracking to maintain IDs across occlusions and camera cuts',
      'Exportable track logs for heatmaps, speed, and zone-entry stats',
      'Evaluation on custom sports footage with precision/recall per object class',
    ],
    stack: [
      'Python',
      'YOLO',
      'Ultralytics',
      'OpenCV',
      'PyTorch',
      'ByteTrack / SORT',
    ],
  },
  {
    id: 'web-scraper-evasion',
    title: 'Adaptive Scraper',
    tagline:
      'High-volume scraping with anti-bot and human-verification bypass layers',
    role: 'Builder',
    period: '2024',
    status: 'Open source',
    description:
      'Web scraping stack designed to work past common bot gates: rotating sessions, browser-like headers, retry/backoff, and layered strategies to clear human-verification challenges before extracting structured data at scale.',
    highlights: [
      'Session and fingerprint rotation to reduce block rates on protected sites',
      'Pluggable bypass steps for CAPTCHA / “verify you are human” interstitials',
      'Resilient crawl queue with dedup, rate limits, and failure recovery',
      'Structured export (JSON/CSV) for downstream NLP and research pipelines',
    ],
    stack: [
      'Python',
      'Selenium',
      'httpx',
      'BeautifulSoup',
      'Proxy rotation',
      'Async I/O',
    ],
  },
  {
    id: 'ai-cost-optimizer',
    title: 'LLM Cost Audit',
    tagline:
      'Audit LLM spend from infra inventory — calls, tokens, models, and savings',
    role: 'Builder · GenOps',
    period: '2025',
    status: 'Building',
    description:
      'Tooling that ingests a company’s AI footprint (API keys, services, call logs), counts LLM invocations, surfaces per-model token usage, and recommends cheaper routing — which model for which task, batching, caching, and provider swaps.',
    highlights: [
      'Inventory step: map apps, envs, and providers from infrastructure questionnaire',
      'Telemetry: aggregate prompt/completion tokens, $ estimate, and call volume by endpoint',
      'Compare models (GPT-4o vs mini vs open weights) on cost vs quality bands',
      'Output playbook: what to migrate, throttle, or cache first',
    ],
    stack: [
      'Python',
      'FastAPI',
      'OpenAI / Anthropic APIs',
      'PostgreSQL',
      'Langfuse',
      'Prometheus-style metrics',
    ],
  },
  {
    id: 'course-studio',
    title: 'Course Builder AI',
    tagline: 'AI course builder — slides, narration audio, and structured modules',
    role: 'Builder',
    period: '2025',
    status: 'Building',
    description:
      'End-to-end course authoring flow: outline a syllabus, generate slide decks (PPT-compatible), and attach AI voiceover that explains each slide in plain language — one exportable package for LMS or internal training.',
    highlights: [
      'Module → lesson → slide hierarchy with learning objectives per section',
      'Automated PPT generation with consistent layout and speaker notes',
      'TTS / audio bed per slide for listen-along courses',
      'Batch export: slides + MP3/WAV + markdown instructor guide',
    ],
    stack: [
      'Python',
      'LLMs',
      'python-pptx',
      'TTS',
      'FastAPI',
      'Next.js',
    ],
  },
  {
    id: 'data-lineage',
    title: 'Data Lineage KG',
    tagline:
      'Warehouse connectors → SQL parse → access checks → loader to lineage graph',
    role: 'Data engineer',
    period: '2025',
    status: 'Building',
    description:
      'Data-lineage platform that connects heterogeneous stores (Airflow-orchestrated pipelines, Snowflake, Oracle, BigQuery, plain SQL sources), pulls raw queries, parses SQL into source/target column mappings, runs access verification, normalizes metadata, and loads edges into a knowledge graph for end-to-end lineage and impact analysis.',
    highlights: [
      'Connectors for Airflow DAG metadata plus Snowflake, Oracle, BigQuery, and SQL files',
      'SQL parser extracts tables, columns, transforms, and write targets',
      'Access-verification layer before exposing lineage to consumers',
      'Loader publishes source → transformation → target triples into a knowledge graph',
    ],
    stack: [
      'Python',
      'Apache Airflow',
      'Snowflake',
      'Oracle',
      'BigQuery',
      'SQLGlot / sqlparse',
      'Neo4j',
      'Knowledge graph',
    ],
  },
]

export const FEATURED_PROJECT = PROJECTS.find((p) => p.featured) ?? PROJECTS[0]

export const OTHER_PROJECTS = PROJECTS.filter((p) => !p.featured)

export function getAllStorySlugs(): string[] {
  const advisorySlugs = ADVISORY_VENTURES.filter((v) => v.story).map((v) => v.id)
  const projectSlugs = PROJECTS.filter((p) => p.story).map((p) => p.id)
  return [...new Set([...projectSlugs, ...advisorySlugs])]
}

/** Every id in PROJECTS — used so /projects/[slug] is built for all list rows. */
export function getAllProjectSlugs(): string[] {
  const advisorySlugs = ADVISORY_VENTURES.filter((v) => v.story).map((v) => v.id)
  return [...new Set([...PROJECTS.map((p) => p.id), ...advisorySlugs])]
}
