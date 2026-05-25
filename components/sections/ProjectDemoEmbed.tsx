'use client'

import { GenericProjectDemo } from '@/components/sections/GenericProjectDemo'
import { SocialHubDemoLaunch } from '@/components/sections/SocialHubDemoLaunch'
import { UnifyDemoEmbed } from '@/components/sections/UnifyDemoEmbed'
import { getProjectDemo } from '@/lib/project-demos'

type ProjectDemoEmbedProps = {
  projectId: string
}

export function ProjectDemoEmbed({ projectId }: ProjectDemoEmbedProps) {
  const config = getProjectDemo(projectId)
  if (!config) return null

  if (config.embed === 'unify') {
    return <UnifyDemoEmbed />
  }

  if (config.embed === 'socialhub') {
    return (
      <div className="overflow-hidden rounded-2xl border border-foreground/12 bg-foreground/[0.02]">
        <SocialHubDemoLaunch />
      </div>
    )
  }

  return <GenericProjectDemo config={config} />
}
