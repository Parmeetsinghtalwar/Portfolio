'use client'

import { useRef, type ReactNode } from 'react'
import Image from 'next/image'
import { useGSAP, gsap, ScrollTrigger } from '@/lib/gsap'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { GETZONED_THEME } from '@/lib/getzoned-scroll'
import { cn } from '@/lib/utils'

export type ScrollExpandImageProps = {
  /** Landscape image — starts small on cream, zooms to cover screen */
  src: string
  alt: string
  srcAfterBlur?: string
  altAfterBlur?: string
  scrollHint?: string
  overlay?: ReactNode
  /** Overlays on the right while hero stays fullscreen behind */
  sidePanel?: ReactNode
  themeBg?: string
  /** Override pin scroll distance (default ~115vh when sidePanel is set) */
  scrollLength?: string | (() => string)
  className?: string
}

const INITIAL_W = 'min(90vw, 1120px)'
const INITIAL_H = 'min(46vh, 420px)'
/** Scroll progress when right panel fades in over the hero */
const PANEL_AT = 0.58

export function ScrollExpandImage({
  src,
  alt,
  srcAfterBlur,
  altAfterBlur,
  scrollHint = 'Scroll to expand',
  overlay,
  sidePanel,
  themeBg = GETZONED_THEME.pinBg,
  scrollLength,
  className,
}: ScrollExpandImageProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const imageARef = useRef<HTMLDivElement>(null)
  const imageBRef = useRef<HTMLDivElement>(null)
  const blurRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLParagraphElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const scrimRef = useRef<HTMLDivElement>(null)
  const sidePanelRef = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  useGSAP(
    () => {
      const section = sectionRef.current
      const pin = pinRef.current
      const frame = frameRef.current
      const imageA = imageARef.current
      const imageB = imageBRef.current
      if (!section || !pin || !frame) return

      if (reduced) return

      const useSidePanel = Boolean(sidePanel)
      const useCrossfade = Boolean(srcAfterBlur) && !useSidePanel
      const isDesktop = () => window.matchMedia('(min-width: 768px)').matches

      const ctx = gsap.context(() => {
        gsap.set(frame, {
          width: INITIAL_W,
          height: INITIAL_H,
          left: '50%',
          top: '50%',
          xPercent: -50,
          yPercent: -50,
        })
        if (imageA) gsap.set(imageA, { filter: 'blur(0px)', opacity: 1 })
        if (imageB) gsap.set(imageB, { opacity: 0 })
        if (scrimRef.current) {
          gsap.set(scrimRef.current, { opacity: 0 })
        }
        if (sidePanelRef.current) {
          gsap.set(sidePanelRef.current, { opacity: 0, x: 48, pointerEvents: 'none' })
        }

        const scrollEnd =
          scrollLength ??
          (useSidePanel
            ? () => `+=${Math.round(window.innerHeight * 1.15)}`
            : '+=150%')

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: scrollEnd,
            pin: pin,
            scrub: 0.85,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        // 1 · Hero expands to fill the screen and stays there
        tl.to(
          frame,
          {
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            xPercent: 0,
            yPercent: 0,
            ease: 'none',
          },
          0,
        )
        if (hintRef.current) {
          tl.to(hintRef.current, { opacity: 0, y: 8, ease: 'none' }, 0.08)
        }

        if (overlayRef.current && !useSidePanel) {
          tl.fromTo(
            overlayRef.current,
            { opacity: 0, y: -16 },
            { opacity: 1, y: 0, ease: 'none' },
            useCrossfade ? 0.66 : 0.58,
          )
        }

        if (useCrossfade) {
          if (imageA) {
            tl.to(imageA, { filter: 'blur(12px)', ease: 'none' }, 0.48)
          }
          if (blurRef.current) {
            tl.fromTo(blurRef.current, { opacity: 0 }, { opacity: 1, ease: 'none' }, 0.5)
          }
          if (imageB && srcAfterBlur) {
            tl.to(imageA, { opacity: 0, ease: 'none' }, 0.58)
            tl.to(imageB, { opacity: 1, ease: 'none' }, 0.58)
            if (blurRef.current) {
              tl.to(blurRef.current, { opacity: 0, ease: 'none' }, 0.62)
            }
          }
        }

        // 2 · Right content + img2 slide in over the fullscreen hero (hero unchanged)
        if (useSidePanel) {
          if (scrimRef.current) {
            tl.to(
              scrimRef.current,
              { opacity: () => (isDesktop() ? 1 : 0), ease: 'none' },
              PANEL_AT,
            )
          }
          if (sidePanelRef.current) {
            tl.to(
              sidePanelRef.current,
              {
                opacity: () => (isDesktop() ? 1 : 0),
                x: () => (isDesktop() ? 0 : 48),
                pointerEvents: () => (isDesktop() ? 'auto' : 'none'),
                ease: 'none',
              },
              PANEL_AT,
            )
          }
        }
      }, section)

      return () => ctx.revert()
    },
    {
      scope: sectionRef,
      dependencies: [reduced, scrollLength, themeBg, src, srcAfterBlur, sidePanel],
    },
  )

  if (reduced) {
    return (
      <section
        ref={sectionRef}
        className={cn('relative w-full', className)}
        style={{ backgroundColor: themeBg }}
        aria-label={alt}
      >
        <div className="relative min-h-[50vh] w-full">
          <Image src={src} alt={alt} fill className="object-cover" priority sizes="100vw" />
          {sidePanel ? (
            <div className="relative z-10 bg-black/80 p-6 md:absolute md:inset-y-0 md:right-0 md:w-1/2 md:max-w-lg">
              {sidePanel}
            </div>
          ) : null}
        </div>
        {!sidePanel && overlay ? (
          <div className="mx-auto max-w-3xl px-6 pb-12">{overlay}</div>
        ) : null}
      </section>
    )
  }

  return (
    <section
      ref={sectionRef}
      className={cn('relative w-full', className)}
      aria-label={alt}
    >
      <div
        ref={pinRef}
        className="relative h-screen w-full overflow-hidden"
        style={{ backgroundColor: themeBg }}
      >
        {/* Fullscreen background — stays put after expand */}
        <div
          ref={frameRef}
          className="absolute z-0 overflow-hidden will-change-[width,height,transform]"
          style={{ backgroundColor: themeBg, width: INITIAL_W, height: INITIAL_H }}
        >
          <div ref={imageARef} className="absolute inset-0">
            <Image
              src={src}
              alt={alt}
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
              onLoad={() => ScrollTrigger.refresh()}
            />
          </div>

          {srcAfterBlur && !sidePanel ? (
            <div ref={imageBRef} className="absolute inset-0 opacity-0">
              <Image
                src={srcAfterBlur}
                alt={altAfterBlur ?? alt}
                fill
                className="object-cover object-center"
                sizes="100vw"
              />
            </div>
          ) : null}

          <div
            ref={blurRef}
            className="pointer-events-none absolute inset-0 z-[5] opacity-0 backdrop-blur-md"
            style={{ backgroundColor: 'rgba(250, 248, 244, 0.35)' }}
            aria-hidden
          />

          {overlay ? (
            <div
              ref={overlayRef}
              className="pointer-events-auto absolute inset-x-0 top-0 z-10 w-full opacity-0"
            >
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-[min(65vh,520px)] bg-gradient-to-b from-[#faf8f4]/95 via-[#faf8f4]/70 to-transparent"
                aria-hidden
              />
              <div className="relative mx-auto w-full max-w-3xl px-5 pt-8 md:px-10 md:pt-12">
                {overlay}
              </div>
            </div>
          ) : null}
        </div>

        {sidePanel ? (
          <>
            <div
              ref={scrimRef}
              className="pointer-events-none absolute right-0 top-0 z-10 hidden h-full w-[min(52vw,640px)] bg-gradient-to-l from-black/75 via-black/45 to-transparent opacity-0 md:block"
              aria-hidden
            />
            <div
              ref={sidePanelRef}
              className="absolute right-0 top-0 z-20 hidden h-full w-[min(44vw,520px)] min-w-[300px] opacity-0 md:block"
            >
              {sidePanel}
            </div>
          </>
        ) : null}

        <p
          ref={hintRef}
          className="pointer-events-none absolute inset-x-0 bottom-8 z-30 text-center font-mono text-[10px] uppercase tracking-[0.35em]"
          style={{ color: GETZONED_THEME.hint }}
        >
          {scrollHint}
        </p>
      </div>
    </section>
  )
}
