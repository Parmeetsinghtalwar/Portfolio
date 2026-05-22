import { createHmac, randomUUID, timingSafeEqual } from 'crypto'

export type LinkedInOAuthState = {
  nonce: string
  returnTo: string
}

function stateSecret(): string {
  return (
    process.env.LINKEDIN_SESSION_SECRET ??
    process.env.LINKEDIN_CLIENT_SECRET ??
    'dev-only-change-me'
  )
}

export function encodeOAuthState(payload: LinkedInOAuthState): string {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const sig = createHmac('sha256', stateSecret()).update(data).digest('base64url')
  return `${data}.${sig}`
}

export function decodeOAuthState(token: string): LinkedInOAuthState | null {
  const [data, sig] = token.split('.')
  if (!data || !sig) return null
  const expected = createHmac('sha256', stateSecret())
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
    ) as LinkedInOAuthState
  } catch {
    return null
  }
}

export function createOAuthState(returnTo: string): string {
  return encodeOAuthState({
    nonce: randomUUID(),
    returnTo,
  })
}
