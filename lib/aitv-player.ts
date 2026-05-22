import type { Language } from '@/app/components/MultiLangVideoPlayer'

export const AITV_PLAYER_LANGUAGES: Language[] = [
  { code: 'en', label: 'english', videoSrc: '/video/english.mov' },
  { code: 'es', label: 'spanish', videoSrc: '/video/spanish.mp4' },
  { code: 'hi', label: 'hindi', videoSrc: '/video/hindi.mp4' },
  { code: 'it', label: 'italian', videoSrc: '/video/italian.mp4' },
  { code: 'ja', label: 'japanese', videoSrc: '/video/japan.mp4' },
]

export const AITV_PLAYER_CAPTION =
  'Open-source LySync pipeline setup — one master performance in, multilingual dubs out.\nASR → translate → TTS / voice conversion → mux back to picture, with timecodes locked so every track lines up.'

export const AITV_MODALITIES = ['Audio', 'Image', 'Text', 'Video'] as const

export const AITV_PHASES = [
  {
    step: '01',
    title: 'Open-source first',
    body:
      'Started with local weights and community stacks — diffusion, TTS, ASR, and video gen running on my own machine. Learning meant reading repos, tracing inference paths, and breaking models until I understood what each tensor was doing.',
    tags: ['ComfyUI', 'Whisper', 'Stable Diffusion', 'FFmpeg', 'PyTorch', 'Hugging Face'],
  },
  {
    step: '02',
    title: 'Models → APIs',
    body:
      'Moved from solo GPU experiments to composed pipelines: open weights for prototyping, then hosted APIs where latency, lip-sync, and dubbing quality mattered. Same mental model — input modality in, target modality out — just swapping local checkpoints for production endpoints.',
    tags: ['REST inference', 'Lip-sync APIs', 'TTS / VC', 'Batch + streaming', 'Eval rubrics'],
  },
  {
    step: '03',
    title: 'LySync · open-source dub pipeline',
    body:
      'LySync is the setup I use to stitch community models into one flow: extract audio, generate per-language speech, align to the original cut, and export tracks that share the same timeline. This player is the QA surface — switch dubs without losing frame time, auto-advance across languages, film-strip progress for drift checks.',
    tags: ['LySync', 'Whisper', 'TTS / VC', 'FFmpeg', 'Timecode lock', 'Open-source weights'],
  },
] as const
