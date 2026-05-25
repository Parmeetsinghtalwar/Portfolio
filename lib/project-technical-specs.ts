import type { ProjectTechnicalSpec } from '@/lib/project-technical'
import {
  UNIFY_ARCHITECTURE_LAYERS,
  UNIFY_FLOW_STEPS,
  UNIFY_STACK_GROUPS,
  UNIFY_TECH_STATS,
} from '@/lib/unify-tech'

type SpecOverrides = Partial<ProjectTechnicalSpec>

export const PROJECT_TECHNICAL_SPECS: Record<string, SpecOverrides> = {
  socialhub: {
    summary:
      'Content Phase / SocialHub — production GenOps platform: React 19 + Vite 7 SPA (and Next.js dashboard surfaces), FastAPI on Apex SaaS, multi-LLM orchestrator, persona agents (Flux + IP-Adapter), UGC + calendar services, APScheduler/Celery workers, and OAuth publishers across five social networks on PostgreSQL + Redis + Cloudinary/S3 + pgvector.',
    diagram: [
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ CLIENT      Next.js dashboard · Studio · Calendar · UGC editor   │',
      '└────────────────────────────────┬─────────────────────────────────┘',
      '                                 │  HTTPS · JWT · OAuth flows',
      '                                 ▼',
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ EDGE        Next.js SSR · rate limit · OAuth callbacks · CDN     │',
      '└────────────────────────────────┬─────────────────────────────────┘',
      '                                 │',
      '┌────────────────────────────────▼─────────────────────────────────┐',
      '│ APPLICATION   FastAPI service mesh                               │',
      '│   Content-gen │ Assets │ Schedule │ Approvals │ Analytics │ Auth │',
      '└──┬───────────┬─────────┬──────────┬──────────────┬───────────────┘',
      '   │           │         │          │              │',
      '   ▼           ▼         ▼          ▼              ▼',
      '┌──────┐  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐',
      '│ LLM  │  │ Image   │  │ Brand    │  │ Telegram │  │ Worker  │',
      '│GPT-4o│  │ DALL·E  │  │ RAG      │  │ approval │  │ pool    │',
      '│Claude│  │ Fal.ai  │  │ pgvector │  │ bot      │  │ (Celery)│',
      '└──────┘  └─────────┘  └──────────┘  └──────────┘  └────┬────┘',
      '                                                        │  schedule + retry',
      '┌───────────────────────────────────────────────────────▼──────────┐',
      '│ DATA        PostgreSQL · Redis · S3 (12M assets) · pgvector      │',
      '└────────────────────────────────┬─────────────────────────────────┘',
      '                                 │ OAuth tokens per platform',
      '                                 ▼',
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ CHANNELS    Facebook · Instagram · X · LinkedIn · Reddit         │',
      '│             Direct publish — image + caption · no passwords      │',
      '└──────────────────────────────────────────────────────────────────┘',
      '',
      'OBS  Langfuse traces · Sentry · Prometheus + Grafana · audit log',
    ].join('\n'),
    layers: [
      {
        title: 'Client',
        detail:
          'Next.js dashboard surfaces — AI Content Studio, smart calendar, UGC editor, document intelligence, analytics. Single-tenant per workspace with role-based UI.',
      },
      {
        title: 'Edge / auth',
        detail:
          'Next.js SSR with JWT sessions, per-route rate limits, and OAuth callback handlers for each social network. CDN-served static assets.',
      },
      {
        title: 'Application services',
        detail:
          'FastAPI service mesh — content generation, asset library, scheduling, approval routing, analytics aggregation, and an auth/OAuth token service that refreshes platform credentials.',
      },
      {
        title: 'AI orchestrator',
        detail:
          'LLM router (GPT-4o, Claude) for copy and prompts; image generators (DALL·E 3, Fal.ai); RAG retrieval over brand docs stored in pgvector; Langfuse traces every call.',
      },
      {
        title: 'Worker plane',
        detail:
          'Celery + Redis queue: scheduled posts, retries with exponential backoff, async image generation, OAuth token refresh, and webhook fan-out to channel publishers.',
      },
      {
        title: 'Data plane',
        detail:
          'PostgreSQL for content/schedules/users; Redis for cache and queue; S3 (or compatible) for 12M+ assets; pgvector for brand document embeddings.',
      },
      {
        title: 'Channels',
        detail:
          'Per-platform OAuth publishers (Facebook, Instagram, X, LinkedIn, Reddit) — push captions + media; no passwords ever stored.',
      },
    ],
    technologies: [
      {
        group: 'Application',
        items: [
          'FastAPI',
          'Apex SaaS',
          'Next.js',
          'React 19',
          'Vite 7',
          'TypeScript',
          'Python',
          'Celery',
          'APScheduler',
        ],
      },
      {
        group: 'AI',
        items: [
          'GPT-4o',
          'Claude',
          'DALL·E 3',
          'Fal.ai',
          'Flux IP-Adapter',
          'Gemini (UGC)',
          'RAG',
          'pgvector',
        ],
      },
      {
        group: 'Data',
        items: ['PostgreSQL', 'Redis', 'S3', 'pgvector', 'OAuth 2.0'],
      },
      {
        group: 'Ops',
        items: ['Docker', 'Langfuse', 'Sentry', 'Prometheus', 'Grafana'],
      },
    ],
    inputs: [
      {
        label: 'Brand context',
        format: 'PDF / docs / URLs',
        description: 'Ingested into pgvector with embeddings for RAG retrieval at generation time.',
      },
      {
        label: 'Campaign brief',
        format: 'JSON (topic, tone, platforms, window)',
        description: 'Drives the AI orchestrator and scheduler.',
      },
      {
        label: 'OAuth grants',
        format: 'Platform OAuth tokens',
        description: 'Per-platform credentials with refresh + scope minimization.',
      },
    ],
    outputs: [
      {
        label: 'Scheduled posts',
        format: 'Per-channel publish jobs',
        description: 'Caption + media payloads queued for the OAuth publishers.',
      },
      {
        label: 'Asset library',
        format: 'S3 + DB metadata',
        description: 'Centralized inventory of generated and uploaded media.',
      },
      {
        label: 'Analytics',
        format: 'Aggregated metrics API',
        description: 'Engagement, reach, and asset usage across connected accounts.',
      },
    ],
    results: [
      { label: 'Posts generated', value: '500K+', detail: 'Production throughput' },
      { label: 'Assets managed', value: '12M+', detail: 'Centralized media library' },
      { label: 'Channels', value: '5', detail: 'FB · IG · X · LI · Reddit' },
      { label: 'Auth model', value: 'OAuth only', detail: 'Zero stored passwords' },
    ],
  },

  prism: {
    summary:
      'Custom recruitment AI: FastAPI service + Celery workers ingest applications from Gmail, parse documents, extract structured candidate data with GPT-4 under strict JSON schemas, run a weighted scoring engine, and schedule interviews through the Google Calendar API.',
    diagram: [
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ SOURCES     Gmail (job inbox) · Careers form · Manual upload     │',
      '└────────────────────────────────┬─────────────────────────────────┘',
      '                                 │ Gmail API push · webhook',
      '                                 ▼',
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ INGEST      Email service · attachment fetch · dedup             │',
      '└────────────────────────────────┬─────────────────────────────────┘',
      '                                 │',
      '┌────────────────────────────────▼─────────────────────────────────┐',
      '│ APPLICATION  (FastAPI + Celery on Redis)                         │',
      '│   Parser  →  Extraction  →  Scoring  →  Pipeline  →  Scheduler   │',
      '└────┬──────────────┬─────────────┬───────────┬─────────┬──────────┘',
      '     │              │             │           │         │',
      '     ▼              ▼             ▼           ▼         ▼',
      '┌─────────┐  ┌──────────────┐  ┌────────┐  ┌──────┐  ┌──────────┐',
      '│ PDF /   │  │ GPT-4 JSON   │  │ Score  │  │ State│  │ GCal     │',
      '│ DOCX    │  │ schema       │  │ engine │  │ FSM  │  │ invite   │',
      '│ extract │  │ validator    │  │ (rules)│  │      │  │ + email  │',
      '└─────────┘  └──────────────┘  └────────┘  └──────┘  └──────────┘',
      '',
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ DATA        PostgreSQL (candidates · roles · scores) · Redis     │',
      '│             Object store (raw résumés) · audit log               │',
      '└────────────────────────────────┬─────────────────────────────────┘',
      '                                 │',
      '                                 ▼',
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ DASHBOARD   Next.js · recruiter inbox · scoring view · overrides │',
      '└──────────────────────────────────────────────────────────────────┘',
      '',
      'OBS  Structured logs · per-candidate trace · SLA timers',
    ].join('\n'),
    layers: [
      {
        title: 'Sources',
        detail:
          'Gmail job inbox (Gmail API push notifications), careers form webhooks, and manual recruiter upload — all normalized into application events.',
      },
      {
        title: 'Ingest',
        detail:
          'Email worker fetches attachments, deduplicates by message-id, and persists raw artifacts to object storage before parsing.',
      },
      {
        title: 'Application services (FastAPI + Celery)',
        detail:
          'Parser (PDF/DOCX/text), GPT-4 extraction with strict JSON-schema validation and retry, weighted scoring engine, candidate state machine, and Google Calendar scheduling service.',
      },
      {
        title: 'Data plane',
        detail:
          'PostgreSQL for candidates, roles, scores, and pipeline state; Redis for Celery + caching; object storage for raw résumé files; immutable audit log.',
      },
      {
        title: 'Recruiter dashboard',
        detail:
          'Next.js app — inbox, ranked candidate view, score explainability, manual override, and interview-slot booking. Talks to FastAPI over JWT-protected APIs.',
      },
      {
        title: 'External integrations',
        detail:
          'Gmail API (inbound + replies), Google Calendar API (invites), and configurable webhooks for ATS systems.',
      },
    ],
    technologies: [
      {
        group: 'Backend',
        items: ['FastAPI', 'Python', 'Celery', 'Redis', 'PostgreSQL'],
      },
      {
        group: 'AI',
        items: ['OpenAI GPT-4', 'JSON Schema', 'Pydantic validation'],
      },
      {
        group: 'Integrations',
        items: ['Gmail API', 'Google Calendar API', 'Webhooks', 'OAuth 2.0'],
      },
      {
        group: 'Frontend / ops',
        items: ['Next.js', 'TypeScript', 'Docker', 'Structured logging'],
      },
    ],
    inputs: [
      { label: 'Inbound résumé', format: 'Email + PDF/DOCX', description: 'Gmail-triggered application with attachments.' },
      { label: 'Job criteria', format: 'JSON role config', description: 'Skills, seniority, must-haves, and scoring weights.' },
    ],
    outputs: [
      { label: 'Ranked candidate', format: 'PostgreSQL row', description: 'Structured fields, score, and explainability factors.' },
      { label: 'Interview invite', format: 'GCal event + email', description: 'Auto-booked slots for candidates above threshold.' },
    ],
    results: [
      { label: 'Manual screening', value: '80–85%↓', detail: 'Recruiter time removed' },
      { label: 'Per candidate', value: '15–30 min saved', detail: 'Default automated path' },
      { label: 'Extraction', value: 'JSON-schema', detail: 'GPT-4 with retry-on-fail' },
    ],
  },

  'sugarcane-health-ml': {
    summary:
      'Sugarcane crop-health research pipeline: field image ingestion → manifest database → cleaning & QC (dedupe, corrupt drop, blur filter, faculty label audit) → stratified splits → augmentation → parallel VGG19/ResNet CNN training and HOG+SVM classical baseline → unified evaluation and faculty co-authored report.',
    diagram: [
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ COLLECTION   Field captures · class protocol · batch metadata    │',
      '└────────────────────────────────┬─────────────────────────────────┘',
      '                                 ▼',
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ CATALOG DB   CSV manifest · paths · labels · resolution · batch  │',
      '└────────────────────────────────┬─────────────────────────────────┘',
      '                                 ▼',
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ CLEANING     Drop corrupt · dedupe · blur score · label review   │',
      '│              Faculty sign-off on disputed classes                │',
      '└────────────────────────────────┬─────────────────────────────────┘',
      '                                 ▼',
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ SPLITS       Stratified train / val / test · fixed seed          │',
      '└────────────────────────────────┬─────────────────────────────────┘',
      '                                 ▼',
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ PREPROCESS   Resize · normalize · augment (train only) · balance  │',
      '└──┬───────────────────────────────────────────────────┬──────────┘',
      '   ▼ CNN track                                           ▼ classical',
      '┌─────────────────────────────┐         ┌───────────────────────────┐',
      '│ VGG19 · ResNet fine-tune    │         │ HOG · color hist → SVM    │',
      '└──────────────┬──────────────┘         └─────────────┬─────────────┘',
      '               └──────────────────┬──────────────────┘',
      '                                  ▼',
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ EVALUATION   Acc · precision · recall · F1 · confusion matrix    │',
      '└────────────────────────────────┬─────────────────────────────────┘',
      '                                 ▼',
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ DELIVERABLE  Clean manifest · splits · checkpoints · PDF report  │',
      '└──────────────────────────────────────────────────────────────────┘',
    ].join('\n'),
    layers: [
      {
        title: 'Collection & catalog',
        detail:
          'Field images per health class with faculty labeling protocol. Central manifest (CSV) registers file path, class ID, resolution, and capture batch before any modeling.',
      },
      {
        title: 'Database cleaning',
        detail:
          'Remove corrupt/unreadable files; dedupe near-identical frames; blur scoring for unusable photos; resolution floor; manual review queue for ambiguous labels with faculty approval.',
      },
      {
        title: 'Splits & preprocess',
        detail:
          'Stratified train/val/test with fixed seed — identical indices for CNN and SVM. Resize, normalize, augmentation on train only; oversampling / class weights for imbalance.',
      },
      {
        title: 'Model tracks',
        detail:
          'Deep: VGG19 and ResNet transfer learning (frozen lower blocks, custom head). Classical: HOG + color histogram features → SVM with validation grid search.',
      },
      {
        title: 'Evaluation & report',
        detail:
          'Held-out test metrics and confusion matrices per model; trade-off analysis in co-authored research PDF with reproducible split files and checkpoints.',
      },
    ],
    technologies: [
      {
        group: 'Data',
        items: ['Python', 'pandas', 'CSV manifest', 'OpenCV', 'imagehash / dedupe'],
      },
      {
        group: 'Deep learning',
        items: ['TensorFlow / Keras', 'VGG19', 'ResNet', 'Albumentations'],
      },
      {
        group: 'Classical ML',
        items: ['scikit-learn', 'SVM', 'HOG', 'color histograms'],
      },
      {
        group: 'Evaluation',
        items: ['Matplotlib', 'confusion matrix', 'precision/recall/F1'],
      },
    ],
    inputs: [
      {
        label: 'Raw field images',
        format: 'JPEG/PNG folders',
        description: 'Unsorted captures from plots — health, disease, stress classes.',
      },
      {
        label: 'Label manifest',
        format: 'CSV database',
        description: 'Path, class, resolution, batch ID — updated after each cleaning pass.',
      },
    ],
    outputs: [
      {
        label: 'Cleaned dataset',
        format: 'Manifest + split indices',
        description: 'Audited catalog and frozen train/val/test partitions.',
      },
      {
        label: 'Model checkpoints',
        format: 'Keras / sklearn artifacts',
        description: 'Best CNN and SVM models per validation metric.',
      },
      {
        label: 'Research report',
        format: 'PDF',
        description: 'Cleaning methodology, metrics tables, CNN vs SVM conclusions.',
      },
    ],
    results: [
      { label: 'Data QC', value: 'Full pipeline', detail: 'Catalog → clean → split' },
      { label: 'Deep models', value: 'VGG19 · ResNet', detail: 'Transfer learning' },
      { label: 'Baseline', value: 'SVM + HOG', detail: 'Same test split' },
      { label: 'Output', value: 'Research doc', detail: 'Faculty co-authored' },
    ],
  },

  unify: {
    summary:
      'Multi-tenant omni-channel L1 platform: NestJS monorepo (conversations, RBAC, BullMQ, channel webhooks) + FastAPI L1 agent (NLU, orchestrator, tool calls) on PostgreSQL with row-level security per tenant.',
    diagram: [
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ CHANNELS    WhatsApp · Telegram · Instagram · Email · Web chat   │',
      '└────────────────────────────────┬─────────────────────────────────┘',
      '                                 │ webhooks · tenant resolved',
      '                                 ▼',
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ PLATFORM (NestJS 11 monorepo · kalamandir-l1)                    │',
      '│   API gateway · JWT auth · tenant middleware · RBAC (29 perms)   │',
      '│   Conversations · tickets · ownership locks · audit log          │',
      '└──┬──────────────────────────────────────────────────┬────────────┘',
      '   │                                                  │',
      '   │ BullMQ (queue)                                   │ REST call',
      '   ▼                                                  ▼',
      '┌──────────────────────┐                  ┌──────────────────────┐',
      '│ Outbound workers     │                  │ L1 AGENT (FastAPI)   │',
      '│ delivery · retries   │                  │ POST /api/v1/message │',
      '│ rate limit per chan  │                  │ 7-step pipeline      │',
      '└──────────────────────┘                  └──────────┬───────────┘',
      '                                                     │',
      '   ┌─────────────────────────────────────────────────┤',
      '   ▼               ▼                ▼                ▼',
      '┌────────┐  ┌──────────────┐  ┌──────────┐  ┌────────────────┐',
      '│Content │  │ Translate    │  │ Catalog  │  │ Orders /       │',
      '│guard   │  │ EN·HI·TE·HG  │  │ search   │  │ payments tools │',
      '│        │  │              │  │pgvector  │  │                │',
      '└────────┘  └──────────────┘  └──────────┘  └────────────────┘',
      '',
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ DATA   PostgreSQL 16 + RLS (app.tenant_id) · Redis · pgvector    │',
      '│        Per-tenant credentials · audit log · ticket store         │',
      '└──────────────────────────────────────────────────────────────────┘',
      '',
      'INFRA  AWS ECS · RDS · ElastiCache (Terraform) · structlog · Sentry',
    ].join('\n'),
    layers: UNIFY_ARCHITECTURE_LAYERS.map((l) => ({
      title: l.title,
      detail: l.detail,
    })),
    flow: UNIFY_FLOW_STEPS.map((f) => ({
      step: f.step,
      title: f.title,
      body: f.body,
    })),
    technologies: UNIFY_STACK_GROUPS.map((g) => ({
      group: g.group,
      items: [...g.items],
    })),
    inputs: [
      {
        label: 'Inbound message',
        format: 'Channel webhook JSON',
        description: 'WhatsApp, Telegram, Instagram, or web chat — resolved to tenant + conversation.',
      },
      {
        label: 'Thread context',
        format: 'conversation_id + tenant_id',
        description: 'Full history loaded with RLS-pinned tenant scope.',
      },
    ],
    outputs: [
      {
        label: 'L1 reply',
        format: 'Channel-formatted text/media',
        description: 'Catalog search, orders, payments, or escalate-to-human signal.',
      },
      {
        label: 'Ticket / audit',
        format: 'PostgreSQL rows',
        description: 'Escalation, ownership locks, audit trail, supervisor view.',
      },
    ],
    results: UNIFY_TECH_STATS.map((s) => ({
      label: s.label,
      value: s.value,
      detail: s.sub,
    })),
  },

  taleweaver: {
    summary:
      'Three-tier book generation stack: React/Vite frontend, FastAPI orchestration with WebSocket streaming, and a GPU LLM service running Qwen2.5-3B + a Fitzgerald LoRA adapter — backed by an offline fine-tuning pipeline that turns ePubs into instruction data.',
    diagram: [
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ CLIENT      React + Vite (Bookgen UI) — outline · chapters · pub │',
      '└────────────────────────────────┬─────────────────────────────────┘',
      '                                 │ HTTPS + WebSocket',
      '                                 ▼',
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ BACKEND     FastAPI · session state · WS fan-out · export jobs   │',
      '└──┬───────────────────────────────┬──────────────────────────┬────┘',
      '   │ REST                          │ WS stream                │ jobs',
      '   ▼                               ▼                          ▼',
      '┌──────────────┐         ┌──────────────────────┐    ┌──────────────┐',
      '│ Outline      │         │ LLM-SERVICE (GPU)    │    │ EPUB / PDF   │',
      '│ generator    │         │ Qwen2.5-3B + LoRA    │    │ exporter     │',
      '│              │         │ token streaming      │    │ ebooklib     │',
      '└──────────────┘         └──────────┬───────────┘    └──────────────┘',
      '                                    │',
      '                       ┌────────────┴─────────────┐',
      '                       ▼                          ▼',
      '              ┌─────────────────┐        ┌──────────────────┐',
      '              │ Adapter weights │        │ Base model cache │',
      '              │ fitzgerald_lora │        │ (transformers)   │',
      '              └────────┬────────┘        └──────────────────┘',
      '                       │ trained offline',
      '┌──────────────────────▼──────────────────────────────────────────┐',
      '│ TRAINING PIPELINE (companion repo `finetune/`)                  │',
      '│   ePub → extract → segment → instruction-gen → dataset.jsonl    │',
      '│   → PEFT LoRA train on Qwen2.5-3B (3,762 examples)              │',
      '└─────────────────────────────────────────────────────────────────┘',
      '',
      'DATA  PostgreSQL (projects · chapters) · object store (exports)',
    ].join('\n'),
    layers: [
      { title: 'Frontend', detail: 'React/Vite Bookgen UI — outline editor, streaming chapter view, export controls.' },
      { title: 'Backend', detail: 'FastAPI orchestration, session and outline state, WebSocket fan-out per chapter, and export job dispatcher.' },
      { title: 'LLM service (GPU)', detail: 'Qwen2.5-3B base model + Fitzgerald PEFT LoRA adapter (~479 MB), streaming generation with sampling controls.' },
      { title: 'Training pipeline', detail: 'Offline `finetune/` repo turns ePub corpora into 3,762 instruction examples, then trains a LoRA adapter consumed by the LLM service.' },
      { title: 'Data + export', detail: 'PostgreSQL for projects, outlines, chapters; object storage for EPUB/PDF exports.' },
    ],
    inputs: [
      { label: 'Story premise', format: 'JSON outline', description: 'Genre, characters, chapter plan, tone.' },
      { label: 'Style adapter', format: 'LoRA weights', description: 'Fitzgerald voice trained from 5 ePub sources.' },
    ],
    outputs: [
      { label: 'Chapters', format: 'WebSocket token stream', description: 'Live streaming generation per chapter.' },
      { label: 'Manuscript', format: 'EPUB / PDF', description: 'Export-ready book files.' },
    ],
    results: [
      { label: 'Training examples', value: '3,762', detail: 'From 5 books' },
      { label: 'Deploy tiers', value: '3', detail: 'frontend · backend · llm-service' },
      { label: 'Adapter size', value: '~479 MB', detail: 'PEFT LoRA on Qwen2.5-3B' },
    ],
  },

  'linkedin-job-scraper': {
    summary:
      'Python data pipeline: rotating-session guest-API scraper feeds raw HTML postings into a Claude 3.5 structured-extraction stage, which writes ten typed fields per row into a formatted Excel workbook.',
    diagram: [
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ INPUT       Search URLs · region filters · session env config    │',
      '└────────────────────────────────┬─────────────────────────────────┘',
      '                                 ▼',
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ SCRAPER     linkedin_scraper.py · session pool · UA rotation     │',
      '│             random delay · MAX_JOBS_PER_SESSION cap              │',
      '└────────────────────────────────┬─────────────────────────────────┘',
      '                                 │ HTML posts',
      '                                 ▼',
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ PARSER      BeautifulSoup → normalized fields                    │',
      '└────────────────────────────────┬─────────────────────────────────┘',
      '                                 ▼',
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ AI EXTRACT  ai_extractor.py · OpenRouter Claude 3.5              │',
      '│             10-field JSON schema (company · role · skills · …)   │',
      '└────────────────────────────────┬─────────────────────────────────┘',
      '                                 ▼',
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ WRITER      excel_writer.py · openpyxl · linkedin_ai_jobs.xlsx   │',
      '└──────────────────────────────────────────────────────────────────┘',
    ].join('\n'),
    inputs: [
      { label: 'Job listings', format: 'LinkedIn guest HTML', description: 'AI/ML roles, USA & UAE — no login required.' },
      { label: 'Session config', format: 'ENV', description: 'MAX_JOBS_PER_SESSION, delays, UA rotation.' },
    ],
    outputs: [
      {
        label: 'Structured rows',
        format: 'linkedin_ai_jobs.xlsx',
        description: '10 fields per row: company, role, skills, salary, mode, full JD, etc.',
      },
    ],
    results: [
      { label: 'Friends helped', value: '6–8', detail: 'Latest-job export runs' },
      { label: 'Fields per job', value: '10', detail: 'Claude-structured' },
      { label: 'Anti-ban', value: 'Delays + caps', detail: 'Session limits + UA rotation' },
    ],
  },

  'ai-twitter-post-generator': {
    summary:
      'Twitter Engagement — daily X automation: live news feeds (RSS + scrape) → FastAPI research worker → Claude persona drafts → Fal Flux images → human approval → Tweepy publish. Built for a consistent daily post cadence and broader reach on AI/tech news.',
    diagram: [
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ SCHEDULE    Daily trigger (cron / manual) · post-every-day goal  │',
      '└────────────────────────────────┬─────────────────────────────────┘',
      '                                 ▼',
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ LIVE FEEDS  HN · TechCrunch · MIT · OpenAI (RSS + scrape)        │',
      '└────────────────────────────────┬─────────────────────────────────┘',
      '                                 ▼',
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ RESEARCH    /api/research · feedparser + BeautifulSoup           │',
      '└────────────────────────────────┬─────────────────────────────────┘',
      '                                 ▼',
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ DRAFT       Claude · persona.json · engagement-focused copy      │',
      '└────────┬────────────────────────────────────┬────────────────────┘',
      '         ▼                                    ▼',
      '┌────────────────────┐                ┌───────────────────────────┐',
      '│ Fal Flux image     │                │ Approval UI               │',
      '└─────────┬──────────┘                └──────────┬────────────────┘',
      '          └──────────────────┬───────────────────┘',
      '                                 ▼',
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ PUBLISH     /api/twitter/post · Tweepy → X (reach timeline)      │',
      '└──────────────────────────────────────────────────────────────────┘',
    ].join('\n'),
    layers: [
      {
        title: 'Live news ingestion',
        detail:
          'Polls RSS and scrape targets each run so tweets reference what shipped today — Hacker News, TechCrunch, MIT, OpenAI blog, and similar AI/tech sources.',
      },
      {
        title: 'Daily automation',
        detail:
          'Designed for a daily loop: one scheduled or manual pipeline execution produces candidate posts instead of rebuilding the workflow from scratch.',
      },
      {
        title: 'Drafting & visuals',
        detail:
          'Claude writes in a fixed persona; Fal Flux generates per-post imagery so timeline posts stand out in crowded feeds.',
      },
      {
        title: 'Publish to X',
        detail:
          'Human approve/reject gate, then Tweepy posts text + media — optimized for consistent presence and audience growth.',
      },
    ],
    technologies: [
      { group: 'Backend', items: ['FastAPI', 'Python', 'feedparser', 'BeautifulSoup'] },
      { group: 'AI', items: ['Claude', 'Fal Flux'] },
      { group: 'Distribution', items: ['Tweepy', 'X API', 'cron / scheduler'] },
    ],
    inputs: [
      { label: 'Live news feeds', format: 'RSS / HTTP', description: 'Fresh AI/tech stories each run.' },
      { label: 'Persona', format: 'persona.json', description: 'Voice, tone, and topic guardrails.' },
    ],
    outputs: [
      { label: 'Daily draft', format: 'Text + image', description: 'Ready for approval.' },
      { label: 'Published post', format: 'X timeline', description: 'Live tweet after approve.' },
    ],
    results: [
      { label: 'Cadence', value: 'Daily', detail: 'Automated news → post loop' },
      { label: 'Feeds', value: 'Live', detail: 'RSS + scrape' },
      { label: 'Goal', value: 'Reach', detail: 'Consistent X presence' },
    ],
  },

  'fitzgerald-lora-pipeline': {
    summary:
      'Author LoRA fine-tuning for Bookgen: Fitzgerald ePubs → instruction dataset (3,762 rows) → PEFT LoRA on Qwen2.5-3B trained on RunPod GPU → fitzgerald_lora/ adapter loaded by the production llm-service for voice-locked chapter streaming (see Taleweaver).',
    diagram: [
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ WHY LoRA    Voice-locked chapters · not one-shot prompting       │',
      '└────────────────────────────────┬─────────────────────────────────┘',
      '                                 ▼',
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ CORPUS      5 Fitzgerald ePub titles (sole style source)         │',
      '└────────────────────────────────┬─────────────────────────────────┘',
      '                                 ▼',
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ extract.py → segment.py → generate_instructions.py               │',
      '│ build_dataset.py → dataset.jsonl (3,762 instruction pairs)       │',
      '└────────────────────────────────┬─────────────────────────────────┘',
      '                                 ▼',
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ TRAIN (GPU)  PEFT LoRA on Qwen2.5-3B · RunPod · Transformers     │',
      '│              → fitzgerald_lora/ (~479 MB adapter weights)        │',
      '└────────────────────────────────┬─────────────────────────────────┘',
      '                                 ▼',
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ PRODUCTION   Bookgen llm-service (GPU) · base + LoRA at inference │',
      '│              WebSocket chapters ← FastAPI ← React frontend       │',
      '└──────────────────────────────────────────────────────────────────┘',
    ].join('\n'),
    layers: [
      {
        title: 'What fine-tuning does',
        detail:
          'LoRA adds trainable low-rank matrices on a frozen Qwen2.5-3B base. The model keeps general language ability; the adapter specializes output toward Fitzgerald-like prose.',
      },
      {
        title: 'Dataset build',
        detail:
          'ePub extract, passage segmentation, teacher-LLM instruction pairs, JSONL merge — 3,762 supervised examples before any GPU train.',
      },
      {
        title: 'Training (RunPod)',
        detail:
          'PEFT training notebooks/scripts on cloud GPU — practical VRAM and runtime for 3B + LoRA. Output: fitzgerald_lora/ weight directory.',
      },
      {
        title: 'Production inference',
        detail:
          'Bookgen llm-service hot-loads base Qwen + adapter, streams chapter tokens to the backend. Same weights trained offline; Dockerized three-tier deploy.',
      },
    ],
    technologies: [
      { group: 'Training', items: ['Python', 'ebooklib', 'PEFT', 'Transformers', 'PyTorch', 'Jupyter'] },
      { group: 'Model', items: ['Qwen2.5-3B', 'LoRA', 'safetensors'] },
      { group: 'Infrastructure', items: ['RunPod GPU', 'Docker', 'Bookgen llm-service'] },
    ],
    inputs: [
      { label: 'Author ePubs', format: '5 × ePub', description: 'Fitzgerald corpus — single voice target.' },
      { label: 'Base checkpoint', format: 'Qwen2.5-3B', description: 'Frozen foundation model for LoRA.' },
    ],
    outputs: [
      { label: 'dataset.jsonl', format: '3,762 rows', description: 'Instruction/response training pairs.' },
      { label: 'fitzgerald_lora/', format: '~479 MB', description: 'Adapter consumed at inference.' },
      { label: 'Chapter stream', format: 'WebSocket', description: 'Voice-locked text in Bookgen UI.' },
    ],
    results: [
      { label: 'Examples', value: '3,762', detail: 'From 5 books' },
      { label: 'Train GPU', value: 'RunPod', detail: 'LoRA fine-tune' },
      { label: 'Deploy', value: 'llm-service', detail: 'Production inference' },
    ],
  },

  'football-analytics': {
    summary:
      'Football intelligence platform: feature store ingests match telemetry, medical history, and contract context; four ML modules (injury risk, valuation, performance, team) read from it; a decisions API surfaces alerts and projections to a clubs-facing dashboard.',
    diagram: [
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ SOURCES     GPS/load telemetry · medical EHR · scouting · league │',
      '└────────────────────────────────┬─────────────────────────────────┘',
      '                                 │ ETL · validation',
      '                                 ▼',
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ FEATURE STORE   per-player time series · contract context        │',
      '└──┬───────────────┬──────────────────┬──────────────┬─────────────┘',
      '   │               │                  │              │',
      '   ▼               ▼                  ▼              ▼',
      '┌──────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐',
      '│ Injury   │ │ Valuation    │ │ Performance  │ │ Team /       │',
      '│ risk     │ │ projection   │ │ tracking     │ │ squad model  │',
      '│ model    │ │ (2–5 season) │ │ (drift)      │ │              │',
      '└─────┬────┘ └──────┬───────┘ └──────┬───────┘ └──────┬───────┘',
      '      └────────────┬┴───────────────┬┴────────────────┘',
      '                                 ▼',
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ DECISION API   risk scores · valuation bands · alerts · plans    │',
      '└────────────────────────────────┬─────────────────────────────────┘',
      '                                 ▼',
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ DASHBOARD   Medical · performance · coaching · executive views   │',
      '└──────────────────────────────────────────────────────────────────┘',
    ].join('\n'),
    layers: [
      { title: 'Sources', detail: 'GPS/load telemetry, medical history, contract context, scouting datasets, league feeds.' },
      { title: 'Feature store', detail: 'Per-player time series with contract metadata; serves all four ML modules from a single source of truth.' },
      { title: 'Injury intelligence', detail: 'Multi-signal model that flags risk before breakdown.' },
      { title: 'Valuation', detail: '2–5 season market value projections from career trajectories.' },
      { title: 'Performance', detail: 'Drift detection and load optimization tied to training-to-match alignment.' },
      { title: 'Team hub', detail: 'Medical, performance, athletic, and coaching views aligned on availability and decisions.' },
    ],
    inputs: [
      { label: 'Player telemetry', format: 'Time series', description: 'Load, minutes, GPS-style metrics.' },
      { label: 'Medical history', format: 'Structured events', description: 'Injuries and return-to-play windows.' },
    ],
    outputs: [
      { label: 'Risk scores', format: 'Dashboard %', description: 'Injury likelihood bands per player.' },
      { label: 'Valuation bands', format: 'EUR projections', description: 'Transfer and development decisions.' },
    ],
  },

  'yolo-sports-tracking': {
    summary:
      'Sports CV pipeline: OpenCV decodes match video into a GPU-batched frame queue, Ultralytics YOLO detects players and ball, ByteTrack/SORT maintains track IDs, analytics derive speed/zones/possession proxies, and CSV/JSON + annotated video export for football intelligence workflows.',
    diagram: [
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ INPUT       Match video · MP4 / RTSP stream                      │',
      '└────────────────────────────────┬─────────────────────────────────┘',
      '                                 │ OpenCV decode',
      '                                 ▼',
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ FRAME QUEUE  bounded buffer · GPU batching                       │',
      '└────────────────────────────────┬─────────────────────────────────┘',
      '                                 ▼',
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ DETECTOR    YOLO (Ultralytics) · PyTorch · player + ball classes │',
      '└────────────────────────────────┬─────────────────────────────────┘',
      '                                 ▼',
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ TRACKER     ByteTrack / SORT · ID maintenance across occlusions  │',
      '└────────────────────────────────┬─────────────────────────────────┘',
      '                                 ▼',
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ ANALYTICS   speed · zones · heatmaps · possession proxies        │',
      '└────────────────────────────────┬─────────────────────────────────┘',
      '                                 ▼',
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ EXPORT      CSV/JSON track logs · annotated video                │',
      '└──────────────────────────────────────────────────────────────────┘',
    ].join('\n'),
    inputs: [
      { label: 'Video frames', format: 'MP4 / stream', description: 'Broadcast or training footage.' },
    ],
    layers: [
      {
        title: 'Decode',
        detail:
          'OpenCV/PyAV reads MP4 or RTSP, normalizes FPS and resolution, feeds a bounded async queue so long matches do not exhaust RAM.',
      },
      {
        title: 'Detect',
        detail:
          'Ultralytics YOLO (PyTorch) per frame — player + ball classes with weights tuned for small ball and crowded scenes.',
      },
      {
        title: 'Track',
        detail:
          'ByteTrack or SORT associates detections into persistent IDs across occlusions and camera motion.',
      },
      {
        title: 'Analytics & export',
        detail:
          'NumPy/Pandas derivations for speed, heatmaps, zone entries; CSV/JSON track logs and optional annotated MP4 for QA.',
      },
    ],
    technologies: [
      { group: 'Vision', items: ['YOLO', 'Ultralytics', 'OpenCV', 'PyTorch'] },
      { group: 'Tracking', items: ['ByteTrack', 'SORT'] },
      { group: 'Output', items: ['CSV', 'JSON', 'Annotated video'] },
    ],
    outputs: [
      { label: 'Track IDs', format: 'CSV / JSON', description: 'Per-frame player and ball positions.' },
      { label: 'Analytics', format: 'Derived stats', description: 'Speed, zones, possession proxies.' },
    ],
    results: [
      { label: 'Classes', value: 'Player + ball', detail: 'Per-frame detect' },
      { label: 'Tracker', value: 'ByteTrack', detail: 'ID continuity' },
      { label: 'Downstream', value: 'Football CV', detail: 'Analytics feed' },
    ],
  },

  'ai-cost-optimizer': {
    summary:
      'GenOps LLM cost & infra audit: structured discovery questionnaire → FastAPI inventory (apps, envs, models, keys) → provider usage collectors → Langfuse + PostgreSQL telemetry ($/tokens per endpoint) → cost-vs-quality analyzer → prioritized Markdown playbook (migrate, throttle, cache, batch) with quantified savings.',
    diagram: [
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ DISCOVERY   Infra questionnaire · API keys · service map         │',
      '└────────────────────────────────┬─────────────────────────────────┘',
      '                                 ▼',
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ INVENTORY   Apps · envs · providers · models per endpoint        │',
      '└────────────────────────────────┬─────────────────────────────────┘',
      '                                 ▼',
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ COLLECTORS  OpenAI · Anthropic · OpenRouter usage telemetry      │',
      '└────────────────────────────────┬─────────────────────────────────┘',
      '                                 ▼',
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ TELEMETRY   token aggregation · $ estimate · per-task cost bands │',
      '│             PostgreSQL · Prometheus-style metrics                │',
      '└────────────────────────────────┬─────────────────────────────────┘',
      '                                 ▼',
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ ANALYZER    model compare (GPT-4o · mini · open weights · …)     │',
      '│             cost vs quality bands · routing recommendations      │',
      '└────────────────────────────────┬─────────────────────────────────┘',
      '                                 ▼',
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ PLAYBOOK    Markdown report · migrate · throttle · cache · batch │',
      '└──────────────────────────────────────────────────────────────────┘',
      '',
      'OBS  Langfuse traces · Prometheus metrics · FastAPI inventory API',
    ].join('\n'),
    layers: [
      {
        title: 'Discovery',
        detail:
          'Infrastructure questionnaire captures apps, environments, provider accounts, models per route, owners, and task types (chat, extraction, embedding, agent loop). Seeds the audit before any API pull.',
      },
      {
        title: 'Inventory service',
        detail:
          'FastAPI + PostgreSQL normalized map: one row per endpoint with model list, env, team owner, estimated spend band, and links to repo/service names for remediation.',
      },
      {
        title: 'Usage collectors',
        detail:
          'Read-only pulls from OpenAI, Anthropic, OpenRouter (and similar) usage APIs plus app call logs — prompt/completion tokens, model id, latency, USD estimate per request.',
      },
      {
        title: 'Telemetry store',
        detail:
          'PostgreSQL rollups (daily spend by model/endpoint/task); Langfuse for trace-level prompt attribution; Prometheus metrics for volume, error rate, and p95 latency dashboards.',
      },
      {
        title: 'Analyzer',
        detail:
          'Compares GPT-4o vs mini vs open-weight routes per task band with quality guardrails — flags re-prompt waste, missing cache, oversized context, and unbounded agent iterations.',
      },
      {
        title: 'Playbook output',
        detail:
          'Ordered Markdown (optional PDF): migrate model on endpoint X, enable cache on Y, throttle Z, batch jobs — each line tied to inventory id and estimated monthly savings.',
      },
    ],
    technologies: [
      { group: 'API', items: ['FastAPI', 'Python', 'PostgreSQL'] },
      { group: 'Providers', items: ['OpenAI', 'Anthropic', 'OpenRouter'] },
      { group: 'Observability', items: ['Langfuse', 'Prometheus', 'Trace tagging'] },
      { group: 'Deliverable', items: ['Cost dashboard', 'Markdown playbook'] },
    ],
    inputs: [
      { label: 'Infra questionnaire', format: 'Structured JSON', description: 'Apps, envs, keys, providers, owners.' },
      { label: 'API inventory', format: 'Keys + service map', description: 'Normalized endpoint → model mapping.' },
      { label: 'Usage logs', format: 'Tokens + traces', description: 'Per endpoint, model, and feature tag.' },
    ],
    outputs: [
      { label: 'Inventory DB', format: 'PostgreSQL', description: 'Canonical AI footprint per company.' },
      { label: 'Cost report', format: 'Dashboard + $ estimate', description: 'Spend by model, endpoint, task type.' },
      { label: 'Playbook', format: 'Markdown', description: 'Prioritized migrate · throttle · cache · batch actions.' },
    ],
    results: [
      { label: 'Audit stages', value: '6', detail: 'Discovery → playbook' },
      { label: 'Telemetry', value: 'Langfuse', detail: 'Per-prompt attribution' },
      { label: 'Savings', value: 'Quantified', detail: 'Per recommendation' },
    ],
  },

  'course-studio': {
    summary:
      'Course authoring pipeline: an LLM outlines a syllabus, a structured generator produces module/lesson/slide content, python-pptx renders branded decks with speaker notes, a TTS stage attaches per-slide narration, and an exporter bundles the artifacts for an LMS package.',
    diagram: [
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ INPUT       Course brief · audience · objectives · constraints   │',
      '└────────────────────────────────┬─────────────────────────────────┘',
      '                                 ▼',
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ OUTLINE     LLM (FastAPI service) · syllabus + objectives        │',
      '└────────────────────────────────┬─────────────────────────────────┘',
      '                                 ▼',
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ CONTENT GEN  module → lesson → slide hierarchy + speaker notes   │',
      '└────────────────────────────────┬─────────────────────────────────┘',
      '                                 ▼',
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ SLIDE RENDER  python-pptx · branded templates · diagrams         │',
      '└──┬──────────────────────────────────────────────┬────────────────┘',
      '   │                                              │',
      '   ▼                                              ▼',
      '┌──────────────────────┐                ┌──────────────────────────┐',
      '│ TTS                  │                │ Markdown instructor guide│',
      '│ per-slide narration  │                │                          │',
      '└──────────┬───────────┘                └────────────┬─────────────┘',
      '           │                                         │',
      '           └──────────────────┬──────────────────────┘',
      '                              ▼',
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ EXPORT      LMS package · PPTX + MP3/WAV per slide + guide       │',
      '└──────────────────────────────────────────────────────────────────┘',
    ].join('\n'),
    inputs: [
      { label: 'Course brief', format: 'Text', description: 'Audience, objectives, module count.' },
    ],
    layers: [
      {
        title: 'Outline',
        detail:
          'FastAPI + LLM: syllabus with module → lesson hierarchy and learning objectives — human-editable gate before slide generation.',
      },
      {
        title: 'Content & render',
        detail:
          'Structured slide copy and speaker notes; python-pptx branded templates produce consistent PPTX (not raw markdown dumps).',
      },
      {
        title: 'Audio & guide',
        detail:
          'Per-slide TTS (Edge or ElevenLabs-class providers); parallel Markdown instructor guide with timing and discussion prompts.',
      },
      {
        title: 'Export',
        detail:
          'Batch LMS package: PPTX + MP3/WAV per slide + facilitator markdown in one folder structure.',
      },
    ],
    technologies: [
      { group: 'Backend', items: ['FastAPI', 'Python', 'LLM'] },
      { group: 'Slides', items: ['python-pptx', 'Templates'] },
      { group: 'Media', items: ['TTS', 'MP3/WAV'] },
    ],
    outputs: [
      { label: 'Slide deck', format: 'PPTX', description: 'Layouts + speaker notes.' },
      { label: 'Audio', format: 'MP3/WAV', description: 'Per-slide narration.' },
      { label: 'Instructor guide', format: 'Markdown', description: 'Facilitator timing and prompts.' },
    ],
    results: [
      { label: 'Hierarchy', value: 'Module → slide', detail: 'Objectives per section' },
      { label: 'Export', value: 'LMS bundle', detail: 'Slides + audio + guide' },
    ],
  },

  'data-lineage': {
    summary:
      'End-to-end data-lineage platform: heterogeneous connectors pull SQL and DAG metadata from warehouses, a parser extracts column-level mappings, an access-verification stage gates exposure, and a graph loader publishes source → transform → target edges to a knowledge graph.',
    diagram: [
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ SOURCES   Airflow DAGs · Snowflake · Oracle · BigQuery · .sql    │',
      '└────────────────────────────────┬─────────────────────────────────┘',
      '                                 ▼',
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ CONNECTORS  metadata + raw query pull · per-source adapters      │',
      '└────────────────────────────────┬─────────────────────────────────┘',
      '                                 ▼',
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ SQL PARSER  SQLGlot / sqlparse → tables · columns · transforms   │',
      '└────────────────────────────────┬─────────────────────────────────┘',
      '                                 ▼',
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ ACCESS CHECK   ownership · permissions · governance gates        │',
      '└────────────────────────────────┬─────────────────────────────────┘',
      '                                 ▼',
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ NORMALIZE     canonical schema · entity ids · transform metadata │',
      '└────────────────────────────────┬─────────────────────────────────┘',
      '                                 ▼',
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ GRAPH LOADER  Neo4j writer · source → transform → target edges   │',
      '└────────────────────────────────┬─────────────────────────────────┘',
      '                                 ▼',
      '┌──────────────────────────────────────────────────────────────────┐',
      '│ CONSUMERS   Lineage UI · impact analysis · audit / governance    │',
      '└──────────────────────────────────────────────────────────────────┘',
    ].join('\n'),
    layers: [
      { title: 'Connectors', detail: 'Per-source adapters for Airflow DAG metadata, Snowflake, Oracle, BigQuery, and raw SQL files — pull both queries and job metadata.' },
      { title: 'SQL parser', detail: 'SQLGlot/sqlparse extracts tables, columns, transforms, and write targets at column-level granularity.' },
      { title: 'Governance', detail: 'Access verification and ownership checks before any lineage edge is exposed to downstream consumers.' },
      { title: 'Normalization', detail: 'Canonical entity ids and transform metadata so heterogeneous sources stitch into one graph.' },
      { title: 'Graph', detail: 'Neo4j loader writes source → transform → target triples; supports column-level lineage and impact analysis queries.' },
    ],
    inputs: [
      { label: 'SQL artifacts', format: '.sql / warehouse API', description: 'Queries and job metadata from heterogeneous sources.' },
    ],
    technologies: [
      { group: 'Sources', items: ['Airflow', 'Snowflake', 'Oracle', 'BigQuery', 'Git SQL'] },
      { group: 'Parse', items: ['SQLGlot', 'sqlparse', 'Python adapters'] },
      { group: 'Graph', items: ['Neo4j', 'Column-level edges'] },
    ],
    outputs: [
      { label: 'Lineage graph', format: 'Neo4j edges', description: 'Impact analysis and column-level trace.' },
      { label: 'Governed view', format: 'Access-checked', description: 'Edges only after permission verify.' },
    ],
    results: [
      { label: 'Sources', value: '5+', detail: 'Heterogeneous connectors' },
      { label: 'Granularity', value: 'Column', detail: 'Not table-only' },
      { label: 'Use case', value: 'Impact', detail: 'Break-if-changed queries' },
    ],
  },
}
