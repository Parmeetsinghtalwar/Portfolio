import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getLinkedInConfig } from '@/lib/linkedin-config'
import { buildLinkedInAuthUrl } from '@/lib/linkedin-oauth'
import { createOAuthState } from '@/lib/linkedin-oauth-state'
import { buildOAuthReturnUrl } from '@/lib/oauth-redirect'

export const runtime = 'nodejs'

const STATE_COOKIE = 'linkedin_oauth_state'

export async function GET(request: Request) {
  const { isConfigured, siteUrl } = getLinkedInConfig()
  const { searchParams } = new URL(request.url)
  const returnTo = searchParams.get('return') ?? '/projects/socialhub'

  if (!isConfigured) {
    return NextResponse.redirect(
      buildOAuthReturnUrl(siteUrl, returnTo, {
        linkedin: 'error',
        reason: 'not_configured',
      }),
    )
  }

  const state = createOAuthState(returnTo)
  const jar = await cookies()
  jar.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 600,
  })

  const url = buildLinkedInAuthUrl(state)
  return NextResponse.redirect(url)
}
