export const UNIFY_TECH_STATS = [
  { value: 'Multi-tenant', label: 'PostgreSQL RLS', sub: 'per-org isolation' },
  { value: '2 services', label: 'NestJS + FastAPI', sub: 'platform + agent' },
  { value: '6+ channels', label: 'Omni-channel', sub: 'webhook ingress' },
  { value: '270+', label: 'Agent tests', sub: 'pytest unit + e2e' },
  { value: '29', label: 'RBAC permissions', sub: 'admin · supervisor · agent' },
  { value: 'BullMQ', label: 'Async messaging', sub: 'queue-backed delivery' },
] as const

export const UNIFY_ARCHITECTURE_LAYERS = [
  {
    title: 'Channels',
    detail:
      'WhatsApp, Telegram, Instagram, email, and embedded web chat hit channel webhooks on the NestJS API. Each inbound event is normalized into a tenant-scoped conversation thread.',
  },
  {
    title: 'Platform (kalamandir-l1)',
    detail:
      'NestJS 11 monorepo: conversation state machine, tickets, JWT auth, tenant middleware, BullMQ workers for outbound delivery, and a router gateway that calls the agent with full thread context.',
  },
  {
    title: 'L1 agent (kalamandir-agent)',
    detail:
      'FastAPI service on POST /api/v1/message: content guard → translation → context load → NLU / understanding → orchestrator (search, orders, payments, handoff signals) → channel-aware formatting.',
  },
  {
    title: 'Data plane',
    detail:
      'PostgreSQL 16 with row-level security (app.tenant_id), Redis for queues, optional pgvector for visual search embeddings, and per-tenant commerce connectors (Magento, catalog APIs) stored as tenant data providers.',
  },
] as const

export const UNIFY_MULTITENANT_POINTS = [
  {
    title: 'JWT-scoped tenants',
    body: 'Every access token carries tenantId, role, and a permission list. Superadmin bypasses tenant scope; brand admins and agents are pinned to one workspace.',
  },
  {
    title: 'PostgreSQL RLS',
    body: 'Requests set app.tenant_id via middleware and transaction-local SET LOCAL so pooled connections cannot leak rows across brands — hardened after a 2026 security audit on session-scoped GUCs.',
  },
  {
    title: 'Agent session isolation',
    body: 'Conversation state keys are composite session:{tenant_id}:{conversation_id} so the same conversation id on two brands never collides. Dedicated pytest coverage for tenant isolation in the context manager.',
  },
  {
    title: 'Per-tenant integrations',
    body: 'Bot tokens, commerce credentials, and visual-search providers are stored per tenant — not in shared env vars — so one deployment serves Kalamandir, sub-brands, and white-label workspaces.',
  },
] as const

export const UNIFY_CONTRIBUTIONS = [
  'Designed the split: NestJS owns conversations, RBAC, channels, and queues; FastAPI owns multilingual NLU, tool calls to commerce APIs, and L1 replies.',
  'Conversation lifecycle: AI-handled → escalate (human takeover) → resume AI, with ownership locks, ticket creation, audit logs, and BullMQ-safe idempotent handoffs.',
  'Built and extended the 7-step agent pipeline (translation, rule NLU, understanding, orchestrator dispatch) with tenant_id on every NestJS ↔ agent call.',
  'Multi-intent + multi-language paths (English, Hindi, Hinglish, Telugu, Tenglish) with channel-specific formatters for WhatsApp, web carousel, and Telegram media groups.',
  'Hardened tenant isolation on both sides: transaction-local RLS in ConversationsService and composite session keys in the agent context manager.',
  'Shipping surface: admin dashboard, agent inbox, analytics modules, and the live L1 product UI mirrored in the portfolio dashboard demo.',
] as const

export const UNIFY_STACK_GROUPS = [
  {
    group: 'Platform monorepo',
    items: [
      'NestJS 11 · TypeORM · PostgreSQL RLS',
      'Redis · BullMQ · JWT (Passport)',
      'Turborepo · React admin + web',
      'AWS ECS · RDS · ElastiCache (Terraform)',
    ],
  },
  {
    group: 'L1 agent service',
    items: [
      'FastAPI · Pydantic · structlog',
      'Anthropic / OpenRouter LLMs',
      'SQLite session store (deploy-safe)',
      'Two-stage search: SKU then vector similarity',
    ],
  },
  {
    group: 'Product capabilities',
    items: [
      'L1 AI with confidence + escalate_to_human',
      'Agent-assist + canned responses',
      'Tickets, SLA hooks, audit trail',
      'Embeddable web widget + REST webhooks',
    ],
  },
] as const

export const UNIFY_FLOW_STEPS = [
  {
    step: '01',
    title: 'Inbound message',
    body: 'Channel webhook → tenant resolved from bot secret or credential → message enqueued on BullMQ.',
  },
  {
    step: '02',
    title: 'Router calls agent',
    body: 'Platform loads thread history (tenant-pinned), POSTs to /api/v1/message with tenant_id + channel context.',
  },
  {
    step: '03',
    title: 'L1 reply or escalate',
    body: 'Agent returns reply + escalate_to_human flag. Platform either sends AI reply or opens ticket and assigns agent.',
  },
  {
    step: '04',
    title: 'Human takeover',
    body: 'Agent pauses AI, operator replies from unified inbox; resume AI clears assignment when the issue is resolved.',
  },
] as const
