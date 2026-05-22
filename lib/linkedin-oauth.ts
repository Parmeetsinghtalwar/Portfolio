import {
  getLinkedInConfig,
  LINKEDIN_SCOPES,
  LINKEDIN_TOKEN_URL,
  LINKEDIN_USERINFO_URL,
  LINKEDIN_AUTH_URL,
} from '@/lib/linkedin-config'

export type LinkedInUserInfo = {
  sub: string
  name: string
  email?: string
  picture?: string
}

export type LinkedInTokenResponse = {
  access_token: string
  expires_in?: number
  refresh_token?: string
}

export function buildLinkedInAuthUrl(state: string): string {
  const { clientId, redirectUri } = getLinkedInConfig()
  if (!clientId) throw new Error('LINKEDIN_CLIENT_ID is not configured')

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
    scope: LINKEDIN_SCOPES.join(' '),
  })

  return `${LINKEDIN_AUTH_URL}?${params.toString()}`
}

export async function exchangeCodeForToken(
  code: string,
): Promise<LinkedInTokenResponse> {
  const { clientId, clientSecret, redirectUri } = getLinkedInConfig()
  if (!clientId || !clientSecret) {
    throw new Error('LinkedIn OAuth credentials are not configured')
  }

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    client_id: clientId,
    client_secret: clientSecret,
  })

  const res = await fetch(LINKEDIN_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(
      `LinkedIn token exchange failed: ${res.status} ${err.slice(0, 200)}`,
    )
  }

  return (await res.json()) as LinkedInTokenResponse
}

export async function fetchLinkedInUserInfo(
  accessToken: string,
): Promise<LinkedInUserInfo> {
  const res = await fetch(LINKEDIN_USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(
      `LinkedIn userinfo failed: ${res.status} ${err.slice(0, 200)}`,
    )
  }

  const data = (await res.json()) as {
    sub: string
    name?: string
    given_name?: string
    family_name?: string
    email?: string
    picture?: string
  }

  const name =
    data.name ??
    ([data.given_name, data.family_name].filter(Boolean).join(' ') ||
      'LinkedIn user')

  return {
    sub: data.sub,
    name,
    email: data.email,
    picture: data.picture,
  }
}
