export type DemoMessage = {
  from: 'user' | 'ai' | 'system'
  text: string
  time?: string
}

export type DemoThread = {
  id: string
  name: string
  preview: string
  channel?: string
  badge?: 'AI' | 'Human' | 'Open'
  time?: string
}

export type DemoKpi = {
  label: string
  value: string
  delta?: string
}

export type DemoPipelineStep = {
  label: string
  detail: string
  status: 'done' | 'active' | 'pending'
}

export type DemoListItem = {
  title: string
  meta?: string
  tag?: string
}

export type DemoTabPanel =
  | { kind: 'inbox'; threads: DemoThread[]; messages: DemoMessage[] }
  | { kind: 'chat'; messages: DemoMessage[] }
  | { kind: 'kpis'; items: DemoKpi[]; note?: string }
  | { kind: 'pipeline'; steps: DemoPipelineStep[] }
  | { kind: 'list'; items: DemoListItem[] }

export type ProjectDemoTab = {
  slug: string
  label: string
  panel: DemoTabPanel
}

export type ProjectDemoConfig = {
  chapterTitle: string
  chapterWhen: string
  description: string
  /** Full bespoke embed (Unify inbox, SocialHub live publish) */
  embed?: 'unify' | 'socialhub'
  tabs?: ProjectDemoTab[]
  windowUrl?: string
}

const DEMO_BY_PROJECT: Record<string, ProjectDemoConfig> = {
  socialhub: {
    chapterTitle: 'Live GenOps demo',
    chapterWhen: 'Try it',
    description:
      'The interactive demo below mirrors the production dashboard — content studio, multi-platform calendar, OAuth publish lanes, and approval flows across Facebook, Instagram, X, LinkedIn, and Reddit.',
    embed: 'socialhub',
  },
  prism: {
    chapterTitle: 'Live hiring demo',
    chapterWhen: 'Try it',
    description:
      'The demo mirrors the recruiter dashboard — Gmail intake threads, AI-scored candidates, structured résumé fields, and interview slots on the calendar.',
    windowUrl: 'app.prism.io/recruit',
    tabs: [
      {
        slug: 'inbox',
        label: 'Candidate Inbox',
        panel: {
          kind: 'inbox',
          threads: [
            { id: '1', name: 'Aisha Khan', preview: 'Applied — Senior ML Engineer', channel: 'Gmail', badge: 'Open', time: '9:12' },
            { id: '2', name: 'James Ortiz', preview: 'Score 87 · Python, RAG, FastAPI', channel: 'Gmail', badge: 'AI', time: '8:40' },
            { id: '3', name: 'Priya N.', preview: 'Interview Thu 3pm — confirmed', channel: 'Calendar', badge: 'Human', time: 'Yesterday' },
          ],
          messages: [
            { from: 'system', text: 'Résumé parsed · 12 skills extracted · JSON schema valid', time: '9:12' },
            { from: 'ai', text: 'Weighted score: 87/100 — strong match on LLM infra & Python. Recommend phone screen.', time: '9:13' },
            { from: 'user', text: 'Schedule interview — send Calendar invite', time: '9:15' },
          ],
        },
      },
      {
        slug: 'scoring',
        label: 'AI Scoring',
        panel: {
          kind: 'kpis',
          items: [
            { label: 'Screened today', value: '24', delta: '-68% manual time' },
            { label: 'Schema pass rate', value: '98%', delta: 'GPT-4 JSON' },
            { label: 'Avg score confidence', value: '0.91', delta: 'Weighted engine' },
            { label: 'Saved / candidate', value: '18 min', delta: 'vs manual' },
          ],
        },
      },
      {
        slug: 'schedule',
        label: 'Scheduling',
        panel: {
          kind: 'list',
          items: [
            { title: 'Thu 3:00 PM — Aisha Khan', meta: 'Google Meet · ML Engineer', tag: 'Confirmed' },
            { title: 'Fri 11:00 AM — James Ortiz', meta: 'Phone screen · Recruiter: Sam', tag: 'Pending' },
            { title: 'Mon 2:00 PM — Batch — 4 candidates', meta: 'Panel loop · Engineering', tag: 'Draft' },
          ],
        },
      },
      {
        slug: 'analytics',
        label: 'Analytics',
        panel: {
          kind: 'kpis',
          items: [
            { label: 'Applications / week', value: '142', delta: '+12%' },
            { label: 'Auto-rejected', value: '38%', delta: 'Below threshold' },
            { label: 'Offers extended', value: '6', delta: 'This month' },
            { label: 'Agreement', value: '96%', delta: 'Eval QA sample' },
          ],
        },
      },
    ],
  },
  unify: {
    chapterTitle: 'Live inbox demo',
    chapterWhen: 'Try it',
    description:
      'The interactive demo below mirrors the agent dashboard — threaded conversations, AI vs human badges, and channel labels across WhatsApp, Telegram, and Instagram.',
    embed: 'unify',
  },
  taleweaver: {
    chapterTitle: 'Live studio demo',
    chapterWhen: 'Try it',
    description:
      'Mirrors Bookgen — outline tree, chapter streaming with voice-locked prose, and export to EPUB/PDF. Fitzgerald LoRA runs in the GPU service behind the chapter panel.',
    windowUrl: 'studio.bookgen.io',
    tabs: [
      {
        slug: 'outline',
        label: 'Outline',
        panel: {
          kind: 'list',
          items: [
            { title: 'Act I — The invitation', meta: '3 chapters', tag: 'Draft' },
            { title: 'Act II — Crossing', meta: '5 chapters', tag: 'Generating' },
            { title: 'Act III — Return', meta: '4 chapters', tag: 'Queued' },
          ],
        },
      },
      {
        slug: 'chapters',
        label: 'Chapters',
        panel: {
          kind: 'chat',
          messages: [
            { from: 'user', text: 'Generate Chapter 4 — maintain Fitzgerald cadence, 1.2k words', time: '14:02' },
            { from: 'ai', text: 'Streaming… Qwen2.5-3B + author LoRA · 412 tokens', time: '14:02' },
            { from: 'ai', text: 'The lights of the pier burned low against the water…', time: '14:03' },
          ],
        },
      },
      {
        slug: 'voice',
        label: 'Voice Lock',
        panel: {
          kind: 'pipeline',
          steps: [
            { label: 'Author EPUB ingested', detail: 'Style sample on file', status: 'done' },
            { label: 'LoRA adapter loaded', detail: 'fitzgerald_lora/', status: 'done' },
            { label: 'Chapter stream', detail: 'WebSocket → backend', status: 'active' },
            { label: 'EPUB export', detail: 'Valid Apple metadata', status: 'pending' },
          ],
        },
      },
      {
        slug: 'export',
        label: 'Export',
        panel: {
          kind: 'list',
          items: [
            { title: 'manuscript.epub', meta: '12 chapters · 48k words', tag: 'Ready' },
            { title: 'manuscript.pdf', meta: 'Print layout', tag: 'Ready' },
            { title: 'outline.json', meta: 'Series bible sync', tag: 'Sync' },
          ],
        },
      },
    ],
  },
  'linkedin-job-scraper': {
    chapterTitle: 'Live pipeline demo',
    chapterWhen: 'Try it',
    description:
      'Mirrors the job-hunt pipeline — curated LinkedIn URLs, guest scrape with session caps, Claude extraction to ten fields, and Excel export friends filter in one sheet.',
    windowUrl: 'jobs.local/pipeline',
    tabs: [
      {
        slug: 'scrape',
        label: 'Scrape',
        panel: {
          kind: 'pipeline',
          steps: [
            { label: 'Search URLs', detail: 'USA · UAE · AI/ML', status: 'done' },
            { label: 'Guest API pull', detail: 'UA rotate · delays', status: 'active' },
            { label: 'Session cap', detail: 'MAX_JOBS_PER_SESSION', status: 'pending' },
          ],
        },
      },
      {
        slug: 'extract',
        label: 'AI Extract',
        panel: {
          kind: 'list',
          items: [
            { title: 'Senior ML Engineer — Stripe', meta: 'Remote · $180–220k', tag: '10 fields' },
            { title: 'GenOps Engineer — Series B', meta: 'Dubai · Hybrid', tag: '10 fields' },
            { title: 'LLM Infra — OpenAI partner', meta: 'SF · On-site', tag: '10 fields' },
          ],
        },
      },
      {
        slug: 'export',
        label: 'Excel Export',
        panel: {
          kind: 'kpis',
          items: [
            { label: 'Rows this run', value: '47', delta: 'Fresh pull' },
            { label: 'Friends on list', value: '8', delta: 'Shared workbook' },
            { label: 'Fields / job', value: '10', delta: 'Claude schema' },
            { label: 'Output', value: '.xlsx', delta: 'Filterable' },
          ],
        },
      },
    ],
  },
  'ai-twitter-post-generator': {
    chapterTitle: 'Live publish demo',
    chapterWhen: 'Try it',
    description:
      'Daily X automation — live news ingest, persona-locked drafts, image gen, human approve/reject, then publish. Tabs mirror the FastAPI research → generate → post flow.',
    windowUrl: 'x-bot.local/dashboard',
    tabs: [
      { slug: 'news', label: 'News Feed', panel: { kind: 'list', items: [
        { title: 'OpenAI — new reasoning API', meta: 'HN · 2h ago', tag: 'Selected' },
        { title: 'EU AI Act enforcement timeline', meta: 'TechCrunch', tag: 'Queued' },
        { title: 'MIT — agent eval benchmarks', meta: 'RSS', tag: 'New' },
      ] } },
      { slug: 'draft', label: 'Generate', panel: { kind: 'chat', messages: [
        { from: 'ai', text: 'Draft: "Reasoning APIs just became a product category…"', time: '07:00' },
        { from: 'user', text: 'Attach Flux visual — persona.json tone', time: '07:01' },
      ] } },
      { slug: 'approve', label: 'Approve', panel: { kind: 'list', items: [
        { title: 'Post #1842', meta: 'Awaiting approval', tag: 'Pending' },
        { title: 'Post #1841', meta: 'Published 6:58 AM', tag: 'Live' },
      ] } },
      { slug: 'publish', label: 'Publish', panel: { kind: 'kpis', items: [
        { label: 'Cadence', value: 'Daily', delta: 'Cron' },
        { label: 'Reach', value: 'Growing', delta: 'X API' },
        { label: 'Feeds', value: '5+', delta: 'Live' },
      ] } },
    ],
  },
  'fitzgerald-lora-pipeline': {
    chapterTitle: 'Live training demo',
    chapterWhen: 'Try it',
    description:
      'Offline fine-tune pipeline — ePub corpus to instruction JSONL, RunPod LoRA train, adapter handoff to Bookgen llm-service for production chapter streaming.',
    windowUrl: 'finetune.local',
    tabs: [
      { slug: 'corpus', label: 'Corpus', panel: { kind: 'list', items: [
        { title: '5 Fitzgerald ePubs', meta: 'Sole style source', tag: 'Ingested' },
        { title: '3,762 instruction pairs', meta: 'dataset.jsonl', tag: 'Ready' },
      ] } },
      { slug: 'train', label: 'Train', panel: { kind: 'pipeline', steps: [
        { label: 'extract.py', detail: 'ebooklib chapters', status: 'done' },
        { label: 'PEFT LoRA', detail: 'Qwen2.5-3B · RunPod', status: 'active' },
        { label: 'fitzgerald_lora/', detail: '~479 MB adapter', status: 'pending' },
      ] } },
      { slug: 'infer', label: 'Inference', panel: { kind: 'chat', messages: [
        { from: 'system', text: 'llm-service: base + LoRA loaded on GPU', time: '—' },
        { from: 'ai', text: 'Chapter token stream → FastAPI WebSocket', time: 'Live' },
      ] } },
    ],
  },
  'sugarcane-health-ml': {
    chapterTitle: 'Live research demo',
    chapterWhen: 'Try it',
    description:
      'Research pipeline UI — manifest catalog, cleaning QC, stratified splits, then VGG19/ResNet vs SVM tracks on identical data with shared eval protocol.',
    windowUrl: 'lab.vit/sugarcane',
    tabs: [
      { slug: 'data', label: 'Dataset', panel: { kind: 'pipeline', steps: [
        { label: 'Manifest CSV', detail: 'Path · label · batch', status: 'done' },
        { label: 'Dedupe · blur QC', detail: 'Faculty audit', status: 'done' },
        { label: 'Stratified split', detail: 'Fixed seed', status: 'done' },
      ] } },
      { slug: 'cnn', label: 'CNN Track', panel: { kind: 'kpis', items: [
        { label: 'VGG19', value: 'Fine-tune', delta: 'Transfer' },
        { label: 'ResNet', value: 'Fine-tune', delta: 'Transfer' },
        { label: 'Metrics', value: 'F1 · CM', delta: 'Same split' },
      ] } },
      { slug: 'svm', label: 'SVM Baseline', panel: { kind: 'list', items: [
        { title: 'HOG features', meta: 'Classical track', tag: 'Baseline' },
        { title: 'sklearn SVM', meta: 'Identical eval', tag: 'Compare' },
      ] } },
    ],
  },
  'football-analytics': {
    chapterTitle: 'Live intelligence demo',
    chapterWhen: 'Try it',
    description:
      'Platform modules — injury risk signals, valuation projection, performance drift, and team availability in one club-facing view (mirrors championsgen product direction).',
    windowUrl: 'app.championsgen.io',
    tabs: [
      { slug: 'injury', label: 'Injury Risk', panel: { kind: 'kpis', items: [
        { label: 'High risk players', value: '3', delta: 'This week' },
        { label: 'Load spike', value: '+18%', delta: 'GPS telemetry' },
        { label: 'League cost context', value: '€750M+', delta: 'Annual' },
      ] } },
      { slug: 'value', label: 'Valuation', panel: { kind: 'list', items: [
        { title: 'LW — 2-season projection', meta: 'EUR band · growth +12%', tag: 'Model' },
        { title: 'CM — transfer miss risk', meta: '45–55% off-target context', tag: 'Alert' },
      ] } },
      { slug: 'perf', label: 'Performance', panel: { kind: 'kpis', items: [
        { label: 'Drift flags', value: '2', delta: 'Early detect' },
        { label: 'Training load', value: 'Optimal', delta: 'Match align' },
      ] } },
      { slug: 'team', label: 'Team View', panel: { kind: 'list', items: [
        { title: 'Medical + coaching aligned', meta: 'Shared availability', tag: 'Live' },
      ] } },
    ],
  },
  'yolo-sports-tracking': {
    chapterTitle: 'Live vision demo',
    chapterWhen: 'Try it',
    description:
      'CV pipeline — frame decode, YOLO detect (player + ball), ByteTrack IDs, analytics export for speed, zones, and possession proxies.',
    windowUrl: 'cv.local/tracker',
    tabs: [
      { slug: 'video', label: 'Video In', panel: { kind: 'pipeline', steps: [
        { label: 'OpenCV decode', detail: 'MP4 · RTSP', status: 'done' },
        { label: 'Frame queue', detail: 'GPU batch', status: 'active' },
      ] } },
      { slug: 'detect', label: 'Detect', panel: { kind: 'kpis', items: [
        { label: 'Classes', value: 'Player · Ball', delta: 'YOLO' },
        { label: 'FPS', value: '28', delta: 'Ultralytics' },
      ] } },
      { slug: 'track', label: 'Track', panel: { kind: 'list', items: [
        { title: 'ID #12 — winger', meta: 'ByteTrack · 1,204 frames', tag: 'Stable' },
        { title: 'ID #0 — ball', meta: 'Occlusion recoveries: 3', tag: 'Track' },
      ] } },
      { slug: 'export', label: 'Analytics', panel: { kind: 'list', items: [
        { title: 'tracks.json', meta: 'Per-frame positions', tag: 'Export' },
        { title: 'heatmap.csv', meta: 'Zone entries', tag: 'Derived' },
      ] } },
    ],
  },
  'ai-cost-optimizer': {
    chapterTitle: 'Live cost audit demo',
    chapterWhen: 'Try it',
    description:
      'GenOps infra audit dashboard — service inventory from questionnaire, provider telemetry, per-model spend, and a prioritized savings playbook (migrate, throttle, cache, batch).',
    windowUrl: 'genops.local/cost-audit',
    tabs: [
      { slug: 'inventory', label: 'Inventory', panel: { kind: 'list', items: [
        { title: 'support-bot · prod', meta: 'GPT-4o · 12k calls/mo', tag: 'OpenAI' },
        { title: 'extract-api · staging', meta: 'Claude mini · 3k calls', tag: 'Anthropic' },
        { title: 'agent-loop · prod', meta: 'OpenRouter mix', tag: 'Multi' },
      ] } },
      { slug: 'telemetry', label: 'Telemetry', panel: { kind: 'kpis', items: [
        { label: 'Spend MTD', value: '$4,280', delta: 'All providers' },
        { label: 'Top endpoint', value: 'support-bot', delta: '38% spend' },
        { label: 'Cache miss waste', value: '$420', delta: 'Est. savings' },
        { label: 'Traces', value: 'Langfuse', delta: 'Attributed' },
      ] } },
      { slug: 'analyzer', label: 'Analyzer', panel: { kind: 'list', items: [
        { title: 'Summarize → mini', meta: 'Quality band OK', tag: 'Migrate' },
        { title: 'Agent loop cap', meta: 'Max 8 iterations', tag: 'Throttle' },
        { title: 'Embed cache', meta: 'Redis · 24h TTL', tag: 'Cache' },
      ] } },
      { slug: 'playbook', label: 'Playbook', panel: { kind: 'kpis', items: [
        { label: 'Est. savings', value: '$1,100/mo', delta: 'If applied' },
        { label: 'Actions', value: '7', delta: 'Prioritized' },
        { label: 'Owners', value: 'Mapped', delta: 'Per endpoint' },
      ] } },
    ],
  },
  'course-studio': {
    chapterTitle: 'Live authoring demo',
    chapterWhen: 'Try it',
    description:
      'Course builder flow — LLM syllabus, slide content, python-pptx render, per-slide TTS, and LMS export bundle (PPTX + audio + instructor guide).',
    windowUrl: 'studio.courses.local',
    tabs: [
      { slug: 'outline', label: 'Outline', panel: { kind: 'list', items: [
        { title: 'Module 1 — Foundations', meta: '4 lessons', tag: 'Approved' },
        { title: 'Module 2 — Practice', meta: '6 lessons', tag: 'Draft' },
      ] } },
      { slug: 'slides', label: 'Slides', panel: { kind: 'list', items: [
        { title: 'lesson-01.pptx', meta: 'Speaker notes included', tag: 'Rendered' },
        { title: 'lesson-02.pptx', meta: 'Branded template', tag: 'Queued' },
      ] } },
      { slug: 'audio', label: 'Narration', panel: { kind: 'pipeline', steps: [
        { label: 'TTS per slide', detail: 'MP3/WAV', status: 'active' },
        { label: 'Instructor guide', detail: 'Markdown', status: 'pending' },
      ] } },
      { slug: 'export', label: 'Export', panel: { kind: 'list', items: [
        { title: 'lms-bundle.zip', meta: 'PPTX + audio + guide', tag: 'Ready' },
      ] } },
    ],
  },
  'data-lineage': {
    chapterTitle: 'Live lineage demo',
    chapterWhen: 'Try it',
    description:
      'Lineage platform — connectors for Airflow, Snowflake, Oracle, BigQuery, and repo SQL; parser → access check → Neo4j graph for column-level impact analysis.',
    windowUrl: 'lineage.local/graph',
    tabs: [
      { slug: 'sources', label: 'Sources', panel: { kind: 'list', items: [
        { title: 'Snowflake', meta: 'Query history', tag: 'Connected' },
        { title: 'Airflow DAGs', meta: 'Task SQL', tag: 'Connected' },
        { title: 'repo/*.sql', meta: 'Git scan', tag: 'Connected' },
      ] } },
      { slug: 'parse', label: 'SQL Parse', panel: { kind: 'pipeline', steps: [
        { label: 'SQLGlot', detail: 'Column mappings', status: 'done' },
        { label: 'Access verify', detail: 'Governance gate', status: 'active' },
        { label: 'Normalize ids', detail: 'Canonical schema', status: 'pending' },
      ] } },
      { slug: 'graph', label: 'Graph', panel: { kind: 'list', items: [
        { title: 'raw.orders → stg.orders', meta: 'Transform edge', tag: 'Neo4j' },
        { title: 'stg.orders → mart.revenue', meta: 'Downstream', tag: 'Impact' },
      ] } },
      { slug: 'impact', label: 'Impact', panel: { kind: 'chat', messages: [
        { from: 'user', text: 'If mart.revenue.customer_id changes?', time: '—' },
        { from: 'ai', text: '3 dashboards · 2 DAG tasks · 1 export job affected', time: '—' },
      ] } },
    ],
  },
  getzoned: {
    chapterTitle: 'Live map demo',
    chapterWhen: 'Try it',
    description:
      'Hyper-local discovery — ~300m map, micro-events, verified hosts, and early-access flows on getzoned.in (mirrors the advisory product surface).',
    windowUrl: 'getzoned.in',
    tabs: [
      { slug: 'map', label: 'Map', panel: { kind: 'list', items: [
        { title: 'Coffee meetup — 120m', meta: 'Tonight · 8 going', tag: 'Event' },
        { title: 'Run club — 80m', meta: 'Sat 6 AM', tag: 'Event' },
      ] } },
      { slug: 'events', label: 'Events', panel: { kind: 'kpis', items: [
        { label: 'Radius', value: '~300m', delta: 'Hyper-local' },
        { label: 'Status', value: 'Live', delta: 'India rollout' },
      ] } },
      { slug: 'community', label: 'Community', panel: { kind: 'list', items: [
        { title: 'Verified host', meta: 'Nagesh · Co-founder', tag: 'Trust' },
      ] } },
    ],
  },
}

export function getProjectDemo(projectId: string): ProjectDemoConfig | undefined {
  return DEMO_BY_PROJECT[projectId]
}

export const DEMO_CHAPTER_TITLES = new Set(
  Object.values(DEMO_BY_PROJECT).map((d) => d.chapterTitle),
)
