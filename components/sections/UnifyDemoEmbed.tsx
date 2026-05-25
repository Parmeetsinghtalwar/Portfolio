'use client'

import { UnifyDashboardDemo } from '@/components/unify/UnifyDashboardDemo'

/** Inbox demo styled for portfolio project pages (matches ProjectDetail palette). */
export function UnifyDemoEmbed() {
  return (
    <div className="overflow-hidden rounded-2xl border border-foreground/12 bg-foreground/[0.02]">
      <UnifyDashboardDemo />
    </div>
  )
}
