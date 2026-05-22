import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SocialHubDemoLaunch } from '@/components/sections/SocialHubDemoLaunch'
import type { Project } from '@/lib/projects'
import type { ProjectStory, StoryBlock } from '@/lib/project-story'

function StoryBlockView({ block }: { block: StoryBlock }) {
  switch (block.type) {
    case 'chapter':
      return (
        <header className="pt-12 first:pt-0 md:pt-16">
          {block.when ? (
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-foreground/45">
              {block.when}
            </p>
          ) : null}
          <h3 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
            {block.title}
          </h3>
        </header>
      )

    case 'prose':
      return (
        <div className="space-y-5">
          {block.paragraphs.map((para) => (
            <p
              key={para.slice(0, 48)}
              className="text-lg leading-[1.75] text-foreground/80 md:text-xl md:leading-[1.8]"
            >
              {para}
            </p>
          ))}
        </div>
      )

    case 'quote':
      return (
        <blockquote className="border-l-2 border-foreground/20 py-2 pl-6 md:pl-8">
          <p className="text-xl font-medium leading-relaxed tracking-tight text-foreground md:text-2xl">
            {block.text}
          </p>
          {block.attribution ? (
            <cite className="mt-4 block font-mono text-xs not-italic text-foreground/50">
              — {block.attribution}
            </cite>
          ) : null}
        </blockquote>
      )

    case 'image':
      return (
        <figure
          className={
            block.fullWidth ? '-mx-6 md:-mx-12 lg:-mx-24' : undefined
          }
        >
          <div
            className={`relative overflow-hidden bg-foreground/[0.03] ${
              block.fullWidth ? 'aspect-[16/10]' : 'aspect-[4/3] rounded-2xl'
            }`}
          >
            <Image
              src={block.src}
              alt={block.alt}
              fill
              sizes={
                block.fullWidth
                  ? '(min-width: 1024px) 1200px, 100vw'
                  : '(min-width: 768px) 672px, 100vw'
              }
              className="object-cover"
            />
          </div>
          {block.caption ? (
            <figcaption className="mt-3 font-mono text-[11px] text-foreground/50">
              {block.caption}
            </figcaption>
          ) : null}
        </figure>
      )

    case 'divider':
      return <hr className="border-foreground/10" />

    default:
      return null
  }
}

type ProjectStoryNarrativeProps = {
  project: Project
  story: ProjectStory
}

/** Chapters covered by ProjectTechnicalSection — omit from narrative to avoid duplication. */
const TECHNICAL_CHAPTER_TITLES = new Set([
  'System architecture',
  'Results & impact',
  'Architecture',
  'Engineering',
])

function filterNarrativeBlocks(blocks: StoryBlock[]): StoryBlock[] {
  const filtered: StoryBlock[] = []
  let i = 0

  while (i < blocks.length) {
    const block = blocks[i]
    if (
      block.type === 'chapter' &&
      TECHNICAL_CHAPTER_TITLES.has(block.title)
    ) {
      i += 1
      while (i < blocks.length && blocks[i].type !== 'chapter') i += 1
      continue
    }
    filtered.push(block)
    i += 1
  }

  return filtered
}

/** Narrative blocks only — rendered below engineering spec on project pages. */
export function ProjectStoryNarrative({
  project,
  story,
}: ProjectStoryNarrativeProps) {
  const blocks = filterNarrativeBlocks(story.blocks)

  return (
    <section className="border-t border-foreground/10 pt-16 md:pt-20">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/45">
        Narrative
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
        Why this was built
      </h2>

      {story.lede ? (
        <p className="mt-6 text-lg leading-[1.75] text-foreground/75 md:text-xl">
          {story.lede}
        </p>
      ) : null}

      {story.byline ? (
        <p className="mt-4 font-mono text-xs text-foreground/50">{story.byline}</p>
      ) : null}

      {project.id === 'socialhub' ? (
        <div className="mt-8 border-t border-foreground/10 pt-8">
          <SocialHubDemoLaunch />
        </div>
      ) : null}

      {story.people?.length ? (
        <ul className="mt-8 flex flex-wrap gap-3">
          {story.people.map((person) => (
            <li key={person.name}>
              {person.href ? (
                <a
                  href={person.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-4 py-2 font-mono text-xs transition hover:border-foreground/35"
                >
                  {person.name}
                  {person.role ? (
                    <span className="text-foreground/45">· {person.role}</span>
                  ) : null}
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              ) : (
                <span className="rounded-full border border-foreground/15 px-4 py-2 font-mono text-xs">
                  {person.name}
                </span>
              )}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-12 space-y-12 md:space-y-16">
        {blocks.map((block, i) => (
          <StoryBlockView key={`${block.type}-${i}`} block={block} />
        ))}
      </div>

      {story.closing ? (
        <p className="mt-16 border-t border-foreground/10 pt-10 font-mono text-sm leading-relaxed text-foreground/55">
          {story.closing}
        </p>
      ) : null}
    </section>
  )
}

/** @deprecated Use ProjectDetail — kept for any direct imports */
export function ProjectStoryView({
  project,
  story,
}: ProjectStoryNarrativeProps) {
  return <ProjectStoryNarrative project={project} story={story} />
}
