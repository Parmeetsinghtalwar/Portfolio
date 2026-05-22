const TICKER =
  'PORTFOLIO — AGENT SYSTEMS · GENOPS · AI PRODUCTS — CO-FOUNDER GETZONED — '

export function TopTicker() {
  const line = `${TICKER.repeat(3)}`

  return (
    <div
      className="relative z-[60] h-9 shrink-0 overflow-hidden bg-foreground text-background"
      aria-hidden
    >
      <div className="flex h-full items-center whitespace-nowrap motion-safe:animate-editorial-ticker">
        <span className="px-4 font-mono text-[11px] uppercase tracking-[0.12em]">
          {line}
        </span>
        <span className="px-4 font-mono text-[11px] uppercase tracking-[0.12em]">
          {line}
        </span>
      </div>
    </div>
  )
}
