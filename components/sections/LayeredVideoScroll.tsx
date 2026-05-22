'use client'

import { useRef, useState, type MouseEvent } from 'react'
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { cn } from '@/lib/utils'

export type LayeredEditorial = {
  tag?: string
  topLeft?: string[]
  bottomLeft?: string[]
  rightBlock?: string[]
  footnote?: string
}

export type LayeredItem = {
  type: 'video' | 'image'
  src: string
  alt?: string
  caption?: string
  series?: string
  editorial?: LayeredEditorial
}

type LayeredVideoScrollProps = {
  items: LayeredItem[]
  title?: string
  eyebrow?: string
  watermark?: string
  className?: string
}

export function LayeredVideoScroll({
  items,
  title = 'Parmeet Talwar',
  eyebrow = '01 · About',
  watermark = 'parmeet',
  className,
}: LayeredVideoScrollProps) {
  const sectionRef = useRef<HTMLElement>(null)

  const [index, setIndex] = useState(0)
  const [overCard, setOverCard] = useState(false)
  const [overBackground, setOverBackground] = useState(false)
  const [cursor, setCursor] = useState<{ x: number; y: number; visible: boolean }>({
    x: 0,
    y: 0,
    visible: false,
  })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], ['-5%', '5%'])
  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1.02, 1.08])
  const scrollWhite = useTransform(scrollYProgress, [0.35, 0.55, 0.75], [0, 0.35, 0])

  const current = items[index]
  const advance = () => setIndex((i) => (i + 1) % items.length)

  /** White stage when cursor is on background (not card) — matches dasupply hover */
  const whiteStage = overBackground && !overCard

  const handleSectionMove = (e: MouseEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect()
    if (!rect) return
    const onBg = !overCard
    setOverBackground(onBg)
    setCursor({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      visible: onBg,
    })
  }

  const ink = whiteStage ? 'text-black/85' : 'text-white/88'
  const inkMuted = whiteStage ? 'text-black/50' : 'text-white/55'
  const inkFaint = whiteStage ? 'text-black/[0.07]' : 'text-white/[0.08]'

  return (
    <section
      ref={sectionRef}
      aria-label={title}
      onMouseMove={handleSectionMove}
      onMouseLeave={() => {
        setCursor((c) => ({ ...c, visible: false }))
        setOverBackground(false)
      }}
      onClick={advance}
      className={cn(
        'relative h-screen w-full overflow-hidden',
        whiteStage ? 'bg-white cursor-none' : 'bg-black cursor-none',
        overCard && 'cursor-default',
        className,
      )}
    >
      {/* Background video — fills stage, cropped to component */}
      <motion.div
        style={{ y: bgY, scale: bgScale }}
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden={whiteStage}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`bg-${current.src}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: whiteStage ? 0.12 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Media
              item={current}
              variant="background"
              className="h-full w-full scale-[1.06] object-cover object-center brightness-[0.52] saturate-[1.05]"
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* White wash: hover on background + light scroll tie-in */}
      <motion.div
        animate={{ opacity: whiteStage ? 1 : 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute inset-0 z-[1] bg-white"
        aria-hidden
      />
      <motion.div
        style={{ opacity: scrollWhite }}
        className="pointer-events-none absolute inset-0 z-[1] bg-white mix-blend-screen"
        aria-hidden
      />

      {/* Large watermark on white stage */}
      <p
        className={cn(
          'pointer-events-none absolute bottom-[8%] left-1/2 z-[2] -translate-x-1/2 select-none font-editorial text-[clamp(5rem,22vw,16rem)] font-normal leading-none tracking-tight transition-opacity duration-500',
          inkFaint,
          whiteStage ? 'opacity-100' : 'opacity-0',
        )}
        aria-hidden
      >
        {watermark}
        <sup className="text-[0.22em]">™</sup>
      </p>

      {/* Corner editorial — life + tech per frame */}
      <EditorialCorners
        editorial={current.editorial}
        index={index}
        series={current.series}
        caption={current.caption}
        ink={ink}
        inkMuted={inkMuted}
      />

      {/* Center card — square crop, video fitted inside frame */}
      <div
        onMouseEnter={() => setOverCard(true)}
        onMouseLeave={() => setOverCard(false)}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'absolute left-1/2 top-1/2 z-10 aspect-square w-[min(42vw,520px)] max-w-[92vw]',
          '-translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[14px]',
          'shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55)] ring-1 ring-white/20',
          'cursor-default',
        )}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`card-${current.src}`}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 overflow-hidden bg-black"
          >
            <Media
              item={current}
              variant="card"
              className="h-full w-full object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>

        <div className="pointer-events-none absolute left-3.5 top-3.5 font-mono text-[11px] uppercase tracking-[0.2em] text-white/92">
          ({current.editorial?.tag ?? String(index + 1).padStart(2, '0')})
        </div>

        <div className="pointer-events-none absolute left-3.5 top-10 font-mono text-[10px] uppercase tracking-[0.22em] text-white/70">
          (view)
        </div>

        {current.caption ? (
          <div className="pointer-events-none absolute bottom-3.5 left-3.5 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-white/92">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_12px_#ff3b30]" />
            {current.caption}
          </div>
        ) : null}
      </div>

      {/* (Next) cursor — background only */}
      <motion.div
        aria-hidden
        animate={{
          x: cursor.x,
          y: cursor.y,
          opacity: cursor.visible && !overCard ? 1 : 0,
          scale: cursor.visible && !overCard ? 1 : 0.7,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 40, mass: 0.4 }}
        className={cn(
          'pointer-events-none absolute left-0 top-0 z-30 -translate-x-1/2 -translate-y-1/2 rounded-full px-5 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.22em]',
          whiteStage
            ? 'bg-black text-white'
            : 'bg-white text-black mix-blend-difference',
        )}
      >
        (next)
      </motion.div>

      <div
        className={cn(
          'pointer-events-none absolute inset-x-7 bottom-7 z-20 flex items-end justify-between font-mono text-xs uppercase tracking-[0.14em] transition-colors duration-500',
          whiteStage ? 'text-black/80' : 'text-white/85 mix-blend-difference',
        )}
      >
        <h2 className="font-editorial text-2xl font-medium tracking-tight normal-case sm:text-3xl md:text-4xl">
          {title}
        </h2>
        <span>{eyebrow}</span>
      </div>
    </section>
  )
}

function EditorialCorners({
  editorial,
  index,
  series,
  caption,
  ink,
  inkMuted,
}: {
  editorial?: LayeredEditorial
  index: number
  series?: string
  caption?: string
  ink: string
  inkMuted: string
}) {
  if (!editorial) return null

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`ed-${index}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="pointer-events-none absolute inset-0 z-[8]"
      >
        {editorial.topLeft?.length ? (
          <div
            className={cn(
              'absolute left-7 top-7 max-w-[200px] space-y-1 font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em]',
              ink,
            )}
          >
            <p className={inkMuted}>({editorial.tag ?? String(index + 1)})</p>
            {editorial.topLeft.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        ) : null}

        {editorial.rightBlock?.length ? (
          <div
            className={cn(
              'absolute right-7 top-1/2 max-w-[220px] -translate-y-1/2 space-y-1 text-right font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em]',
              ink,
            )}
          >
            {editorial.rightBlock.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        ) : null}

        {editorial.bottomLeft?.length ? (
          <div
            className={cn(
              'absolute bottom-24 left-7 max-w-[240px] space-y-1 font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em]',
              ink,
            )}
          >
            {editorial.bottomLeft.map((line) => (
              <p key={line}>{line}</p>
            ))}
            {series ? (
              <p className={cn('pt-3', inkMuted)}>
                {series} · {caption ?? `frame ${index + 1}`}
              </p>
            ) : null}
            {editorial.footnote ? (
              <p className={cn('pt-2', inkMuted)}>{editorial.footnote}</p>
            ) : null}
          </div>
        ) : null}
      </motion.div>
    </AnimatePresence>
  )
}

function Media({
  item,
  variant,
  className,
}: {
  item: LayeredItem
  variant: 'background' | 'card'
  className?: string
}) {
  const fitClass = cn(
    'absolute inset-0 h-full w-full min-h-full min-w-full',
    className,
  )

  if (item.type === 'video') {
    return (
      <video
        className={fitClass}
        src={item.src}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden={variant === 'background'}
      />
    )
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      className={fitClass}
      src={item.src}
      alt={item.alt ?? ''}
      draggable={false}
      loading="lazy"
    />
  )
}
