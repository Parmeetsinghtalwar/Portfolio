import type { Metadata } from 'next'
import { UnifyLanding } from '@/components/unify/UnifyLanding'
import { UNIFY_LIVE_URL } from '@/lib/unify-landing'

export const metadata: Metadata = {
  title: 'Omni L1 Platform · Omni-channel L1 Support',
  description:
    'Multi-tenant omni-channel L1 — NestJS platform + FastAPI agent. Architecture, stack, and what I built.',
  openGraph: {
    title: 'Omni L1 Platform · Omni-channel L1 Support',
    description:
      'Every conversation. One system. Engineering deep-dive: multi-tenant RLS, BullMQ, L1 agent pipeline.',
    url: UNIFY_LIVE_URL,
  },
}

export default function UnifyProjectPage() {
  return <UnifyLanding />
}
