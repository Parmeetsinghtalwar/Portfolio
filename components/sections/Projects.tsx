'use client'

import { ProjectHoverModal } from '@/components/ui/project-hover-modal'
import { PROJECTS } from '@/lib/projects'
import { projectsToHoverItems } from '@/lib/project-hover'

const HOVER_ITEMS = projectsToHoverItems(PROJECTS)

export function Projects() {
  return (
    <section
      id="projects"
      className="relative bg-background py-24 text-foreground md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-4">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-foreground/50">
              05 · Selected work
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
              Projects
            </h2>
          </div>

          <div className="md:col-span-7 md:col-start-6">
            <p className="text-base leading-relaxed text-foreground/65 md:text-lg">
              Hover a row — preview follows your cursor. Click for architecture,
              stack, I/O, results — then why it was built.
            </p>
            <p className="mt-2 font-mono text-xs text-foreground/45">
              Showing 4 of {PROJECTS.length} · hover for preview
            </p>
          </div>
        </div>

        <ProjectHoverModal items={HOVER_ITEMS} />
      </div>
    </section>
  )
}
