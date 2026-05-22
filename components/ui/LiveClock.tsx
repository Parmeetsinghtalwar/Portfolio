'use client'

import { useEffect, useState } from 'react'

function formatClock(date: Date): string {
  const h = date.getHours().toString().padStart(2, '0')
  const m = date.getMinutes().toString().padStart(2, '0')
  const s = date.getSeconds().toString().padStart(2, '0')
  const offsetMin = -date.getTimezoneOffset()
  const sign = offsetMin >= 0 ? '+' : '-'
  const abs = Math.abs(offsetMin)
  const oh = Math.floor(abs / 60)
  const om = abs % 60
  const tz =
    om === 0
      ? `UTC${sign}${oh}`
      : `UTC${sign}${oh}:${om.toString().padStart(2, '0')}`
  return `${h}:${m}:${s} (${tz})`
}

export function LiveClock() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const tick = () => setTime(formatClock(new Date()))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <time
      dateTime={new Date().toISOString()}
      className="font-mono text-[11px] tabular-nums tracking-wide text-foreground/80"
    >
      {time || '—:—:—'}
    </time>
  )
}
