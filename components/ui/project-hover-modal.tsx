'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import Link from 'next/link'
import { motion, type Variants } from 'framer-motion'
import gsap from 'gsap'
import { ChevronDown } from 'lucide-react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import type { ProjectHoverItem } from '@/lib/project-hover'
import { cn } from '@/lib/utils'

const VISIBLE_COUNT = 4

type ModalState = { active: boolean; index: number }

const scaleAnimation: Variants = {
  closed: {
    scale: 0,
    opacity: 0,
    transition: { duration: 0.35, ease: [0.32, 0, 0.67, 0] },
  },
  enter: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.35, ease: [0.76, 0, 0.24, 1] },
  },
  initial: { scale: 0, opacity: 0 },
}

type ProjectHoverModalProps = {
  items: ProjectHoverItem[]
}

export function ProjectHoverModal({ items }: ProjectHoverModalProps) {
  const reducedMotion = usePrefersReducedMotion()
  const [expanded, setExpanded] = useState(false)
  const [modal, setModal] = useState<ModalState>({ active: false, index: 0 })
  const [mounted, setMounted] = useState(false)

  const visibleItems = expanded ? items : items.slice(0, VISIBLE_COUNT)
  const hiddenCount = items.length - VISIBLE_COUNT

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="relative mt-14">
      <div className="relative flex w-full flex-col">
        {visibleItems.map((item, index) => (
          <ProjectRow
            key={item.id}
            index={index}
            item={item}
            setModal={setModal}
            showModal={!reducedMotion}
          />
        ))}
      </div>

      {!expanded && hiddenCount > 0 ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-foreground/15 px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-foreground/70 transition hover:border-foreground/40 hover:text-foreground"
        >
          View more
          <span className="text-foreground/40">+{hiddenCount}</span>
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      ) : null}

      {expanded && hiddenCount > 0 ? (
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="mt-6 font-mono text-xs text-foreground/50 underline-offset-4 hover:text-foreground hover:underline"
        >
          Show less
        </button>
      ) : null}

      {mounted && !reducedMotion
        ? createPortal(
            <HoverModal modal={modal} items={visibleItems} />,
            document.body,
          )
        : null}
    </div>
  )
}

function ProjectRow({
  item,
  index,
  setModal,
  showModal,
}: {
  item: ProjectHoverItem
  index: number
  setModal: (state: ModalState) => void
  showModal: boolean
}) {
  const num = String(index + 1).padStart(2, '0')

  return (
    <Link
      href={item.href}
      className="group flex w-full cursor-pointer items-center justify-between gap-4 border-t border-foreground/15 py-4 transition-colors duration-200 last:border-b hover:bg-foreground/[0.02] md:py-5"
      onMouseEnter={() => showModal && setModal({ active: true, index })}
      onMouseLeave={() => showModal && setModal({ active: false, index })}
    >
      <div className="flex min-w-0 items-baseline gap-3 md:gap-5">
        <span className="shrink-0 font-mono text-[10px] text-foreground/40">
          {num}
        </span>
        <h3 className="truncate text-xl font-semibold tracking-tight transition-transform duration-300 group-hover:translate-x-0.5 md:text-2xl lg:text-3xl">
          {item.title}
        </h3>
      </div>
      <p className="hidden shrink-0 font-mono text-[10px] uppercase tracking-wider text-foreground/45 sm:block">
        {item.subtitle}
      </p>
    </Link>
  )
}

function HoverModal({
  modal,
  items,
}: {
  modal: ModalState
  items: ProjectHoverItem[]
}) {
  const { active, index } = modal
  const modalContainer = useRef<HTMLDivElement>(null)
  const cursor = useRef<HTMLDivElement>(null)
  const cursorLabel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = modalContainer.current
    const cursorEl = cursor.current
    const labelEl = cursorLabel.current
    if (!container || !cursorEl || !labelEl) return

    gsap.set([container, cursorEl, labelEl], {
      xPercent: -50,
      yPercent: -50,
      left: 0,
      top: 0,
    })

    const xMoveContainer = gsap.quickTo(container, 'left', {
      duration: 0.65,
      ease: 'power3',
    })
    const yMoveContainer = gsap.quickTo(container, 'top', {
      duration: 0.65,
      ease: 'power3',
    })
    const xMoveCursor = gsap.quickTo(cursorEl, 'left', {
      duration: 0.45,
      ease: 'power3',
    })
    const yMoveCursor = gsap.quickTo(cursorEl, 'top', {
      duration: 0.45,
      ease: 'power3',
    })
    const xMoveCursorLabel = gsap.quickTo(labelEl, 'left', {
      duration: 0.4,
      ease: 'power3',
    })
    const yMoveCursorLabel = gsap.quickTo(labelEl, 'top', {
      duration: 0.4,
      ease: 'power3',
    })

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const offsetX = 24
      const offsetY = 24
      xMoveContainer(clientX + offsetX)
      yMoveContainer(clientY + offsetY)
      xMoveCursor(clientX)
      yMoveCursor(clientY)
      xMoveCursorLabel(clientX)
      yMoveCursorLabel(clientY)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const activeItem = items[index]

  return (
    <>
      <motion.div
        ref={modalContainer}
        className="pointer-events-none fixed z-[200] h-36 w-44 overflow-hidden rounded-md bg-background shadow-xl ring-1 ring-foreground/15 md:h-40 md:w-52"
        style={{ transformOrigin: 'center center' }}
        variants={scaleAnimation}
        initial="initial"
        animate={active ? 'enter' : 'closed'}
      >
        <div
          className="absolute left-0 h-full w-full transition-[top] duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
          style={{ top: `${index * -100}%` }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="relative h-full w-full"
              style={{ backgroundColor: item.color }}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="208px"
                className="object-cover"
                unoptimized={item.image.startsWith('http')}
              />
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        ref={cursor}
        className="pointer-events-none fixed z-[201] h-10 w-10 rounded-full bg-foreground"
        style={{ transformOrigin: 'center center' }}
        variants={scaleAnimation}
        initial="initial"
        animate={active ? 'enter' : 'closed'}
      />

      <motion.div
        ref={cursorLabel}
        className="pointer-events-none fixed z-[202] flex h-10 w-10 items-center justify-center rounded-full font-mono text-[10px] text-background"
        style={{ transformOrigin: 'center center' }}
        variants={scaleAnimation}
        initial="initial"
        animate={active ? 'enter' : 'closed'}
      >
        View
      </motion.div>

      {/* Preload active slide */}
      {active && activeItem ? (
        <span className="sr-only">{activeItem.title}</span>
      ) : null}
    </>
  )
}
