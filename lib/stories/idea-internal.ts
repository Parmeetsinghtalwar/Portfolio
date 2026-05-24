import type { ProjectStory } from '@/lib/project-story'

export const IDEA_INTERNAL_STORY: ProjectStory = {
  headline: 'Content Phase',
  subtitle:
    'Full-stack GenOps for multi-platform social — AI generation, calendar planning, persona agents, and OAuth publishing',
  lede:
    'Content Phase is a production-scale social media AI manager: React + Vite frontend, FastAPI backend on the Apex SaaS framework, PostgreSQL with Alembic migrations, and Docker Compose for deploy. It generates platform-specific copy and images, plans monthly content calendars from business profiles, maintains character-consistent persona agents, runs a UGC “magic editor,” and publishes to Facebook, Instagram, X, LinkedIn, and Reddit — with a Telegram bot that mirrors the web dashboard.',
  byline: 'Parmeet Singh Talwar · Forward Deploy AI Engineer · ApexNeural',
  social: [],
  blocks: [
    {
      type: 'chapter',
      title: 'Why this exists',
    },
    {
      type: 'prose',
      paragraphs: [
        'Teams needed an operator-grade GenOps product — not a single “generate a tweet” demo, but something founders and marketers could run daily. They were still juggling Canva, spreadsheets, five platform logins, and ad-hoc ChatGPT tabs.',
        'Content Phase compresses that into one monorepo: connect accounts once via OAuth, generate and refine content with GPT-4o and dual image providers (Fal.ai Nano Banana for speed, DALL·E 3 for quality), plan a month of posts from a business profile, and let a background scheduler publish on time.',
      ],
    },
    {
      type: 'quote',
      text: 'One codebase, five channels, and the same AI pipeline whether you use the web app or Telegram.',
      attribution: 'System architecture · Content Phase',
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
        'Production deploy via Docker Compose — PostgreSQL, FastAPI API, and Vite SPA with documented CORS and OAuth configuration in-repo.',
        'Documented system architecture in-repo (`SYSTEM_ARCHITECTURE.md`) with full API contracts, OAuth flows (including LinkedIn non-PKCE and Twitter hybrid v1.1/v2 media upload), and deployment guidance.',
        'Same monorepo also holds auth-login experiments, Facebook Graph helpers, and influencer ComfyUI workflows — Content Phase is the primary shipped application.',
      ],
    },
  ],
  closing:
    'Stack: React · FastAPI · PostgreSQL · Docker · OpenAI · Fal.ai · Telegram',
}
