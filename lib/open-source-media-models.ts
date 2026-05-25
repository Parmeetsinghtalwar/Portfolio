export type OpenSourceMediaModel = {
  id: string
  kind: 'image' | 'video'
  name: string
  license: string
  org: string
  tagline: string
  /** One-line “why use this” */
  role: string
  previewPath: string
  workflowJsonPath: string
  usedIn: { label: string; href: string }
  specs: string[]
}

export const OPEN_SOURCE_MEDIA_INTRO =
  'Self-hosted generation in ComfyUI — no per-image API bill. Content Phase routes here when teams want open weights instead of DALL·E / Fal.'

export const OPEN_SOURCE_IMAGE_MODEL: OpenSourceMediaModel = {
  id: 'z-image-turbo',
  kind: 'image',
  name: 'Z-Image-Turbo',
  license: 'Apache-2.0',
  org: 'Tongyi-MAI',
  tagline: 'Open-source 6B still-image model',
  role: 'Photoreal frames, strong prompt follow, bilingual text — direct txt2img in ComfyUI.',
  previewPath: '/projects/comfyui/z.jpeg',
  workflowJsonPath: '/automations/comfyui/z-image-turbo.json',
  usedIn: { label: 'Content Phase / SocialHub', href: '/projects/socialhub' },
  specs: [
    'ComfyUI native graph (Qwen3-4B encoder + z_image_turbo_bf16 + VAE)',
    'Fits ~16GB VRAM consumer GPUs',
    'Alternative to DALL·E 3 / Fal for cost-controlled stills',
  ],
}

export const OPEN_SOURCE_VIDEO_MODEL: OpenSourceMediaModel = {
  id: 'wan-video',
  kind: 'video',
  name: 'Wan 2.1 / 2.2',
  license: 'Apache-2.0',
  org: 'Alibaba Wan team',
  tagline: 'Open-source text-to-video & image-to-video',
  role: 'Short social clips from script or hero still — T2V and I2V graphs in the same ComfyUI queue.',
  previewPath: '/projects/comfyui/wan.jpeg',
  workflowJsonPath: '/automations/comfyui/wan-t2v.json',
  usedIn: { label: 'Content Phase / SocialHub', href: '/projects/socialhub' },
  specs: [
    'T2V: wan2.1_t2v_1.3B · I2V: wan2.1_i2v + CLIP vision',
    'umt5_xxl text encoder · wan_2.1_vae',
    'Powers script → render video path before OAuth publish',
  ],
}

export const OPEN_SOURCE_MEDIA_MODELS = [
  OPEN_SOURCE_IMAGE_MODEL,
  OPEN_SOURCE_VIDEO_MODEL,
] as const

