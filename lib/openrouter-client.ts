const OPENROUTER_CHAT_URL = 'https://openrouter.ai/api/v1/chat/completions'

export type ProjectImageCopy = {
  quote: string
  attribution: string
  heroImagePrompt: string
  previewImagePrompt: string
}

type ContentPart = {
  type?: string
  text?: string
  image_url?: { url?: string }
}

type ChatMessage = {
  role?: string
  content?: string | ContentPart[]
  images?: Array<{
    type?: string
    image_url?: { url?: string }
    imageUrl?: { url?: string }
  }>
}

type ChatCompletionResponse = {
  choices?: Array<{ message?: ChatMessage }>
  error?: { message?: string }
}

function openRouterHeaders(apiKey: string): HeadersInit {
  return {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
    'X-Title': 'Portfolio Project Visuals',
  }
}

export async function openRouterChat(
  apiKey: string,
  body: Record<string, unknown>,
): Promise<ChatCompletionResponse> {
  const res = await fetch(OPENROUTER_CHAT_URL, {
    method: 'POST',
    headers: openRouterHeaders(apiKey),
    body: JSON.stringify(body),
  })
  const data = (await res.json()) as ChatCompletionResponse
  if (!res.ok) {
    const msg = data.error?.message ?? `OpenRouter ${res.status}`
    throw new Error(msg)
  }
  return data
}

export async function generateProjectCopy(
  apiKey: string,
  input: {
    title: string
    tagline: string
    description: string
    stack: string[]
  },
): Promise<ProjectImageCopy> {
  const model = process.env.OPENROUTER_TEXT_MODEL ?? 'openai/gpt-4.1-mini'

  const data = await openRouterChat(apiKey, {
    model,
    temperature: 0.85,
    max_tokens: 600,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: [
          'You curate portfolio visuals for a software engineer\'s projects.',
          'Return JSON only with these keys:',
          'quote — one famous MOVIE quote (real, recognizable) that metaphorically fits the project; max 22 words; keep the line faithful to the film.',
          'attribution — film title and year, e.g. "The Social Network (2010)" or "Character — Interstellar (2014)".',
          'heroImagePrompt — ONE real-world photograph that visually suggests the project domain (tools, environment, objects). Muted natural colors, documentary style. NO text, NO logos, NO neon, NO holograms, NO neural-network art, NO sci-fi UI, NO glowing circuits.',
          'previewImagePrompt — Square still life matching the hero subject/mood. Same rules: photograph only, zero typography, zero words, zero logos. NO AI-art clichés.',
        ].join(' '),
      },
      {
        role: 'user',
        content: JSON.stringify(input),
      },
    ],
  })

  const raw = data.choices?.[0]?.message?.content
  const text =
    typeof raw === 'string'
      ? raw.trim()
      : Array.isArray(raw)
        ? raw
            .filter((p) => p.type === 'text' && p.text)
            .map((p) => p.text)
            .join('')
            .trim()
        : ''

  if (!text) throw new Error('No copy returned from text model')

  const parsed = JSON.parse(text) as Partial<ProjectImageCopy>
  if (!parsed.quote || !parsed.heroImagePrompt || !parsed.previewImagePrompt) {
    throw new Error('Invalid copy JSON from model')
  }

  return {
    quote: parsed.quote,
    attribution: parsed.attribution ?? 'Cinema',
    heroImagePrompt: parsed.heroImagePrompt,
    previewImagePrompt: parsed.previewImagePrompt,
  }
}

export function extractImageDataUrls(message: ChatMessage | undefined): string[] {
  const urls: string[] = []

  for (const img of message?.images ?? []) {
    const url = img.image_url?.url ?? img.imageUrl?.url
    if (url) urls.push(url)
  }

  const content = message?.content
  if (Array.isArray(content)) {
    for (const part of content) {
      if (part.type === 'image_url' && part.image_url?.url) {
        urls.push(part.image_url.url)
      }
    }
  }

  return urls
}

function buildImagePrompt(imagePrompt: string, variant: 'hero' | 'preview'): string {
  const noTextRule =
    'CRITICAL: zero text, zero letters, zero words, zero numbers, zero logos, zero watermarks, zero UI labels, zero captions, zero typography on any object or screen.'
  const aspect =
    variant === 'hero'
      ? 'Generate one cinematic wide 16:9 hero photograph.'
      : 'Generate one square 1:1 portfolio thumbnail photograph.'

  return [
    imagePrompt,
    aspect,
    noTextRule,
    'Photorealistic documentary still life or environment photo: natural soft daylight, muted palette, shallow depth of field when appropriate.',
    'Not illustration, not 3D render, not digital painting, not stock "AI brain" art, not neon cyberpunk, not holographic dashboards.',
    'If a screen appears, content must be heavily blurred or blank so no readable characters.',
    'No human faces.',
  ].join(' ')
}

async function requestImageViaTool(
  apiKey: string,
  model: string,
  imagePrompt: string,
  variant: 'hero' | 'preview',
): Promise<string> {
  const toolModel = process.env.OPENROUTER_TOOL_MODEL ?? 'openai/gpt-4o-mini'
  const aspect = variant === 'hero' ? '16:9' : '1:1'

  const data = await openRouterChat(apiKey, {
    model: toolModel,
    tools: [
      {
        type: 'openrouter:image_generation',
        parameters: {
          model,
          aspect_ratio: aspect,
        },
      },
    ],
    messages: [
      {
        role: 'user',
        content: buildImagePrompt(imagePrompt, variant),
      },
    ],
  })

  const urls = extractImageDataUrls(data.choices?.[0]?.message)
  if (!urls[0]) throw new Error(`No image from tool ${model} (${variant})`)
  return urls[0]
}

async function requestImageViaModalities(
  apiKey: string,
  model: string,
  imagePrompt: string,
  variant: 'hero' | 'preview',
): Promise<string> {
  const aspect = variant === 'hero' ? '16:9' : '1:1'
  const modalities = model.includes('gemini') ? ['image', 'text'] : ['image']

  const data = await openRouterChat(apiKey, {
    model,
    modalities,
    max_tokens: 1024,
    image_config: { aspect_ratio: aspect },
    messages: [
      {
        role: 'user',
        content: buildImagePrompt(imagePrompt, variant),
      },
    ],
  })

  const urls = extractImageDataUrls(data.choices?.[0]?.message)
  if (!urls[0]) throw new Error(`No image from ${model} (${variant})`)
  return urls[0]
}

export async function generateGptImage(
  apiKey: string,
  imagePrompt: string,
  variant: 'hero' | 'preview',
): Promise<string> {
  const model = process.env.OPENROUTER_IMAGE_MODEL ?? 'google/gemini-2.5-flash-image'
  const useTool = model.includes('gpt-image') || model.includes('gpt-5-image')

  if (useTool) {
    try {
      return await requestImageViaTool(apiKey, model, imagePrompt, variant)
    } catch {
      return await requestImageViaModalities(
        apiKey,
        'google/gemini-2.5-flash-image',
        imagePrompt,
        variant,
      )
    }
  }

  return await requestImageViaModalities(apiKey, model, imagePrompt, variant)
}

export function dataUrlToBuffer(dataUrl: string): { ext: string; buffer: Buffer } {
  const match = /^data:image\/([\w+]+);base64,(.+)$/i.exec(dataUrl)
  if (!match) throw new Error('Invalid image data URL')
  const ext = match[1] === 'jpeg' ? 'jpg' : match[1]
  return { ext, buffer: Buffer.from(match[2], 'base64') }
}
