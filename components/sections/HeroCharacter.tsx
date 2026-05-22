'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

// Walk-cycle frequency: number of full leg swings across the section.
const STEPS = 8

function useSwing(progress: MotionValue<number>, offset = 0, amp = 30) {
  return useTransform(progress, (p) => Math.sin(p * Math.PI * STEPS + offset) * amp)
}

export function HeroCharacter({ targetRef }: { targetRef: React.RefObject<HTMLElement | null> }) {
  const reduced = usePrefersReducedMotion()
  const internalRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: targetRef ?? internalRef,
    offset: ['start start', 'end start'],
  })

  // Travel left → right across the hero as it scrolls away.
  const x = useTransform(scrollYProgress, [0, 1], ['-5vw', '95vw'])

  // Limb swings — legs out of phase, arms opposite of their same-side leg.
  const legL = useSwing(scrollYProgress, 0, 35)
  const legR = useSwing(scrollYProgress, Math.PI, 35)
  const armL = useSwing(scrollYProgress, Math.PI, 28)
  const armR = useSwing(scrollYProgress, 0, 28)

  // Subtle vertical bob — body rises slightly at mid-step.
  const bob = useTransform(scrollYProgress, (p) =>
    -Math.abs(Math.sin(p * Math.PI * STEPS)) * 4,
  )

  // Ball bounces ahead of the kicking foot.
  const ballY = useTransform(scrollYProgress, (p) =>
    -Math.abs(Math.sin(p * Math.PI * STEPS + Math.PI / 2)) * 22,
  )
  const ballRot = useTransform(scrollYProgress, [0, 1], [0, 1440])

  // Reduced motion → static character at the start.
  const xFinal = reduced ? '4vw' : x
  const bobFinal = reduced ? 0 : bob
  const legLFinal = reduced ? 0 : legL
  const legRFinal = reduced ? 0 : legR
  const armLFinal = reduced ? 0 : armL
  const armRFinal = reduced ? 0 : armR
  const ballYFinal = reduced ? 0 : ballY
  const ballRotFinal = reduced ? 0 : ballRot

  return (
    <div
      ref={internalRef}
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 h-48 md:h-56"
    >
      <motion.div
        style={{ x: xFinal, y: bobFinal }}
        className="absolute bottom-4 left-0"
      >
        <svg
          width="180"
          height="220"
          viewBox="0 0 180 220"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]"
        >
          {/* —— Back arm —— */}
          <motion.g
            style={{
              rotate: armRFinal,
              transformBox: 'fill-box',
              transformOrigin: '50% 0%',
            }}
            transform="translate(72 88)"
          >
            <rect x="-4" y="0" width="8" height="44" rx="4" fill="#f4c89a" />
            <circle cx="0" cy="48" r="6" fill="#f4c89a" />
          </motion.g>

          {/* —— Back leg —— */}
          <motion.g
            style={{
              rotate: legRFinal,
              transformBox: 'fill-box',
              transformOrigin: '50% 0%',
            }}
            transform="translate(80 132)"
          >
            <rect x="-5" y="0" width="10" height="42" rx="3" fill="#0d1b3d" />
            <ellipse cx="2" cy="46" rx="11" ry="5" fill="#ff7a29" />
          </motion.g>

          {/* —— Body —— */}
          <g transform="translate(90 90)">
            {/* Neck */}
            <rect x="-5" y="-12" width="10" height="14" fill="#f4c89a" />
            {/* Torso — white tee */}
            <path
              d="M -22 0 Q -24 6 -24 18 L -24 44 Q -24 48 -20 48 L 20 48 Q 24 48 24 44 L 24 18 Q 24 6 22 0 Z"
              fill="#ffffff"
            />
            {/* Tee accent */}
            <rect x="-3" y="6" width="6" height="20" rx="2" fill="#1640a8" opacity="0.55" />
          </g>

          {/* —— Head —— */}
          <g transform="translate(90 60)">
            {/* Hair back */}
            <path
              d="M -22 -4 Q -22 -26 0 -28 Q 22 -26 22 -4 L 22 4 Q 18 -8 0 -10 Q -18 -8 -22 4 Z"
              fill="#2a1810"
            />
            {/* Face */}
            <circle cx="0" cy="0" r="20" fill="#f4c89a" />
            {/* Ear */}
            <ellipse cx="20" cy="2" rx="3" ry="5" fill="#f4c89a" />
            {/* Glasses */}
            <circle cx="-8" cy="-2" r="5" fill="none" stroke="#1a1a1a" strokeWidth="2" />
            <circle cx="8" cy="-2" r="5" fill="none" stroke="#1a1a1a" strokeWidth="2" />
            <line x1="-3" y1="-2" x2="3" y2="-2" stroke="#1a1a1a" strokeWidth="1.5" />
            {/* Smile */}
            <path
              d="M -5 8 Q 0 12 5 8"
              stroke="#1a1a1a"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
            />
            {/* Hair tuft */}
            <path
              d="M -16 -16 Q -8 -32 4 -22 Q 12 -28 18 -14"
              fill="#2a1810"
            />
          </g>

          {/* —— Front leg —— */}
          <motion.g
            style={{
              rotate: legLFinal,
              transformBox: 'fill-box',
              transformOrigin: '50% 0%',
            }}
            transform="translate(100 132)"
          >
            <rect x="-5" y="0" width="10" height="42" rx="3" fill="#0d1b3d" />
            <ellipse cx="2" cy="46" rx="11" ry="5" fill="#ff7a29" />
          </motion.g>

          {/* —— Front arm —— */}
          <motion.g
            style={{
              rotate: armLFinal,
              transformBox: 'fill-box',
              transformOrigin: '50% 0%',
            }}
            transform="translate(108 88)"
          >
            <rect x="-4" y="0" width="8" height="44" rx="4" fill="#f4c89a" />
            <circle cx="0" cy="48" r="6" fill="#f4c89a" />
          </motion.g>

          {/* —— Soccer ball —— */}
          <motion.g style={{ y: ballYFinal }} transform="translate(150 190)">
            <motion.g style={{ rotate: ballRotFinal, transformBox: 'fill-box', transformOrigin: '50% 50%' }}>
              <circle cx="0" cy="0" r="11" fill="#ffffff" />
              <polygon
                points="0,-8 7,-3 4,6 -4,6 -7,-3"
                fill="#1a1a1a"
              />
              <circle cx="0" cy="0" r="11" fill="none" stroke="#1a1a1a" strokeWidth="1.2" />
            </motion.g>
            {/* Shadow */}
            <ellipse cx="0" cy="16" rx="9" ry="2" fill="#000" opacity="0.25" />
          </motion.g>

          {/* —— Character ground shadow —— */}
          <ellipse cx="100" cy="186" rx="34" ry="4" fill="#000" opacity="0.25" />
        </svg>
      </motion.div>
    </div>
  )
}
