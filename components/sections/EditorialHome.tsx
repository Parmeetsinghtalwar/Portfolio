'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { TopTicker } from '@/components/ui/TopTicker'
import { LiveClock } from '@/components/ui/LiveClock'
import { SITE } from '@/lib/constants'

const NAV = [
  { href: '#home', label: 'Index' },
  { href: '#about', label: 'About' },
  { href: '#advisory', label: 'Advisory' },
  { href: '#open-models', label: 'Open models' },
  { href: '#playground', label: 'Playground' },
  { href: '#lysync', label: 'LySync' },
  { href: '#projects', label: 'Work' },
  { href: '#contact', label: 'Contact' },
  { href: '/projects/socialhub?demo=1', label: 'Demo' },
] as const

const INTRO =
  'I design and ship agent systems, GenOps pipelines, and the products around them — merging storytelling, engineering, and strategy for teams that need AI to work in production, not just in slides.'

const EASE = [0.22, 1, 0.36, 1] as const

export function EditorialHome() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen flex-col bg-background text-foreground"
    >
      <TopTicker />

      <header className="relative z-10 flex flex-col gap-5 px-6 py-6 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-4 md:px-10 md:py-8">
        <Link
          href="/"
          className="font-editorial text-lg font-medium tracking-tight sm:justify-self-start md:text-xl"
        >
          parmeet<sup className="text-[0.45em] font-normal">™</sup>
        </Link>

        <nav aria-label="Primary" className="sm:justify-self-center">
          <ul className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.08em] text-foreground/75 sm:justify-center md:gap-x-4 md:text-xs">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="transition hover:text-foreground"
                >
                  ({item.label})
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex sm:justify-end">
          <LiveClock />
        </div>
      </header>

      <div className="relative flex flex-1 flex-col px-6 pb-10 md:px-10 md:pb-14">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
          className="ml-auto w-full max-w-md pt-4 md:max-w-lg md:pt-8 lg:max-w-xl"
        >
          <p className="font-mono text-[11px] text-foreground/45">(1)</p>
          <p className="mt-4 font-editorial text-lg leading-[1.55] text-foreground/90 md:text-xl md:leading-[1.6]">
            {INTRO}
          </p>
          <p className="mt-6 font-mono text-[10px] leading-relaxed text-foreground/50">
            {SITE.role}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.55, ease: EASE }}
          className="mt-auto pt-16 md:pt-24"
        >
          <p className="font-mono text-[11px] text-foreground/45">(2)</p>
          <h1 className="mt-3 font-editorial text-[clamp(3.5rem,14vw,11rem)] font-normal leading-[0.88] tracking-tight">
            parmeet
            <sup className="ml-1 align-super text-[0.22em] font-normal tracking-normal">
              ™
            </sup>
          </h1>
          <p className="mt-6 max-w-sm font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/45">
            Scroll for work & contact ↓
          </p>
        </motion.div>
      </div>
    </section>
  )
}
