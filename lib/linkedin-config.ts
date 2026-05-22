export function getLinkedInConfig() {
  const clientId = process.env.LINKEDIN_CLIENT_ID
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001').replace(
    /\/$/,
    '',
  )
  const redirectUri =
    process.env.LINKEDIN_REDIRECT_URI ??
    `${siteUrl}/api/oauth/linkedin/callback`

  return {
    clientId,
    clientSecret,
    redirectUri,
    siteUrl,
    isConfigured: Boolean(clientId && clientSecret),
  }
}

/** Posting requires w_member_social — enable in LinkedIn Developer app */
export const LINKEDIN_SCOPES = [
  'openid',
  'profile',
  'email',
  'w_member_social',
] as const

export const LINKEDIN_AUTH_URL =
  'https://www.linkedin.com/oauth/v2/authorization'
export const LINKEDIN_TOKEN_URL =
  'https://www.linkedin.com/oauth/v2/accessToken'
export const LINKEDIN_USERINFO_URL = 'https://api.linkedin.com/v2/userinfo'
