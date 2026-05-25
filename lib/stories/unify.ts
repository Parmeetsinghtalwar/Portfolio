import type { ProjectStory } from '@/lib/project-story'

export const UNIFY_STORY: ProjectStory = {
  headline: 'Unify',
  subtitle:
    'Omni-channel L1 — one inbox, AI-first, human when it matters',
  lede:
    'Production omni-channel support for brands on WhatsApp, Telegram, and Instagram: one inbox, multilingual L1 AI, catalog grounding, and human takeover with full thread context.',
  byline: 'Parmeet Singh Talwar · Full-stack builder',
  social: [],
  blocks: [
    {
      type: 'chapter',
      title: 'Why this exists',
    },
    {
      type: 'prose',
      paragraphs: [
        'Support teams were drowning in duplicated threads — the same order question on WhatsApp, Telegram, and email, with no shared context and no safe way to let AI answer first without breaking tenant isolation.',
        'Unify funnels every channel into one system: L1 AI handles product questions, order status, and FAQs with confidence scoring; agents take over in one click with the full transcript, private notes, and canned replies — always scoped to one brand tenant.',
      ],
    },
    {
      type: 'quote',
      text: 'Agents pick up exactly where AI left off. Full context, no repeated questions.',
      attribution: 'Unify · L1 + human handoff',
    },
    {
      type: 'chapter',
      title: 'Product flow',
      when: 'How it works',
    },
    {
      type: 'prose',
      paragraphs: [
        'Connect channels (WhatsApp, Telegram, Instagram, email, web chat) into a single omni-channel inbox.',
        'L1 AI responds instantly — multilingual EN, Telugu, and Hindi-Hinglish, image-based product recommendations, and escalation when confidence drops.',
        'Humans pause AI, add notes, and reply from the same dashboard; BullMQ workers and WebSockets keep delivery and live inbox state in sync.',
      ],
    },
    {
      type: 'chapter',
      title: 'What I built',
      when: 'Engineering',
    },
    {
      type: 'prose',
      paragraphs: [
        'Platform and agent are intentionally separate: tenancy, conversations, and channel delivery live in one service; NLU, tools, and model calls live in another so you can scale inference without rewiring every webhook. Multi-tenant isolation and the seven-step agent pipeline are spelled out under Technical.',
      ],
    },
  ],
  closing:
    'NestJS · FastAPI · PostgreSQL RLS · pgvector · BullMQ · omni-channel L1',
}
