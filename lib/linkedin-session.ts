import { createHmac, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'

export type LinkedInSession = {
  sub: string
  name: string
  email?: string
  picture?: string
  accessToken: string
  expiresAt?: number
  connectedAt: number
}

const COOKIE_NAME = 'linkedin_demo_session'

function sessionSecret(): string {
  return (
    process.env.LINKEDIN_SESSION_SECRET ??
    process.env.LINKEDIN_CLIENT_SECRET ??
    'dev-only-change-me'
  )
}

export function encodeLinkedInSession(session: LinkedInSession): string {
  const data = Buffer.from(JSON.stringify(session)).toString('base64url')
  const sig = createHmac('sha256', sessionSecret()).update(data).digest('base64url')
  return `${data}.${sig}`
}

export function decodeLinkedInSession(token: string): LinkedInSession | null {
  const [data, sig] = token.split('.')
  if (!data || !sig) return null
  const expected = createHmac('sha256', sessionSecret())
    .update(data)
    .digest('base64url')
  try {
    const a = Buffer.from(sig)
    const b = Buffer.from(expected)
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  } catch {
    return null
  }
  try {
    return JSON.parse(
      Buffer.from(data, 'base64url').toString('utf8'),
    ) as LinkedInSession
  } catch {
    return null
  }
}

export async function getLinkedInSession(): Promise<LinkedInSession | null> {
  const jar = await cookies()
  const raw = jar.get(COOKIE_NAME)?.value
  if (!raw) return null
  const session = decodeLinkedInSession(raw)
  if (session?.expiresAt && Date.now() > session.expiresAt) return null
  return session
}

export async function setLinkedInSession(session: LinkedInSession) {
  const jar = await cookies()
  jar.set(COOKIE_NAME, encodeLinkedInSession(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 14,
  })
}

export async function clearLinkedInSession() {
  const jar = await cookies()
  jar.delete(COOKIE_NAME)
}
