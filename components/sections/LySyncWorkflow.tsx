import { LYSYNC_WORKFLOW_STEPS } from '@/lib/lysync-lab'
import { cn } from '@/lib/utils'

type LySyncWorkflowProps = {
  variant?: 'compact' | 'full'
  className?: string
}

const STATUS_STYLES = {
  done: 'text-emerald-700',
  active: 'text-amber-700',
} as const

export function LySyncWorkflow({ variant = 'full', className }: LySyncWorkflowProps) {
  const compact = variant === 'compact'

  return (
    <div className={cn(className)}>
      <ol
        className={cn(
          'rounded-2xl border border-foreground/12 bg-background/80',
          compact ? 'divide-y divide-foreground/10' : 'divide-y divide-foreground/10',
        )}
      >
        {LYSYNC_WORKFLOW_STEPS.map((step, i) => (
          <li
            key={step.id}
            className={cn(
              'flex items-start gap-4 px-4 py-4 md:px-5',
              compact && 'px-3 py-3',
            )}
          >
            <div className="mt-0.5 flex items-center gap-2">
              <p
                className={cn(
                  'grid h-7 w-7 place-items-center rounded-full border border-foreground/15 bg-foreground/[0.03] font-mono text-[10px] uppercase tracking-wider text-foreground/55',
                  compact && 'text-[9px]',
                )}
              >
                {String(i + 1).padStart(2, '0')}
              </p>
              <span
                className={cn(
                  'inline-flex h-1.5 w-1.5 rounded-full',
                  step.status === 'done' ? 'bg-emerald-500' : 'bg-amber-500',
                )}
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <p
                  className={cn(
                    'font-semibold tracking-tight text-foreground',
                    compact ? 'text-sm' : 'text-base',
                  )}
                >
                  {step.label}
                </p>
                <span
                  className={cn(
                    'font-mono text-[10px] uppercase tracking-wide',
                    STATUS_STYLES[step.status],
                  )}
                >
                  {step.status === 'done' ? 'wired' : 'building'}
                </span>
              </div>

              <span
                className={cn(
                  'mt-1.5 block leading-relaxed text-foreground/65',
                  compact ? 'text-xs' : 'text-sm',
                )}
              >
                {step.detail}
              </span>
            </div>
          </li>
        ))}
      </ol>

      {!compact ? (
        <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/40">
          ASR → translate → TTS / VC → lip-sync → mux · timecodes locked across tracks
        </p>
      ) : null}
    </div>
  )
}
