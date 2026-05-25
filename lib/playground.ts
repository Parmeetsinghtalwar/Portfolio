import { homeSectionEyebrow } from '@/lib/home-sections'

export const PLAYGROUND_COPY = {
  eyebrow: homeSectionEyebrow('playground'),
  title: 'Playground',
  lede:
    'Hands-on automation experiments and reusable workflow templates — n8n, ComfyUI, Make, Zapier. Import JSON, wire credentials, iterate.',
  finderHint:
    'Open a folder like Finder — pick a workflow, download JSON at the bottom.',
} as const

export const PLAYGROUND_SKILLS = [
  'Automation templates',
  'ComfyUI',
  'n8n',
  'JSON exports',
  'Pipeline testing',
] as const
