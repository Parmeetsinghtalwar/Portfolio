'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export type CarouselItem = {
  src: string
  alt: string
  index: string
  caption: string
}

type ImageCarouselProps = {
  items: CarouselItem[]
  title?: string
  hint?: string
  className?: string
}

/**
 * Horizontal photo strip with:
 *   - CSS scroll-snap for native feel on touch + trackpad
 *   - vertical-wheel-to-horizontal hijack so a regular mouse wheel scrolls sideways
 *   - bottom progress bar driven from scrollLeft
 */
export function ImageCarousel({
  items,
  title = 'Photo gallery',
  hint = 'Drag · scroll · swipe',
  className,
}: ImageCarouselProps) {
  const stripRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const strip = stripRef.current
    if (!strip) return

    const updateProgress = () => {
      const max = strip.scrollWidth - strip.clientWidth
      setProgress(max > 0 ? (strip.scrollLeft / max) * 100 : 0)
    }

    const onWheel = (e: WheelEvent) => {
      // Only hijack mostly-vertical gestures; let real horizontal scroll pass.
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault()
        strip.scrollLeft += e.deltaY
      }
    }

    strip.addEventListener('scroll', updateProgress, { passive: true })
    strip.addEventListener('wheel', onWheel, { passive: false })
    updateProgress()

    return () => {
      strip.removeEventListener('scroll', updateProgress)
      strip.removeEventListener('wheel', onWheel)
    }
  }, [])

  return (
    <section
      aria-label={title}
      className={cn('w-full bg-black py-24 text-white', className)}
    >
      <div className="mx-7 mb-8 flex items-baseline justify-between border-b border-white/10 pb-6">
        <h3 className="text-xl font-medium tracking-tight sm:text-2xl">{title}</h3>
        <span className="text-xs uppercase tracking-[0.18em] text-white/50">{hint}</span>
      </div>

      <div
        ref={stripRef}
        className={cn(
          'flex gap-4 overflow-x-auto overflow-y-hidden px-7 pb-6',
          'snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          'overscroll-x-contain',
        )}
      >
        {items.map((item) => (
          <a
            key={item.index}
            href="#"
            className={cn(
              'group relative aspect-[4/5] w-[clamp(240px,32vw,460px)] flex-none snap-start',
              'overflow-hidden rounded-xl bg-neutral-900 transition-transform duration-500',
              'hover:-translate-y-1',
            )}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="(max-width: 768px) 70vw, 32vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-x-3.5 bottom-3.5 flex justify-between text-[11px] uppercase tracking-[0.18em] text-white drop-shadow">
              <span>{item.index}</span>
              <span>{item.caption}</span>
            </div>
          </a>
        ))}
      </div>

      <div className="relative mx-7 h-px bg-white/10">
        <div
          className="absolute left-0 top-0 h-full bg-white transition-[width] duration-75"
          style={{ width: `${progress}%` }}
        />
      </div>
    </section>
  )
}
