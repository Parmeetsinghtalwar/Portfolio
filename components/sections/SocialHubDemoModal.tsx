'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Monitor, X } from 'lucide-react'

type SocialHubDemoModalProps = {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}

export function SocialHubDemoModal({
  open,
  onClose,
  children,
}: SocialHubDemoModalProps) {
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            aria-label="Close demo"
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="SocialHub live demo"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="fixed inset-x-2 bottom-3 top-[3vh] z-[75] mx-auto flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-background shadow-2xl shadow-black/40 sm:inset-x-4 md:top-[5vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-center gap-3 border-b border-foreground/10 bg-foreground/[0.03] px-4 py-3 md:px-5">
              <div className="flex items-center gap-1.5" aria-hidden>
                <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="flex min-w-0 flex-1 items-center justify-center gap-2 font-mono text-[11px] text-foreground/55">
                <Monitor className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">SocialHub — live demo</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-foreground/60 ring-1 ring-foreground/15 transition hover:bg-foreground/5 hover:text-foreground"
                aria-label="Close demo window"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex min-h-0 flex-1 flex-col px-4 py-4 md:px-5 md:py-5">
              {children}
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}
