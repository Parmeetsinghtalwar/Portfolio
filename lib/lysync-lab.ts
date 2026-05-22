export const LYSYNC_WORKFLOW_STEPS = [
  {
    id: 'ingest',
    label: 'Ingest',
    detail: 'Master clip + reference audio locked to one timeline.',
    status: 'done' as const,
  },
  {
    id: 'asr',
    label: 'ASR',
    detail: 'Whisper-class transcript with word-level timecodes.',
    status: 'done' as const,
  },
  {
    id: 'translate',
    label: 'Translate',
    detail: 'Per-language scripts — meaning first, then length-fit for dub.',
    status: 'done' as const,
  },
  {
    id: 'tts',
    label: 'TTS / VC',
    detail: 'Open-source speech gen or voice conversion per track.',
    status: 'active' as const,
  },
  {
    id: 'lipsync',
    label: 'Lip-sync',
    detail: 'Align mouth energy to new audio — community lip-sync weights.',
    status: 'active' as const,
  },
  {
    id: 'mux',
    label: 'Mux & QA',
    detail: 'FFmpeg mux + multilang player for drift and timing checks.',
    status: 'done' as const,
  },
] as const

export const LYSYNC_LEARNING_POINTS = [
  'Not a course — hands-on reps on open repos, papers, and inference scripts until outputs are predictable.',
  'Comparing Whisper, TTS, and lip-sync checkpoints side by side before any API shortcut.',
  'Building LySync as the glue: one config, shared timecodes, export paths per language.',
  'Using the player below as the review surface — same frame, switch dubs, watch lip lag.',
] as const

export const LYSYNC_LAB_COPY = {
  eyebrow: '04 · Open-source audio · lip-sync',
  title: 'LySync workflow',
  lede:
    'The dub pipeline I am actively wiring — open weights for ASR, speech, and lip alignment, then a QA player to hear five languages on one cut.',
  statusLabel: 'In progress · learning by building',
  middleEyebrow: 'LySync · pipeline (working on)',
  middleLede:
    'Same flow the multilang player demos — open-source audio in, lip-synced dubs out. Scroll down for outputs.',
} as const
