'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, Check } from 'lucide-react'
import { UnifyDashboardDemo } from '@/components/unify/UnifyDashboardDemo'
import { UnifyTechSection } from '@/components/unify/UnifyTechSection'
import {
  UNIFY_CHANNELS,
  UNIFY_FAQ,
  UNIFY_LIVE_URL,
  UNIFY_NAV,
  UNIFY_PILLARS,
  UNIFY_STATS,
  UNIFY_STEPS,
} from '@/lib/unify-landing'
import { cn } from '@/lib/utils'

export function UnifyLanding() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 antialiased">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-[#fafafa]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-6">
            <Link
              href="/#projects"
              className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-slate-500 transition hover:text-slate-900"
            >
              <ArrowLeft className="h-3 w-3" />
              Portfolio
            </Link>
            <span className="text-lg font-semibold tracking-tight text-slate-900">
              Unify
            </span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            {UNIFY_NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-slate-600 transition hover:text-slate-900"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a
            href={UNIFY_LIVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Live product
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden px-6 pb-20 pt-16 md:pb-28 md:pt-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(99,102,241,0.12),transparent)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-indigo-600">
            Omni-channel L1 platform
          </p>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 md:text-6xl md:leading-[1.08]">
            Every conversation.
            <br />
            <span className="text-slate-500">One system.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
            AI handles the first layer across every channel. Humans take over with
            full context.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href={`${UNIFY_LIVE_URL}signup`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500"
            >
              Book a demo
            </a>
            <a
              href="#features"
              className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-400"
            >
              Explore features
            </a>
          </div>
          <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-slate-500">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Live conversation · demo
          </p>
        </div>
      </section>

      <section id="features" className="border-t border-slate-200/80 bg-white px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Everything you need,
              <span className="text-slate-400"> nothing you don&apos;t</span>
            </h2>
            <p className="mt-4 text-slate-600">
              Three pillars that power your support — unified, intelligent, and
              human when it counts.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {UNIFY_PILLARS.map((pillar) => (
              <article
                key={pillar.title}
                className="rounded-2xl border border-slate-200/80 bg-[#fafafa] p-6 md:p-8"
              >
                <h3 className="text-lg font-semibold text-slate-900">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {pillar.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Connect channels and let AI resolve.
            </h2>
            <p className="mt-4 text-slate-600">
              Link your channels, let AI handle the first layer, and take over with
              one click when it counts.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {UNIFY_STEPS.map((item) => (
              <div key={item.step}>
                <p className="font-mono text-sm font-semibold text-indigo-600">
                  {item.step}
                </p>
                <h3 className="mt-2 text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200/80 bg-white px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              See your channels{' '}
              <span className={cn('bg-gradient-to-r from-[#5c1f2e] to-rose-800 bg-clip-text text-transparent')}>
                come together
              </span>
            </h2>
            <p className="mt-4 text-slate-600">
              Connect and manage every conversation from a single, elegant
              dashboard.
            </p>
          </div>
          <UnifyDashboardDemo />
        </div>
      </section>

      <UnifyTechSection />

      <section id="integrations" className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-600">
              Integrations
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Keep all conversations in one place
            </h2>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            {UNIFY_CHANNELS.map((ch) => (
              <span
                key={ch}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm"
              >
                {ch}
              </span>
            ))}
            <span className="rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-500">
              REST API · WebSocket · webhooks
            </span>
          </div>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-semibold">Live chat widget</h3>
              <p className="mt-2 text-sm text-slate-600">
                Customize colors, language, text, and design to fit your brand.
              </p>
              <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-800">
                  Hello there. How can we help you?
                </p>
                <button
                  type="button"
                  className="mt-4 w-full rounded-lg bg-indigo-600 py-2 text-sm font-medium text-white"
                >
                  Chat with us
                </button>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-semibold">Omni-channel inbox</h3>
              <p className="mt-2 text-sm text-slate-600">
                WhatsApp, Telegram, Instagram, Email, SMS — one unified view.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-indigo-600" />
                  Identity validation
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-indigo-600" />
                  Custom API &amp; webhooks
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-indigo-600" />
                  CRM connectors
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200/80 bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-semibold tracking-tight">
            Why teams choose Unify
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {UNIFY_STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-semibold tracking-tight text-indigo-600">
                  {stat.value}
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-slate-500">
                  {stat.sub}
                </p>
                <p className="mt-3 text-sm font-semibold text-slate-900">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="border-t border-slate-200/80 bg-white px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-semibold tracking-tight">
            Your Questions, Answered.
          </h2>
          <div className="mt-10 space-y-3">
            {UNIFY_FAQ.map((item) => (
              <details
                key={item.q}
                className="group rounded-xl border border-slate-200 bg-[#fafafa] px-5 py-4"
              >
                <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900 marker:content-none">
                  {item.q}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
