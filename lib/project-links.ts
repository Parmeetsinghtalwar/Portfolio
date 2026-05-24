import type { ProjectLink } from '@/lib/projects'

const APEX_CLOUD_HOST = 'apexneural.cloud'

export function isApexNeuralCloudUrl(href: string): boolean {
  try {
    const host = new URL(href, 'https://placeholder.local').hostname
    return host === APEX_CLOUD_HOST || host.endsWith(`.${APEX_CLOUD_HOST}`)
  } catch {
    return href.includes(APEX_CLOUD_HOST)
  }
}

export function isGitHubUrl(href: string): boolean {
  try {
    const host = new URL(href, 'https://placeholder.local').hostname
    return host === 'github.com' || host.endsWith('.github.io')
  } catch {
    return href.includes('github.com')
  }
}

export function filterPublicProjectLinks(links: ProjectLink[] | undefined): ProjectLink[] {
  if (!links?.length) return []
  return links.filter(
    (link) => !isApexNeuralCloudUrl(link.href) && !isGitHubUrl(link.href),
  )
}
