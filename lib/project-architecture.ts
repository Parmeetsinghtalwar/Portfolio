export type ArchGroup =
  | 'client'
  | 'edge'
  | 'app'
  | 'ai'
  | 'worker'
  | 'data'
  | 'channel'
  | 'external'
  | 'obs'

export type ArchNodeData = {
  label: string
  subLabel?: string
  group: ArchGroup
  description: string
  usage: string
  tech?: string[]
}

export type ArchNode = {
  id: string
  position: { x: number; y: number }
  data: ArchNodeData
}

export type ArchEdge = {
  id: string
  source: string
  target: string
  label?: string
  animated?: boolean
  dashed?: boolean
}

export type ProjectArchitectureGraph = {
  nodes: ArchNode[]
  edges: ArchEdge[]
}

/** Helper: place a list of tiers (rows) into x/y coordinates. */
function tiers(
  rows: string[][],
  opts: { xGap?: number; yGap?: number; centerX?: number } = {},
): Record<string, { x: number; y: number }> {
  const { xGap = 200, yGap = 150, centerX = 480 } = opts
  const positions: Record<string, { x: number; y: number }> = {}
  rows.forEach((row, y) => {
    const totalWidth = (row.length - 1) * xGap
    const startX = centerX - totalWidth / 2
    row.forEach((id, x) => {
      positions[id] = { x: startX + x * xGap, y: y * yGap }
    })
  })
  return positions
}

const SOCIALHUB_POS = tiers([
  ['dashboard'],
  ['edge'],
  ['gen', 'assets', 'schedule', 'analytics'],
  ['llm', 'image', 'rag', 'approval', 'workers'],
  ['postgres', 'redis', 's3', 'pgvector'],
  ['fb', 'ig', 'x', 'li', 'reddit'],
])

const SOCIALHUB_GRAPH: ProjectArchitectureGraph = {
  nodes: [
    {
      id: 'dashboard',
      position: SOCIALHUB_POS.dashboard,
      data: {
        label: 'Studio dashboard',
        subLabel: 'Next.js',
        group: 'client',
        description: 'The marketer-facing UI.',
        usage:
          'Marketers and brand managers open the Studio, draft campaigns, preview AI output, schedule across platforms, and review analytics. Talks to the edge tier over HTTPS with JWT sessions.',
        tech: ['Next.js 15', 'TypeScript', 'Tailwind', 'Framer Motion'],
      },
    },
    {
      id: 'edge',
      position: SOCIALHUB_POS.edge,
      data: {
        label: 'Edge / Auth',
        subLabel: 'SSR · OAuth · rate limit',
        group: 'edge',
        description: 'Server-rendered edge with auth and OAuth callbacks.',
        usage:
          'Issues JWT sessions, handles OAuth callbacks for every social network, enforces per-route rate limits, and serves the dashboard. Fans out to the FastAPI service mesh.',
        tech: ['Next.js SSR', 'JWT', 'OAuth 2.0', 'CDN'],
      },
    },
    {
      id: 'gen',
      position: SOCIALHUB_POS.gen,
      data: {
        label: 'Content gen',
        subLabel: 'FastAPI',
        group: 'app',
        description: 'Generates copy + media for a campaign brief.',
        usage:
          'Takes a brief and brand context, calls the LLM router for copy, the image generator for visuals, and pulls RAG context from pgvector. Persists drafts to PostgreSQL and emits them to approvals.',
        tech: ['FastAPI', 'Python', 'Pydantic'],
      },
    },
    {
      id: 'assets',
      position: SOCIALHUB_POS.assets,
      data: {
        label: 'Asset library',
        subLabel: 'FastAPI',
        group: 'app',
        description: 'Central media inventory.',
        usage:
          'Tracks every uploaded and generated asset (12M+). Stores binary content in S3, metadata in PostgreSQL, and serves search + tag queries to the dashboard.',
        tech: ['FastAPI', 'S3', 'PostgreSQL'],
      },
    },
    {
      id: 'schedule',
      position: SOCIALHUB_POS.schedule,
      data: {
        label: 'Scheduler',
        subLabel: 'FastAPI',
        group: 'app',
        description: 'Plans posts across platforms.',
        usage:
          'Builds a calendar per workspace, resolves time-zones, respects per-platform rate limits, and enqueues publish jobs onto the Celery worker pool.',
        tech: ['FastAPI', 'Celery', 'Redis'],
      },
    },
    {
      id: 'analytics',
      position: SOCIALHUB_POS.analytics,
      data: {
        label: 'Analytics',
        subLabel: 'FastAPI',
        group: 'app',
        description: 'Engagement + asset usage.',
        usage:
          'Pulls reach, engagement, and conversion metrics from each connected channel and aggregates them into dashboards. Reads from PostgreSQL + cached per-platform fetches in Redis.',
        tech: ['FastAPI', 'PostgreSQL', 'Redis'],
      },
    },
    {
      id: 'llm',
      position: SOCIALHUB_POS.llm,
      data: {
        label: 'LLM router',
        subLabel: 'GPT-4o · Claude',
        group: 'ai',
        description: 'Routes copy generation across models.',
        usage:
          'Wraps OpenAI and Anthropic clients, applies brand voice from RAG context, and falls back across providers on failure. Every call is traced into Langfuse for cost and quality tracking.',
        tech: ['GPT-4o', 'Claude', 'OpenRouter', 'Langfuse'],
      },
    },
    {
      id: 'image',
      position: SOCIALHUB_POS.image,
      data: {
        label: 'Image gen',
        subLabel: 'DALL·E · Fal.ai',
        group: 'ai',
        description: 'Produces visuals per draft.',
        usage:
          'Generates images on demand from text prompts using DALL·E 3 and Fal Flux. Streams progress back to the Studio and stores final assets in S3 via the asset service.',
        tech: ['DALL·E 3', 'Fal.ai'],
      },
    },
    {
      id: 'rag',
      position: SOCIALHUB_POS.rag,
      data: {
        label: 'RAG retrieval',
        subLabel: 'Brand context',
        group: 'ai',
        description: 'Brand-voice context retrieval.',
        usage:
          'Embeds brand docs into pgvector, retrieves the top-k chunks for every generation, and injects them into prompts so output stays on brand and compliance-aware.',
        tech: ['pgvector', 'OpenAI embeddings'],
      },
    },
    {
      id: 'approval',
      position: SOCIALHUB_POS.approval,
      data: {
        label: 'Approval bot',
        subLabel: 'Telegram',
        group: 'worker',
        description: 'Human-in-the-loop approval.',
        usage:
          'Posts drafts into a Telegram channel for review. Captures approve/reject actions through bot commands, and resumes the publish workflow only on approval.',
        tech: ['python-telegram-bot', 'Redis'],
      },
    },
    {
      id: 'workers',
      position: SOCIALHUB_POS.workers,
      data: {
        label: 'Worker pool',
        subLabel: 'Celery · Redis queue',
        group: 'worker',
        description: 'Async publish + retry.',
        usage:
          'Pulls publish jobs off Redis, refreshes OAuth tokens when needed, calls the right channel publisher, and retries with exponential backoff on failure.',
        tech: ['Celery', 'Redis', 'OAuth'],
      },
    },
    {
      id: 'postgres',
      position: SOCIALHUB_POS.postgres,
      data: {
        label: 'PostgreSQL',
        subLabel: 'Primary DB',
        group: 'data',
        description: 'Source of truth for users, content, schedules.',
        usage:
          'Stores workspaces, users, drafts, scheduled posts, asset metadata, and analytics aggregates. Read by every application service.',
        tech: ['PostgreSQL'],
      },
    },
    {
      id: 'redis',
      position: SOCIALHUB_POS.redis,
      data: {
        label: 'Redis',
        subLabel: 'Cache + queue',
        group: 'data',
        description: 'Hot data + Celery broker.',
        usage:
          'Backs Celery as broker + result store, caches platform fetches for analytics, and holds short-lived approval state.',
        tech: ['Redis'],
      },
    },
    {
      id: 's3',
      position: SOCIALHUB_POS.s3,
      data: {
        label: 'S3 / Object store',
        subLabel: '12M+ assets',
        group: 'data',
        description: 'Asset binary storage.',
        usage:
          'Holds every uploaded and generated image, video, and document. The asset library writes here; the publisher reads here.',
        tech: ['S3-compatible'],
      },
    },
    {
      id: 'pgvector',
      position: SOCIALHUB_POS.pgvector,
      data: {
        label: 'pgvector',
        subLabel: 'Vector index',
        group: 'data',
        description: 'Brand-doc embeddings.',
        usage:
          'PostgreSQL extension for similarity search over brand documents, used by the RAG retrieval service to fetch brand-relevant context per generation.',
        tech: ['pgvector', 'PostgreSQL'],
      },
    },
    {
      id: 'fb',
      position: SOCIALHUB_POS.fb,
      data: {
        label: 'Facebook',
        subLabel: 'Graph API',
        group: 'channel',
        description: 'Page + reel publish.',
        usage:
          'Worker pool calls the Graph API with stored OAuth tokens to publish image + caption. No password storage anywhere.',
        tech: ['Graph API', 'OAuth 2.0'],
      },
    },
    {
      id: 'ig',
      position: SOCIALHUB_POS.ig,
      data: {
        label: 'Instagram',
        subLabel: 'Graph API',
        group: 'channel',
        description: 'Feed + reel publish.',
        usage:
          'Worker publishes containers (image / video / carousel) through Instagram Graph API on connected accounts.',
        tech: ['Instagram Graph API'],
      },
    },
    {
      id: 'x',
      position: SOCIALHUB_POS.x,
      data: {
        label: 'X (Twitter)',
        subLabel: 'v2 API',
        group: 'channel',
        description: 'Tweets + threads.',
        usage:
          'Posts tweets and media via X v2 API; threads supported with retry-safe sequencing in the worker.',
        tech: ['X v2 API'],
      },
    },
    {
      id: 'li',
      position: SOCIALHUB_POS.li,
      data: {
        label: 'LinkedIn',
        subLabel: 'Marketing API',
        group: 'channel',
        description: 'Company page posts.',
        usage:
          'Publishes long-form and image posts to connected LinkedIn pages through the Marketing API with OAuth-scoped access.',
        tech: ['LinkedIn Marketing API'],
      },
    },
    {
      id: 'reddit',
      position: SOCIALHUB_POS.reddit,
      data: {
        label: 'Reddit',
        subLabel: 'OAuth API',
        group: 'channel',
        description: 'Subreddit posts.',
        usage:
          'Posts approved content to selected subreddits with subreddit-rules awareness handled at the scheduler layer.',
        tech: ['Reddit OAuth API'],
      },
    },
  ],
  edges: [
    { id: 'e1', source: 'dashboard', target: 'edge' },
    { id: 'e2', source: 'edge', target: 'gen' },
    { id: 'e3', source: 'edge', target: 'assets' },
    { id: 'e4', source: 'edge', target: 'schedule' },
    { id: 'e5', source: 'edge', target: 'analytics' },
    { id: 'e6', source: 'gen', target: 'llm' },
    { id: 'e7', source: 'gen', target: 'image' },
    { id: 'e8', source: 'gen', target: 'rag' },
    { id: 'e9', source: 'gen', target: 'approval' },
    { id: 'e10', source: 'schedule', target: 'workers' },
    { id: 'e11', source: 'rag', target: 'pgvector' },
    { id: 'e12', source: 'image', target: 's3' },
    { id: 'e13', source: 'assets', target: 's3' },
    { id: 'e14', source: 'assets', target: 'postgres' },
    { id: 'e15', source: 'gen', target: 'postgres' },
    { id: 'e16', source: 'analytics', target: 'postgres' },
    { id: 'e17', source: 'workers', target: 'redis' },
    { id: 'e18', source: 'approval', target: 'redis' },
    { id: 'e19', source: 'workers', target: 'fb', animated: true },
    { id: 'e20', source: 'workers', target: 'ig', animated: true },
    { id: 'e21', source: 'workers', target: 'x', animated: true },
    { id: 'e22', source: 'workers', target: 'li', animated: true },
    { id: 'e23', source: 'workers', target: 'reddit', animated: true },
  ],
}

const PRISM_POS = tiers([
  ['gmail', 'careers'],
  ['ingest'],
  ['parser', 'extractor', 'scorer', 'pipeline', 'scheduler'],
  ['gpt4', 'postgres', 'redis', 'object'],
  ['dashboard', 'gcal'],
])

const PRISM_GRAPH: ProjectArchitectureGraph = {
  nodes: [
    {
      id: 'gmail',
      position: PRISM_POS.gmail,
      data: {
        label: 'Gmail inbox',
        subLabel: 'Gmail API push',
        group: 'external',
        description: 'Inbound applications.',
        usage:
          'A dedicated job inbox receives applications. Gmail API push notifications trigger the ingest worker; attachments are pulled and deduplicated by message-id.',
        tech: ['Gmail API', 'Pub/Sub push'],
      },
    },
    {
      id: 'careers',
      position: PRISM_POS.careers,
      data: {
        label: 'Careers form',
        subLabel: 'Webhook',
        group: 'external',
        description: 'Direct application form.',
        usage:
          'Public careers page posts structured applications and résumés to the ingest service. Same downstream pipeline as Gmail-sourced applications.',
        tech: ['Webhook', 'HTTPS'],
      },
    },
    {
      id: 'ingest',
      position: PRISM_POS.ingest,
      data: {
        label: 'Ingest service',
        subLabel: 'FastAPI worker',
        group: 'app',
        description: 'Normalizes inbound applications.',
        usage:
          'Fetches attachments, deduplicates by message-id, stores raw artifacts to object storage, and emits a parse job onto Celery.',
        tech: ['FastAPI', 'Celery'],
      },
    },
    {
      id: 'parser',
      position: PRISM_POS.parser,
      data: {
        label: 'Document parser',
        subLabel: 'PDF · DOCX',
        group: 'app',
        description: 'Turns documents into clean text.',
        usage:
          'Extracts text from PDF and DOCX résumés. Hands the cleaned text to the extraction stage; the raw file lives in object storage for audit.',
        tech: ['pdfminer', 'python-docx'],
      },
    },
    {
      id: 'extractor',
      position: PRISM_POS.extractor,
      data: {
        label: 'GPT-4 extractor',
        subLabel: 'JSON schema',
        group: 'ai',
        description: 'Structured candidate fields.',
        usage:
          'Calls GPT-4 with a strict JSON schema (name, skills, seniority, recent roles, education). On schema failure it retries with a corrective system prompt before flagging the candidate for manual review.',
        tech: ['OpenAI GPT-4', 'Pydantic', 'JSON Schema'],
      },
    },
    {
      id: 'scorer',
      position: PRISM_POS.scorer,
      data: {
        label: 'Scoring engine',
        subLabel: 'Weighted rules',
        group: 'app',
        description: 'Ranks candidates per role.',
        usage:
          'Applies per-role weights (skills, experience, seniority, location, culture proxies). Outputs a 0–100 score with explainability factors stored alongside the candidate row.',
        tech: ['Python', 'PostgreSQL'],
      },
    },
    {
      id: 'pipeline',
      position: PRISM_POS.pipeline,
      data: {
        label: 'Pipeline FSM',
        subLabel: 'State machine',
        group: 'app',
        description: 'Candidate state transitions.',
        usage:
          'Drives candidates through states: New → Reviewed → Shortlisted → Interview → Hired / Rejected. Triggers next-action services (e.g. invite scheduling).',
        tech: ['FastAPI', 'PostgreSQL'],
      },
    },
    {
      id: 'scheduler',
      position: PRISM_POS.scheduler,
      data: {
        label: 'Interview scheduler',
        subLabel: 'Calendar service',
        group: 'app',
        description: 'Books interview slots.',
        usage:
          'When a candidate hits the Interview state, finds open slots from recruiter calendars and creates a Google Calendar event with a candidate invite email.',
        tech: ['Google Calendar API'],
      },
    },
    {
      id: 'gpt4',
      position: PRISM_POS.gpt4,
      data: {
        label: 'OpenAI GPT-4',
        subLabel: 'Provider',
        group: 'ai',
        description: 'Foundation model.',
        usage:
          'Provides the JSON-schema constrained extraction. Used only by the extractor service; usage logged per candidate.',
        tech: ['OpenAI'],
      },
    },
    {
      id: 'postgres',
      position: PRISM_POS.postgres,
      data: {
        label: 'PostgreSQL',
        subLabel: 'Primary DB',
        group: 'data',
        description: 'Candidates · roles · scores.',
        usage:
          'Stores roles, candidates, structured fields, scores, audit trails, and the pipeline state. Powers the recruiter dashboard.',
        tech: ['PostgreSQL'],
      },
    },
    {
      id: 'redis',
      position: PRISM_POS.redis,
      data: {
        label: 'Redis',
        subLabel: 'Celery broker',
        group: 'data',
        description: 'Queue + cache.',
        usage:
          'Broker and result store for Celery workers; caches model output for retry and idempotency.',
        tech: ['Redis'],
      },
    },
    {
      id: 'object',
      position: PRISM_POS.object,
      data: {
        label: 'Object store',
        subLabel: 'Raw résumés',
        group: 'data',
        description: 'Raw application artifacts.',
        usage:
          'Holds the original PDF / DOCX / EML files for every application — pulled on demand by the dashboard for human review and by audit.',
        tech: ['S3-compatible'],
      },
    },
    {
      id: 'dashboard',
      position: PRISM_POS.dashboard,
      data: {
        label: 'Recruiter dashboard',
        subLabel: 'Next.js',
        group: 'client',
        description: 'Recruiter UI.',
        usage:
          'Inbox view, ranked candidates with score breakdown, document preview, manual override, and one-click interview booking.',
        tech: ['Next.js', 'TypeScript'],
      },
    },
    {
      id: 'gcal',
      position: PRISM_POS.gcal,
      data: {
        label: 'Google Calendar',
        subLabel: 'Invites',
        group: 'external',
        description: 'Interview booking.',
        usage:
          'Scheduler service creates events here for both recruiter and candidate; failures are surfaced back to the dashboard with retry options.',
        tech: ['Google Calendar API', 'OAuth'],
      },
    },
  ],
  edges: [
    { id: 'p1', source: 'gmail', target: 'ingest', animated: true },
    { id: 'p2', source: 'careers', target: 'ingest', animated: true },
    { id: 'p3', source: 'ingest', target: 'parser' },
    { id: 'p4', source: 'parser', target: 'extractor' },
    { id: 'p5', source: 'extractor', target: 'scorer' },
    { id: 'p6', source: 'scorer', target: 'pipeline' },
    { id: 'p7', source: 'pipeline', target: 'scheduler' },
    { id: 'p8', source: 'extractor', target: 'gpt4' },
    { id: 'p9', source: 'parser', target: 'object' },
    { id: 'p10', source: 'scorer', target: 'postgres' },
    { id: 'p11', source: 'pipeline', target: 'postgres' },
    { id: 'p12', source: 'ingest', target: 'redis' },
    { id: 'p13', source: 'scheduler', target: 'gcal', animated: true },
    { id: 'p14', source: 'pipeline', target: 'dashboard' },
  ],
}

const DBAAS_POS = tiers(
  [
    ['spa'],
    ['apex'],
    ['api'],
    ['ai', 'calendar', 'agents', 'ugc', 'oauth'],
    ['scheduler'],
    ['postgres', 'cloudinary'],
    ['openai', 'fal'],
    ['telegram'],
    ['fb', 'ig', 'x', 'li', 'reddit'],
  ],
  { centerX: 520, yGap: 140 },
)

const DBAAS_GRAPH: ProjectArchitectureGraph = {
  nodes: [
    {
      id: 'spa',
      position: DBAAS_POS.spa,
      data: {
        label: 'Content Phase SPA',
        subLabel: 'React 19 + Vite 7',
        group: 'client',
        description: 'Marketer dashboard and generators.',
        usage:
          'Landing (Three.js), post generator, Content Calendar, UGC editor, Agents, OAuth connections, scheduler, and payments. Calls FastAPI over HTTPS with Apex JWT sessions.',
        tech: ['React 19', 'Vite 7', 'Tailwind 4', 'Framer Motion', 'Three.js'],
      },
    },
    {
      id: 'apex',
      position: DBAAS_POS.apex,
      data: {
        label: 'Apex SaaS auth',
        subLabel: 'apex.bootstrap',
        group: 'edge',
        description: 'Users, tenants, JWT.',
        usage:
          'Bootstraps auth tables and session/JWT validation before route handlers run. Same framework layer used across ApexNeural products.',
        tech: ['Apex SaaS', 'JWT'],
      },
    },
    {
      id: 'api',
      position: DBAAS_POS.api,
      data: {
        label: 'FastAPI core',
        subLabel: 'Monolithic API',
        group: 'app',
        description: 'Routes + service wiring.',
        usage:
          'Mounts health, posts, scheduled, ai_content, enhance, credentials, ugc, content_calendar, agents, social_posting, scheduler. slowapi rate limits on heavy AI endpoints.',
        tech: ['FastAPI', 'SQLAlchemy', 'Alembic'],
      },
    },
    {
      id: 'ai',
      position: DBAAS_POS.ai,
      data: {
        label: 'AI content',
        subLabel: 'GPT-4o · images',
        group: 'ai',
        description: 'Copy + image generation.',
        usage:
          'Platform-specific captions, prompt enhancer (text vs diffusion), DALL·E 3 and Fal Nano Banana paths, caption injected into image prompts for alignment.',
        tech: ['OpenAI GPT-4o', 'DALL·E 3', 'Fal.ai'],
      },
    },
    {
      id: 'calendar',
      position: DBAAS_POS.calendar,
      data: {
        label: 'Content calendar',
        subLabel: 'Monthly planner',
        group: 'app',
        description: 'Plan + bulk generate.',
        usage:
          'Builds monthly post plans from business profile, drives bulk asset generation, and writes scheduled slots the worker will publish.',
        tech: ['FastAPI', 'Plan service'],
      },
    },
    {
      id: 'agents',
      position: DBAAS_POS.agents,
      data: {
        label: 'Persona agents',
        subLabel: 'Flux · IP-Adapter',
        group: 'ai',
        description: 'Character-consistent visuals.',
        usage:
          'agent_service maintains persona references and generates on-brand imagery via Fal Flux Pro/Dev with IP-Adapter conditioning.',
        tech: ['Fal.ai Flux', 'IP-Adapter'],
      },
    },
    {
      id: 'ugc',
      position: DBAAS_POS.ugc,
      data: {
        label: 'UGC editor',
        subLabel: 'Gemini edits',
        group: 'app',
        description: 'Magic editor for creatives.',
        usage:
          'ugc_service applies Gemini Flash image edits to user uploads; results stored via Cloudinary URLs for scheduling.',
        tech: ['Gemini', 'Cloudinary'],
      },
    },
    {
      id: 'oauth',
      position: DBAAS_POS.oauth,
      data: {
        label: 'OAuth credentials',
        subLabel: 'Fernet encrypted',
        group: 'app',
        description: 'Per-platform tokens.',
        usage:
          'Stores OAuth tokens per platform profile (Facebook, Instagram, X, LinkedIn, Reddit). Never stores passwords; tokens decrypted only at publish time.',
        tech: ['OAuth 2.0', 'Fernet'],
      },
    },
    {
      id: 'scheduler',
      position: DBAAS_POS.scheduler,
      data: {
        label: 'Scheduler worker',
        subLabel: 'APScheduler · 60s',
        group: 'worker',
        description: 'Due-post publisher.',
        usage:
          'scheduler_worker polls scheduled_posts, invokes platform publishers, records per-platform success/failure. Started alongside FastAPI lifespan.',
        tech: ['APScheduler', 'asyncio'],
      },
    },
    {
      id: 'postgres',
      position: DBAAS_POS.postgres,
      data: {
        label: 'PostgreSQL 15',
        subLabel: 'Primary DB',
        group: 'data',
        description: 'Posts · plans · creds.',
        usage:
          'Docker Compose Postgres: users, posts, calendar plans, agents, scheduled_posts, encrypted credentials. Alembic migrations in-repo.',
        tech: ['PostgreSQL 15'],
      },
    },
    {
      id: 'cloudinary',
      position: DBAAS_POS.cloudinary,
      data: {
        label: 'Cloudinary',
        subLabel: 'Media CDN',
        group: 'data',
        description: 'Generated + uploaded assets.',
        usage:
          'Hosts AI-generated and user-uploaded images served to social APIs and the SPA preview grid.',
        tech: ['Cloudinary'],
      },
    },
    {
      id: 'openai',
      position: DBAAS_POS.openai,
      data: {
        label: 'OpenAI',
        subLabel: 'GPT-4o · DALL·E',
        group: 'external',
        description: 'LLM + image API.',
        usage:
          'Copy, enhancement, vision on PDF pages for document intelligence, and DALL·E 3 when highest image quality is selected.',
        tech: ['OpenAI API'],
      },
    },
    {
      id: 'fal',
      position: DBAAS_POS.fal,
      data: {
        label: 'Fal.ai',
        subLabel: 'Nano Banana · Flux',
        group: 'external',
        description: 'Fast diffusion provider.',
        usage:
          'Default fast image path and Flux-based persona generation for agents module.',
        tech: ['Fal.ai'],
      },
    },
    {
      id: 'telegram',
      position: DBAAS_POS.telegram,
      data: {
        label: 'Telegram bot',
        subLabel: 'Mobile parity',
        group: 'channel',
        description: 'Approvals + commands.',
        usage:
          'telegram_bot_service calls the same FastAPI services as the web UI — generate, schedule, and approve without opening the browser.',
        tech: ['python-telegram-bot'],
      },
    },
    {
      id: 'fb',
      position: DBAAS_POS.fb,
      data: {
        label: 'Facebook',
        subLabel: 'Graph API',
        group: 'channel',
        description: 'Page publish.',
        usage: 'facebook_service posts image + caption to connected pages.',
        tech: ['Graph API'],
      },
    },
    {
      id: 'ig',
      position: DBAAS_POS.ig,
      data: {
        label: 'Instagram',
        subLabel: 'Graph API',
        group: 'channel',
        description: 'Feed publish.',
        usage: 'instagram_service publishes media containers from Cloudinary URLs.',
        tech: ['Graph API'],
      },
    },
    {
      id: 'x',
      position: DBAAS_POS.x,
      data: {
        label: 'X (Twitter)',
        subLabel: 'v1.1 + v2 media',
        group: 'channel',
        description: 'Tweet + media upload.',
        usage:
          'twitter_service hybrid upload: v1.1 media upload then v2 tweet create.',
        tech: ['Twitter API'],
      },
    },
    {
      id: 'li',
      position: DBAAS_POS.li,
      data: {
        label: 'LinkedIn',
        subLabel: 'Non-PKCE OAuth',
        group: 'channel',
        description: 'Company posts.',
        usage: 'linkedin_service publishes UGC posts to organization pages.',
        tech: ['LinkedIn API'],
      },
    },
    {
      id: 'reddit',
      position: DBAAS_POS.reddit,
      data: {
        label: 'Reddit',
        subLabel: 'OAuth submit',
        group: 'channel',
        description: 'Subreddit posts.',
        usage: 'reddit_service submits link/image posts to authorized subreddits.',
        tech: ['Reddit API'],
      },
    },
  ],
  edges: [
    { id: 'd1', source: 'spa', target: 'apex' },
    { id: 'd2', source: 'apex', target: 'api' },
    { id: 'd3', source: 'api', target: 'ai' },
    { id: 'd4', source: 'api', target: 'calendar' },
    { id: 'd5', source: 'api', target: 'agents' },
    { id: 'd6', source: 'api', target: 'ugc' },
    { id: 'd7', source: 'api', target: 'oauth' },
    { id: 'd8', source: 'ai', target: 'openai' },
    { id: 'd9', source: 'ai', target: 'fal' },
    { id: 'd10', source: 'agents', target: 'fal' },
    { id: 'd11', source: 'calendar', target: 'postgres' },
    { id: 'd12', source: 'ai', target: 'cloudinary' },
    { id: 'd13', source: 'ugc', target: 'cloudinary' },
    { id: 'd14', source: 'api', target: 'postgres' },
    { id: 'd15', source: 'scheduler', target: 'api' },
    { id: 'd16', source: 'scheduler', target: 'oauth' },
    { id: 'd17', source: 'scheduler', target: 'fb', animated: true },
    { id: 'd18', source: 'scheduler', target: 'ig', animated: true },
    { id: 'd19', source: 'scheduler', target: 'x', animated: true },
    { id: 'd20', source: 'scheduler', target: 'li', animated: true },
    { id: 'd21', source: 'scheduler', target: 'reddit', animated: true },
    { id: 'd22', source: 'telegram', target: 'api', dashed: true },
    { id: 'd23', source: 'oauth', target: 'fb' },
    { id: 'd24', source: 'oauth', target: 'ig' },
    { id: 'd25', source: 'oauth', target: 'x' },
    { id: 'd26', source: 'oauth', target: 'li' },
    { id: 'd27', source: 'oauth', target: 'reddit' },
  ],
}

const UNIFY_POS = tiers([
  ['wa', 'tg', 'ig', 'web'],
  ['platform'],
  ['queue', 'agent'],
  ['guard', 'translate', 'catalog', 'tools'],
  ['postgres', 'redis', 'pgvector'],
  ['inbox', 'commerce'],
])

const UNIFY_GRAPH: ProjectArchitectureGraph = {
  nodes: [
    {
      id: 'wa',
      position: UNIFY_POS.wa,
      data: {
        label: 'WhatsApp',
        subLabel: 'Business webhook',
        group: 'external',
        description: 'Channel ingress.',
        usage:
          'Customer messages hit a per-tenant WhatsApp Business webhook. The platform resolves tenant from the bot credential and normalizes the message into a conversation thread.',
        tech: ['WhatsApp Business'],
      },
    },
    {
      id: 'tg',
      position: UNIFY_POS.tg,
      data: {
        label: 'Telegram',
        subLabel: 'Bot webhook',
        group: 'external',
        description: 'Channel ingress.',
        usage:
          'Telegram bot webhooks deliver inbound messages; per-tenant tokens isolate which workspace owns the conversation.',
        tech: ['Telegram Bot API'],
      },
    },
    {
      id: 'ig',
      position: UNIFY_POS.ig,
      data: {
        label: 'Instagram',
        subLabel: 'Messaging API',
        group: 'external',
        description: 'DM ingress.',
        usage:
          'Instagram messaging webhooks route DMs into the platform with the same conversation normalization pipeline.',
        tech: ['Instagram Messaging API'],
      },
    },
    {
      id: 'web',
      position: UNIFY_POS.web,
      data: {
        label: 'Web chat',
        subLabel: 'Embeddable widget',
        group: 'external',
        description: 'On-site chat widget.',
        usage:
          'Lightweight embeddable widget; messages stream into the platform via WebSocket and join the same per-tenant conversation model.',
        tech: ['WebSocket', 'JS widget'],
      },
    },
    {
      id: 'platform',
      position: UNIFY_POS.platform,
      data: {
        label: 'NestJS platform',
        subLabel: 'kalamandir-l1',
        group: 'app',
        description: 'Conversations · RBAC · tickets.',
        usage:
          'NestJS monorepo: JWT auth, tenant middleware, conversation state machine, ticketing, RBAC (29 permissions), audit log, and the router that calls the L1 agent.',
        tech: ['NestJS 11', 'TypeORM', 'JWT', 'TypeScript'],
      },
    },
    {
      id: 'queue',
      position: UNIFY_POS.queue,
      data: {
        label: 'BullMQ workers',
        subLabel: 'Outbound delivery',
        group: 'worker',
        description: 'Reliable channel sends.',
        usage:
          'BullMQ workers handle outbound delivery: per-channel rate limits, retry with backoff, and idempotent handoffs between AI and human modes.',
        tech: ['BullMQ', 'Redis'],
      },
    },
    {
      id: 'agent',
      position: UNIFY_POS.agent,
      data: {
        label: 'L1 agent',
        subLabel: 'FastAPI · kalamandir-agent',
        group: 'app',
        description: '7-step reply pipeline.',
        usage:
          'POST /api/v1/message: runs content guard → translation → context load → understanding → orchestrator → tool calls → channel-aware formatting.',
        tech: ['FastAPI', 'Python', 'Pydantic'],
      },
    },
    {
      id: 'guard',
      position: UNIFY_POS.guard,
      data: {
        label: 'Content guard',
        subLabel: 'Pre-check',
        group: 'ai',
        description: 'Safety + tenant rules.',
        usage:
          'Filters disallowed content and applies tenant-level policies before any LLM call.',
        tech: ['Rules', 'LLM moderation'],
      },
    },
    {
      id: 'translate',
      position: UNIFY_POS.translate,
      data: {
        label: 'Translate / NLU',
        subLabel: 'EN · HI · TE · HG',
        group: 'ai',
        description: 'Multilingual understanding.',
        usage:
          'Detects language, translates to a canonical working language for the orchestrator, and translates the reply back into the customer\'s channel-native form.',
        tech: ['LLM', 'Language detection'],
      },
    },
    {
      id: 'catalog',
      position: UNIFY_POS.catalog,
      data: {
        label: 'Catalog search',
        subLabel: 'pgvector',
        group: 'ai',
        description: 'Product retrieval.',
        usage:
          'Vector search over per-tenant catalog embeddings for product discovery; supports image-based search for visual product match.',
        tech: ['pgvector', 'Embeddings'],
      },
    },
    {
      id: 'tools',
      position: UNIFY_POS.tools,
      data: {
        label: 'Tool calls',
        subLabel: 'Orders · payments',
        group: 'app',
        description: 'Per-tenant integrations.',
        usage:
          'Orchestrator invokes per-tenant tools — order status, payment links, Magento APIs — with the tenant-scoped credentials stored in the platform.',
        tech: ['Magento', 'Razorpay', 'HTTP tools'],
      },
    },
    {
      id: 'postgres',
      position: UNIFY_POS.postgres,
      data: {
        label: 'PostgreSQL',
        subLabel: 'RLS per tenant',
        group: 'data',
        description: 'Conversations · users · tickets.',
        usage:
          'Row-level security keyed on app.tenant_id pinned via transaction-local GUC. Stores every conversation, message, ticket, and audit row, isolated per workspace.',
        tech: ['PostgreSQL 16', 'RLS'],
      },
    },
    {
      id: 'redis',
      position: UNIFY_POS.redis,
      data: {
        label: 'Redis',
        subLabel: 'BullMQ + cache',
        group: 'data',
        description: 'Queue + cache.',
        usage:
          'Backs BullMQ, caches tenant resolution for hot webhook bursts, and holds agent session state with composite tenant keys.',
        tech: ['Redis'],
      },
    },
    {
      id: 'pgvector',
      position: UNIFY_POS.pgvector,
      data: {
        label: 'pgvector',
        subLabel: 'Catalog vectors',
        group: 'data',
        description: 'Per-tenant catalog embeddings.',
        usage:
          'Tenant-scoped catalog vectors used by the catalog search tool. Visual-search embeddings live here too.',
        tech: ['pgvector'],
      },
    },
    {
      id: 'inbox',
      position: UNIFY_POS.inbox,
      data: {
        label: 'Agent inbox',
        subLabel: 'Unified UI',
        group: 'client',
        description: 'Human takeover.',
        usage:
          'Operators see AI conversations live, take over with one click, reply from a unified inbox, and resume AI when done. WebSocket-backed for live updates.',
        tech: ['React', 'WebSocket'],
      },
    },
    {
      id: 'commerce',
      position: UNIFY_POS.commerce,
      data: {
        label: 'Commerce systems',
        subLabel: 'Magento · payments',
        group: 'external',
        description: 'Per-tenant systems.',
        usage:
          'Tool calls reach into each tenant\'s commerce backend — Magento, payment provider, custom APIs — using credentials stored per tenant.',
        tech: ['Magento', 'Razorpay', 'Custom APIs'],
      },
    },
  ],
  edges: [
    { id: 'u1', source: 'wa', target: 'platform', animated: true },
    { id: 'u2', source: 'tg', target: 'platform', animated: true },
    { id: 'u3', source: 'ig', target: 'platform', animated: true },
    { id: 'u4', source: 'web', target: 'platform', animated: true },
    { id: 'u5', source: 'platform', target: 'queue' },
    { id: 'u6', source: 'platform', target: 'agent' },
    { id: 'u7', source: 'agent', target: 'guard' },
    { id: 'u8', source: 'agent', target: 'translate' },
    { id: 'u9', source: 'agent', target: 'catalog' },
    { id: 'u10', source: 'agent', target: 'tools' },
    { id: 'u11', source: 'platform', target: 'postgres' },
    { id: 'u12', source: 'queue', target: 'redis' },
    { id: 'u13', source: 'catalog', target: 'pgvector' },
    { id: 'u14', source: 'platform', target: 'inbox' },
    { id: 'u15', source: 'tools', target: 'commerce', animated: true },
    { id: 'u16', source: 'queue', target: 'wa', animated: true },
    { id: 'u17', source: 'queue', target: 'tg', animated: true },
    { id: 'u18', source: 'queue', target: 'ig', animated: true },
    { id: 'u19', source: 'queue', target: 'web', animated: true },
  ],
}

const TALEWEAVER_POS = tiers([
  ['ui'],
  ['backend'],
  ['outline', 'llm', 'exporter'],
  ['adapter', 'base'],
  ['training'],
  ['postgres', 'storage'],
])

const TALEWEAVER_GRAPH: ProjectArchitectureGraph = {
  nodes: [
    {
      id: 'ui',
      position: TALEWEAVER_POS.ui,
      data: {
        label: 'Bookgen UI',
        subLabel: 'React + Vite',
        group: 'client',
        description: 'Author-facing app.',
        usage:
          'Authors define a premise, edit the outline, watch chapters stream in, and export the finished manuscript. WebSocket for live tokens; REST for outline + export.',
        tech: ['React', 'Vite', 'TypeScript'],
      },
    },
    {
      id: 'backend',
      position: TALEWEAVER_POS.backend,
      data: {
        label: 'Backend',
        subLabel: 'FastAPI',
        group: 'app',
        description: 'Orchestration + WS fan-out.',
        usage:
          'Holds project state, dispatches outline generation, streams chapter tokens to the UI over WebSocket, and triggers export jobs when chapters are accepted.',
        tech: ['FastAPI', 'WebSocket', 'Pydantic'],
      },
    },
    {
      id: 'outline',
      position: TALEWEAVER_POS.outline,
      data: {
        label: 'Outline generator',
        subLabel: 'LLM call',
        group: 'ai',
        description: 'Plans the story.',
        usage:
          'Takes the premise and creates a chapter-by-chapter outline with motifs, character arcs, and scene beats. Editable in the UI before chapter generation.',
        tech: ['LLM', 'Structured output'],
      },
    },
    {
      id: 'llm',
      position: TALEWEAVER_POS.llm,
      data: {
        label: 'LLM service (GPU)',
        subLabel: 'Qwen2.5-3B + LoRA',
        group: 'ai',
        description: 'Voice-locked chapter gen.',
        usage:
          'Runs Qwen2.5-3B with the Fitzgerald LoRA adapter loaded. Streams tokens for each chapter back to the backend, which fans them out to the UI.',
        tech: ['Qwen2.5-3B', 'PEFT', 'Transformers', 'PyTorch'],
      },
    },
    {
      id: 'exporter',
      position: TALEWEAVER_POS.exporter,
      data: {
        label: 'EPUB / PDF exporter',
        subLabel: 'ebooklib',
        group: 'app',
        description: 'Manuscript export.',
        usage:
          'Bundles approved chapters into clean EPUB and PDF files with metadata, cover, and TOC; writes outputs to object storage for download.',
        tech: ['ebooklib', 'WeasyPrint'],
      },
    },
    {
      id: 'adapter',
      position: TALEWEAVER_POS.adapter,
      data: {
        label: 'Fitzgerald LoRA',
        subLabel: '~479 MB',
        group: 'ai',
        description: 'Author-style adapter.',
        usage:
          'PEFT LoRA weights produced offline; loaded into the LLM service at startup so output stays voice-locked.',
        tech: ['PEFT', 'LoRA'],
      },
    },
    {
      id: 'base',
      position: TALEWEAVER_POS.base,
      data: {
        label: 'Base weights',
        subLabel: 'Qwen2.5-3B',
        group: 'ai',
        description: 'Foundation model cache.',
        usage:
          'Local Transformers cache of the Qwen2.5-3B base; the LoRA adapter attaches on top at load time.',
        tech: ['Transformers', 'safetensors'],
      },
    },
    {
      id: 'training',
      position: TALEWEAVER_POS.training,
      data: {
        label: 'Training pipeline',
        subLabel: 'finetune/ repo',
        group: 'app',
        description: 'Offline LoRA training.',
        usage:
          'ePub → extract → segment → generate instructions → dataset.jsonl (3,762 examples) → PEFT LoRA train. Produces the adapter consumed by the LLM service.',
        tech: ['Python', 'PEFT', 'Datasets'],
      },
    },
    {
      id: 'postgres',
      position: TALEWEAVER_POS.postgres,
      data: {
        label: 'PostgreSQL',
        subLabel: 'Projects · chapters',
        group: 'data',
        description: 'Author state.',
        usage:
          'Stores authors, projects, outlines, and chapter versions; powers the UI listings and export history.',
        tech: ['PostgreSQL'],
      },
    },
    {
      id: 'storage',
      position: TALEWEAVER_POS.storage,
      data: {
        label: 'Object store',
        subLabel: 'Exports',
        group: 'data',
        description: 'EPUB / PDF artifacts.',
        usage:
          'Holds exported manuscripts available for author download; integrates with backend download links.',
        tech: ['S3-compatible'],
      },
    },
  ],
  edges: [
    { id: 't1', source: 'ui', target: 'backend', animated: true },
    { id: 't2', source: 'backend', target: 'outline' },
    { id: 't3', source: 'backend', target: 'llm', animated: true },
    { id: 't4', source: 'backend', target: 'exporter' },
    { id: 't5', source: 'llm', target: 'adapter' },
    { id: 't6', source: 'llm', target: 'base' },
    { id: 't7', source: 'training', target: 'adapter', dashed: true },
    { id: 't8', source: 'backend', target: 'postgres' },
    { id: 't9', source: 'exporter', target: 'storage' },
  ],
}

const FOOTBALL_POS = tiers([
  ['telemetry', 'medical', 'scouting'],
  ['ingest'],
  ['features'],
  ['injury', 'valuation', 'performance', 'team'],
  ['decision'],
  ['dashboard'],
])

const FOOTBALL_GRAPH: ProjectArchitectureGraph = {
  nodes: [
    {
      id: 'telemetry',
      position: FOOTBALL_POS.telemetry,
      data: {
        label: 'GPS / load',
        subLabel: 'Wearables',
        group: 'external',
        description: 'In-session player telemetry.',
        usage:
          'GPS units and load monitors stream minutes, distance, accelerations, and heart-rate proxies per session. Ingested as time-series records keyed on player + session.',
        tech: ['Catapult-style GPS', 'CSV exports'],
      },
    },
    {
      id: 'medical',
      position: FOOTBALL_POS.medical,
      data: {
        label: 'Medical EHR',
        subLabel: 'Injury history',
        group: 'external',
        description: 'Club medical records.',
        usage:
          'Structured medical events — injuries, RTP windows, treatments — pulled from the club EHR with consent. Feeds the injury intelligence model.',
        tech: ['EHR APIs', 'Manual import'],
      },
    },
    {
      id: 'scouting',
      position: FOOTBALL_POS.scouting,
      data: {
        label: 'Scouting + league',
        subLabel: 'Market data',
        group: 'external',
        description: 'Career + contract signals.',
        usage:
          'Scouting datasets, league-level performance feeds, and contract metadata enrich each player profile for valuation projections.',
        tech: ['CSV', 'Vendor APIs'],
      },
    },
    {
      id: 'ingest',
      position: FOOTBALL_POS.ingest,
      data: {
        label: 'Ingest + ETL',
        subLabel: 'FastAPI',
        group: 'app',
        description: 'Normalizes every source.',
        usage:
          'Receives heterogeneous formats, validates schemas, dedupes events, and writes canonical records into the feature store.',
        tech: ['FastAPI', 'Pandas', 'Pydantic'],
      },
    },
    {
      id: 'features',
      position: FOOTBALL_POS.features,
      data: {
        label: 'Feature store',
        subLabel: 'Time-series + profile',
        group: 'data',
        description: 'One source of truth per player.',
        usage:
          'Stores per-player time series (load, performance) plus profile attributes (contract, position, age). Every ML module reads from here so they stay aligned.',
        tech: ['PostgreSQL', 'TimescaleDB'],
      },
    },
    {
      id: 'injury',
      position: FOOTBALL_POS.injury,
      data: {
        label: 'Injury model',
        subLabel: 'Risk score',
        group: 'ai',
        description: 'Multi-signal injury risk.',
        usage:
          'Combines load history, medical events, and performance drift to flag players at elevated injury risk before breakdown.',
        tech: ['XGBoost', 'scikit-learn'],
      },
    },
    {
      id: 'valuation',
      position: FOOTBALL_POS.valuation,
      data: {
        label: 'Valuation model',
        subLabel: '2–5 seasons',
        group: 'ai',
        description: 'Market-value projection.',
        usage:
          'Projects market value across 2–5 seasons from career trajectories, position scarcity, and contract context. Outputs valuation bands with confidence.',
        tech: ['Gradient boosting', 'Time series'],
      },
    },
    {
      id: 'performance',
      position: FOOTBALL_POS.performance,
      data: {
        label: 'Performance',
        subLabel: 'Drift + load',
        group: 'ai',
        description: 'Form and load optimization.',
        usage:
          'Detects early drift in performance, optimizes training load, and aligns training-to-match metrics for coaching staff.',
        tech: ['Anomaly detection', 'Forecasting'],
      },
    },
    {
      id: 'team',
      position: FOOTBALL_POS.team,
      data: {
        label: 'Team model',
        subLabel: 'Squad view',
        group: 'ai',
        description: 'Availability + squad fit.',
        usage:
          'Aggregates injury, valuation, and performance signals into a squad-level availability and rotation plan.',
        tech: ['Linear programming', 'Heuristics'],
      },
    },
    {
      id: 'decision',
      position: FOOTBALL_POS.decision,
      data: {
        label: 'Decision API',
        subLabel: 'FastAPI',
        group: 'app',
        description: 'Single read API for clubs.',
        usage:
          'Exposes risk scores, valuation bands, availability, and alerts as a JSON API consumed by the dashboard and any club-side integration.',
        tech: ['FastAPI', 'OpenAPI'],
      },
    },
    {
      id: 'dashboard',
      position: FOOTBALL_POS.dashboard,
      data: {
        label: 'Club dashboard',
        subLabel: 'Next.js',
        group: 'client',
        description: 'Medical · performance · exec.',
        usage:
          'Role-specific views for medical, performance, coaching, and executive. Same data, framed for the question each role asks.',
        tech: ['Next.js', 'TypeScript', 'Recharts'],
      },
    },
  ],
  edges: [
    { id: 'f1', source: 'telemetry', target: 'ingest', animated: true },
    { id: 'f2', source: 'medical', target: 'ingest', animated: true },
    { id: 'f3', source: 'scouting', target: 'ingest', animated: true },
    { id: 'f4', source: 'ingest', target: 'features' },
    { id: 'f5', source: 'features', target: 'injury' },
    { id: 'f6', source: 'features', target: 'valuation' },
    { id: 'f7', source: 'features', target: 'performance' },
    { id: 'f8', source: 'features', target: 'team' },
    { id: 'f9', source: 'injury', target: 'decision' },
    { id: 'f10', source: 'valuation', target: 'decision' },
    { id: 'f11', source: 'performance', target: 'decision' },
    { id: 'f12', source: 'team', target: 'decision' },
    { id: 'f13', source: 'decision', target: 'dashboard' },
  ],
}

const YOLO_POS = tiers([
  ['video'],
  ['decoder'],
  ['queue'],
  ['detector'],
  ['tracker'],
  ['analytics', 'storage'],
  ['export'],
])

const YOLO_GRAPH: ProjectArchitectureGraph = {
  nodes: [
    {
      id: 'video',
      position: YOLO_POS.video,
      data: {
        label: 'Match video',
        subLabel: 'MP4 / RTSP',
        group: 'external',
        description: 'Source footage.',
        usage:
          'Broadcast feeds, training cam, or pre-recorded MP4. Entry point for the entire vision pipeline.',
        tech: ['MP4', 'RTSP'],
      },
    },
    {
      id: 'decoder',
      position: YOLO_POS.decoder,
      data: {
        label: 'Frame decoder',
        subLabel: 'OpenCV',
        group: 'app',
        description: 'Decodes video into frames.',
        usage:
          'Reads the video, normalizes FPS and resolution, and pushes frames into a bounded buffer for GPU batching.',
        tech: ['OpenCV', 'PyAV'],
      },
    },
    {
      id: 'queue',
      position: YOLO_POS.queue,
      data: {
        label: 'Frame queue',
        subLabel: 'Bounded buffer',
        group: 'worker',
        description: 'GPU batching.',
        usage:
          'Decouples decoder throughput from detector latency. Batches frames so the GPU stays saturated without dropping ordering.',
        tech: ['Python queue', 'Async I/O'],
      },
    },
    {
      id: 'detector',
      position: YOLO_POS.detector,
      data: {
        label: 'YOLO detector',
        subLabel: 'Ultralytics',
        group: 'ai',
        description: 'Per-frame detection.',
        usage:
          'Locates player and ball bounding boxes per frame. Tuned for small / fast ball and crowded player scenes.',
        tech: ['YOLO', 'Ultralytics', 'PyTorch'],
      },
    },
    {
      id: 'tracker',
      position: YOLO_POS.tracker,
      data: {
        label: 'Tracker',
        subLabel: 'ByteTrack / SORT',
        group: 'ai',
        description: 'ID maintenance.',
        usage:
          'Associates detections across frames into consistent track IDs, handling occlusions, camera cuts, and re-entries.',
        tech: ['ByteTrack', 'SORT'],
      },
    },
    {
      id: 'analytics',
      position: YOLO_POS.analytics,
      data: {
        label: 'Analytics',
        subLabel: 'Derived stats',
        group: 'app',
        description: 'Speed · zones · possession.',
        usage:
          'Turns raw track logs into useful stats — speed, zone entries, heatmaps, possession proxies — for downstream football analysis.',
        tech: ['NumPy', 'Pandas'],
      },
    },
    {
      id: 'storage',
      position: YOLO_POS.storage,
      data: {
        label: 'Storage',
        subLabel: 'CSV / JSON',
        group: 'data',
        description: 'Track + frame artifacts.',
        usage:
          'Persists per-frame detections, track IDs, and annotated video snippets for later re-analysis.',
        tech: ['Object storage', 'CSV'],
      },
    },
    {
      id: 'export',
      position: YOLO_POS.export,
      data: {
        label: 'Export',
        subLabel: 'Annotated video',
        group: 'channel',
        description: 'Consumable outputs.',
        usage:
          'Outputs ready for coaches and analysts: annotated video, CSV/JSON track logs, and per-player summaries.',
        tech: ['ffmpeg', 'OpenCV'],
      },
    },
  ],
  edges: [
    { id: 'y1', source: 'video', target: 'decoder', animated: true },
    { id: 'y2', source: 'decoder', target: 'queue' },
    { id: 'y3', source: 'queue', target: 'detector' },
    { id: 'y4', source: 'detector', target: 'tracker' },
    { id: 'y5', source: 'tracker', target: 'analytics' },
    { id: 'y6', source: 'tracker', target: 'storage' },
    { id: 'y7', source: 'analytics', target: 'export' },
    { id: 'y8', source: 'storage', target: 'export' },
  ],
}

const LINEAGE_POS = tiers([
  ['airflow', 'snowflake', 'oracle', 'bigquery', 'sql'],
  ['connectors'],
  ['parser'],
  ['access'],
  ['normalize'],
  ['loader'],
  ['neo4j'],
  ['ui'],
])

const LINEAGE_GRAPH: ProjectArchitectureGraph = {
  nodes: [
    {
      id: 'airflow',
      position: LINEAGE_POS.airflow,
      data: {
        label: 'Airflow',
        subLabel: 'DAG metadata',
        group: 'external',
        description: 'Job metadata source.',
        usage:
          'Pulls DAG definitions, task SQL, and run history. Anchors lineage in the orchestration layer, not just raw queries.',
        tech: ['Airflow REST'],
      },
    },
    {
      id: 'snowflake',
      position: LINEAGE_POS.snowflake,
      data: {
        label: 'Snowflake',
        subLabel: 'Warehouse',
        group: 'external',
        description: 'Production warehouse.',
        usage:
          'Reads query history and ACCOUNT_USAGE views to extract SQL for column-level parsing.',
        tech: ['Snowflake connector'],
      },
    },
    {
      id: 'oracle',
      position: LINEAGE_POS.oracle,
      data: {
        label: 'Oracle',
        subLabel: 'Legacy OLTP',
        group: 'external',
        description: 'Legacy systems.',
        usage:
          'Pulls views, materialized views, and stored procedures so lineage reaches into older systems instead of stopping at the warehouse.',
        tech: ['cx_Oracle', 'JDBC'],
      },
    },
    {
      id: 'bigquery',
      position: LINEAGE_POS.bigquery,
      data: {
        label: 'BigQuery',
        subLabel: 'INFORMATION_SCHEMA',
        group: 'external',
        description: 'Warehouse jobs.',
        usage:
          'Reads INFORMATION_SCHEMA.JOBS for executed queries and reference tables, enabling lineage on Google-native pipelines.',
        tech: ['BigQuery API'],
      },
    },
    {
      id: 'sql',
      position: LINEAGE_POS.sql,
      data: {
        label: 'Raw .sql',
        subLabel: 'Repo files',
        group: 'external',
        description: 'Versioned SQL.',
        usage:
          'Scans Git repos for .sql files; lineage covers checked-in transformations even when they run outside warehouse logs.',
        tech: ['Git', 'glob'],
      },
    },
    {
      id: 'connectors',
      position: LINEAGE_POS.connectors,
      data: {
        label: 'Connectors',
        subLabel: 'Per-source adapters',
        group: 'app',
        description: 'Pluggable ingest.',
        usage:
          'Each adapter speaks one source. Normalizes job + query metadata into a canonical schema so the parser only deals with cleaned input.',
        tech: ['Python adapters'],
      },
    },
    {
      id: 'parser',
      position: LINEAGE_POS.parser,
      data: {
        label: 'SQL parser',
        subLabel: 'SQLGlot · sqlparse',
        group: 'app',
        description: 'Column-level extraction.',
        usage:
          'Parses every SQL artifact into table, column, transform, and target triples. Handles CTEs, joins, and dialect quirks across warehouses.',
        tech: ['SQLGlot', 'sqlparse'],
      },
    },
    {
      id: 'access',
      position: LINEAGE_POS.access,
      data: {
        label: 'Access check',
        subLabel: 'Governance',
        group: 'app',
        description: 'Gate before exposure.',
        usage:
          'Cross-checks the requester against ownership and permission rules so lineage edges only surface to authorized consumers.',
        tech: ['IAM lookup'],
      },
    },
    {
      id: 'normalize',
      position: LINEAGE_POS.normalize,
      data: {
        label: 'Normalize',
        subLabel: 'Canonical schema',
        group: 'app',
        description: 'Stable identifiers.',
        usage:
          'Resolves table and column aliases across sources into canonical entity ids so the graph stitches into one connected view.',
        tech: ['Python', 'Schema registry'],
      },
    },
    {
      id: 'loader',
      position: LINEAGE_POS.loader,
      data: {
        label: 'Graph loader',
        subLabel: 'Neo4j writer',
        group: 'app',
        description: 'Publishes triples.',
        usage:
          'Writes source → transformation → target relationships into Neo4j with versioning, so historical lineage stays available for audit.',
        tech: ['Neo4j Bolt'],
      },
    },
    {
      id: 'neo4j',
      position: LINEAGE_POS.neo4j,
      data: {
        label: 'Neo4j',
        subLabel: 'Knowledge graph',
        group: 'data',
        description: 'Lineage store.',
        usage:
          'Backs column-level lineage queries, impact analysis, and audit reports for the lineage UI.',
        tech: ['Neo4j'],
      },
    },
    {
      id: 'ui',
      position: LINEAGE_POS.ui,
      data: {
        label: 'Lineage UI',
        subLabel: 'Impact + audit',
        group: 'client',
        description: 'Consumer surface.',
        usage:
          'Lets data engineers and governance run impact analysis ("what breaks if I drop this column?") and trace every transformation end to end.',
        tech: ['React', 'D3', 'Cypher queries'],
      },
    },
  ],
  edges: [
    { id: 'l1', source: 'airflow', target: 'connectors', animated: true },
    { id: 'l2', source: 'snowflake', target: 'connectors', animated: true },
    { id: 'l3', source: 'oracle', target: 'connectors', animated: true },
    { id: 'l4', source: 'bigquery', target: 'connectors', animated: true },
    { id: 'l5', source: 'sql', target: 'connectors', animated: true },
    { id: 'l6', source: 'connectors', target: 'parser' },
    { id: 'l7', source: 'parser', target: 'access' },
    { id: 'l8', source: 'access', target: 'normalize' },
    { id: 'l9', source: 'normalize', target: 'loader' },
    { id: 'l10', source: 'loader', target: 'neo4j' },
    { id: 'l11', source: 'neo4j', target: 'ui' },
  ],
}

const SUGARCANE_POS = tiers([
  ['collect'],
  ['catalog'],
  ['clean'],
  ['split'],
  ['preprocess'],
  ['vgg', 'resnet', 'svm'],
  ['eval'],
  ['report'],
])

const SUGARCANE_GRAPH: ProjectArchitectureGraph = {
  nodes: [
    {
      id: 'collect',
      position: SUGARCANE_POS.collect,
      data: {
        label: 'Field capture',
        subLabel: 'Raw images',
        group: 'external',
        description: 'Plot imagery.',
        usage:
          'Sugarcane leaf and canopy photos captured per health class following faculty protocol — batch IDs and capture notes kept with each visit.',
        tech: ['JPEG/PNG', 'mobile / DSLR'],
      },
    },
    {
      id: 'catalog',
      position: SUGARCANE_POS.catalog,
      data: {
        label: 'Image catalog',
        subLabel: 'CSV manifest DB',
        group: 'data',
        description: 'Central registry.',
        usage:
          'Every file registered with path, class label, resolution, and batch metadata in a pandas-backed manifest — the single source of truth before cleaning and modeling.',
        tech: ['pandas', 'CSV', 'Python'],
      },
    },
    {
      id: 'clean',
      position: SUGARCANE_POS.clean,
      data: {
        label: 'Database cleaning',
        subLabel: 'QC · dedupe · labels',
        group: 'app',
        description: 'Data hygiene.',
        usage:
          'Drops corrupt/unreadable images, removes duplicates and burst frames, blur-scores unusable shots, enforces minimum resolution, and routes ambiguous labels to faculty review before splits are frozen.',
        tech: ['OpenCV', 'imagehash', 'pandas'],
      },
    },
    {
      id: 'split',
      position: SUGARCANE_POS.split,
      data: {
        label: 'Train / val / test',
        subLabel: 'Stratified · fixed seed',
        group: 'data',
        description: 'Reproducible splits.',
        usage:
          'Stratified partitions written to index files — identical splits feed VGG19, ResNet, and SVM so comparisons stay fair across model families.',
        tech: ['scikit-learn', 'stratified split'],
      },
    },
    {
      id: 'preprocess',
      position: SUGARCANE_POS.preprocess,
      data: {
        label: 'Preprocess',
        subLabel: 'OpenCV · augment',
        group: 'app',
        description: 'Image pipeline.',
        usage:
          'Resize, normalize, and augment training images only; class imbalance handled with oversampling and weighted loss before feeding CNN and classical tracks.',
        tech: ['OpenCV', 'Albumentations'],
      },
    },
    {
      id: 'vgg',
      position: SUGARCANE_POS.vgg,
      data: {
        label: 'VGG19',
        subLabel: 'Transfer learning',
        group: 'ai',
        description: 'Deep CNN baseline.',
        usage:
          'Fine-tunes VGG19 head on sugarcane classes; frozen lower blocks with a custom classifier on top. Compared against ResNet and SVM on the same splits.',
        tech: ['TensorFlow/Keras', 'VGG19'],
      },
    },
    {
      id: 'resnet',
      position: SUGARCANE_POS.resnet,
      data: {
        label: 'ResNet',
        subLabel: 'Transfer learning',
        group: 'ai',
        description: 'Deep CNN baseline.',
        usage:
          'ResNet fine-tuning with the same augmentation protocol as VGG19. Typically stronger on fine-grained leaf texture signals in the dataset.',
        tech: ['TensorFlow/Keras', 'ResNet'],
      },
    },
    {
      id: 'svm',
      position: SUGARCANE_POS.svm,
      data: {
        label: 'SVM baseline',
        subLabel: 'HOG · color hist',
        group: 'ai',
        description: 'Classical pipeline.',
        usage:
          'Hand-crafted features (HOG, color histograms) fed into an SVM classifier — apples-to-apples eval against CNNs on identical splits for the research report.',
        tech: ['scikit-learn', 'SVM', 'HOG'],
      },
    },
    {
      id: 'eval',
      position: SUGARCANE_POS.eval,
      data: {
        label: 'Evaluation',
        subLabel: 'Metrics suite',
        group: 'app',
        description: 'Model comparison.',
        usage:
          'Computes accuracy, precision, recall, F1, and confusion matrices per model. Drives the trade-off analysis in the faculty co-authored report.',
        tech: ['scikit-learn', 'Matplotlib'],
      },
    },
    {
      id: 'report',
      position: SUGARCANE_POS.report,
      data: {
        label: 'Research report',
        subLabel: 'PDF deliverable',
        group: 'channel',
        description: 'Final output.',
        usage:
          'Documents methodology, dataset protocol, metric tables, and CNN vs classical conclusions for academic submission.',
        tech: ['LaTeX / PDF'],
      },
    },
  ],
  edges: [
    { id: 'sg0', source: 'collect', target: 'catalog', animated: true },
    { id: 'sg1', source: 'catalog', target: 'clean', animated: true },
    { id: 'sg1b', source: 'clean', target: 'split', animated: true },
    { id: 'sg1c', source: 'split', target: 'preprocess', animated: true },
    { id: 'sg2', source: 'preprocess', target: 'vgg' },
    { id: 'sg3', source: 'preprocess', target: 'resnet' },
    { id: 'sg4', source: 'preprocess', target: 'svm' },
    { id: 'sg5', source: 'vgg', target: 'eval' },
    { id: 'sg6', source: 'resnet', target: 'eval' },
    { id: 'sg7', source: 'svm', target: 'eval' },
    { id: 'sg8', source: 'eval', target: 'report' },
  ],
}

const LINKEDIN_POS = tiers([
  ['urls'],
  ['scraper'],
  ['parser'],
  ['claude'],
  ['excel'],
])

const LINKEDIN_GRAPH: ProjectArchitectureGraph = {
  nodes: [
    {
      id: 'urls',
      position: LINKEDIN_POS.urls,
      data: {
        label: 'Search URLs',
        subLabel: 'USA · UAE · AI/ML',
        group: 'external',
        description: 'Job listing seeds.',
        usage:
          'Curated LinkedIn search URLs for AI/ML roles in USA and UAE. Fed into the scraper with per-session caps from ENV config.',
        tech: ['ENV config'],
      },
    },
    {
      id: 'scraper',
      position: LINKEDIN_POS.scraper,
      data: {
        label: 'Guest scraper',
        subLabel: 'linkedin_scraper.py',
        group: 'app',
        description: 'No-login fetch.',
        usage:
          'Hits LinkedIn guest API endpoints with UA rotation, random delays, and MAX_JOBS_PER_SESSION to reduce blocks. Returns raw HTML job postings.',
        tech: ['requests', 'BeautifulSoup', 'Python'],
      },
    },
    {
      id: 'parser',
      position: LINKEDIN_POS.parser,
      data: {
        label: 'HTML parser',
        subLabel: 'Normalize fields',
        group: 'app',
        description: 'Structured job text.',
        usage:
          'Extracts title, company, location, and description text from HTML before handing clean blobs to the AI extractor.',
        tech: ['BeautifulSoup'],
      },
    },
    {
      id: 'claude',
      position: LINKEDIN_POS.claude,
      data: {
        label: 'Claude extractor',
        subLabel: 'ai_extractor.py',
        group: 'ai',
        description: '10-field JSON.',
        usage:
          'OpenRouter Claude 3.5 Sonnet maps each posting into ten structured fields: company, role, skills, salary, mode, full JD, and more.',
        tech: ['OpenRouter', 'Claude 3.5'],
      },
    },
    {
      id: 'excel',
      position: LINKEDIN_POS.excel,
      data: {
        label: 'Excel writer',
        subLabel: 'excel_writer.py',
        group: 'channel',
        description: 'Spreadsheet output.',
        usage:
          'Writes formatted rows to linkedin_ai_jobs.xlsx via openpyxl. CLI main.py orchestrates scrape → extract → write in one run.',
        tech: ['openpyxl', 'CLI'],
      },
    },
  ],
  edges: [
    { id: 'lj1', source: 'urls', target: 'scraper', animated: true },
    { id: 'lj2', source: 'scraper', target: 'parser' },
    { id: 'lj3', source: 'parser', target: 'claude' },
    { id: 'lj4', source: 'claude', target: 'excel', animated: true },
  ],
}

const TWITTER_POS = tiers([
  ['feeds'],
  ['research'],
  ['claude'],
  ['fal'],
  ['approval'],
  ['tweepy'],
])

const TWITTER_GRAPH: ProjectArchitectureGraph = {
  nodes: [
    {
      id: 'feeds',
      position: TWITTER_POS.feeds,
      data: {
        label: 'Live news feeds',
        subLabel: 'HN · TC · MIT',
        group: 'external',
        description: 'AI news sources.',
        usage:
          'RSS and scrape targets polled each daily run: Hacker News, TechCrunch, MIT, OpenAI blog — fresh stories for engagement posts.',
        tech: ['RSS', 'feedparser'],
      },
    },
    {
      id: 'research',
      position: TWITTER_POS.research,
      data: {
        label: 'Research worker',
        subLabel: '/api/research',
        group: 'app',
        description: 'Topic harvest.',
        usage:
          'FastAPI endpoint scrapes feeds with BeautifulSoup/feedparser, dedupes stories, and returns candidate headlines for drafting.',
        tech: ['FastAPI', 'BeautifulSoup'],
      },
    },
    {
      id: 'claude',
      position: TWITTER_POS.claude,
      data: {
        label: 'Claude drafter',
        subLabel: 'persona.json',
        group: 'ai',
        description: 'Persona tweets.',
        usage:
          'Anthropic Claude drafts tweets in the voice defined in persona.json — tone, length, and topic constraints applied per generation.',
        tech: ['Claude', 'Anthropic API'],
      },
    },
    {
      id: 'fal',
      position: TWITTER_POS.fal,
      data: {
        label: 'Fal Flux',
        subLabel: 'Image gen',
        group: 'ai',
        description: 'Tweet visuals.',
        usage: 'Generates a Fal Flux image per draft for richer posts. Image URL attached before approval.',
        tech: ['Fal.ai', 'Flux'],
      },
    },
    {
      id: 'approval',
      position: TWITTER_POS.approval,
      data: {
        label: 'Approval UI',
        subLabel: 'Static HTML',
        group: 'client',
        description: 'Human gate.',
        usage:
          'Static page lists pending drafts with approve/reject actions. Nothing posts until a human confirms.',
        tech: ['HTML', 'FastAPI static'],
      },
    },
    {
      id: 'tweepy',
      position: TWITTER_POS.tweepy,
      data: {
        label: 'X publisher',
        subLabel: '/api/twitter/post',
        group: 'channel',
        description: 'Live post.',
        usage:
          'Approved drafts publish via Tweepy to X with text + media — the daily output aimed at timeline reach and consistent audience growth.',
        tech: ['Tweepy', 'X API'],
      },
    },
  ],
  edges: [
    { id: 'tw1', source: 'feeds', target: 'research', animated: true },
    { id: 'tw2', source: 'research', target: 'claude' },
    { id: 'tw3', source: 'claude', target: 'fal' },
    { id: 'tw4', source: 'fal', target: 'approval' },
    { id: 'tw5', source: 'approval', target: 'tweepy', animated: true },
  ],
}

const FINETUNE_POS = tiers([
  ['epub'],
  ['extract'],
  ['segment'],
  ['instructions'],
  ['dataset'],
  ['train'],
  ['adapter'],
  ['bookgen'],
])

const FINETUNE_GRAPH: ProjectArchitectureGraph = {
  nodes: [
    {
      id: 'epub',
      position: FINETUNE_POS.epub,
      data: {
        label: 'ePub corpus',
        subLabel: '5 Fitzgerald books',
        group: 'external',
        description: 'Source texts.',
        usage: 'Five Fitzgerald ePub titles are the sole training corpus for the author-style adapter.',
        tech: ['ePub'],
      },
    },
    {
      id: 'extract',
      position: FINETUNE_POS.extract,
      data: {
        label: 'extract.py',
        subLabel: 'ebooklib',
        group: 'app',
        description: 'Chapter text.',
        usage: 'Pulls clean chapter text from ePub structure, stripping boilerplate and metadata noise.',
        tech: ['ebooklib', 'Python'],
      },
    },
    {
      id: 'segment',
      position: FINETUNE_POS.segment,
      data: {
        label: 'segment.py',
        subLabel: 'Passage chunks',
        group: 'app',
        description: 'Style passages.',
        usage: 'Segments chapters into author-voice passages sized for instruction-pair generation.',
        tech: ['Python'],
      },
    },
    {
      id: 'instructions',
      position: FINETUNE_POS.instructions,
      data: {
        label: 'generate_instructions',
        subLabel: 'Teacher LLM',
        group: 'ai',
        description: 'Instruction pairs.',
        usage:
          'Teacher model writes instruction/response pairs from passages — the dataset that teaches Qwen how to write like Fitzgerald.',
        tech: ['LLM', 'Jupyter'],
      },
    },
    {
      id: 'dataset',
      position: FINETUNE_POS.dataset,
      data: {
        label: 'build_dataset.py',
        subLabel: '3,762 examples',
        group: 'data',
        description: 'dataset.jsonl.',
        usage: 'Merges instruction pairs into dataset.jsonl — 3,762 rows ready for PEFT training.',
        tech: ['JSONL'],
      },
    },
    {
      id: 'train',
      position: FINETUNE_POS.train,
      data: {
        label: 'PEFT train',
        subLabel: 'Qwen2.5-3B',
        group: 'ai',
        description: 'LoRA fine-tune.',
        usage:
          'PEFT LoRA fine-tune on Qwen2.5-3B — runs on RunPod GPU (VRAM + hours of train time). Notebooks tune rank, LR, and epochs before exporting fitzgerald_lora/.',
        tech: ['PEFT', 'PyTorch', 'Transformers', 'RunPod'],
      },
    },
    {
      id: 'adapter',
      position: FINETUNE_POS.adapter,
      data: {
        label: 'fitzgerald_lora',
        subLabel: '~479 MB',
        group: 'data',
        description: 'Adapter weights.',
        usage: 'Shipped adapter directory consumed at runtime by Bookgen llm-service.',
        tech: ['safetensors', 'PEFT'],
      },
    },
    {
      id: 'bookgen',
      position: FINETUNE_POS.bookgen,
      data: {
        label: 'Bookgen llm-service',
        subLabel: 'RunPod · GPU',
        group: 'channel',
        description: 'Production inference.',
        usage:
          'Production tier loads Qwen2.5-3B + fitzgerald_lora adapter on cloud GPU, streams chapters to FastAPI/WebSocket — the consumer that makes fine-tuning matter for authors.',
        tech: ['Qwen2.5-3B', 'RunPod', 'Docker'],
      },
    },
  ],
  edges: [
    { id: 'ft1', source: 'epub', target: 'extract', animated: true },
    { id: 'ft2', source: 'extract', target: 'segment' },
    { id: 'ft3', source: 'segment', target: 'instructions' },
    { id: 'ft4', source: 'instructions', target: 'dataset' },
    { id: 'ft5', source: 'dataset', target: 'train' },
    { id: 'ft6', source: 'train', target: 'adapter' },
    { id: 'ft7', source: 'adapter', target: 'bookgen', animated: true, dashed: true },
  ],
}

const COST_POS = tiers([
  ['questionnaire'],
  ['inventory'],
  ['collectors'],
  ['telemetry'],
  ['analyzer'],
  ['playbook'],
])

const COST_GRAPH: ProjectArchitectureGraph = {
  nodes: [
    {
      id: 'questionnaire',
      position: COST_POS.questionnaire,
      data: {
        label: 'Infra questionnaire',
        subLabel: 'Discovery input',
        group: 'external',
        description: 'Company AI footprint.',
        usage:
          'Maps apps, environments, API keys, and providers — the starting point before any telemetry pull.',
        tech: ['Forms', 'JSON'],
      },
    },
    {
      id: 'inventory',
      position: COST_POS.inventory,
      data: {
        label: 'Inventory service',
        subLabel: 'FastAPI',
        group: 'app',
        description: 'Service map.',
        usage:
          'Builds a normalized inventory of endpoints, models in use, and estimated monthly spend bands per app.',
        tech: ['FastAPI', 'PostgreSQL'],
      },
    },
    {
      id: 'collectors',
      position: COST_POS.collectors,
      data: {
        label: 'Usage collectors',
        subLabel: 'Provider APIs',
        group: 'app',
        description: 'Token telemetry.',
        usage:
          'Pulls usage from OpenAI, Anthropic, OpenRouter, and similar — prompt/completion tokens per endpoint.',
        tech: ['OpenAI API', 'Anthropic API'],
      },
    },
    {
      id: 'telemetry',
      position: COST_POS.telemetry,
      data: {
        label: 'Telemetry store',
        subLabel: 'Langfuse · metrics',
        group: 'data',
        description: 'Aggregated usage.',
        usage:
          'Stores per-model call volume, token counts, and $ estimates. Prometheus-style metrics for dashboards.',
        tech: ['PostgreSQL', 'Langfuse', 'Prometheus'],
      },
    },
    {
      id: 'analyzer',
      position: COST_POS.analyzer,
      data: {
        label: 'Model analyzer',
        subLabel: 'Cost vs quality',
        group: 'ai',
        description: 'Routing advice.',
        usage:
          'Compares GPT-4o, mini, and open-weight options per task type — recommends cheaper routing without quality collapse.',
        tech: ['Python', 'Benchmarks'],
      },
    },
    {
      id: 'playbook',
      position: COST_POS.playbook,
      data: {
        label: 'Savings playbook',
        subLabel: 'Markdown report',
        group: 'channel',
        description: 'Action plan.',
        usage:
          'Prioritized list: what to migrate, throttle, cache, or batch first — with quantified savings per recommendation.',
        tech: ['Markdown', 'PDF export'],
      },
    },
  ],
  edges: [
    { id: 'co1', source: 'questionnaire', target: 'inventory', animated: true },
    { id: 'co2', source: 'inventory', target: 'collectors' },
    { id: 'co3', source: 'collectors', target: 'telemetry' },
    { id: 'co4', source: 'telemetry', target: 'analyzer' },
    { id: 'co5', source: 'analyzer', target: 'playbook', animated: true },
  ],
}

const COURSE_POS = tiers([
  ['brief'],
  ['outline'],
  ['content'],
  ['slides'],
  ['tts', 'guide'],
  ['export'],
])

const COURSE_GRAPH: ProjectArchitectureGraph = {
  nodes: [
    {
      id: 'brief',
      position: COURSE_POS.brief,
      data: {
        label: 'Course brief',
        subLabel: 'Author input',
        group: 'external',
        description: 'Requirements.',
        usage: 'Audience, objectives, module count, and tone constraints seed the entire authoring pipeline.',
        tech: ['Text', 'JSON'],
      },
    },
    {
      id: 'outline',
      position: COURSE_POS.outline,
      data: {
        label: 'Outline service',
        subLabel: 'LLM · FastAPI',
        group: 'ai',
        description: 'Syllabus structure.',
        usage:
          'LLM produces module → lesson hierarchy with learning objectives per section — editable before content gen.',
        tech: ['LLM', 'FastAPI'],
      },
    },
    {
      id: 'content',
      position: COURSE_POS.content,
      data: {
        label: 'Content generator',
        subLabel: 'Per slide',
        group: 'ai',
        description: 'Slide copy + notes.',
        usage:
          'Fills each slide with body text, bullet structure, and speaker notes aligned to the learning objective.',
        tech: ['LLM', 'Structured output'],
      },
    },
    {
      id: 'slides',
      position: COURSE_POS.slides,
      data: {
        label: 'PPT renderer',
        subLabel: 'python-pptx',
        group: 'app',
        description: 'Branded decks.',
        usage:
          'Renders consistent slide layouts from templates — outputs PPTX with embedded speaker notes.',
        tech: ['python-pptx'],
      },
    },
    {
      id: 'tts',
      position: COURSE_POS.tts,
      data: {
        label: 'TTS narration',
        subLabel: 'Per slide audio',
        group: 'ai',
        description: 'Listen-along.',
        usage: 'Generates MP3/WAV per slide explaining content in plain language for async learners.',
        tech: ['TTS', 'Edge TTS / ElevenLabs'],
      },
    },
    {
      id: 'guide',
      position: COURSE_POS.guide,
      data: {
        label: 'Instructor guide',
        subLabel: 'Markdown',
        group: 'app',
        description: 'Facilitator notes.',
        usage: 'Markdown instructor guide with timing, discussion prompts, and assessment hooks per module.',
        tech: ['Markdown'],
      },
    },
    {
      id: 'export',
      position: COURSE_POS.export,
      data: {
        label: 'LMS package',
        subLabel: 'Batch export',
        group: 'channel',
        description: 'Shippable bundle.',
        usage:
          'Zips PPTX + audio + guide into one package ready for LMS upload or internal training distribution.',
        tech: ['ZIP', 'Next.js UI'],
      },
    },
  ],
  edges: [
    { id: 'cs1', source: 'brief', target: 'outline', animated: true },
    { id: 'cs2', source: 'outline', target: 'content' },
    { id: 'cs3', source: 'content', target: 'slides' },
    { id: 'cs4', source: 'content', target: 'tts' },
    { id: 'cs5', source: 'content', target: 'guide' },
    { id: 'cs6', source: 'slides', target: 'export' },
    { id: 'cs7', source: 'tts', target: 'export' },
    { id: 'cs8', source: 'guide', target: 'export' },
  ],
}

export const PROJECT_ARCHITECTURE_GRAPHS: Record<string, ProjectArchitectureGraph> = {
  socialhub: DBAAS_GRAPH,
  prism: PRISM_GRAPH,
  unify: UNIFY_GRAPH,
  taleweaver: TALEWEAVER_GRAPH,
  'football-analytics': FOOTBALL_GRAPH,
  'yolo-sports-tracking': YOLO_GRAPH,
  'data-lineage': LINEAGE_GRAPH,
  'sugarcane-health-ml': SUGARCANE_GRAPH,
  'linkedin-job-scraper': LINKEDIN_GRAPH,
  'ai-twitter-post-generator': TWITTER_GRAPH,
  'fitzgerald-lora-pipeline': FINETUNE_GRAPH,
  'ai-cost-optimizer': COST_GRAPH,
  'course-studio': COURSE_GRAPH,
}
