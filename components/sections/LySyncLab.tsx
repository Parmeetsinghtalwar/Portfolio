'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { MultiLangVideoPlayer } from '@/app/components/MultiLangVideoPlayer'
import { LySyncWorkflow } from '@/components/sections/LySyncWorkflow'
import { LYSYNC_LAB_COPY, LYSYNC_LEARNING_POINTS } from '@/lib/lysync-lab'
import {
  AITV_PLAYER_CAPTION,
  AITV_PLAYER_LANGUAGES,
} from '@/lib/aitv-player'

export function LySyncLab() {
  const copy = LYSYNC_LAB_COPY

  return (
    <section
      id="lysync"
      className="relative border-t border-foreground/10 bg-background py-24 text-foreground md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 md:grid-cols-12 md:items-start">
          <div className="md:col-span-5 md:sticky md:top-24">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-foreground/50">
              {copy.eyebrow}
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
              {copy.title}
            </h2>
            <span className="mt-4 inline-flex rounded-full border border-foreground/20 bg-foreground/[0.03] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-foreground/70">
              {copy.statusLabel}
            </span>
            <p className="mt-6 text-lg leading-relaxed text-foreground/65">{copy.lede}</p>
            <Link
              href="/player"
              className="mt-8 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-foreground/55 transition hover:text-foreground"
            >
              Open multilang player
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="md:col-span-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/45">
              How I am learning
            </p>
            <ul className="mt-4 space-y-4">
              {LYSYNC_LEARNING_POINTS.map((point) => (
                <li
                  key={point}
                  className="border-l border-foreground/20 pl-4 text-sm leading-relaxed text-foreground/70 md:text-base"
                >
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/45">
            Pipeline · open-source stack
          </p>
          <h3 className="mt-3 text-xl font-semibold tracking-tight md:text-2xl">
            One master performance in, multilingual lip-synced dubs out
          </h3>
          <LySyncWorkflow variant="full" className="mt-8" />
        </div>

        <div className="mt-12 md:mt-16">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/45">
                Live demo · LySync outputs
              </p>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-foreground/60">
                Five language renders from the same open-source LySync run.
                Switch tracks to compare lip timing and energy — playback position
                and play state carry over; when one dub ends, the player cycles
                to the next so you can hear alignment across the pipeline.
              </p>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-foreground/40">
              Click video · unmute · switch language below
            </p>
          </div>

          <MultiLangVideoPlayer
            languages={AITV_PLAYER_LANGUAGES}
            defaultLang="en"
            caption={AITV_PLAYER_CAPTION}
          />
        </div>
      </div>
    </section>
  )
}
