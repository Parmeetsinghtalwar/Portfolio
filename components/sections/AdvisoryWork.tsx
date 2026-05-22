'use client'

import { ScrollExpandImage } from '@/components/sections/ScrollExpandImage'
import { GetZonedScrollSidePanel } from '@/components/sections/GetZonedScrollSidePanel'
import {
  GETZONED_EXPAND_COPY,
  GETZONED_EXPAND_IMAGE,
  GETZONED_THEME,
} from '@/lib/getzoned-scroll'

export function AdvisoryWork() {
  const copy = GETZONED_EXPAND_COPY

  return (
    <section
      id="advisory"
      className="relative border-t border-foreground/10 bg-background text-foreground"
    >
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="max-w-3xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-foreground/70">
            02 · Advisory
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            {copy.title}
          </h2>
          <p className="mt-4 text-base font-medium leading-relaxed text-foreground/80 md:text-lg">
            {copy.subtitle}
          </p>
        </div>
      </div>

      <div className="pb-24 md:pb-32">
        <ScrollExpandImage
          src={GETZONED_EXPAND_IMAGE}
          alt="GetZoned — connection in real life"
          scrollHint={copy.scrollHint}
          themeBg={GETZONED_THEME.pinBg}
          sidePanel={<GetZonedScrollSidePanel />}
        />
      </div>
    </section>
  )
}
