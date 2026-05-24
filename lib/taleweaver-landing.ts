export const TALEWEAVER_STUDIO_SECTION_ID = 'studio'

export const TALEWEAVER_STATS = [
  { value: '10K+', label: 'Books created' },
  { value: '50+', label: 'Genres supported' },
  { value: '99%', label: 'Author satisfaction' },
  { value: '24/7', label: 'AI availability' },
] as const

export const TALEWEAVER_FEATURES = [
  {
    title: 'Smart outlines',
    body: 'AI builds chapter arcs from your title, genre, and themes — editable before a single paragraph ships.',
  },
  {
    title: 'Author EPUB fine-tuning',
    body: 'Bring your existing EPUB or style samples; the stack adapts diction, rhythm, and POV so new chapters match your catalog.',
  },
  {
    title: 'Voice-locked prose',
    body: 'Fine-tuned outputs aim for natural, human-readable flow — tuned to pass reader trust, not generic chatbot cadence.',
  },
  {
    title: 'Export-ready',
    body: 'Retail-grade EPUB and PDF with clean metadata, spine order, and chapter breaks — KDP- and Apple Books–friendly.',
  },
  {
    title: 'Multi-language',
    body: 'Generate and localize in multiple languages without rebuilding the outline from scratch.',
  },
  {
    title: 'Hours, not months',
    body: 'Outline to manuscript in one session — authors use it to unblock drafts, not replace the final human edit.',
  },
] as const

export const TALEWEAVER_STEPS = [
  {
    step: '01',
    title: 'Define your story',
    body: 'Title, genre, themes — or upload an author EPUB for style grounding.',
  },
  {
    step: '02',
    title: 'Generate & fine-tune',
    body: 'Outlines and chapters with voice-locked generation; adjust structure before export.',
  },
  {
    step: '03',
    title: 'Export & publish',
    body: 'Download EPUB or PDF and push to your storefront or newsletter list.',
  },
] as const

export const TALEWEAVER_GENRES = [
  'Literary fiction',
  'Romance',
  'Thriller',
  'Sci-fi',
  'Memoir',
  'Business',
  'Technical',
  'Children',
] as const
