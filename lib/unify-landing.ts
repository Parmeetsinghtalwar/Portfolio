export const UNIFY_LIVE_URL = 'https://l1chatbot.apexneural.cloud/'

export const UNIFY_NAV = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Engineering', href: '#engineering' },
  { label: 'Integrations', href: '#integrations' },
  { label: 'FAQ', href: '#faq' },
] as const

export const UNIFY_PILLARS = [
  {
    title: 'Omni-channel by design',
    body: 'WhatsApp, Telegram, Instagram, email, website — every channel funnels into one inbox. Your conversations stay in one place.',
  },
  {
    title: 'Built for AI first',
    body: 'L1 AI responds instantly. Product questions, order tracking, FAQs. Confidence-scored, context-aware. Upgrade when you need human takeover.',
  },
  {
    title: 'One-click human takeover',
    body: 'Agents pick up exactly where AI left off. Full context, no repeated questions. Pause AI, add private notes, use canned responses.',
  },
] as const

export const UNIFY_STEPS = [
  {
    step: '01',
    title: 'Connect',
    body: 'Link your channels — WhatsApp, Telegram, Instagram, email, web.',
  },
  {
    step: '02',
    title: 'AI responds',
    body: 'L1 AI handles inquiries instantly with confidence scoring.',
  },
  {
    step: '03',
    title: 'Take over',
    body: 'Agents step in with full context when human touch is needed.',
  },
] as const

export type UnifyThread = {
  id: string
  name: string
  initial: string
  time: string
  preview: string
  channel: string
  ai: boolean
  messages: { from: 'user' | 'ai' | 'system'; text: string; time: string }[]
}

export const UNIFY_THREADS: UnifyThread[] = [
  {
    id: 'sarah',
    name: 'Sarah K.',
    initial: 'S',
    time: '2m',
    preview: 'Hi, I need help with order #4821',
    channel: 'WhatsApp',
    ai: true,
    messages: [
      { from: 'user', text: 'Hi, I need help with order #4821', time: '10:32' },
      {
        from: 'ai',
        text: 'Looking up your order now. Order #4821 shipped via DHL yesterday. Tracking: DHL-9284731',
        time: '10:32',
      },
      { from: 'user', text: 'Can I change the delivery address?', time: '10:33' },
      {
        from: 'ai',
        text: 'Address changes require agent approval. Let me connect you with a team member.',
        time: '10:33',
      },
    ],
  },
  {
    id: 'mike',
    name: 'Mike L.',
    initial: 'M',
    time: '8m',
    preview: 'Can I change my plan?',
    channel: 'Telegram',
    ai: true,
    messages: [
      { from: 'user', text: 'Can I change my plan?', time: '10:24' },
      {
        from: 'ai',
        text: 'You are on Pro monthly. I can queue an upgrade to Premium — confirm to proceed.',
        time: '10:24',
      },
    ],
  },
  {
    id: 'priya',
    name: 'Priya D.',
    initial: 'P',
    time: '15m',
    preview: 'Thanks for the quick response!',
    channel: 'Instagram',
    ai: false,
    messages: [
      { from: 'user', text: 'Thanks for the quick response!', time: '10:17' },
      { from: 'system', text: 'Conversation resolved · CSAT 5/5', time: '10:18' },
    ],
  },
  {
    id: 'jordan',
    name: 'Jordan',
    initial: 'J',
    time: '1h',
    preview: 'Is the widget customizable?',
    channel: 'Web chat',
    ai: true,
    messages: [
      { from: 'user', text: 'Is the widget customizable?', time: '09:40' },
      {
        from: 'ai',
        text: 'Yes — theme color, copy, position, and identity validation are all configurable in Settings.',
        time: '09:40',
      },
    ],
  },
  {
    id: 'arjun',
    name: 'Arjun S.',
    initial: 'A',
    time: '2h',
    preview: 'Payment failed on checkout',
    channel: 'Email',
    ai: false,
    messages: [
      { from: 'user', text: 'Payment failed on checkout', time: '08:55' },
      { from: 'system', text: 'Assigned to agent · AI paused', time: '08:56' },
    ],
  },
]

export const UNIFY_DASHBOARD_TABS = [
  'Unified Inbox',
  'AI Conversations',
  'Human Takeover',
  'Analytics',
  'Automation',
  'Settings',
] as const

export const UNIFY_CHANNELS = [
  'Telegram',
  'Messenger',
  'WhatsApp',
  'Email',
  'Instagram',
  'Slack',
  'Website',
] as const

export const UNIFY_STATS = [
  { label: 'Instant resolution', value: '< 3s', sub: 'avg response' },
  { label: 'One source of truth', value: '100%', sub: 'context kept' },
  { label: 'Track performance', value: 'Real-time', sub: 'analytics' },
] as const

export const UNIFY_FAQ = [
  {
    q: 'What is Unify and how is it different?',
    a: 'Unify is an omni-channel L1 support platform: AI handles the first layer on every channel, humans take over with full context in one inbox.',
  },
  {
    q: 'Who is Unify designed for?',
    a: 'Support and operations teams that run WhatsApp, social, email, and web chat — especially brands that need multilingual AI plus agent escalation.',
  },
  {
    q: 'How does human takeover work?',
    a: 'Agents click once to pause AI, inherit the full thread history, and reply from the same workspace — no re-asking the customer.',
  },
  {
    q: 'What about privacy and data?',
    a: 'Encrypted in transit and at rest, org-level RBAC, and tenant isolation for multi-brand workspaces.',
  },
  {
    q: 'Which channels are supported?',
    a: 'WhatsApp, Telegram, Instagram, email, SMS, embedded web widget, plus REST API, WebSocket, and webhooks.',
  },
] as const
