import type { ProjectStory } from '@/lib/project-story'

export const LINKEDIN_JOBS_STORY: ProjectStory = {
  headline: 'AI Jobs Export',
  subtitle:
    'AI-powered LinkedIn job discovery — fresh AI/ML roles in USA & UAE, structured for real job hunts',
  lede:
    'I built this when friends kept missing good AI/ML openings because LinkedIn search is noisy and every posting hides salary, skills, and remote policy in different places. The pipeline scrapes latest listings (guest API, no login), runs Claude to pull ten clean fields per job, and exports a spreadsheet people can actually filter — I have used it to help six to eight friends stay on top of the market with regular fresh runs.',
  byline: 'Parmeet Singh Talwar · Builder',
  social: [],
  blocks: [
    {
      type: 'chapter',
      title: 'Why this exists',
    },
    {
      type: 'prose',
      paragraphs: [
        'Job hunting in AI/ML moves fast: a strong role can sit at the top of the feed for a day and disappear. Manually opening dozens of LinkedIn posts to copy company, stack, salary hint, and remote mode into a sheet does not scale — especially when you are helping multiple people search in parallel.',
        'AI Jobs Export automates the boring part: collect fresh postings, let the model read each description once, and output rows you can sort by skills, location, or company instead of re-reading the same HTML clutter.',
      ],
    },
    {
      type: 'quote',
      text: 'The win was not the scraper — it was my friends opening one Excel file and seeing only the jobs that matched them, updated from the latest market pull.',
      attribution: 'How I use AI Jobs Export',
    },
    {
      type: 'chapter',
      title: 'Helping friends in the market',
      when: 'Real use',
    },
    {
      type: 'prose',
      paragraphs: [
        'I ran the pipeline for about six to eight friends hunting AI, ML, and GenOps-style roles — mostly USA and UAE searches. Each run aimed at the latest postings, not a stale dump: new companies, new titles, updated descriptions.',
        'They cared about different filters — remote-only, LLM infra, computer vision, entry vs senior — so the ten-field schema (company, role, skills, salary signal, work mode, full JD, and more) mattered more than raw links. A shared spreadsheet beat sending screenshots in group chat.',
        'The feedback loop was simple: run overnight or on demand, share the workbook, they shortlist and apply while I tweak search URLs or session caps if LinkedIn throttles.',
      ],
    },
    {
      type: 'chapter',
      title: 'The pipeline',
      when: 'How it works',
    },
    {
      type: 'prose',
      paragraphs: [
        'Python modules: `linkedin_scraper.py` hits the public guest API with rotated user-agents, random delays, and `MAX_JOBS_PER_SESSION` so sessions do not burn out. `ai_extractor.py` sends each posting through OpenRouter Claude 3.5 Sonnet with a fixed JSON schema. `excel_writer.py` formats `linkedin_ai_jobs.xlsx` for filtering and sharing.',
        'No LinkedIn login stored — lower risk for a personal tool, with trade-offs on volume. Anti-ban behavior is intentional: slow enough to finish a run, fast enough that friends get timely updates when the market moves.',
      ],
    },
    {
      type: 'chapter',
      title: 'What changed for people',
    },
    {
      type: 'prose',
      paragraphs: [
        'Friends went from scrolling infinite LinkedIn feeds to scanning a structured export — latest roles, comparable columns, full JD text in one place. For me it validated a small rule: use AI on the extraction and normalization step, keep humans on judgment about which rows to pursue.',
        'The project stays open and scriptable: new search URLs, rerun CLI `main.py`, new sheet out. Same pattern I would reuse for any niche job market that is too fragmented to track by hand.',
      ],
    },
  ],
  closing:
    'Python · Claude 3.5 · LinkedIn guest API · Excel export · built for real job hunts',
}
