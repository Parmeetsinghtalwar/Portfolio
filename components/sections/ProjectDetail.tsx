import { ArrowUpRight } from 'lucide-react'
import { ProjectTechnicalSection } from '@/components/sections/ProjectTechnical'
import { ProjectStoryNarrative } from '@/components/sections/ProjectStory'
import { getProjectTechnical } from '@/lib/project-technical'
import type { Project } from '@/lib/projects'
import { cn } from '@/lib/utils'

const STATUS_STYLES: Record<Project['status'], string> = {
  Live: 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/25',
  Production: 'bg-blue-500/10 text-blue-800 ring-blue-500/25',
  Building: 'bg-amber-500/10 text-amber-800 ring-amber-500/25',
  Research: 'bg-violet-500/10 text-violet-800 ring-violet-500/25',
  'Open source': 'bg-foreground/5 text-foreground/80 ring-foreground/15',
}

type ProjectDetailProps = {
  project: Project
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  const spec = getProjectTechnical(project)
  const story = project.story
  const title = story?.headline ?? project.title
  const subtitle = story?.subtitle ?? project.tagline

  return (
    <div className="mx-auto max-w-4xl">
      <header className="border-b border-foreground/10 pb-10">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={cn(
              'rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ring-1',
              STATUS_STYLES[project.status],
            )}
          >
            {project.status}
          </span>
          <span className="font-mono text-xs text-foreground/45">
            {project.period}
          </span>
          <span className="font-mono text-xs text-foreground/45">·</span>
          <span className="font-mono text-xs text-foreground/55">
            {project.role}
          </span>
        </div>

        <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-6xl">
          {title}
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-foreground/70 md:text-xl">
          {subtitle}
        </p>

        {(story?.social ?? project.links)?.length ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {(story?.social ?? project.links ?? []).map((link) => (
              <a
                key={link.href}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={
                  link.href.startsWith('http')
                    ? 'noopener noreferrer'
                    : undefined
                }
                className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 bg-foreground/[0.03] px-3.5 py-1.5 font-mono text-xs text-foreground/80 transition hover:border-foreground/40 hover:text-foreground"
              >
                {link.label}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        ) : null}
      </header>

      <div className="mt-14">
        <ProjectTechnicalSection spec={spec} projectId={project.id} />
      </div>

      {story ? (
        <div className="mt-16 md:mt-20">
          <ProjectStoryNarrative project={project} story={story} />
        </div>
      ) : (
        <ProjectWhyBuilt project={project} />
      )}
    </div>
  )
}

function ProjectWhyBuilt({ project }: { project: Project }) {
  const hasNarrative =
    project.problem ||
    project.solution ||
    (project.overview?.length ?? 0) > 0

  if (!hasNarrative) return null

  return (
    <section className="space-y-10">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/45">
          Narrative
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
          Why this was built
        </h2>
      </div>

      {project.problem ? (
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/45">
            The problem
          </p>
          <p className="mt-4 text-base leading-relaxed text-foreground/75 md:text-lg">
            {project.problem}
          </p>
        </div>
      ) : null}

      {project.solution ? (
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/45">
            What I built
          </p>
          <p className="mt-4 text-base leading-relaxed text-foreground/75 md:text-lg">
            {project.solution}
          </p>
        </div>
      ) : null}

      {project.overview?.length ? (
        <div className="space-y-4">
          {(project.overview ?? [project.description]).map((para, i) => (
            <p
              key={i}
              className="text-base leading-relaxed text-foreground/75 md:text-lg"
            >
              {para}
            </p>
          ))}
        </div>
      ) : (
        <p className="text-base leading-relaxed text-foreground/75 md:text-lg">
          {project.description}
        </p>
      )}

      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/45">
          Highlights
        </p>
        <ul className="mt-4 space-y-3">
          {project.highlights.map((item) => (
            <li
              key={item}
              className="flex gap-3 text-base leading-relaxed text-foreground/75"
            >
              <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-foreground/40" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
