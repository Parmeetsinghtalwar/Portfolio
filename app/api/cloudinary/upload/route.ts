import { NextResponse } from 'next/server'
import { getCloudinaryConfig, uploadToCloudinary } from '@/lib/cloudinary'

export const runtime = 'nodejs'

const IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
])
const VIDEO_TYPES = new Set([
  'video/mp4',
  'video/webm',
  'video/quicktime',
])
const MAX_IMAGE_BYTES = 10 * 1024 * 1024
const MAX_VIDEO_BYTES = 50 * 1024 * 1024

export async function POST(request: Request) {
  const { isConfigured, folder } = getCloudinaryConfig()
  if (!isConfigured) {
    return NextResponse.json(
      { error: 'Cloudinary is not configured' },
      { status: 503 },
    )
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const file = formData.get('file')
  const scope = String(formData.get('scope') ?? 'socialhub-demo').replace(
    /[^a-z0-9-_]/gi,
    '',
  )

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const isImage = IMAGE_TYPES.has(file.type)
  const isVideo = VIDEO_TYPES.has(file.type)

  if (!isImage && !isVideo) {
    return NextResponse.json(
      { error: 'Unsupported file type. Use JPG, PNG, WebP, GIF, MP4, or WebM.' },
      { status: 400 },
    )
  }

  if (isImage && file.size > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: 'Image must be under 10MB' }, { status: 400 })
  }
  if (isVideo && file.size > MAX_VIDEO_BYTES) {
    return NextResponse.json({ error: 'Video must be under 50MB' }, { status: 400 })
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const upload = await uploadToCloudinary(buffer, {
      folder: `${folder}/${scope}`,
      resourceType: isVideo ? 'video' : 'image',
    })

    return NextResponse.json({
      ok: true,
      url: upload.url,
      publicId: upload.publicId,
      resourceType: upload.resourceType,
      bytes: upload.bytes,
      width: upload.width,
      height: upload.height,
    })
  } catch (err) {
    console.error('[cloudinary/upload]', err)
    const message = err instanceof Error ? err.message : 'Upload failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
