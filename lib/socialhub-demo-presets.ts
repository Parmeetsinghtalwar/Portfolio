import { cloudinaryImageUrl } from '@/lib/cloudinary-public'

const PRESET_FOLDER = 'portfolio/socialhub-demo/presets'

export type SocialHubPresetImage = {
  id: string
  label: string
  /** Stable Cloudinary public_id (pre-seeded via seed:socialhub-presets) */
  publicId: string
  /** CDN delivery URL for preview + LinkedIn post */
  cloudinaryUrl: string
}

function preset(publicIdSuffix: string, label: string): SocialHubPresetImage {
  const id = publicIdSuffix
  const publicId = `${PRESET_FOLDER}/${id}`
  const cloudinaryUrl =
    cloudinaryImageUrl(publicId, { width: 1200 }) ??
    `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto,w_1200/${publicId}`

  return { id, label, publicId, cloudinaryUrl }
}

export const SOCIALHUB_DEMO_PRESETS: SocialHubPresetImage[] = [
  preset('campaign-1', 'Product launch'),
  preset('campaign-2', 'Team culture'),
  preset('campaign-3', 'Analytics win'),
]

export function getPresetById(id: string): SocialHubPresetImage | undefined {
  return SOCIALHUB_DEMO_PRESETS.find((p) => p.id === id)
}

export function getDefaultPreset(): SocialHubPresetImage {
  return SOCIALHUB_DEMO_PRESETS[0]
}
