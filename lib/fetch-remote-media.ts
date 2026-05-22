const ALLOWED_HOSTS = new Set(['res.cloudinary.com'])

export async function fetchRemoteImageBuffer(
  url: string,
  maxBytes: number,
): Promise<{ buffer: Buffer; mimeType: string }> {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    throw new Error('Invalid media URL')
  }

  if (parsed.protocol !== 'https:' || !ALLOWED_HOSTS.has(parsed.hostname)) {
    throw new Error('Media URL must be a Cloudinary HTTPS link')
  }

  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) {
    throw new Error('Could not fetch media from Cloudinary')
  }

  const mimeType = res.headers.get('content-type') ?? 'image/jpeg'
  if (!mimeType.startsWith('image/')) {
    throw new Error('LinkedIn demo posts require an image')
  }

  const buffer = Buffer.from(await res.arrayBuffer())
  if (buffer.byteLength > maxBytes) {
    throw new Error('Image is too large for LinkedIn')
  }

  return { buffer, mimeType }
}
