import { NextResponse } from 'next/server'
import { clearLinkedInSession } from '@/lib/linkedin-session'

export const runtime = 'nodejs'

export async function POST() {
  await clearLinkedInSession()
  return NextResponse.json({ ok: true })
}
