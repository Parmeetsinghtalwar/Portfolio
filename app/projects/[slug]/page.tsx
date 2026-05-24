import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { Nav } from '@/components/ui/Nav'
import { ProjectDetail } from '@/components/sections/ProjectDetail'
import {
  LEGACY_PROJECT_SLUGS,
  PROJECTS,
  getAllProjectSlugs,
  getProjectById,
} from '@/lib/projects'

type RouteParams = { slug: string }

export function generateStaticParams(): RouteParams[] {
  return getAllProjectSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>
}): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectById(slug)
  if (!project) return { title: 'Project not found' }
  const description = project.story?.lede ?? project.tagline
  return {
    title: project.story?.headline ?? project.title,
    description,
    openGraph: {
      title: `${project.title} · Parmeet Singh Talwar`,
      description,
      type: 'article',
    },
  }
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/45">
      {children}
    </p>
  )
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<RouteParams>
}) {
  const { slug } = await params
  const canonicalSlug = LEGACY_PROJECT_SLUGS[slug]
  if (canonicalSlug) {
    redirect(`/projects/${canonicalSlug}`)
  }
  const project = getProjectById(slug)
  if (!project) notFound()

  const otherProjects = PROJECTS.filter((p) => p.id !== project.id).slice(0, 3)

  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <Nav />

      <article className="mx-auto max-w-4xl px-6 pb-24 pt-32 md:pt-36">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-foreground/55 transition hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All projects
        </Link>

        <div className="mt-10">
          <ProjectDetail project={project} />
        </div>

        {otherProjects.length ? (
          <section className="mt-24 border-t border-foreground/10 pt-12">
            <SectionLabel>More work</SectionLabel>
            <ul className="mt-6 grid gap-4 md:grid-cols-3">
              {otherProjects.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/projects/${p.id}`}
                    className="group flex h-full flex-col justify-between gap-4 rounded-2xl border border-foreground/12 p-5 transition hover:border-foreground/30"
                  >
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-foreground/45">
                        {p.story ? 'Story' : p.status} · {p.period}
                      </p>
                      <p className="mt-2 text-lg font-semibold tracking-tight">
                        {p.title}
                      </p>
                      <p className="mt-1 text-sm text-foreground/65">
                        {p.story?.subtitle ?? p.tagline}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] text-foreground/55 group-hover:text-foreground">
                      View project
                      <ArrowUpRight className="h-3 w-3" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </article>
    </main>
  )
}
