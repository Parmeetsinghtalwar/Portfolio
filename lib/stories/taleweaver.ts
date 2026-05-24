import type { ProjectStory } from '@/lib/project-story'

export const TALEWEAVER_STORY: ProjectStory = {
  headline: 'AI Book Studio',
  subtitle: 'One tweet about finishing a novel — then Bookgen, EPUB fine-tuning, and 10K+ books',
  lede:
    'Taleweaver is the product name I use for what ships as Bookgen: AI story infrastructure for authors who need speed without sounding like a machine wrote their chapter.',
  byline: 'Parmeet Singh Talwar · Builder · GenOps',
  social: [{ label: 'Portfolio experience', href: '/projects/taleweaver' }],
  blocks: [
    {
      type: 'chapter',
      title: 'It started as a tweet',
    },
    {
      type: 'prose',
      paragraphs: [
        'The whole thing began with a throwaway line — something like: why does finishing a book still take a year when we have models that can draft in minutes? I posted it, went to sleep, and woke up to a thread that would not stop.',
        'Authors, ghostwriters, and indie publishers filled the DMs. Not “build me ChatGPT” — they wanted EPUBs that sounded like them, series consistency, export that Apple and Amazon would not reject, and prose that did not trip the obvious AI tells. A simple tweet became a research queue.',
      ],
    },
    {
      type: 'quote',
      text: 'The idea was never “replace the writer.” It was: get to a manuscript worth editing, in the author’s voice, this week.',
      attribution: 'How I frame Taleweaver',
    },
    {
      type: 'chapter',
      title: 'What we built',
      when: 'Bookgen',
    },
    {
      type: 'prose',
      paragraphs: [
        'Bookgen is the live surface: outline → chapter generation → EPUB/PDF export. Under Taleweaver, the part I care about is author EPUB fine-tuning — ingest a sample or prior book, lock style embeddings and prompt constraints, generate new material that matches cadence and vocabulary.',
        'We stress voice-locked outputs: human-readable rhythm, varied sentence length, genre-appropriate cliché avoidance — tuned so readers stay in the story instead of hunting for “AI smell.” That is the bar authors asked for in the first viral week.',
        '50+ genres, multi-language, commercial tiers — the SaaS wrapper is standard. The engineering depth is in the fine-tuning loop and export pipeline, not another blank textarea.',
      ],
    },
    {
      type: 'chapter',
      title: 'From reach to product',
    },
    {
      type: 'prose',
      paragraphs: [
        'Reach mattered because it validated the pain quickly — 10K+ books on the counter now, but the early signal was social: one tweet, then newsletters, then authors asking for API access. We shipped fast because the spec came from real inboxes, not a deck.',
        'I still treat Taleweaver as a GenOps problem: data in (author EPUB, bible, genre), model stages (outline, chapter, polish), artifact out (valid EPUB). Same discipline as pipelines I run elsewhere — just the output is a novel instead of a LinkedIn post.',
      ],
    },
    { type: 'divider' },
    {
      type: 'prose',
      paragraphs: [
        'If you are evaluating whether I can ship AI products people actually use: Taleweaver is the one that started as a sentence on Twitter and became a platform authors pay for. The demo is the site — the story is the tweet.',
      ],
    },
  ],
  closing: 'Bookgen · Taleweaver · author EPUB fine-tuning · EPUB/PDF export',
}
