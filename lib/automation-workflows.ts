export type AutomationPlatform = 'n8n' | 'comfyui' | 'make' | 'zapier'

export type AutomationWorkflow = {
  id: string
  title: string
  description: string
  platform: AutomationPlatform
  tags: string[]
  /** Public path, e.g. /automations/n8n/my-flow.json */
  jsonPath: string
  /** Longer copy for Finder detail pane */
  detail?: string
  /** Optional link to a portfolio project that uses similar patterns */
  relatedHref?: string
  relatedLabel?: string
}

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
]

export const AUTOMATION_SKILLS = [
  'n8n',
  'ComfyUI',
  'Make.com',
  'Zapier',
  'Webhooks',
  'LoRA',
  'Gmail / GCal',
  'Airtable',
  'OpenAI nodes',
] as const
