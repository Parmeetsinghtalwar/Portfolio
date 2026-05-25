import type { AutomationWorkflow } from '@/lib/automation-types'
import { N8N_COMMUNITY_WORKFLOWS } from '@/lib/n8n-community-workflows'

export type { AutomationPlatform, AutomationWorkflow } from '@/lib/automation-types'

/**
 * Add workflows here + drop JSON under public/automations/{platform}/.
 * n8n: ⋮ → Import from File. ComfyUI: drag JSON into ComfyUI UI.
 */
export const AUTOMATION_WORKFLOWS: AutomationWorkflow[] = [
  {
    id: 'n8n-webhook-starter',
    title: 'Webhook → HTTP response',
    description: 'Minimal template: POST webhook in, JSON response out.',
    detail:
      'Starter n8n workflow for agent callbacks, form hooks, or internal tools. Webhook node listens on a path, responds with structured JSON. Duplicate and add IF nodes, OpenAI, or HTTP Request nodes for your stack. Activate only after setting credentials and a public URL (or n8n tunnel for local dev).',
    platform: 'n8n',
    tags: ['webhook', 'starter', 'http'],
    jsonPath: '/automations/n8n/webhook-starter.json',
  },
  {
    id: 'n8n-prism-pattern',
    title: 'Email → AI parse → webhook',
    description: 'Gmail trigger, OpenAI JSON parse, downstream webhook.',
    detail:
      'Production pattern behind recruitment automation: email lands, résumé or body parsed to strict JSON via GPT, then POST to the next workflow (Airtable update, scoring, calendar). Replace Gmail OAuth, model, and webhook URL. Enforce JSON schema in the system prompt so downstream nodes never regex-parse PDFs.',
    platform: 'n8n',
    tags: ['gmail', 'openai', 'recruitment', 'pattern'],
    jsonPath: '/automations/n8n/email-ai-webhook-pattern.json',
    relatedHref: '/projects/prism',
    relatedLabel: 'See Prism project',
  },
  ...N8N_COMMUNITY_WORKFLOWS,
  {
    id: 'comfyui-txt2img-starter',
    title: 'SDXL txt2img (starter graph)',
    description: 'Basic checkpoint + prompt → image save.',
    detail:
      'ComfyUI workflow export: Load Checkpoint, CLIP encode positive/negative prompts, KSampler, VAE decode, Save Image. Swap checkpoint for SDXL or Flux weights you host locally. Use as the base graph before adding ControlNet, LoRA loaders, or upscaler nodes.',
    platform: 'comfyui',
    tags: ['sdxl', 'txt2img', 'starter'],
    jsonPath: '/automations/comfyui/txt2img-starter.json',
  },
  {
    id: 'comfyui-lora-stack',
    title: 'LoRA + checkpoint stack',
    description: 'Load LoRA on top of base model for style/character.',
    detail:
      'Shows how to chain LoraLoader after checkpoint with adjustable strength. Fine-tune LoRAs in kohya/ss or similar, drop .safetensors into models/loras, then reference the filename in the node. Pair with img2img branch for character consistency across scenes.',
    platform: 'comfyui',
    tags: ['lora', 'fine-tune', 'character'],
    jsonPath: '/automations/comfyui/lora-stack.json',
  },
  {
    id: 'comfyui-z-image-turbo',
    title: 'Z-Image-Turbo (open-source stills)',
    description:
      'Apache-2.0 Tongyi-MAI 6B image model — native ComfyUI txt2img graph.',
    detail:
      'Content Phase uses this path for direct still generation without DALL·E/Fal markup. Download qwen_3_4b.safetensors (text_encoders), z_image_turbo_bf16.safetensors (diffusion_models), ae.safetensors (vae) per ComfyUI docs, then load this workflow JSON. Photoreal frames, strong instruction follow, fits ~16GB VRAM class GPUs.',
    platform: 'comfyui',
    tags: ['z-image', 'open-source', '6B', 'socialhub'],
    jsonPath: '/automations/comfyui/z-image-turbo.json',
    previewPath: '/projects/comfyui/z.jpeg',
    relatedHref: '/projects/socialhub',
    relatedLabel: 'Content Phase / SocialHub',
  },
  {
    id: 'comfyui-wan-t2v',
    title: 'Wan 2.1 text-to-video',
    description: 'Open-weight Wan T2V clip generation in ComfyUI.',
    detail:
      'Script-driven social video in Content Phase: Wan 2.1 T2V graph (wan2.1_t2v_1.3B_fp16 + wan_2.1_vae + umt5_xxl text encoder). Queue from FastAPI or run manually in ComfyUI; export MP4 to Cloudinary before OAuth publish. Pair with Wan I2V when you have a hero still from Z-Image.',
    platform: 'comfyui',
    tags: ['wan', 'video', 't2v', 'open-source', 'socialhub'],
    jsonPath: '/automations/comfyui/wan-t2v.json',
    previewPath: '/projects/comfyui/wan.jpeg',
    relatedHref: '/projects/socialhub',
    relatedLabel: 'Content Phase / SocialHub',
  },
]

export const AUTOMATION_SKILLS = [
  'n8n',
  'ComfyUI',
  'Z-Image-Turbo',
  'Wan video',
  'Make.com',
  'Zapier',
  'Webhooks',
  'LoRA',
  'Gmail / GCal',
  'Airtable',
  'OpenAI nodes',
] as const
