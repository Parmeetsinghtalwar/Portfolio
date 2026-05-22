'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, Feather, Quote } from 'lucide-react'
import { TaleweaverStudioDemo } from '@/components/taleweaver/TaleweaverStudioDemo'
import {
  TALEWEAVER_FEATURES,
  TALEWEAVER_GENRES,
  TALEWEAVER_LIVE_URL,
  TALEWEAVER_STATS,
  TALEWEAVER_STEPS,
} from '@/lib/taleweaver-landing'

export function TaleweaverLanding() {
  return (
    <div className="min-h-screen bg-[#fffdf8] text-amber-950 antialiased">
      <header className="sticky top-0 z-50 border-b border-amber-900/10 bg-[#fffdf8]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-6">
            <Link
              href="/#projects"
              className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-amber-900/50 transition hover:text-amber-950"
            >
              <ArrowLeft className="h-3 w-3" />
              Portfolio
            </Link>
            <span className="flex items-center gap-2 font-editorial text-xl font-medium tracking-tight">
              <Feather className="h-4 w-4 text-amber-800" />
              Taleweaver
            </span>
          </div>
          <p className="hidden font-mono text-[10px] uppercase tracking-wider text-amber-900/45 sm:block">
            ships as Bookgen
          </p>
          <a
            href={TALEWEAVER_LIVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full bg-amber-950 px-4 py-2 text-sm font-medium text-amber-50 transition hover:bg-amber-900"
          >
            Live on Bookgen
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden px-6 pb-16 pt-16 md:pb-24 md:pt-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-5%,rgba(180,130,70,0.14),transparent)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-800/80">
            AI-powered story creation · Bookgen
          </p>
          <h1 className="mt-6 font-editorial text-4xl font-medium tracking-tight md:text-6xl md:leading-[1.08]">
            Transform ideas into
            <br />
            <span className="text-amber-800/70">beautiful eBooks</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-amber-950/70">
            Taleweaver is the engine behind Bookgen — outline to export-ready EPUB, with
            author fine-tuning so new chapters read like you, not a template.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href={TALEWEAVER_LIVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-amber-950 px-6 py-3 text-sm font-semibold text-amber-50 shadow-lg shadow-amber-950/20 transition hover:bg-amber-900"
            >
              Start creating free
            </a>
            <a
              href="#origin"
              className="rounded-full border border-amber-900/20 bg-white px-6 py-3 text-sm font-semibold text-amber-950 transition hover:border-amber-900/35"
            >
              How it started
            </a>
          </div>
        </div>
        <div className="relative mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
          {TALEWEAVER_STATS.map((s) => (
            <div key={s.label} className="rounded-xl border border-amber-900/10 bg-white/60 px-4 py-5 text-center">
              <p className="text-2xl font-semibold text-amber-950">{s.value}</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-amber-900/50">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="origin" className="border-t border-amber-900/10 bg-[#f7f2e8] px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-800/70">
            Origin
          </p>
          <h2 className="mt-4 font-editorial text-3xl font-medium tracking-tight md:text-4xl">
            One tweet. Then DMs. Then a product.
          </h2>
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-amber-950/75">
            <p>
              Taleweaver did not begin in a roadmap workshop. It began as a single post —
              a half-joke about how finishing a novel still takes forever when models can
              draft in minutes. The tweet traveled further than expected: authors,
              ghostwriters, and indie publishers piled into the replies and inbox.
            </p>
            <p>
              They were not asking for another chat box. They wanted{' '}
              <strong className="font-medium text-amber-950">EPUB fine-tuning</strong> on
              their own voice, exports that stores accept, and prose that does not read like
              obvious AI — the kind of natural cadence that keeps readers in the story
              instead of running detection checks in their head.
            </p>
            <p>
              That reach turned into Bookgen — live at{' '}
              <a
                href={TALEWEAVER_LIVE_URL}
                className="underline decoration-amber-900/30 underline-offset-4 hover:decoration-amber-950"
                target="_blank"
                rel="noopener noreferrer"
              >
                Bookgen
              </a>
              , 10K+ books on the counter, 50+ genres — but the soul of the project is still
              Taleweaver: GenOps for long-form fiction, born from one sentence on the internet.
            </p>
          </div>
          <blockquote className="mt-10 flex gap-4 rounded-2xl border border-amber-900/10 bg-white/70 p-6 md:p-8">
            <Quote className="h-8 w-8 shrink-0 text-amber-800/40" />
            <p className="font-editorial text-xl leading-relaxed text-amber-950/90">
              The idea was never replace the writer. Get to a manuscript worth editing — in
              the author&apos;s voice — this week.
            </p>
          </blockquote>
        </div>
      </section>

      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="font-editorial text-3xl font-medium tracking-tight md:text-4xl">
                Author EPUB fine-tuning
              </h2>
              <p className="mt-4 leading-relaxed text-amber-950/70">
                Upload a sample EPUB or prior book — we extract style signals and lock
                generation so new chapters match your diction, pacing, and POV.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-amber-950/75">
                <li className="flex gap-2">
                  <span className="text-amber-700">·</span>
                  Voice-locked generation — human-readable rhythm, not generic LLM filler
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-700">·</span>
                  Detection-aware polish — tuned for natural flow readers trust
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-700">·</span>
                  Valid EPUB spine, metadata, and chapter markers for KDP / Apple Books
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-700">·</span>
                  PDF export for ARCs and newsletters in the same pipeline
                </li>
              </ul>
            </div>
            <TaleweaverStudioDemo />
          </div>
        </div>
      </section>

      <section className="border-t border-amber-900/10 bg-white px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center font-editorial text-3xl font-medium md:text-4xl">
            Powerful features
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TALEWEAVER_FEATURES.map((f) => (
              <article
                key={f.title}
                className="rounded-2xl border border-amber-900/10 bg-[#fffdf8] p-6"
              >
                <h3 className="font-semibold text-amber-950">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-amber-950/65">{f.body}</p>
              </article>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {TALEWEAVER_GENRES.map((g) => (
              <span
                key={g}
                className="rounded-full border border-amber-900/15 px-3 py-1 text-xs text-amber-900/70"
              >
                {g}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center font-editorial text-3xl font-medium">How it works</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {TALEWEAVER_STEPS.map((s) => (
              <div key={s.step} className="text-center md:text-left">
                <p className="font-mono text-sm font-semibold text-amber-800">{s.step}</p>
                <h3 className="mt-2 text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-amber-950/65">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-amber-900/10 bg-[#f7f2e8] px-6 py-16 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-editorial text-3xl font-medium">Ready to write your story?</h2>
          <p className="mt-3 text-amber-950/65">
            Open Bookgen — start from an idea or an author EPUB.
          </p>
          <a
            href={TALEWEAVER_LIVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex rounded-full bg-amber-950 px-8 py-3 text-sm font-semibold text-amber-50 transition hover:bg-amber-900"
          >
            Get started on Bookgen
          </a>
        </div>
      </section>

      <footer className="border-t border-amber-900/10 px-6 py-8 text-center text-xs text-amber-900/50">
        <p>
          Taleweaver · portfolio case study · live product{' '}
          <a
            href={TALEWEAVER_LIVE_URL}
            className="underline hover:text-amber-950"
            target="_blank"
            rel="noopener noreferrer"
          >
            Bookgen
          </a>
        </p>
        <p className="mt-2 font-mono text-[10px]">
          Built by Parmeet Singh Talwar · LLM pipelines · EPUB export · author fine-tuning
        </p>
      </footer>
    </div>
  )
}
