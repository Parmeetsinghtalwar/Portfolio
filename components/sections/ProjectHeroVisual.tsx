import Image from 'next/image'
import { getProjectVisual } from '@/lib/project-visuals'

type ProjectHeroVisualProps = {
  projectId: string
}

export function ProjectHeroVisual({ projectId }: ProjectHeroVisualProps) {
  const visual = getProjectVisual(projectId)
  if (!visual?.hero) return null

  return (
    <section className="relative -mx-6 mt-10 overflow-hidden rounded-2xl md:-mx-0 md:mt-12">
      <div className="relative aspect-[16/9] w-full bg-foreground/[0.04]">
        <Image
          src={visual.hero}
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 896px, 100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/40 to-black/15"
          aria-hidden
        />
        <blockquote className="absolute inset-x-0 bottom-0 p-6 md:p-10 lg:p-12">
          <p className="max-w-3xl font-editorial text-2xl font-medium leading-snug tracking-tight text-white md:text-4xl md:leading-[1.15]">
            &ldquo;{visual.quote}&rdquo;
          </p>
          <cite className="mt-4 block font-mono text-[11px] not-italic uppercase tracking-[0.2em] text-white/55">
            — {visual.attribution}
          </cite>
        </blockquote>
      </div>
    </section>
  )
}
