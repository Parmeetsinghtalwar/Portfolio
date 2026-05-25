'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { OPEN_MEDIA_EXPLORATION_COPY } from '@/lib/open-source-media-exploration'
import {
  OPEN_SOURCE_IMAGE_MODEL,
  OPEN_SOURCE_VIDEO_MODEL,
} from '@/lib/open-source-media-models'
import { cn } from '@/lib/utils'

type PreviewMode = 'image' | 'video'

function MediaPreview({ mode }: { mode: PreviewMode }) {
  const model =
    mode === 'image' ? OPEN_SOURCE_IMAGE_MODEL : OPEN_SOURCE_VIDEO_MODEL

  return (
    <motion.div
      key={mode}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative aspect-[16/9] w-full bg-foreground/[0.04]"
    >
      <Image
        src={model.previewPath}
        alt=""
        fill
        priority={mode === 'image'}
        sizes="(min-width: 1024px) 896px, 100vw"
        className="object-cover"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10"
        aria-hidden
      />
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">
          {mode === 'image' ? 'Open-source image' : 'Open-source video'} · ComfyUI
          output
        </p>
        <p className="mt-2 max-w-2xl font-editorial text-2xl font-medium tracking-tight text-white md:text-3xl">
          {model.name}
        </p>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-white/55">
          {model.org} · {model.license}
        </p>
      </div>
    </motion.div>
  )
}

function MediaWord({
  label,
  active,
  onClick,
}: {
  label: 'img' | 'video'
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'font-medium underline decoration-2 underline-offset-[6px] transition-colors',
        active
          ? 'text-foreground decoration-foreground'
          : 'text-foreground/75 decoration-foreground/25 hover:text-foreground hover:decoration-foreground/50',
      )}
    >
      {label}
    </button>
  )
}

export function OpenSourceMediaExploration() {
  const [mode, setMode] = useState<PreviewMode>('image')
  const copy = OPEN_MEDIA_EXPLORATION_COPY

  return (
    <section
      id="open-models"
      className="relative border-t border-foreground/10 bg-background py-24 text-foreground md:py-32"
    >
      <div className="mx-auto max-w-4xl px-6">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-foreground/50">
          {copy.eyebrow}
        </p>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
          {copy.title}
        </h2>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-foreground/65">
          {copy.lede}
        </p>

        <p className="mt-8 max-w-3xl text-base leading-relaxed text-foreground/75 md:text-lg">
          LoRA fine-tuning on open LLMs (Qwen + PEFT for author voice). ComfyUI for
          open-weight{' '}
          <MediaWord label="img" active={mode === 'image'} onClick={() => setMode('image')} />{' '}
          stills (Z-Image-Turbo, 6B Apache-2.0) and{' '}
          <MediaWord
            label="video"
            active={mode === 'video'}
            onClick={() => setMode('video')}
          />{' '}
          clips (Wan T2V / I2V). The same stack ships on Content Phase when production
          needs control over cost and style.
        </p>

        <div className="relative mt-10 overflow-hidden rounded-2xl ring-1 ring-foreground/10">
          <AnimatePresence mode="wait">
            <MediaPreview mode={mode} />
          </AnimatePresence>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/projects/fitzgerald-lora-pipeline"
            className="rounded-full border border-foreground/15 px-4 py-2 font-mono text-xs text-foreground/75 transition hover:border-foreground/35 hover:text-foreground"
          >
            Author fine-tune (LoRA) →
          </Link>
          <Link
            href="/projects/socialhub"
            className="rounded-full border border-foreground/15 px-4 py-2 font-mono text-xs text-foreground/75 transition hover:border-foreground/35 hover:text-foreground"
          >
            Content Phase (production) →
          </Link>
          <Link
            href="#playground"
            className="rounded-full border border-foreground/15 px-4 py-2 font-mono text-xs text-foreground/75 transition hover:border-foreground/35 hover:text-foreground"
          >
            Playground workflows →
          </Link>
        </div>
      </div>
    </section>
  )
}
