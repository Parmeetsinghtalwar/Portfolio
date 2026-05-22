'use client'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const ROTATING_WORDS = ['agentic', 'intelligent', 'kinetic', 'social']
const CHIPS = ['Python', 'FastAPI', 'Next.js', 'LangGraph', 'RAG', 'MCP']
const EASE = [0.65, 0, 0.35, 1] as const

function StaggerText({
  text,
  delay = 0,
  className = '',
}: {
  text: string
  delay?: number
  className?: string
}) {
  return (
    <span className={`inline-block ${className}`}>
      {text.split('').map((ch, i) => (
        <span key={i} className="inline-block overflow-hidden align-baseline">
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.7, delay: delay + i * 0.035, ease: EASE }}
          >
            {ch === ' ' ? ' ' : ch}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

export function Hero() {
  const [wordIdx, setWordIdx] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const id = window.setInterval(() => {
      setWordIdx((i) => (i + 1) % ROTATING_WORDS.length)
    }, 2600)
    return () => window.clearInterval(id)
  }, [])

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden text-foreground"
    >
      <div className="relative z-10 max-w-2xl pt-32 md:pt-36 px-6 md:px-12 text-left">
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
          className="font-mono text-[10px] uppercase tracking-[0.35em] mb-6 inline-flex items-center gap-3 text-foreground/60"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-foreground opacity-50" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-foreground" />
          </span>
          Co-founder · AI Engineer · Builder
        </motion.p>

        <h1 className="text-2xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.05]">
          <StaggerText text="Building" />{' '}
          <span className="relative inline-block align-baseline">
            <AnimatePresence mode="wait">
              <motion.span
                key={ROTATING_WORDS[wordIdx]}
                className="inline-block italic text-foreground/85"
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '-100%', opacity: 0 }}
                transition={{ duration: 0.55, ease: EASE }}
                style={{ display: 'inline-block' }}
              >
                {ROTATING_WORDS[wordIdx]}
              </motion.span>
            </AnimatePresence>
          </span>
          <br />
          <StaggerText text="systems for people." delay={0.45} />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.1, ease: EASE }}
          className="mt-6 max-w-md text-foreground/70 text-sm md:text-base leading-relaxed"
        >
          Co-founder & CTO of GetZoned. Forward Deploy AI Engineer.
          Agent systems, GenOps pipelines, and the products around them.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.25, ease: EASE }}
          className="mt-6 flex items-center gap-2 flex-wrap"
        >
          {CHIPS.map((chip) => (
            <motion.span
              key={chip}
              whileHover={{ y: -2, scale: 1.05 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="rounded-full border border-foreground/20 bg-foreground/[0.03] px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/80 backdrop-blur-sm hover:bg-foreground/[0.05] hover:border-foreground/40 transition-colors"
            >
              {chip}
            </motion.span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.4, ease: EASE }}
          className="mt-8 flex items-center gap-3 flex-wrap"
        >
          <a
            href="#projects"
            className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-xs md:text-sm font-medium text-background transition hover:opacity-90"
          >
            <span>View selected work</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border border-foreground/30 bg-transparent px-5 py-2.5 text-xs md:text-sm font-medium text-foreground transition hover:bg-foreground/[0.04] hover:border-foreground"
          >
            Let&apos;s talk
            <span>↗</span>
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.7 }}
        className="absolute bottom-6 right-6 md:right-12 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/45"
      >
        <span className="animate-float inline-block">↓ scroll</span>
      </motion.div>
    </section>
  )
}
