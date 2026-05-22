import type { ProjectStory } from '@/lib/project-story'

export const GETZONED_STORY: ProjectStory = {
  headline: 'GetZoned',
  subtitle: 'Entertainment app for real-world connection — funded, live, scaling',
  lede:
    'Co-founded GetZoned to pull people off infinite scroll and into verified micro-events within ~300m. I lead engineering and product as CTO — from the first January meetup to a funded app live at getzoned.in.',
  byline: 'Parmeet Singh Talwar · Co-founder & CTO',
  social: [
    { label: 'getzoned.in', href: 'https://getzoned.in' },
    { label: 'Live product', href: 'https://getzoned.in' },
  ],
  blocks: [
    {
      type: 'chapter',
      title: 'Why we built it',
    },
    {
      type: 'prose',
      paragraphs: [
        'Feeds are loud. Real connection is quiet and nearby. GetZoned is a hyper-local social map: discover micro-events, meet people in your radius, and build a verified community without performing for an algorithm.',
        'We started as a January meetup experiment with Nagesh Naik and turned it into a funded company — own the stack end to end: mobile experience, backend, matching, and AI personalization for who you should meet next.',
      ],
    },
    {
      type: 'quote',
      text: 'Connection is why we\u2019re here; it is what gives purpose and meaning to our lives.',
      attribution: 'GetZoned',
    },
    {
      type: 'chapter',
      title: 'What ships today',
      when: 'Product',
    },
    {
      type: 'prose',
      paragraphs: [
        'Live across Indian cities with city-by-city rollout. Users step out of the noise into curated real-world moments — events, people, and memories that do not disappear when the session ends.',
        'As CTO I own architecture, hiring for engineering, and the roadmap from MVP to scale: verification, safety, event discovery, and the growth loops that keep communities active offline.',
      ],
    },
    {
      type: 'chapter',
      title: 'Advisory, not client work',
    },
    {
      type: 'prose',
      paragraphs: [
        'GetZoned sits in the Advisory section of this portfolio — ventures I co-founded and run, separate from client builds under Selected work. The story here is founder mode: fundraising, product taste, and shipping under real market pressure.',
      ],
    },
  ],
  closing:
    'Funded · live · scaling. If you are building community or local discovery products, say hello — always open to operators and investors who care about real-world connection.',
}
