import { NextResponse } from 'next/server'
import { getCloudinaryConfig } from '@/lib/cloudinary'

export async function GET() {
  const { isConfigured, cloudName } = getCloudinaryConfig()
  return NextResponse.json({
    configured: isConfigured,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? cloudName ?? null,
  })
}
