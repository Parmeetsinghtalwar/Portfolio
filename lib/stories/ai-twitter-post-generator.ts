import type { ProjectStory } from '@/lib/project-story'

export const TWITTER_ENGAGEMENT_STORY: ProjectStory = {
  headline: 'Twitter Engagement',
  subtitle:
    'Daily X automation — live AI news feeds, drafted posts, visuals, and publish to reach a wider audience',
  lede:
    'I was given a clear job: show up on X every day with something worth reading — not random hot takes, but timely AI news packaged for a consistent persona. I built an automation that pulls live stories from major tech feeds, drafts tweets with Claude, generates Fal Flux images, runs human approval when needed, and publishes through the X API so the account keeps a daily rhythm without starting from a blank compose box.',
  byline: 'Parmeet Singh Talwar · Builder',
  social: [],
  blocks: [
    {
      type: 'chapter',
      title: 'The task',
    },
    {
      type: 'prose',
      paragraphs: [
        'The goal was engagement at scale: post on Twitter/X daily, stay relevant to what the AI world was actually talking about today, and build reach over time instead of posting once and going quiet.',
        'Manual workflow meant opening five news sites, rewriting headlines, hunting for an image, and hoping you still felt like posting at 11pm. That does not survive a daily cadence.',
      ],
    },
    {
      type: 'quote',
      text: 'Consistency beats virality when you are trying to reach masses — one reliable post every day beats ten posts in a week and silence after.',
      attribution: 'Why I automated the pipeline',
    },
    {
      type: 'chapter',
      title: 'Daily automation loop',
      when: 'How it runs',
    },
    {
      type: 'prose',
      paragraphs: [
        'The pipeline is built as a repeatable daily loop: fetch fresh stories from live RSS and scrape targets (Hacker News, TechCrunch, MIT TR, OpenAI blog, and similar), dedupe what was already covered, send the best candidates through Claude with a fixed persona in `persona.json`, attach a Fal Flux image for scroll-stopping feeds, then approve and publish via Tweepy.',
        'FastAPI ties it together — `/api/research` for ingestion, generate endpoints for drafts, approve/reject on a simple static UI, `/api/twitter/post` when a tweet is ready to go live. The same run can be triggered on a schedule (cron or manual fire) so “post today” is one command, not a research project.',
      ],
    },
    {
      type: 'chapter',
      title: 'Reaching more people',
    },
    {
      type: 'prose',
      paragraphs: [
        'News-backed posts perform better than generic motivation content in tech: people share what they just learned from a launch, paper, or funding round. Pairing text + image + a recognizable voice makes the account feel like a daily briefing, not a bot spamming links.',
        'Human approval stays in the loop for quality control — automation handles volume and timing; you still reject a weak draft before it hits the timeline. That balance is what makes daily posting sustainable while aiming for broader reach on X.',
      ],
    },
  ],
  closing:
    'FastAPI · live news feeds · Claude · Fal Flux · Tweepy · daily X publishing',
}
