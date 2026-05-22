'use client'

import dynamic from 'next/dynamic'
import type { ProjectArchitectureGraph } from '@/lib/project-architecture'

const ProjectArchitectureFlow = dynamic(
  () =>
    import('@/components/sections/ProjectArchitectureFlow').then(
      (m) => m.ProjectArchitectureFlow,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[640px] w-full items-center justify-center rounded-2xl border border-foreground/12 bg-foreground/[0.02] font-mono text-xs text-foreground/55">
        Loading interactive architecture…
      </div>
    ),
  },
)

export function ProjectArchitectureFlowClient({
  graph,
}: {
  graph: ProjectArchitectureGraph
}) {
  return <ProjectArchitectureFlow graph={graph} />
}
