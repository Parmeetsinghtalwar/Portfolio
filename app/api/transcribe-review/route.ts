import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

type Body = {
  image?: string
  typedText?: string
  ocrText?: string
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    return NextResponse.json({
      text: null,
      error: 'AI transcribe not configured (set OPENROUTER_API_KEY)',
    })
  }

  let body: Body
  try {
    body = (await request.json()) as Body
  } catch {
    return NextResponse.json({ text: null, error: 'Invalid JSON body' }, { status: 400 })
  }

  const { image, typedText, ocrText } = body
  if (!image) {
    return NextResponse.json({ text: null, error: 'Missing image' }, { status: 400 })
  }

  const prompt = [
    'You read handwritten or drawn reviews on a portfolio guest wall.',
    'Return ONLY the most likely plain-text message the visitor meant to write.',
    'No markdown, no quotes, one short paragraph max.',
    typedText ? `They also typed: "${typedText}"` : '',
    ocrText ? `OCR draft: "${ocrText}"` : '',
  ]
    .filter(Boolean)
    .join('\n')

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
        'X-Title': 'Portfolio Review Wall',
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_VISION_MODEL ?? 'google/gemini-2.0-flash-001',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: image } },
            ],
          },
        ],
        max_tokens: 200,
        temperature: 0.2,
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      return NextResponse.json(
        { text: null, error: `OpenRouter error: ${res.status} ${errText.slice(0, 200)}` },
        { status: 502 },
      )
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>
    }
    const text = data.choices?.[0]?.message?.content?.trim() ?? null
    return NextResponse.json({ text })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Transcribe failed'
    return NextResponse.json({ text: null, error: message }, { status: 500 })
  }
}
