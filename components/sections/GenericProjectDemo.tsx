'use client'

import { useState, type ReactNode } from 'react'
import type {
  DemoMessage,
  DemoTabPanel,
  DemoThread,
  ProjectDemoConfig,
  ProjectDemoTab,
} from '@/lib/project-demos'
import { cn } from '@/lib/utils'

function DemoWindow({
  url,
  children,
}: {
  url: string
  children: ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-xl shadow-stone-900/8">
      <div className="flex items-center gap-2 border-b border-stone-100 bg-stone-50/90 px-4 py-2.5">
        <div className="h-2.5 w-2.5 rounded-full bg-red-400/90" />
        <div className="h-2.5 w-2.5 rounded-full bg-amber-400/90" />
        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/90" />
        <span className="ml-2 flex-1 rounded-lg bg-white px-3 py-1 text-center font-mono text-[10px] text-stone-500 ring-1 ring-stone-200/80">
          {url}
        </span>
      </div>
      {children}
    </div>
  )
}

function InboxPanel({
  threads,
  messages,
}: {
  threads: DemoThread[]
  messages: DemoMessage[]
}) {
  const [active, setActive] = useState(threads[0]?.id ?? '')

  return (
    <div className="grid min-h-[380px] md:grid-cols-[minmax(0,240px)_1fr]">
      <aside className="border-r border-stone-100 bg-stone-50/80 p-3">
        <ul className="space-y-0.5">
          {threads.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => setActive(t.id)}
                className={cn(
                  'w-full rounded-xl px-2 py-2.5 text-left transition',
                  active === t.id
                    ? 'bg-white shadow-sm ring-1 ring-stone-200/80'
                    : 'hover:bg-white/90',
                )}
              >
                <span className="block text-xs font-semibold text-stone-900">{t.name}</span>
                <span className="mt-0.5 block truncate text-[11px] text-stone-500">
                  {t.preview}
                </span>
                <span className="mt-1.5 flex flex-wrap gap-1">
                  {t.channel ? (
                    <span className="rounded-md bg-stone-100 px-1.5 py-0.5 text-[9px] font-medium text-stone-600">
                      {t.channel}
                    </span>
                  ) : null}
                  {t.badge ? (
                    <span
                      className={cn(
                        'rounded-md px-1.5 py-0.5 text-[9px] font-semibold',
                        t.badge === 'AI' && 'bg-sky-50 text-sky-700',
                        t.badge === 'Human' && 'bg-violet-50 text-violet-700',
                        t.badge === 'Open' && 'bg-amber-50 text-amber-800',
                      )}
                    >
                      {t.badge}
                    </span>
                  ) : null}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <div className="flex flex-col bg-white p-4">
        <div className="flex-1 space-y-3">
          {messages.map((m, i) => (
            <div
              key={`${m.text.slice(0, 24)}-${i}`}
              className={cn(
                'max-w-[90%] rounded-2xl px-3 py-2 text-sm',
                m.from === 'user' && 'ml-auto bg-stone-900 text-white',
                m.from === 'ai' && 'bg-sky-50 text-stone-800 ring-1 ring-sky-100',
                m.from === 'system' && 'bg-stone-50 font-mono text-[11px] text-stone-600',
              )}
            >
              {m.text}
              {m.time ? (
                <span className="mt-1 block text-[10px] opacity-60">{m.time}</span>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ChatPanel({ messages }: { messages: DemoMessage[] }) {
  return (
    <div className="min-h-[320px] space-y-3 bg-white p-4">
      {messages.map((m, i) => (
        <div
          key={`${m.text.slice(0, 24)}-${i}`}
          className={cn(
            'max-w-[85%] rounded-2xl px-3 py-2 text-sm',
            m.from === 'user' && 'ml-auto bg-stone-900 text-white',
            m.from === 'ai' && 'bg-sky-50 text-stone-800',
            m.from === 'system' && 'mx-auto max-w-full bg-stone-50 text-center font-mono text-[11px] text-stone-600',
          )}
        >
          {m.text}
        </div>
      ))}
    </div>
  )
}

function KpisPanel({
  items,
  note,
}: {
  items: { label: string; value: string; delta?: string }[]
  note?: string
}) {
  return (
    <div className="grid gap-3 bg-white p-4 sm:grid-cols-2">
      {items.map((k) => (
        <div
          key={k.label}
          className="rounded-xl border border-stone-100 bg-stone-50/50 p-4"
        >
          <p className="text-[10px] font-medium uppercase tracking-wider text-stone-500">
            {k.label}
          </p>
          <p className="mt-1 text-2xl font-semibold text-stone-900">{k.value}</p>
          {k.delta ? (
            <p className="mt-1 font-mono text-[10px] text-stone-500">{k.delta}</p>
          ) : null}
        </div>
      ))}
      {note ? (
        <p className="sm:col-span-2 font-mono text-[11px] text-stone-500">{note}</p>
      ) : null}
    </div>
  )
}

function PipelinePanel({
  steps,
}: {
  steps: { label: string; detail: string; status: 'done' | 'active' | 'pending' }[]
}) {
  return (
    <ol className="space-y-0 bg-white p-4">
      {steps.map((s, i) => (
        <li key={s.label} className="flex gap-3 pb-4 last:pb-0">
          <span
            className={cn(
              'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold',
              s.status === 'done' && 'bg-emerald-100 text-emerald-800',
              s.status === 'active' && 'bg-sky-100 text-sky-800',
              s.status === 'pending' && 'bg-stone-100 text-stone-500',
            )}
          >
            {i + 1}
          </span>
          <div>
            <p className="text-sm font-medium text-stone-900">{s.label}</p>
            <p className="text-xs text-stone-500">{s.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

function ListPanel({
  items,
}: {
  items: { title: string; meta?: string; tag?: string }[]
}) {
  return (
    <ul className="divide-y divide-stone-100 bg-white">
      {items.map((item) => (
        <li
          key={item.title}
          className="flex items-center justify-between gap-3 px-4 py-3"
        >
          <div>
            <p className="text-sm font-medium text-stone-900">{item.title}</p>
            {item.meta ? (
              <p className="text-xs text-stone-500">{item.meta}</p>
            ) : null}
          </div>
          {item.tag ? (
            <span className="shrink-0 rounded-md bg-stone-100 px-2 py-0.5 font-mono text-[10px] text-stone-600">
              {item.tag}
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  )
}

function TabPanel({ panel }: { panel: DemoTabPanel }) {
  switch (panel.kind) {
    case 'inbox':
      return <InboxPanel threads={panel.threads} messages={panel.messages} />
    case 'chat':
      return <ChatPanel messages={panel.messages} />
    case 'kpis':
      return <KpisPanel items={panel.items} note={panel.note} />
    case 'pipeline':
      return <PipelinePanel steps={panel.steps} />
    case 'list':
      return <ListPanel items={panel.items} />
    default:
      return null
  }
}

type GenericProjectDemoProps = {
  config: ProjectDemoConfig
}

export function GenericProjectDemo({ config }: GenericProjectDemoProps) {
  const tabs = config.tabs ?? []
  const [tabIndex, setTabIndex] = useState(0)
  const active = tabs[tabIndex]

  if (!tabs.length) return null

  return (
    <DemoWindow url={config.windowUrl ?? 'app.portfolio.demo'}>
      <div className="flex flex-wrap gap-1 border-b border-stone-100 bg-stone-50/60 p-2">
        {tabs.map((tab: ProjectDemoTab, i: number) => (
          <button
            key={tab.slug}
            type="button"
            onClick={() => setTabIndex(i)}
            className={cn(
              'rounded-lg px-3 py-1.5 font-mono text-[10px] transition',
              i === tabIndex
                ? 'bg-white font-semibold text-stone-900 shadow-sm ring-1 ring-stone-200/80'
                : 'text-stone-500 hover:bg-white/80 hover:text-stone-800',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {active ? <TabPanel panel={active.panel} /> : null}
    </DemoWindow>
  )
}
