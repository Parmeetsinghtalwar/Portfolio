import manifest from '@/data/project-visuals.json'

export type ProjectVisual = {
  /** Wide hero on project page — image has no text */
  hero: string
  /** Hover / list preview — may include stylized title text */
  preview: string
  /** Famous movie quote */
  quote: string
  /** Film attribution, e.g. "The Matrix (1999)" */
  attribution: string
  heroImagePrompt?: string
  previewImagePrompt?: string
}

export type ProjectVisualsManifest = Record<string, ProjectVisual>

const VISUALS = manifest as ProjectVisualsManifest

export function getProjectVisual(projectId: string): ProjectVisual | undefined {
  const entry = VISUALS[projectId]
  if (!entry) return undefined
  if ('hero' in entry && entry.hero) return entry
  const legacy = entry as ProjectVisual & { preview?: string }
  if (legacy.preview && !legacy.hero) {
    return {
      hero: legacy.preview,
      preview: legacy.preview,
      quote: legacy.quote,
      attribution: legacy.attribution ?? '',
    }
  }
  return entry
}

export function getAllProjectVisuals(): ProjectVisualsManifest {
  return VISUALS
}
