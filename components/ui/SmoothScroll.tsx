'use client'
import { useEffect } from 'react'
import Lenis from 'lenis'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

export function SmoothScroll() {
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced) return

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    })

    let raf = 0
    const tick = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [reduced])

  return null
}
