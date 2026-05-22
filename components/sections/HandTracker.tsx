'use client'
import dynamic from 'next/dynamic'

// Loaded only on the client and only when this section mounts. Keeps the
// ~500KB MediaPipe module out of every other route's bundle.
const HandCursor = dynamic(() => import('./HandCursor').then((m) => m.HandCursor), {
  ssr: false,
  loading: () => (
    <section className="flex min-h-screen items-center justify-center bg-neutral-950">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/40">
        Loading…
      </p>
    </section>
  ),
})

export function HandTracker() {
  return <HandCursor />
}
