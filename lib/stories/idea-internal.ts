import type { ProjectStory } from '@/lib/project-story'

export const IDEA_INTERNAL_STORY: ProjectStory = {
  headline: 'DBaaS Social Hub',
  subtitle:
    'Content Phase — full-stack GenOps for multi-platform social: AI generation, calendar planning, persona agents, and OAuth publishing',
  lede:
    'The Samsung archive at `dbaas/social-hub/dbasssocialhub` is a production-scale social media AI manager: React + Vite frontend, FastAPI backend on the Apex SaaS framework, PostgreSQL with Alembic migrations, and Docker Compose for deploy. It generates platform-specific copy and images, plans monthly content calendars from business profiles, maintains character-consistent persona agents, runs a UGC “magic editor,” and publishes to Facebook, Instagram, X, LinkedIn, and Reddit — with a Telegram bot that mirrors the web dashboard.',
  byline: 'Parmeet Singh Talwar · Forward Deploy AI Engineer · DBaaS / ApexNeural',
  social: [
    { label: 'SocialHub live', href: 'https://socialhub.apexneural.cloud/' },
    { label: 'Backend API', href: 'https://ai-content.apexneural.cloud/' },
    {
      label: 'Case study',
      href: 'https://apexneural.com/case-studies/dbaas-platform',
    },
  ],
  blocks: [
    {
      type: 'chapter',
      title: 'Why this exists',
    },
    {
      type: 'prose',
      paragraphs: [
        'DBaaS (Digital Business as a Service) needed a flagship GenOps product: not a single “generate a tweet” demo, but an operator-grade system teams could run daily. Founders and marketers were still juggling Canva, spreadsheets, five platform logins, and ad-hoc ChatGPT tabs.',
        'Content Phase / DBaaS Social Hub compresses that into one monorepo: connect accounts once via OAuth, generate and refine content with GPT-4o and dual image providers (Fal.ai Nano Banana for speed, DALL·E 3 for quality), plan a month of posts from a business profile, and let a background scheduler publish on time.',
      ],
    },
    {
      type: 'quote',
      text: 'One codebase, five channels, and the same AI pipeline whether you use the web app or Telegram.',
      attribution: 'System architecture · dbasssocialhub',
    },
    {
      type: 'chapter',
      title: 'What ships in the repo',
      when: 'Product surface',
    },
    {
      type: 'prose',
      paragraphs: [
        'The React SPA includes a premium landing page (WebGL Liquid Ether background), generator for single posts, a Content Calendar “super controller” for monthly plans and bulk asset generation, UGC editor, persona Agents page, connections/OAuth management, scheduler views, and payment flows.',
        'The FastAPI layer exposes routes for AI content, content calendar, agents, UGC, scheduled posts, social posting, credentials, and health — wired to services for each social network plus PDF document intelligence that extracts brand visuals from uploaded business PDFs.',
        'A scheduler worker polls every 60 seconds, publishes due posts across selected platforms, and records per-platform success or failure. Telegram uses the same service layer directly for full feature parity on mobile.',
      ],
    },
    {
      type: 'chapter',
      title: 'How I built it',
      when: 'Engineering',
    },
    {
      type: 'prose',
      paragraphs: [
        'Backend: Python 3.10+, FastAPI, Apex bootstrap for auth and DB tables, SQLAlchemy + Alembic, APScheduler + asyncio worker, slowapi rate limits on expensive AI routes, and Fernet-encrypted OAuth tokens per platform profile.',
        'AI pipeline: strategy pattern across OpenAI (GPT-4o / GPT-4o-mini for copy, prompt enhancement, vision on PDF pages) and Fal.ai (Nano Banana, Flux Pro/Dev for persona agents with IP-Adapter, Gemini Flash for UGC edits). Prompt enhancer splits text vs diffusion prompts; caption context is injected back into image prompts for visual alignment.',
        'Frontend: React 19, Vite 7, Tailwind 4, Framer Motion, GSAP, Three.js — axios to the API with protected routes and auth context. Docker Compose runs PostgreSQL 15, backend on :8000, frontend on :3000 for local and production-style deploys.',
      ],
    },
    {
      type: 'chapter',
      title: 'Results',
    },
    {
      type: 'prose',
      paragraphs: [
        'Production URLs: frontend at socialhub.apexneural.cloud, API at ai-content.apexneural.cloud — configured in docker-compose and CORS allowlists.',
        'Documented system architecture in-repo (`SYSTEM_ARCHITECTURE.md`) with full API contracts, OAuth flows (including LinkedIn non-PKCE and Twitter hybrid v1.1/v2 media upload), and deployment guidance.',
        'Ecosystem on disk: same `dbaas/` tree also holds auth-login experiments, Facebook Graph helpers, and influencer ComfyUI workflows — Social Hub is the primary shipped application.',
      ],
    },
    { type: 'divider' },
    {
      type: 'prose',
      paragraphs: [
        'Source: `/Volumes/Samsung_T5/Storage/code/source code/dbaas/social-hub/dbasssocialhub` — the canonical DBaaS Social Hub / Content Phase codebase this portfolio page describes.',
      ],
    },
  ],
  closing:
    'Live: socialhub.apexneural.cloud · API: ai-content.apexneural.cloud · Stack: React · FastAPI · PostgreSQL · Docker · OpenAI · Fal.ai',
}
