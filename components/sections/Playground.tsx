'use client'

import { AutomationFinder } from '@/components/ui/AutomationFinder'
import { PLAYGROUND_COPY, PLAYGROUND_SKILLS } from '@/lib/playground'

export function Playground() {
  return (
    <section
      id="playground"
      className="relative border-t border-foreground/10 py-24 md:py-32"
      style={{
        backgroundColor: '#f0ebe3',
        backgroundImage: `
          linear-gradient(rgba(61, 56, 50, 0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(61, 56, 50, 0.04) 1px, transparent 1px)
        `,
        backgroundSize: '24px 24px',
      }}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 text-center md:mb-10">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-foreground/50">
            {PLAYGROUND_COPY.eyebrow}
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
            {PLAYGROUND_COPY.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-foreground/65 md:text-lg">
            {PLAYGROUND_COPY.lede}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {PLAYGROUND_SKILLS.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-foreground/12 bg-background/80 px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-foreground/65"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <p className="mb-6 text-center font-mono text-sm text-foreground/55 md:text-base">
          {PLAYGROUND_COPY.finderHint}
        </p>

        <AutomationFinder />
      </div>
    </section>
  )
}
