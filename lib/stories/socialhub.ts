import type { ProjectStory } from '@/lib/project-story'

export const SOCIALHUB_STORY: ProjectStory = {
  headline: 'Multi-Channel GenOps',
  subtitle:
    'GenOps for social — one idea in, campaigns out, without hiring an agency',
  lede:
    'SocialHub is the content factory I helped shape: AI agents and workflows that generate posts, images, and schedules across every major channel — with OAuth so your passwords never touch our servers.',
  byline: 'Parmeet Singh Talwar · Builder · GenOps / AI systems',
  social: [],
  blocks: [
    {
      type: 'chapter',
      title: 'Why this exists',
    },
    {
      type: 'prose',
      paragraphs: [
        'Most teams do not need another dashboard. They need a factory: one brief, many platforms, consistent brand voice, and posts that actually ship on time. Agencies are slow and expensive; DIY tools still leave you copying captions by hand at midnight.',
        'SocialHub sits in the middle — “social media management, using AI.” Not a single trick feature, but a full GenOps loop: generate, review, schedule, publish, and measure, with humans still in control when it matters.',
      ],
    },
    {
      type: 'quote',
      text: 'Don’t hire a social media agency. Content creation and engagement with AI agents and workflows.',
      attribution: 'SocialHub',
    },
    {
      type: 'chapter',
      title: 'What you get on the surface',
      when: 'Product',
    },
    {
      type: 'prose',
      paragraphs: [
        'The live app is built around three promises you see the moment you land: an AI dashboard for real-time analytics, Creative AI for automated content, and Social Growth for network expansion — all in one place instead of five tabs and a spreadsheet.',
        'Under that sits an AI Content Studio (viral posts in seconds), Smart Analytics, a drag-and-drop Visual Planner, and Audience Insights so you know who you are actually reaching. The numbers on the site — 500K+ posts generated, 12M+ assets managed, 99.9% uptime — are the scale story; the product story is how you get there without burning out.',
      ],
    },
    {
      type: 'chapter',
      title: 'Secure by design',
    },
    {
      type: 'prose',
      paragraphs: [
        'The part I care about most architecturally: direct OAuth on every platform connection. That is the most secure pattern we could ship — we never store your social passwords. Permissions are scoped to what publishing actually needs: post image and caption, nothing more.',
        'Brand teams are right to be tense about access. SocialHub’s positioning is explicit: your data, your privacy, no vague “full account access” scopes. Tokens flow through standard OAuth; sensitive material can be encrypted at rest where the stack requires it. You connect, you approve, we publish what you approved.',
      ],
    },
    {
      type: 'chapter',
      title: 'Generation stack',
    },
    {
      type: 'prose',
      paragraphs: [
        'Copy runs through modern LLMs — GPT-4o class models for captions, hashtags, and platform-specific tone. Images use a dual-provider setup: Fal.ai for speed on everyday posts, DALL-E 3 when you need premium fidelity. Document intelligence lets you upload PDFs so RAG can extract brand voice, product facts, and visual cues — the model stops guessing what your brand sounds like.',
        'The UGC Magic Editor line is real product surface, not marketing filler: background removal, filters, brand overlays — turn a user-submitted photo into an asset that still looks like your campaign. Multi-angle product shots, lifestyle placement from a plain packshot, model clothes swap — the “no photoshoot” pipeline ecommerce teams always wanted.',
        'Video workflow on the marketing site is script → persona → render: write or auto-generate a script, pick from hundreds of AI personas for consistent character, then generate branded video in minutes, with 50+ languages and lip-sync called out for localization without reshooting.',
      ],
    },
    {
      type: 'chapter',
      title: 'Plan once, post everywhere',
    },
    {
      type: 'prose',
      paragraphs: [
        'The Smart Content Calendar is the operational heart: plan a month, let AI suggest holidays and trending angles, queue optimal times, then let the background scheduler publish to Facebook, Instagram, Twitter (X), LinkedIn, and Reddit. Bulk queues and analytics tie back to the dashboard so you are not guessing whether Tuesday’s post landed.',
        'Brand-aligned business posts are a separate mode — LinkedIn and Twitter copy that respects tone sliders, industry vocabulary, and auto-hashtag rules. Lifestyle magic takes a white-background product shot and places it in scene without a studio day. Consistency view shows the organic calendar filling up so the feed does not go quiet when the team is busy.',
      ],
    },
    {
      type: 'chapter',
      title: 'How I fit in the build',
      when: 'Engineering',
    },
    {
      type: 'prose',
      paragraphs: [
        'SocialHub / Content Factory (content-phase1 on GitHub) is a full-stack GenOps system — FastAPI backend, Next.js front end, workflow automation, and integrations that matter on the ground: LLMs, RAG over brand docs, image providers, n8n-style scheduling hooks, and a Telegram bot so founders can generate, approve, or reschedule from their phone like a command center.',
        'My work sits in the AI layer and the connective tissue: prompt and context design, OAuth flows that stay minimal-scope, pipeline reliability, and making the “one idea → multi-platform campaign” path feel like one product instead of seven scripts. Telegram is not a gimmick — it is how a busy operator approves ten posts on the way to a meeting.',
        'Pricing on the live site tiers Starter ($19), Pro ($49, unlimited posts, persona agents, Telegram), and Enterprise (white-label, custom training, API) — the architecture has to earn that ladder: rate limits and account caps on Starter, orchestration depth on Pro, tenancy and API on Enterprise.',
      ],
    },
    {
      type: 'chapter',
      title: 'What it is not',
    },
    {
      type: 'prose',
      paragraphs: [
        'It is not a generic chatbot wearing a social media hat. It is not “post this one caption to LinkedIn” as a portfolio demo — that was a different experiment on my personal site. SocialHub is the production-grade content operating system: scheduled, multi-channel, brand-grounded, and meant to run for agencies and brands daily.',
        'If you are evaluating the stack: start at the live URL, click through login, and read the repo. The marketing site is the vision; the codebase is how the vision is wired.',
      ],
    },
    { type: 'divider' },
    {
      type: 'prose',
      paragraphs: [
        'SocialHub is the project I point to when someone asks whether I can ship AI that touches real business workflows — not just a model call, but OAuth, calendars, assets, approvals, and publish paths that still work on Monday morning.',
      ],
    },
  ],
  closing:
    'Multi-channel GenOps — scheduled, brand-grounded, production-grade',
}
