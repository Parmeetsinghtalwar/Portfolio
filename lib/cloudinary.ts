import { v2 as cloudinary } from 'cloudinary'

export type CloudinaryUploadResult = {
  url: string
  publicId: string
  resourceType: 'image' | 'video'
  bytes: number
  width?: number
  height?: number
}

export function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  const folder = process.env.CLOUDINARY_FOLDER ?? 'portfolio'

  return {
    cloudName,
    apiKey,
    apiSecret,
    folder,
    isConfigured: Boolean(cloudName && apiKey && apiSecret),
  }
}

function ensureConfigured() {
  const { isConfigured } = getCloudinaryConfig()
  if (!isConfigured) {
    throw new Error('Cloudinary is not configured')
  }
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig()
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  })
}

export async function uploadToCloudinary(
  buffer: Buffer,
  options: {
    folder: string
    resourceType: 'image' | 'video' | 'auto'
    filename?: string
  },
): Promise<CloudinaryUploadResult> {
  ensureConfigured()

  type UploadResult = {
    secure_url: string
    public_id: string
    resource_type: string
    bytes: number
    width?: number
    height?: number
  }

  const result = await new Promise<UploadResult>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder,
        resource_type: options.resourceType,
        public_id: options.filename,
        overwrite: true,
        unique_filename: !options.filename,
      },
      (error, uploadResult) => {
        if (error || !uploadResult) {
          reject(error ?? new Error('Cloudinary upload failed'))
          return
        }
        resolve(uploadResult as UploadResult)
      },
    )
    stream.end(buffer)
  })

  const resourceType =
    result.resource_type === 'video' ? 'video' : 'image'

  return {
    url: result.secure_url,
    publicId: result.public_id,
    resourceType,
    bytes: result.bytes,
    width: result.width,
    height: result.height,
  }
}

export function buildCloudinaryDeliveryUrl(
  publicId: string,
  options?: { width?: number },
): string {
  const { cloudName } = getCloudinaryConfig()
  if (!cloudName) return ''
  const transforms = ['f_auto', 'q_auto']
  if (options?.width) transforms.push(`w_${options.width}`)
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms.join(',')}/${publicId}`
}
