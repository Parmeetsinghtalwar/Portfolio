import type { LayeredItem } from '@/components/sections/LayeredVideoScroll'

const IMG_CAR_FILES = [
  'IMG_4514.MOV',
  'IMG_5267.MOV',
  'IMG_7088.MOV',
  'IMG_7142.MOV',
  'IMG_7401.MOV',
  'IMG_7408.MOV',
  'IMG_7838.MOV',
] as const

const LOCAL_SRC: Record<(typeof IMG_CAR_FILES)[number], string> = {
  'IMG_4514.MOV': '/img-car/IMG_4514.MOV',
  'IMG_5267.MOV': '/img-car/IMG_5267.MOV',
  'IMG_7088.MOV': '/img-car/IMG_7088.MOV',
  'IMG_7142.MOV': '/img-car/IMG_7142.MOV',
  'IMG_7401.MOV': '/img-car/IMG_7401.MOV',
  'IMG_7408.MOV': '/img-car/IMG_7408.MOV',
  'IMG_7838.MOV': '/img-car/IMG_7838.MOV',
}

const CLOUDINARY_SRC: Partial<Record<(typeof IMG_CAR_FILES)[number], string>> = {}

/** Life + tech editorial copy per frame (dasupply-style corners) */
const EDITORIAL: LayeredItem['editorial'][] = [
  {
    tag: '01',
    topLeft: ['STACK', 'BACKEND CORE'],
    bottomLeft: [
      'PYTHON · TYPESCRIPT',
      'FASTAPI · NESTJS',
      'POSTGRES · REDIS',
    ],
    rightBlock: [
      'REST APIS · WEBSOCKETS',
      'JWT · RBAC',
      'QUEUE-FIRST FLOWS',
    ],
    footnote: 'TECH STACK — BACKEND',
  },
  {
    tag: '02',
    topLeft: ['STACK', 'LLM SYSTEMS'],
    bottomLeft: [
      'LANGGRAPH · AGENTS',
      'RAG · VECTOR SEARCH',
      'PROMPT OPS · EVALS',
    ],
    rightBlock: [
      'OPENAI · ANTHROPIC',
      'TOOL CALLING',
      'MEMORY PATTERNS',
    ],
    footnote: 'TECH STACK — AI',
  },
  {
    tag: '03',
    topLeft: ['STACK', 'FRONTEND'],
    bottomLeft: [
      'NEXT.JS · REACT',
      'TYPESCRIPT · TAILWIND',
      'APP ROUTER · SSR',
    ],
    rightBlock: [
      'FRAMER MOTION · GSAP',
      'R3F · THREE.JS',
      'PERF-FIRST UI',
    ],
    footnote: 'TECH STACK — WEB',
  },
  {
    tag: '04',
    topLeft: ['STACK', 'AUTOMATION'],
    bottomLeft: [
      'N8N · MAKE · ZAPIER',
      'WORKFLOWS · WEBHOOKS',
      'EVENT-DRIVEN TASKS',
    ],
    rightBlock: [
      'CRON · RETRIES',
      'QUEUE ORCHESTRATION',
      'OPS PLAYBOOKS',
    ],
    footnote: 'TECH STACK — AUTOMATION',
  },
  {
    tag: '05',
    topLeft: ['STACK', 'DATA LAYER'],
    bottomLeft: [
      'POSTGRES · SQLITE',
      'REDIS CACHE',
      'S3-STYLE STORAGE',
    ],
    rightBlock: [
      'PANDAS · NUMPY',
      'ETL · VALIDATION',
      'METRICS + LOGS',
    ],
    footnote: 'TECH STACK — DATA',
  },
  {
    tag: '06',
    topLeft: ['STACK', 'DEVOPS'],
    bottomLeft: [
      'DOCKER · CI/CD',
      'GITHUB ACTIONS',
      'ENV-FIRST CONFIG',
    ],
    rightBlock: [
      'NGINX · DEPLOYMENTS',
      'HEALTH CHECKS',
      'ROLLBACK STRATEGY',
    ],
    footnote: 'TECH STACK — SHIP',
  },
  {
    tag: '07',
    topLeft: ['STACK', 'TOOLKIT'],
    bottomLeft: [
      'NODE · BUN · PNPM',
      'PYTEST · PLAYWRIGHT',
      'ZOD · Pydantic',
    ],
    rightBlock: [
      'MCP SERVERS',
      'OBSERVABILITY',
      'SYSTEMS THINKING',
    ],
    footnote: 'TECH STACK — END TO END',
  },
]

export const IMG_CAR_CAROUSEL_ITEMS: LayeredItem[] = IMG_CAR_FILES.map(
  (file, index) => ({
    type: 'video' as const,
    src: CLOUDINARY_SRC[file] ?? LOCAL_SRC[file],
    caption: `Frame ${String(index + 1).padStart(2, '0')}`,
    series: 'About · 01',
    editorial: EDITORIAL[index],
  }),
)

export const ABOUT_CAROUSEL_ITEMS = IMG_CAR_CAROUSEL_ITEMS
