import { ADVISORY_VENTURES, getAdvisoryById, type AdvisoryVenture } from '@/lib/advisory'
import type { ProjectStory } from '@/lib/project-story'
import { PRISM_STORY } from '@/lib/stories/prism'
import { SOCIALHUB_STORY } from '@/lib/stories/socialhub'
import { TALEWEAVER_STORY } from '@/lib/stories/taleweaver'
import { FOOTBALL_ANALYTICS_STORY } from '@/lib/stories/football-analytics'
import { SUGARCANE_ML_STORY } from '@/lib/stories/sugarcane-health-ml'
import { UNIFY_STORY } from '@/lib/stories/unify'
import { LINKEDIN_JOBS_STORY } from '@/lib/stories/linkedin-job-scraper'
import { TWITTER_ENGAGEMENT_STORY } from '@/lib/stories/ai-twitter-post-generator'
import { AUTHOR_FINETUNE_STORY } from '@/lib/stories/fitzgerald-lora-pipeline'
import { LLM_COST_AUDIT_STORY } from '@/lib/stories/ai-cost-optimizer'
import { SPORTS_TRACKING_STORY } from '@/lib/stories/yolo-sports-tracking'
import { COURSE_STUDIO_STORY } from '@/lib/stories/course-studio'
import { DATA_LINEAGE_STORY } from '@/lib/stories/data-lineage'

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
  'idea-internal': 'socialhub',
  dbaas: 'socialhub',
  'content-phase': 'socialhub',
}

/** Old slugs → canonical id (for redirects) */
export const LEGACY_PROJECT_SLUGS: Record<string, string> = {
  dbaas: 'socialhub',
  'idea-internal': 'socialhub',
  'content-phase': 'socialhub',
  'getzoned-marketing': 'getzoned',
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
    title: 'Content Phase',
    tagline:
      'Multi-channel GenOps (SocialHub) — AI content, calendar, persona agents, OAuth publish',
    role: 'Builder · GenOps',
    period: '2024 — 2025',
    status: 'Production',
    description:
      'One product, two surfaces: the public SocialHub / Multi-Channel GenOps experience and the production Content Phase monorepo (React + Vite, FastAPI on Apex SaaS). GPT-4o copy, DALL-E 3 / Fal.ai images, RAG over brand docs, monthly content calendar, persona agents, UGC editor, and scheduled publish to Facebook, Instagram, X, LinkedIn, and Reddit — with Telegram parity.',
    highlights: [
      '500K+ posts generated, 12M+ assets managed (per product metrics)',
      'Direct OAuth — post image & caption only; no stored passwords',
      'AI Content Studio, smart calendar, UGC editor, PDF brand intelligence, persona agents (Flux + IP-Adapter)',
      'Production stack: React 19 + Vite 7 SPA, FastAPI, PostgreSQL, Docker Compose, APScheduler worker',
      'Open-source lineage: content-phase1 on GitHub',
    ],
    stack: [
      'FastAPI',
      'Next.js',
      'React 19',
      'Vite 7',
      'Apex SaaS',
      'PostgreSQL',
      'GPT-4o',
      'DALL-E 3',
      'Fal.ai',
      'RAG',
      'OAuth 2.0',
      'n8n',
      'Telegram',
      'Docker',
    ],
    metrics: [
      { label: 'Platforms', value: '5' },
      { label: 'Channels', value: 'Web + Telegram' },
      { label: 'Auth', value: 'OAuth only' },
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
    id: 'sugarcane-health-ml',
    title: 'Sugarcane ML',
    tagline:
      'Crop health ML — database cleaning, stratified splits, VGG19 · ResNet · SVM',
    role: 'Research · VIT Bhopal',
    period: '2023 — 2024',
    status: 'Research',
    description:
      'Faculty-guided sugarcane health research: built a cleaned image database (manifest, dedupe, blur QC, label audit), stratified train/val/test splits, then compared VGG19 and ResNet transfer learning against HOG + SVM baselines on identical data — documented in a co-authored research report.',
    highlights: [
      'Image database with CSV manifest — path, label, resolution, capture batch metadata',
      'Cleaning pipeline: corrupt-file drop, duplicate removal, blur filter, faculty label review',
      'Stratified train/val/test splits (fixed seed) shared by CNN and classical tracks',
      'VGG19 & ResNet fine-tuning + SVM (HOG / color features) — same eval protocol',
      'Metrics: accuracy, precision, recall, F1, confusion matrices · reproducible checkpoints',
    ],
    stack: [
      'Python',
      'pandas',
      'OpenCV',
      'TensorFlow / Keras',
      'VGG19',
      'ResNet',
      'SVM',
      'scikit-learn',
      'Albumentations',
      'Matplotlib',
    ],
    metrics: [
      { label: 'Pipeline', value: 'Clean → split → train' },
      { label: 'Models', value: 'VGG19 · ResNet · SVM' },
      { label: 'Output', value: 'Research report' },
    ],
    story: SUGARCANE_ML_STORY,
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
    metrics: [
      { label: 'Channels', value: '5+' },
      { label: 'Agent', value: '7-step L1' },
      { label: 'Tenancy', value: 'PostgreSQL RLS' },
    ],
    story: UNIFY_STORY,
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
    tagline:
      'AI job discovery for friends — latest USA & UAE AI/ML roles → structured Excel',
    role: 'Builder',
    period: '2025',
    status: 'Open source',
    description:
      'Personal job-hunt tool turned shared pipeline: scrapes fresh AI/ML LinkedIn postings (guest API), uses Claude to extract ten structured fields per role, and exports a filterable spreadsheet. Helped six to eight friends track the latest market without manually opening every posting.',
    highlights: [
      'Used with 6–8 friends — regular runs for the latest AI/ML openings (USA & UAE)',
      'AI extracts company, role, skills, salary signal, remote mode, full JD, and more',
      'Guest API scraper — UA rotation, delays, session caps (`MAX_JOBS_PER_SESSION`)',
      'Output: `linkedin_ai_jobs.xlsx` — one sheet to shortlist and apply',
      'Stack: `linkedin_scraper.py` · `ai_extractor.py` · `excel_writer.py` · CLI `main.py`',
    ],
    stack: [
      'Python',
      'BeautifulSoup',
      'OpenRouter',
      'Claude 3.5',
      'openpyxl',
      'requests',
    ],
    metrics: [
      { label: 'Friends helped', value: '6–8' },
      { label: 'Fields per job', value: '10' },
      { label: 'Regions', value: 'USA · UAE' },
    ],
    story: LINKEDIN_JOBS_STORY,
  },
  {
    id: 'ai-twitter-post-generator',
    title: 'Twitter Engagement',
    tagline:
      'Daily X automation — live AI news → persona tweets + images → publish for reach',
    role: 'Builder',
    period: '2025',
    status: 'Open source',
    description:
      'Built to post on X every day: automated pipeline fetches live AI news (HN, TechCrunch, MIT, OpenAI feeds), Claude drafts persona-styled copy, Fal Flux adds visuals, human approval gate, then Tweepy publishes — designed to keep a daily rhythm and grow audience reach.',
    highlights: [
      'Daily posting workflow — scheduled or on-demand runs, not one-off manual threads',
      'Live news ingestion: RSS + scrape via feedparser and BeautifulSoup',
      'Persona-locked voice in `persona.json` · Claude drafting · Fal Flux images',
      'Approve/reject UI then `/api/twitter/post` to X for mass-facing distribution',
      'FastAPI: research → generate → publish pipeline',
    ],
    stack: [
      'FastAPI',
      'Claude',
      'Fal.ai',
      'Tweepy',
      'BeautifulSoup',
      'feedparser',
      'cron / scheduler',
    ],
    metrics: [
      { label: 'Cadence', value: 'Daily' },
      { label: 'News feeds', value: 'Live APIs' },
      { label: 'Publish', value: 'X / Twitter' },
    ],
    story: TWITTER_ENGAGEMENT_STORY,
  },
  {
    id: 'fitzgerald-lora-pipeline',
    title: 'Author Fine-Tune',
    tagline:
      'LoRA on Qwen2.5-3B — ePub corpus → instruction dataset → RunPod train → Bookgen inference',
    role: 'ML engineer',
    period: '2024 — 2025',
    status: 'Research',
    description:
      'Explains and implements author-style fine-tuning for Bookgen: what LoRA is, why a dedicated adapter beats prompts alone, and how five Fitzgerald ePubs become 3,762 instruction rows, a ~479 MB LoRA trained on RunPod GPU, then loaded in production by the Bookgen `llm-service` for voice-locked chapter streaming.',
    highlights: [
      'LoRA (PEFT) on frozen Qwen2.5-3B — train adapter only, not full model weights',
      'Pipeline: extract → segment → generate_instructions → build_dataset → PEFT train',
      '5 Fitzgerald ePubs → 3,762 instruction pairs in dataset.jsonl',
      'GPU training on RunPod; adapter shipped as fitzgerald_lora/ (~479 MB)',
      'Production: Bookgen llm-service loads base + LoRA for chapter generation',
    ],
    stack: [
      'Python',
      'ebooklib',
      'Transformers',
      'PEFT',
      'PyTorch',
      'Qwen2.5-3B',
      'RunPod',
      'Docker',
      'Jupyter',
    ],
    metrics: [
      { label: 'Training rows', value: '3,762' },
      { label: 'Adapter', value: '~479 MB' },
      { label: 'Inference', value: 'llm-service' },
    ],
    links: [{ label: 'Taleweaver / Bookgen', href: '/projects/taleweaver' }],
    story: AUTHOR_FINETUNE_STORY,
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
    metrics: [
      { label: 'Detect', value: 'YOLO' },
      { label: 'Track', value: 'ByteTrack' },
      { label: 'Output', value: 'CSV / JSON' },
    ],
    links: [{ label: 'Football Intelligence', href: '/projects/football-analytics' }],
    story: SPORTS_TRACKING_STORY,
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
      'OpenRouter',
      'PostgreSQL',
      'Langfuse',
      'Prometheus',
    ],
    metrics: [
      { label: 'Stages', value: '6' },
      { label: 'Output', value: 'Playbook' },
      { label: 'Store', value: 'PostgreSQL' },
    ],
    story: LLM_COST_AUDIT_STORY,
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
    metrics: [
      { label: 'Artifacts', value: 'PPTX + audio' },
      { label: 'Structure', value: 'Module → slide' },
      { label: 'Guide', value: 'Markdown' },
    ],
    story: COURSE_STUDIO_STORY,
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
    metrics: [
      { label: 'Sources', value: '5+' },
      { label: 'Granularity', value: 'Column' },
      { label: 'Graph', value: 'Neo4j' },
    ],
    story: DATA_LINEAGE_STORY,
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
