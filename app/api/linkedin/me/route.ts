import { NextResponse } from 'next/server'
import { getLinkedInConfig } from '@/lib/linkedin-config'
import { getLinkedInSession } from '@/lib/linkedin-session'

export const runtime = 'nodejs'

export async function GET() {
  const { isConfigured } = getLinkedInConfig()
  const session = await getLinkedInSession()

  return NextResponse.json({
    configured: isConfigured,
    connected: Boolean(session),
    profile: session
      ? {
          name: session.name,
          email: session.email,
          picture: session.picture,
          connectedAt: session.connectedAt,
        }
      : null,
  })
}
