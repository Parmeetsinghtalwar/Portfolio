import { NextResponse } from 'next/server'
import { fetchRemoteImageBuffer } from '@/lib/fetch-remote-media'
import { getLinkedInConfig } from '@/lib/linkedin-config'
import { getPresetById } from '@/lib/socialhub-demo-presets'
import { publishLinkedInImagePost } from '@/lib/linkedin-publish'
import { getLinkedInSession } from '@/lib/linkedin-session'

export const runtime = 'nodejs'

const MAX_BYTES = 5 * 1024 * 1024
const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
])

export async function POST(request: Request) {
  const { isConfigured } = getLinkedInConfig()
  if (!isConfigured) {
    return NextResponse.json(
      { error: 'LinkedIn OAuth is not configured on this server' },
      { status: 503 },
    )
  }

  const session = await getLinkedInSession()
  if (!session) {
    return NextResponse.json(
      { error: 'Connect LinkedIn first' },
      { status: 401 },
    )
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const caption = String(formData.get('caption') ?? '').trim()
  const presetId = String(formData.get('presetId') ?? '').trim()
  const mediaUrl = String(formData.get('mediaUrl') ?? '').trim()
  const file = formData.get('image')

  if (caption.length < 3) {
    return NextResponse.json({ error: 'Caption is too short' }, { status: 400 })
  }
  if (caption.length > 3000) {
    return NextResponse.json({ error: 'Caption is too long' }, { status: 400 })
  }

  let buffer: Buffer
  let mimeType: string

  if (mediaUrl) {
    try {
      const remote = await fetchRemoteImageBuffer(mediaUrl, MAX_BYTES)
      buffer = remote.buffer
      mimeType = remote.mimeType
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid media URL'
      return NextResponse.json({ error: message }, { status: 400 })
    }
  } else if (file instanceof File && file.size > 0) {
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'Unsupported image type' }, { status: 400 })
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'Image must be under 5MB' }, { status: 400 })
    }
    mimeType = file.type
    buffer = Buffer.from(await file.arrayBuffer())
  } else if (presetId) {
    const preset = getPresetById(presetId)
    if (!preset) {
      return NextResponse.json({ error: 'Unknown preset image' }, { status: 400 })
    }
    try {
      const remote = await fetchRemoteImageBuffer(preset.cloudinaryUrl, MAX_BYTES)
      buffer = remote.buffer
      mimeType = remote.mimeType
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Preset not available on Cloudinary'
      return NextResponse.json({ error: message }, { status: 400 })
    }
  } else {
    return NextResponse.json(
      { error: 'Select a preset image or upload your own' },
      { status: 400 },
    )
  }

  try {
    const result = await publishLinkedInImagePost(
      session.accessToken,
      session.sub,
      buffer,
      mimeType,
      caption,
    )

    return NextResponse.json({
      ok: true,
      postId: result.postId,
      message: 'Posted to LinkedIn via SocialHub demo',
    })
  } catch (err) {
    console.error('[linkedin/post]', err)
    const message =
      err instanceof Error ? err.message : 'Could not publish to LinkedIn'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
