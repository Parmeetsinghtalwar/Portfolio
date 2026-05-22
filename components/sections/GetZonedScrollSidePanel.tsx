import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import {
  GETZONED_BLUR_IMAGE,
  GETZONED_EXPAND_COPY,
  GETZONED_THEME,
} from '@/lib/getzoned-scroll'

export function GetZonedScrollSidePanel() {
  const copy = GETZONED_EXPAND_COPY
  const t = GETZONED_THEME

  return (
    <div
      className="flex h-full min-h-0 flex-col justify-center px-6 py-10 md:px-8 md:py-14 lg:px-10"
      style={{ color: t.sideText }}
    >
      <div className="relative mx-auto aspect-[4/3] w-full max-w-sm overflow-hidden rounded-xl shadow-xl ring-1 ring-[#c9a87c]/40">
        <Image
          src={GETZONED_BLUR_IMAGE}
          alt="GetZoned app — events and connections"
          fill
          className="object-cover"
          sizes="(min-width: 768px) 38vw, 90vw"
        />
      </div>

      <p
        className="mt-8 font-mono text-[11px] font-semibold uppercase tracking-[0.24em]"
        style={{ color: t.sideTextMuted }}
      >
        {copy.sideEyebrow}
      </p>
      <h3
        className="mt-3 text-3xl font-bold tracking-tight md:text-4xl"
        style={{ color: t.sideText }}
      >
        {copy.sideTitle}
      </h3>
      <p
        className="mt-4 text-base font-semibold leading-relaxed md:text-lg"
        style={{ color: t.sideText }}
      >
        {copy.sideBody}
      </p>
      <p
        className="mt-4 text-base font-bold leading-relaxed md:text-lg"
        style={{ color: t.sideTextAccent }}
      >
        {copy.sideQuote}
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href={copy.viewStoryHref}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          style={{ backgroundColor: t.accent }}
        >
          {copy.viewStoryLabel}
          <ArrowUpRight className="h-4 w-4" />
        </Link>
        <Link
          href="https://getzoned.in"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-white/35 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          getzoned.in
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
