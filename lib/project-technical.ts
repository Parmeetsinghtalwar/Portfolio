import type { Project } from '@/lib/projects'
import { PROJECT_TECHNICAL_SPECS } from '@/lib/project-technical-specs'

export type TechnicalLayer = {
  title: string
  detail: string
}

export type TechnicalFlowStep = {
  step: string
  title: string
  body: string
}

export type TechnicalIO = {
  label: string
  format: string
  description: string
}

export type TechnicalResult = {
  label: string
  value: string
  detail?: string
}

export type TechnologyGroup = {
  group: string
  items: string[]
}

export type ProjectTechnicalSpec = {
  summary: string
  /** Plain monospace diagram — boxes and arrows */
  diagram?: string
  layers?: TechnicalLayer[]
  flow?: TechnicalFlowStep[]
  technologies: TechnologyGroup[]
  inputs: TechnicalIO[]
  outputs: TechnicalIO[]
  results: TechnicalResult[]
}

function stackToTechnologies(stack: string[]): TechnologyGroup[] {
  return [{ group: 'Stack', items: stack }]
}

function highlightsToResults(
  highlights: string[],
  metrics?: Project['metrics'],
): TechnicalResult[] {
  if (metrics?.length) {
    return metrics.map((m) => ({
      label: m.label,
      value: m.value,
    }))
  }
  return highlights.slice(0, 4).map((h, i) => {
    const [label, ...rest] = h.split('—').map((s) => s.trim())
    if (rest.length) {
      return { label: label ?? `Outcome ${i + 1}`, value: rest.join(' — ') }
    }
    const colon = h.indexOf(':')
    if (colon > 0) {
      return {
        label: h.slice(0, colon).trim(),
        value: h.slice(colon + 1).trim(),
      }
    }
    return { label: `Outcome ${i + 1}`, value: h }
  })
}

function defaultLayers(project: Project): TechnicalLayer[] {
  const stack = project.stack.slice(0, 4).join(' · ')
  return [
    {
      title: 'Client / ingress',
      detail: `User-facing surface for ${project.title}: web app, API clients, or channel webhooks depending on the product.`,
    },
    {
      title: 'Application layer',
      detail: `Core business logic and orchestration built with ${stack || 'the project stack'}.`,
    },
    {
      title: 'Data & integrations',
      detail:
        'Persistence, queues, external APIs, and export paths that feed the outputs below.',
    },
  ]
}

function defaultDiagram(project: Project, layers: TechnicalLayer[]): string {
  const names = layers.map((l) => l.title.split('/')[0].trim())
  const line = names.join('  →  ')
  return [
    `┌─────────────────────────────────────────────────────────┐`,
    `│  ${project.title}`,
    `└─────────────────────────────────────────────────────────┘`,
    ``,
    `  ${line}`,
    ``,
    `  Inputs  ──►  Process  ──►  Outputs / results`,
  ].join('\n')
}

export function buildDefaultTechnical(project: Project): ProjectTechnicalSpec {
  const layers = project.architecture?.length
    ? project.architecture.map((n) => ({
        title: n.title,
        detail: n.detail,
      }))
    : defaultLayers(project)

  return {
    summary: project.description,
    layers,
    diagram: defaultDiagram(project, layers),
    technologies: stackToTechnologies(project.stack),
    inputs: [
      {
        label: 'Primary input',
        format: 'User / operator data',
        description: project.tagline,
      },
    ],
    outputs: [
      {
        label: 'Primary deliverable',
        format: project.status,
        description:
          project.highlights[0] ?? project.description.slice(0, 160),
      },
    ],
    results: highlightsToResults(project.highlights, project.metrics),
  }
}

function mergeSpec(
  base: ProjectTechnicalSpec,
  custom: Partial<ProjectTechnicalSpec>,
): ProjectTechnicalSpec {
  return {
    summary: custom.summary ?? base.summary,
    diagram: custom.diagram ?? base.diagram,
    layers: custom.layers ?? base.layers,
    flow: custom.flow ?? base.flow,
    technologies: custom.technologies?.length
      ? custom.technologies
      : base.technologies,
    inputs: custom.inputs?.length ? custom.inputs : base.inputs,
    outputs: custom.outputs?.length ? custom.outputs : base.outputs,
    results: custom.results?.length ? custom.results : base.results,
  }
}

export function getProjectTechnical(
  project: Project,
  overrides?: Partial<ProjectTechnicalSpec>,
): ProjectTechnicalSpec {
  const custom = PROJECT_TECHNICAL_SPECS[project.id]
  const base = buildDefaultTechnical(project)
  return mergeSpec(mergeSpec(base, custom ?? {}), overrides ?? {})
}
