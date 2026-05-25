import type { ProjectStory } from '@/lib/project-story'

export const COURSE_STUDIO_STORY: ProjectStory = {
  headline: 'Course Builder AI',
  subtitle:
    'Brief → syllabus → slides → narration — one exportable package for LMS or internal training',
  lede:
    'Building a course still means outline, slides, speaker notes, and often voiceover — repeated manually for every module. Course Builder AI chains LLM outline generation, structured slide content, python-pptx rendering with branded templates, per-slide TTS, and a Markdown instructor guide into a single batch export teams can drop into an LMS.',
  byline: 'Parmeet Singh Talwar · Builder',
  social: [],
  blocks: [
    {
      type: 'chapter',
      title: 'What it automates',
    },
    {
      type: 'prose',
      paragraphs: [
        'Authors supply a brief: audience, learning objectives, module count, tone, and constraints. The FastAPI-backed outline service returns module → lesson hierarchy with objectives per section — editable before anything renders.',
        'Content generation fills each slide with bullets, body copy, and speaker notes aligned to those objectives. python-pptx applies consistent layouts so decks do not look like raw LLM dumps.',
      ],
    },
    {
      type: 'chapter',
      title: 'Listen-along & export',
    },
    {
      type: 'prose',
      paragraphs: [
        'TTS runs per slide — plain-language narration for async learners who want audio without recording a human voice for v1.',
        'Batch export bundles PPTX, MP3/WAV per slide, and the instructor guide (timing, discussion prompts, assessment hooks). One folder structure instead of three separate tools.',
      ],
    },
    {
      type: 'chapter',
      title: 'Status',
    },
    {
      type: 'prose',
      paragraphs: [
        'Building: outline + slide path is solid; TTS provider swap (Edge vs ElevenLabs) and template library are where most iteration happens. Same GenOps pattern — structured stages, human review between stages, artifact out.',
      ],
    },
  ],
  closing: 'FastAPI · LLM · python-pptx · TTS · LMS-ready export',
}
