import type { ProjectStory } from '@/lib/project-story'
import { GETZONED_STORY } from '@/lib/stories/getzoned'

export type AdvisoryLink = {
  label: string
  href: string
}

export type AdvisoryMetric = {
  label: string
  value: string
}

export type AdvisoryStatus = 'Live' | 'Production' | 'Building' | 'Research' | 'Open source'

export type AdvisoryVenture = {
  id: string
  title: string
  tagline: string
  role: string
  period: string
  status: AdvisoryStatus
  description: string
  highlights: string[]
  stack: string[]
  links?: AdvisoryLink[]
  cover?: string
  metrics?: AdvisoryMetric[]
  story?: ProjectStory
}

/** Co-founder / venture work — not listed under client Projects */
export const ADVISORY_VENTURES: AdvisoryVenture[] = [
  {
    id: 'getzoned',
    title: 'GetZoned',
    tagline: 'Co-founded · funded · live — 300m map for real people and micro-events',
    role: 'Co-founder & CTO',
    period: '2024 — Present',
    status: 'Live',
    cover: '/projects/getzoned/getzoned2.png',
    description:
      'Entertainment app that gets people off feeds and into real life. Hyper-local map, micro-events, verified community — funded and scaling across Indian cities.',
    highlights: [
      'Co-founded with Nagesh Naik — from January meetup to getzoned.in',
      'Own full stack: app, backend, AI personalization, matching',
      'Funded · live product · city-by-city rollout',
    ],
    stack: ['Next.js', 'Product', 'Community', 'AI personalization', 'Mobile'],
    links: [
      { label: 'getzoned.in', href: 'https://getzoned.in' },
      { label: 'View story', href: '/projects/getzoned' },
    ],
    metrics: [
      { label: 'Radius', value: '~300m' },
      { label: 'Status', value: 'Live' },
      { label: 'Role', value: 'CTO' },
    ],
    story: GETZONED_STORY,
  },
]

export function getAdvisoryById(id: string): AdvisoryVenture | undefined {
  return ADVISORY_VENTURES.find((v) => v.id === id)
}
