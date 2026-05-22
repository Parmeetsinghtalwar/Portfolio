import type { ProjectStory } from '@/lib/project-story'

export const FOOTBALL_ANALYTICS_STORY: ProjectStory = {
  headline: 'Football Intelligence',
  subtitle:
    'Unleash the power of AI in football — trust, development, injury risk, valuation, and performance',
  lede:
    'Football Analytics is an AI platform for professional clubs: maximize player development, predict value growth, prevent injuries, and give medical, performance, and coaching staff one shared view of squad health, availability, and results.',
  byline: 'Parmeet Singh Talwar · Builder · AI for sport',
  social: [
    { label: 'Product site', href: 'https://championsgen.framer.website/' },
  ],
  blocks: [
    {
      type: 'chapter',
      title: 'The problem',
    },
    {
      type: 'prose',
      paragraphs: [
        'Injuries cost an estimated €750M+ per year across Europe’s top five leagues. For a single mid- or top-tier club, direct and indirect injury costs can reach tens of millions per season — and a serious injury can slash a player’s market value by 20–50%.',
        'Transfers are equally brittle: 45–55% fail to deliver expected value, often because hype, short-term stats, and poor league or tactical fit replace structured projection.',
        'Match stats show what happened, not why performance drifts — and departments still work from separate dashboards instead of one explainable signal.',
      ],
    },
    {
      type: 'quote',
      text: 'We used artificial intelligence to maximize player development, predict their value growth, and help prevent injuries.',
      attribution: 'championsgen.framer.website',
    },
    {
      type: 'chapter',
      title: 'Four intelligence modules',
      when: 'Platform',
    },
    {
      type: 'prose',
      paragraphs: [
        'Injury risk management — predict and manage injury risk before breakdown. Multi-signal intelligence anticipates risk early; load and decisions adjust when risk rises, not after treatment starts. Targets line-up stability, fewer forced tactical changes, and more points from availability.',
        'Player valuation projection — AI-powered forecasts for how market value evolves over 2–5 seasons, built on real career trajectories (not hype). Supports buy, hold, and sell timing with league intensity and team style-of-play fit.',
        'Performance tracking — detect early performance deviation, optimize load inside each player’s tolerance window, align training to match drivers, and integrate performance with injury intelligence so output and availability move together.',
        'Team management — align medical, performance, athletic, and coaching staff on one shared view: protect availability, sustain match output, optimize workload, and turn individual intelligence into collective results.',
      ],
    },
    {
      type: 'chapter',
      title: 'Injury risk — what changes',
      when: 'Impact',
    },
    {
      type: 'prose',
      paragraphs: [
        'Sporting: key players stay available; execution stays consistent in decisive moments.',
        'Asset protection: reduce injury-driven value drops and protect long-term squad investments.',
        'Operational: reactive “treat after injury” becomes proactive thresholds, real-time workload tweaks, and season-long monitoring.',
        'Decision-making: one explainable risk indicator per player — actionable recommendations, not raw data silos.',
        'Strategic: better handling of congested fixtures, return-to-play, and long-term squad durability.',
      ],
    },
    {
      type: 'chapter',
      title: 'Valuation — controlled investments',
      when: 'Transfers',
    },
    {
      type: 'prose',
      paragraphs: [
        'De-risk transfers by separating peak performance, sustainable performance, and future value.',
        'Surface overvalued profiles with limited growth or poor league fit; find undervalued young talents and late bloomers before the market reprices them.',
        'Embed tactical and championship context so valuation is not universal — it is specific to how and where a player plays.',
        'Turn recruitment from market speculation into strategic foresight with clearer capital efficiency per squad slot.',
      ],
    },
    {
      type: 'chapter',
      title: 'Performance — from monitoring to control',
      when: 'Match day',
    },
    {
      type: 'prose',
      paragraphs: [
        'Performance consistency: fewer unexplained form drops; output held closer to each player’s optimal band through congested periods.',
        'Coaching intelligence: single readiness indicators, weekly priority focus areas, faster aligned decisions.',
        'Training-to-match: stronger carry-over from preparation to competition; less “good training, poor match” disconnect.',
        'Integrated risk + performance: gains inside safe physiological limits so health and availability do not trade off against output.',
      ],
    },
    {
      type: 'chapter',
      title: 'Team & squad outcomes',
    },
    {
      type: 'prose',
      paragraphs: [
        'Sustained performance optimization — talent only wins seasons when availability and execution hold; fatigue and decline are caught early.',
        'Squad fit intelligence — build for game model and league demands, not trend chasing; reduce system-mismatch signings.',
        'Sporting–financial alignment — stable valuations through visibility and performance; sporting success reinforces financial stability.',
        'Tagline on the product site: build the right team, keep players fit, perform consistently, create long-term value.',
      ],
    },
    {
      type: 'chapter',
      title: 'Status',
    },
    {
      type: 'prose',
      paragraphs: [
        'The public Framer site (championsgen.framer.website) is live with demo and contact flows; core modules are rolling out as an integrated platform — injury, valuation, performance, and team intelligence — rather than disconnected point tools.',
      ],
    },
    { type: 'divider' },
    {
      type: 'prose',
      paragraphs: [
        'Football Analytics is how I frame the work for clubs: control performance, protect value, win sustainably — with AI that staff can act on before breakdown or mis-spend happens.',
      ],
    },
  ],
  closing:
    'Product: championsgen.framer.website · Modules: injury · valuation · performance · team',
}
