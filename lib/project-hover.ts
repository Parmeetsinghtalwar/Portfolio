import { getProjectVisual } from '@/lib/project-visuals'
import type { Project } from '@/lib/projects'

export type ProjectHoverItem = {
  id: string
  title: string
  subtitle: string
  href: string
  color: string
  image: string
}

/** Fallback previews until you add `/public/projects/<id>/preview.jpg` */
const PREVIEW_FALLBACK: Record<string, string> = {
  getzoned:
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
  socialhub:
    'https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=800&q=80',
  prism:
    'https://images.unsplash.com/photo-1521737711864-e399b85bbf0b?auto=format&fit=crop&w=800&q=80',
  'content-phase':
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
  'sugarcane-health-ml':
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80',
  'web-scraper-evasion':
    'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=800&q=80',
  'ai-cost-optimizer':
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
  'yolo-sports-tracking':
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
  'course-studio':
    'https://images.unsplash.com/photo-1501504904252-d72951365796?auto=format&fit=crop&w=800&q=80',
  'data-lineage':
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
  'linkedin-job-scraper':
    'https://images.unsplash.com/photo-1611947881359-aa9a2e849c2a?auto=format&fit=crop&w=800&q=80',
  'b2b-lead-platform':
    'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800&q=80',
  madhost:
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
  'ai-twitter-post-generator':
    'https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=800&q=80',
  'fitzgerald-lora-pipeline':
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80',
  'getzoned-marketing':
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
  unify:
    'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80',
  taleweaver:
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80',
  'kalamandir-agent':
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
  'football-analytics':
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
}

const DEFAULT_PREVIEW =
  'https://images.unsplash.com/photo-1555066931-4369d14bab8c?auto=format&fit=crop&w=800&q=80'

const HOVER_COLORS = [
  '#0a0a0a',
  '#e8e4dc',
  '#525252',
  '#f5f5f5',
  '#171717',
  '#d4d4d4',
  '#404040',
  '#fafafa',
]

export function projectsToHoverItems(projects: Project[]): ProjectHoverItem[] {
  return projects.map((project, index) => {
    const visual = getProjectVisual(project.id)
    return {
      id: project.id,
      title: project.title,
      subtitle: project.story
        ? 'Story'
        : `${project.status} · ${project.period}`,
      href: `/projects/${project.id}`,
      color: HOVER_COLORS[index % HOVER_COLORS.length],
      image:
        visual?.preview ??
        project.preview ??
        project.cover ??
        PREVIEW_FALLBACK[project.id] ??
        DEFAULT_PREVIEW,
    }
  })
}
