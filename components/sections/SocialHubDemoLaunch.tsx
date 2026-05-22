'use client'

import { Suspense, useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Play } from 'lucide-react'
import { SocialHubDemoModal } from '@/components/sections/SocialHubDemoModal'
import { SocialHubDemoInner } from '@/components/sections/SocialHubDemo'
import { cn } from '@/lib/utils'

function SocialHubDemoLaunchInner() {
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)

  const openDemo = useCallback(() => setOpen(true), [])

  useEffect(() => {
    const linkedin = searchParams.get('linkedin')
    const demo = searchParams.get('demo')
    if (linkedin === 'connected' || linkedin === 'error' || demo === '1') {
      setOpen(true)
    }
  }, [searchParams])

  useEffect(() => {
    if (window.location.hash === '#socialhub-demo') {
      setOpen(true)
      window.history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search,
      )
    }
  }, [])

  return (
    <>
      <button
        type="button"
        onClick={openDemo}
        className={cn(
          'group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition',
          'bg-[#0A66C2] text-white shadow-lg shadow-[#0A66C2]/25',
          'hover:brightness-110 hover:shadow-xl hover:shadow-[#0A66C2]/30',
          'ring-2 ring-[#0A66C2]/20 ring-offset-2 ring-offset-background',
        )}
      >
        <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
          <Play className="h-3.5 w-3.5 fill-current" />
          <span className="absolute inset-0 animate-ping rounded-full bg-white/30 opacity-75 group-hover:opacity-100" />
        </span>
        Demo
      </button>
      <p className="mt-2 max-w-sm font-mono text-[10px] leading-relaxed text-foreground/45">
        Try the live SocialHub flow — connect LinkedIn, pick an image, post.
      </p>

      <SocialHubDemoModal open={open} onClose={() => setOpen(false)}>
        <SocialHubDemoInner
          variant="modal"
          onLinkedInOAuthHandled={openDemo}
        />
      </SocialHubDemoModal>
    </>
  )
}

export function SocialHubDemoLaunch() {
  return (
    <Suspense fallback={null}>
      <SocialHubDemoLaunchInner />
    </Suspense>
  )
}
