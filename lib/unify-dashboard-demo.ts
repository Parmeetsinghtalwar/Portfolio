import { UNIFY_THREADS, type UnifyThread } from '@/lib/unify-landing'

export const UNIFY_TAB_SLUGS = [
  'inbox',
  'ai',
  'takeover',
  'analytics',
  'automation',
  'settings',
] as const

export type UnifyTabSlug = (typeof UNIFY_TAB_SLUGS)[number]

export const UNIFY_TAB_LABELS = [
  'Unified Inbox',
  'AI Conversations',
  'Human Takeover',
  'Analytics',
  'Automation',
  'Settings',
] as const

export function tabUrl(slug: UnifyTabSlug): string {
  const paths: Record<UnifyTabSlug, string> = {
    inbox: 'app.unify.io/inbox',
    ai: 'app.unify.io/ai',
    takeover: 'app.unify.io/takeover',
    analytics: 'app.unify.io/reports',
    automation: 'app.unify.io/automation',
    settings: 'app.unify.io/settings',
  }
  return paths[slug]
}

export const UNIFY_INBOX_THREADS = UNIFY_THREADS

export const UNIFY_AI_MESSAGES = [
  { from: 'user' as const, text: 'What products do you have for curly hair?', time: '11:00' },
  {
    from: 'ai' as const,
    text: 'We have 3 products perfect for curly hair: CurlDefine Cream ($24), Moisture Lock Spray ($18), and Deep Repair Mask ($32). Would you like details on any of these?',
    time: '11:00',
  },
  { from: 'user' as const, text: 'Tell me about the cream', time: '11:01' },
  {
    from: 'ai' as const,
    text: 'CurlDefine Cream — lightweight hold, reduces frizz, enhances natural curl pattern. 200ml. Ingredients: Shea butter, coconut oil, argan extract.',
    time: '11:01',
  },
]

export const UNIFY_TAKEOVER_MESSAGES = [
  { from: 'user' as const, text: 'I want to upgrade my plan', time: '14:20' },
  {
    from: 'ai' as const,
    text: 'I can help! We have Pro ($49/mo) and Enterprise ($149/mo). Which interests you?',
    time: '14:20',
  },
  { from: 'user' as const, text: 'I need custom pricing for 500+ agents', time: '14:21' },
]

export const UNIFY_ANALYTICS_KPIS = [
  { label: 'Conversations', value: '1,284', delta: '+12%', up: true, border: 'border-l-blue-500' },
  { label: 'Messages', value: '8,491', delta: '+8%', up: true, border: 'border-l-emerald-500' },
  { label: 'Avg / Convo', value: '6.6', delta: '-3%', up: false, border: 'border-l-amber-500' },
  { label: 'Takeovers', value: '89', delta: '-18%', up: false, border: 'border-l-[#5c1f2e]' },
] as const

export const UNIFY_VOLUME_BARS = [42, 55, 48, 62, 58, 70, 65, 72, 68, 80, 75, 88] as const

export const UNIFY_SENDER_BARS = [
  { label: 'Customer', pct: 92, color: 'bg-emerald-500' },
  { label: 'AI', pct: 58, color: 'bg-blue-500' },
  { label: 'Human', pct: 22, color: 'bg-[#5c1f2e]' },
] as const

export const UNIFY_AUTOMATION_RULES = [
  {
    title: 'Auto-assign to AI',
    when: 'When: New conversation → Assign to L1 Bot',
    active: true,
  },
  {
    title: 'Escalate on keyword',
    when: "When: Message contains 'urgent' → Escalate to human",
    active: true,
  },
  {
    title: 'Close stale convos',
    when: 'When: Inactive > 24h → Resolve conversation',
    active: false,
  },
  {
    title: 'VIP routing',
    when: 'When: Contact label = VIP → Assign to senior agent',
    active: true,
  },
] as const

export const UNIFY_INBOX_INTEGRATIONS = [
  { name: 'Telegram', letter: 'T', color: 'bg-sky-500', on: true },
  { name: 'WhatsApp', letter: 'W', color: 'bg-emerald-500', on: true },
  { name: 'Instagram', letter: 'I', color: 'bg-pink-500', on: false },
  { name: 'Website', letter: 'W', color: 'bg-slate-900', on: true },
] as const

export const UNIFY_SETTINGS_NAV = [
  'Profile',
  'Inboxes',
  'Bots & AI',
  'Agents',
  'Teams',
  'Canned Resp.',
  'Labels',
  'Integrations',
] as const

export type { UnifyThread }
