'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

type LoaderProps = {
  brand?: string
  minDuration?: number
  logLines?: string[]
}

const DEFAULT_LINES = [
  'Initializing loader…',
  'Booting renderer…',
  'Checking WebGL support…',
  'Renderer config: DPR cap 1.5.',
  'Renderer ready.',
  'Post-processing pipeline ready.',
  'Starting image load…',
  'Hydrating components…',
  'Mounting scenes…',
  'Wiring scroll listeners…',
  'Ready.',
]

export function Loader({
  brand = 'PORTFOLIO',
  minDuration = 1800,
  logLines = DEFAULT_LINES,
}: LoaderProps) {
  const [progress, setProgress] = useState(0)
  const [visibleLines, setVisibleLines] = useState<string[]>([])
  const [visible, setVisible] = useState(true)
  const [done, setDone] = useState(false)
  const logRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const start = performance.now()
    let windowLoaded = document.readyState === 'complete'
    let fontsLoaded = false

    const onLoad = () => {
      windowLoaded = true
    }
    window.addEventListener('load', onLoad)

    document.fonts.ready.then(() => {
      fontsLoaded = true
    })

    let raf = 0
    const tick = () => {
      const elapsed = performance.now() - start
      const ready = windowLoaded && fontsLoaded && elapsed >= minDuration
      const capped = Math.min(elapsed / minDuration, 1) * 95
      const target = ready ? 100 : capped

      setProgress((p) => {
        const next = p + (target - p) * 0.15
        return Math.abs(next - target) < 0.5 ? target : next
      })

      if (target >= 100 && ready) {
        setProgress(100)
        setVisible(false)
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('load', onLoad)
    }
  }, [minDuration])

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      setVisibleLines((lines) => {
        if (i >= logLines.length) {
          clearInterval(interval)
          return lines
        }
        const next = [...lines, logLines[i]]
        i += 1
        return next
      })
    }, Math.max(80, minDuration / logLines.length))
    return () => clearInterval(interval)
  }, [logLines, minDuration])

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [visibleLines])

  useEffect(() => {
    if (done) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [done])

  const pct = Math.floor(progress)

  return (
    <AnimatePresence onExitComplete={() => setDone(true)}>
      {visible ? (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] overflow-hidden text-white"
          style={{
            backgroundColor: '#0000A8',
            fontFamily: 'var(--font-vt323), "Courier New", monospace',
          }}
          aria-label="Loading"
          role="status"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              background:
                'repeating-linear-gradient(0deg, rgba(0,0,0,0.35) 0px, rgba(0,0,0,0.35) 1px, transparent 1px, transparent 3px)',
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.5) 100%)',
            }}
          />

          <div className="relative h-full w-full px-8 py-10 sm:px-12 sm:py-14 md:px-16 md:py-16">
            <h1 className="text-[clamp(2.4rem,5.5vw,5rem)] leading-[0.95] tracking-wide">
              {brand}.COM 1998
              <br />
              Professional Setup
            </h1>

            <p className="mt-6 max-w-[60ch] text-[clamp(1.1rem,1.6vw,1.5rem)] leading-tight">
              Please wait while Setup copies files to the {brand} experience.
            </p>

            <p className="mt-8 text-[clamp(1.1rem,1.6vw,1.5rem)] leading-tight">
              Setup is copying files...
            </p>

            <div
              className="mt-3 h-5 w-full max-w-[1100px] border border-white/80"
              style={{ backgroundColor: 'rgba(0,0,0,0.15)' }}
            >
              <div
                className="h-full"
                style={{
                  width: `${pct}%`,
                  backgroundColor: '#F5E96B',
                  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.4)',
                  transition: 'width 90ms linear',
                }}
              />
            </div>
            <p className="mt-2 text-[clamp(1.1rem,1.6vw,1.5rem)] tabular-nums">
              {pct}%
            </p>

            <div
              ref={logRef}
              className="mt-6 max-w-[1100px] overflow-y-auto border border-white/80 px-4 py-3 text-[clamp(1rem,1.4vw,1.35rem)] leading-tight"
              style={{
                height: 'clamp(220px, 38vh, 420px)',
                backgroundColor: 'rgba(0,0,0,0.15)',
              }}
            >
              {visibleLines.map((line, idx) => (
                <div key={idx} className="whitespace-pre">
                  <span className="mr-3">•</span>
                  {line}
                </div>
              ))}
              <span className="ml-1 inline-block h-[1em] w-[0.6ch] animate-pulse bg-white align-middle" />
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
