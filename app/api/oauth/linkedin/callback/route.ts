import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getLinkedInConfig } from '@/lib/linkedin-config'
import {
  exchangeCodeForToken,
  fetchLinkedInUserInfo,
} from '@/lib/linkedin-oauth'
import { decodeOAuthState } from '@/lib/linkedin-oauth-state'
import { buildOAuthReturnUrl } from '@/lib/oauth-redirect'
import { setLinkedInSession } from '@/lib/linkedin-session'

export const runtime = 'nodejs'

const STATE_COOKIE = 'linkedin_oauth_state'

export async function GET(request: Request) {
  const { siteUrl } = getLinkedInConfig()
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const stateParam = searchParams.get('state')
  const error = searchParams.get('error')

  const jar = await cookies()
  const savedState = jar.get(STATE_COOKIE)?.value
  jar.delete(STATE_COOKIE)

  const parsedState = stateParam ? decodeOAuthState(stateParam) : null
  const returnTo = parsedState?.returnTo ?? '/projects/socialhub'

  if (error) {
    return NextResponse.redirect(
      buildOAuthReturnUrl(siteUrl, returnTo, {
        linkedin: 'error',
        reason: error,
      }),
    )
  }

  if (!code || !stateParam) {
    return NextResponse.redirect(
      buildOAuthReturnUrl(siteUrl, returnTo, {
        linkedin: 'error',
        reason: 'missing_code',
      }),
    )
  }

  if (!savedState || savedState !== stateParam || !parsedState) {
    return NextResponse.redirect(
      buildOAuthReturnUrl(siteUrl, returnTo, {
        linkedin: 'error',
        reason: 'invalid_state',
      }),
    )
  }

  try {
    const token = await exchangeCodeForToken(code)
    const profile = await fetchLinkedInUserInfo(token.access_token)

    const expiresAt = token.expires_in
      ? Date.now() + token.expires_in * 1000
      : undefined

    await setLinkedInSession({
      sub: profile.sub,
      name: profile.name,
      email: profile.email,
      picture: profile.picture,
      accessToken: token.access_token,
      expiresAt,
      connectedAt: Date.now(),
    })

    return NextResponse.redirect(
      buildOAuthReturnUrl(siteUrl, returnTo, { linkedin: 'connected' }),
    )
  } catch (err) {
    const reason = err instanceof Error ? err.message : 'oauth_failed'
    return NextResponse.redirect(
      buildOAuthReturnUrl(siteUrl, returnTo, {
        linkedin: 'error',
        reason: reason.slice(0, 120),
      }),
    )
  }
}
