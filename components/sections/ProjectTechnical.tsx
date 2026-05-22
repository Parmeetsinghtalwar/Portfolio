import { ArrowDown } from 'lucide-react'
import { ProjectArchitectureFlowClient } from '@/components/sections/ProjectArchitectureFlowClient'
import {
  PROJECT_ARCHITECTURE_GRAPHS,
  type ProjectArchitectureGraph,
} from '@/lib/project-architecture'
import type { ProjectTechnicalSpec } from '@/lib/project-technical'
import { cn } from '@/lib/utils'

function SectionHeading({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <h2
      className={cn(
        'text-2xl font-semibold tracking-tight md:text-3xl',
        className,
      )}
    >
      {children}
    </h2>
  )
}

function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/45">
      {children}
    </p>
  )
}

type ProjectTechnicalProps = {
  spec: ProjectTechnicalSpec
  projectId: string
}

export function ProjectTechnicalSection({
  spec,
  projectId,
}: ProjectTechnicalProps) {
  const graph: ProjectArchitectureGraph | undefined =
    PROJECT_ARCHITECTURE_GRAPHS[projectId]

  return (
    <section className="space-y-16 border-b border-foreground/10 pb-16 md:space-y-20 md:pb-20">
      <div>
        <SubLabel>Engineering</SubLabel>
        <SectionHeading className="mt-3">Overview</SectionHeading>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-foreground/75 md:text-lg">
          {spec.summary}
        </p>
      </div>

      {graph ? (
        <div>
          <SubLabel>Architecture</SubLabel>
          <SectionHeading className="mt-3">System architecture</SectionHeading>
          <p className="mt-2 max-w-2xl text-sm text-foreground/60">
            Hover or tap any service to see what it does, what tech runs it, and
            how it connects to the rest of the system.
          </p>
          <div className="mt-6">
            <ProjectArchitectureFlowClient graph={graph} />
          </div>
        </div>
      ) : spec.diagram ? (
        <div>
          <SubLabel>Architecture</SubLabel>
          <SectionHeading className="mt-3">System architecture</SectionHeading>
          <p className="mt-2 max-w-2xl text-sm text-foreground/60">
            High-level data flow and major components.
          </p>
          <pre
            className="mt-6 overflow-x-auto rounded-2xl border border-foreground/12 bg-foreground/[0.03] p-5 font-mono text-[11px] leading-relaxed text-foreground/85 md:p-6 md:text-xs"
            aria-label="System architecture diagram"
          >
            {spec.diagram}
          </pre>
        </div>
      ) : null}

      {spec.layers?.length ? (
        <div>
          {!spec.diagram && !graph ? (
            <>
              <SubLabel>Architecture</SubLabel>
              <SectionHeading className="mt-3">System architecture</SectionHeading>
            </>
          ) : (
            <SectionHeading>Architecture layers</SectionHeading>
          )}
          <div className="mt-8 space-y-3">
            {spec.layers.map((layer, i) => (
              <article
                key={layer.title}
                className="grid gap-3 rounded-2xl border border-foreground/12 bg-foreground/[0.02] p-5 md:grid-cols-[100px_1fr]"
              >
                <p className="font-mono text-xs font-semibold text-foreground/55">
                  L{i + 1}
                </p>
                <div>
                  <h3 className="text-base font-semibold tracking-tight">
                    {layer.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                    {layer.detail}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : null}

      {spec.flow?.length ? (
        <div>
          <SectionHeading>Message / data flow</SectionHeading>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {spec.flow.map((step) => (
              <div
                key={step.step}
                className="rounded-xl border border-foreground/12 p-5"
              >
                <p className="font-mono text-xs font-semibold text-foreground/50">
                  {step.step}
                </p>
                <h4 className="mt-2 font-semibold tracking-tight">{step.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div>
        <SubLabel>Stack</SubLabel>
        <SectionHeading className="mt-3">Technologies used</SectionHeading>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {spec.technologies.map((group) => (
            <div
              key={group.group}
              className="rounded-2xl border border-foreground/12 p-5"
            >
              <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-foreground/50">
                {group.group}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-foreground/12 px-2.5 py-1 font-mono text-[11px] text-foreground/75"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionHeading>Inputs & outputs</SectionHeading>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <IOTable title="Inputs" items={spec.inputs} />
          <IOTable title="Outputs" items={spec.outputs} />
        </div>
      </div>

      {spec.results.length ? (
        <div>
          <SectionHeading>Results</SectionHeading>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {spec.results.map((result) => (
              <div
                key={`${result.label}-${result.value}`}
                className="rounded-2xl border border-foreground/12 bg-foreground/[0.02] p-5"
              >
                <p className="text-2xl font-semibold tracking-tight md:text-3xl">
                  {result.value}
                </p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-foreground/50">
                  {result.label}
                </p>
                {result.detail ? (
                  <p className="mt-2 text-sm text-foreground/65">{result.detail}</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex justify-center pt-2">
        <ArrowDown className="h-5 w-5 text-foreground/30" aria-hidden />
      </div>
    </section>
  )
}

function IOTable({
  title,
  items,
}: {
  title: string
  items: ProjectTechnicalSpec['inputs']
}) {
  return (
    <div className="rounded-2xl border border-foreground/12 overflow-hidden">
      <p className="border-b border-foreground/10 bg-foreground/[0.03] px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-foreground/55">
        {title}
      </p>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-foreground/10 font-mono text-[10px] uppercase tracking-wider text-foreground/45">
            <th className="px-5 py-2.5 font-medium">Name</th>
            <th className="px-5 py-2.5 font-medium">Format</th>
          </tr>
        </thead>
        <tbody>
          {items.map((row) => (
            <tr
              key={row.label}
              className="border-b border-foreground/8 last:border-0"
            >
              <td className="align-top px-5 py-4 font-medium text-foreground">
                {row.label}
              </td>
              <td className="align-top px-5 py-4">
                <p className="font-mono text-[11px] text-foreground/55">
                  {row.format}
                </p>
                <p className="mt-1.5 leading-relaxed text-foreground/70">
                  {row.description}
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
