const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

export function isCloudinaryCdnEnabled(): boolean {
  return Boolean(cloudName)
}

export function cloudinaryImageUrl(
  publicId: string,
  options?: { width?: number },
): string | null {
  if (!cloudName) return null
  const transforms = ['f_auto', 'q_auto']
  if (options?.width) transforms.push(`w_${options.width}`)
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms.join(',')}/${publicId}`
}

export function cloudinaryVideoUrl(publicId: string): string | null {
  if (!cloudName) return null
  return `https://res.cloudinary.com/${cloudName}/video/upload/f_auto,q_auto/${publicId}`
}
