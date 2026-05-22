'use client'

import { useState, type ReactNode } from 'react'
import {
  BarChart3,
  Bot,
  Inbox,
  Search,
  Send,
  Settings,
  UserRound,
  Zap,
} from 'lucide-react'
import {
  UNIFY_AI_MESSAGES,
  UNIFY_ANALYTICS_KPIS,
  UNIFY_AUTOMATION_RULES,
  UNIFY_INBOX_INTEGRATIONS,
  UNIFY_INBOX_THREADS,
  UNIFY_SENDER_BARS,
  UNIFY_SETTINGS_NAV,
  UNIFY_TAB_LABELS,
  UNIFY_TAB_SLUGS,
  UNIFY_TAKEOVER_MESSAGES,
  UNIFY_VOLUME_BARS,
  tabUrl,
  type UnifyTabSlug,
  type UnifyThread,
} from '@/lib/unify-dashboard-demo'
import { cn } from '@/lib/utils'

const TAB_ICONS = [Inbox, Bot, UserRound, BarChart3, Zap, Settings] as const

const BURGUNDY = 'bg-[#5c1f2e] hover:bg-[#4a1825]'

function WindowChrome({ url, children }: { url: string; children: ReactNode }) {
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

function InboxView() {
  const [thread, setThread] = useState<UnifyThread>(UNIFY_INBOX_THREADS[0])

  return (
    <div className="grid min-h-[420px] md:grid-cols-[minmax(0,250px)_1fr]">
      <aside className="border-r border-stone-100 bg-[#faf9f7] p-3">
        <div className="mb-2 flex items-center justify-between px-1">
          <p className="text-xs font-semibold text-stone-800">My Inbox</p>
          <Search className="h-3.5 w-3.5 text-stone-400" />
        </div>
        <ul className="space-y-0.5">
          {UNIFY_INBOX_THREADS.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => setThread(t)}
                className={cn(
                  'flex w-full items-start gap-2.5 rounded-xl px-2 py-2.5 text-left transition',
                  thread.id === t.id
                    ? 'bg-white shadow-sm ring-1 ring-stone-200/80'
                    : 'hover:bg-white/80',
                )}
              >
                <span
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                    t.id === 'mike' ? 'bg-violet-100 text-violet-800' : 'bg-stone-200 text-stone-700',
                  )}
                >
                  {t.initial}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex justify-between gap-1">
                    <span className="truncate text-xs font-semibold text-stone-900">
                      {t.name}
                    </span>
                    <span className="shrink-0 text-[10px] text-stone-400">{t.time}</span>
                  </span>
                  <span className="mt-0.5 block truncate text-[11px] text-stone-500">
                    {t.preview}
                  </span>
                  <span className="mt-1.5 flex gap-1">
                    {t.ai ? (
                      <span className="rounded-md bg-sky-50 px-1.5 py-0.5 text-[9px] font-semibold text-sky-700">
                        AI
                      </span>
                    ) : null}
                    <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[9px] font-semibold text-amber-800">
                      Open
                    </span>
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="flex flex-col">
        <div className="flex items-center justify-between border-b border-stone-100 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-stone-900">{thread.name}</span>
            {thread.channel === 'WhatsApp' ? (
              <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                WhatsApp
              </span>
            ) : (
              <span className="rounded-md bg-stone-100 px-2 py-0.5 text-[10px] text-stone-600">
                {thread.channel}
              </span>
            )}
            {thread.ai ? (
              <span className="rounded-md bg-sky-50 px-2 py-0.5 text-[10px] font-medium text-sky-700">
                AI Handling
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto bg-white p-4">
          {thread.messages.map((msg) => {
            if (msg.from === 'system') {
              return (
                <p
                  key={`${msg.time}-${msg.text}`}
                  className="text-center text-[10px] text-stone-400"
                >
                  {msg.text}
                </p>
              )
            }
            const isAi = msg.from === 'ai'
            return (
              <div
                key={`${msg.time}-${msg.text}`}
                className={cn('flex', isAi ? 'justify-end' : 'justify-start')}
              >
                <div
                  className={cn(
                    'max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed',
                    isAi ? 'bg-sky-50 text-stone-800' : 'bg-stone-100 text-stone-800',
                  )}
                >
                  {isAi ? (
                    <span className="mb-1 block text-[10px] font-semibold text-sky-600">
                      AI Bot
                    </span>
                  ) : null}
                  {msg.text}
                  <span className="mt-1 block text-[10px] text-stone-400">{msg.time}</span>
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex items-center gap-2 border-t border-stone-100 p-3">
          <div className="flex-1 rounded-xl bg-stone-50 px-4 py-2.5 text-sm text-stone-400 ring-1 ring-stone-200/80">
            Type a message…
          </div>
          <button
            type="button"
            aria-label="Send"
            className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white', BURGUNDY)}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

function AiConversationsView() {
  return (
    <div className="grid min-h-[420px] md:grid-cols-[1fr_minmax(0,200px)]">
      <div className="flex flex-col border-r border-stone-100">
        <div className="flex items-center justify-between border-b border-stone-100 px-4 py-3">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-stone-600" />
            <span className="text-sm font-semibold text-stone-900">AI L1 Agent</span>
          </div>
          <span className="rounded-lg bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-700 ring-1 ring-sky-100">
            Confidence: 94%
          </span>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {UNIFY_AI_MESSAGES.map((msg) => {
            const isAi = msg.from === 'ai'
            return (
              <div
                key={`${msg.time}-${msg.text}`}
                className={cn('flex', isAi ? 'justify-end' : 'justify-start')}
              >
                <div
                  className={cn(
                    'max-w-[90%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed',
                    isAi ? 'bg-sky-50 text-stone-800' : 'bg-stone-100 text-stone-800',
                  )}
                >
                  {isAi ? (
                    <span className="mb-1 block text-[10px] font-semibold text-sky-600">
                      AI Bot
                    </span>
                  ) : null}
                  {msg.text}
                  <span className="mt-1 block text-[10px] text-stone-400">{msg.time}</span>
                </div>
              </div>
            )
          })}
        </div>
        <div className="flex flex-wrap gap-2 border-t border-stone-100 px-4 py-3">
          <span className="rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-medium text-emerald-700">
            Product Catalog
          </span>
          <span className="rounded-md bg-sky-50 px-2 py-1 text-[10px] font-medium text-sky-700">
            Context-Aware
          </span>
          <span className="rounded-md bg-amber-50 px-2 py-1 text-[10px] font-medium text-amber-800">
            Multi-turn
          </span>
        </div>
      </div>
      <aside className="bg-[#faf9f7] p-4 text-xs">
        <p className="font-semibold uppercase tracking-wider text-stone-500">AI skills active</p>
        <ul className="mt-3 space-y-2 text-stone-700">
          {['LLM Reasoning', 'Catalog Search', 'Confidence Scoring', 'Brand Voice'].map(
            (skill) => (
              <li key={skill} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {skill}
              </li>
            ),
          )}
        </ul>
        <p className="mt-6 font-semibold uppercase tracking-wider text-stone-500">Session</p>
        <dl className="mt-3 space-y-2 text-stone-700">
          <div className="flex justify-between">
            <dt>Messages</dt>
            <dd className="font-medium">6</dd>
          </div>
          <div className="flex justify-between">
            <dt>Duration</dt>
            <dd className="font-medium">2m 14s</dd>
          </div>
          <div className="flex justify-between">
            <dt>Confidence</dt>
            <dd className="font-semibold text-sky-600">94%</dd>
          </div>
        </dl>
      </aside>
    </div>
  )
}

function TakeoverView() {
  return (
    <div className="flex min-h-[420px] flex-col">
      <div className="flex items-center justify-between border-b border-stone-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-800">
            M
          </span>
          <span className="text-sm font-semibold text-stone-900">Mike L.</span>
        </div>
        <button type="button" className={cn('rounded-lg px-4 py-2 text-xs font-semibold text-white', BURGUNDY)}>
          Take Over
        </button>
      </div>
      <div className="border-b border-amber-200/80 bg-amber-50 px-4 py-2.5 text-center text-xs font-medium text-amber-900">
        ⚠ Escalated — Customer requested human agent
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {UNIFY_TAKEOVER_MESSAGES.map((msg) => {
          const isAi = msg.from === 'ai'
          return (
            <div
              key={`${msg.time}-${msg.text}`}
              className={cn('flex', isAi ? 'justify-end' : 'justify-start')}
            >
              <div
                className={cn(
                  'max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed',
                  isAi ? 'bg-sky-50 text-stone-800' : 'bg-stone-100 text-stone-800',
                )}
              >
                {isAi ? (
                  <span className="mb-1 block text-[10px] font-semibold text-sky-600">
                    AI Bot
                  </span>
                ) : null}
                {msg.text}
                <span className="mt-1 block text-[10px] text-stone-400">{msg.time}</span>
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex flex-wrap gap-2 border-t border-stone-100 p-4">
        <button
          type="button"
          className="rounded-lg border border-stone-200 bg-white px-4 py-2 text-xs font-medium text-stone-700"
        >
          Canned responses
        </button>
        <button
          type="button"
          className="rounded-lg border border-stone-200 bg-white px-4 py-2 text-xs font-medium text-stone-700"
        >
          Private note
        </button>
        <button type="button" className={cn('rounded-lg px-4 py-2 text-xs font-semibold text-white', BURGUNDY)}>
          Resume AI
        </button>
      </div>
    </div>
  )
}

function AnalyticsView() {
  const [range, setRange] = useState<'today' | '7d' | '30d'>('7d')
  const maxVol = Math.max(...UNIFY_VOLUME_BARS)

  return (
    <div className="min-h-[420px] p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-stone-900">Reports &amp; Analytics</h3>
        <div className="flex rounded-lg border border-stone-200 bg-stone-50 p-0.5 text-xs">
          {(['today', '7d', '30d'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={cn(
                'rounded-md px-3 py-1.5 font-medium capitalize transition',
                range === r ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500',
              )}
            >
              {r === '7d' ? '7d' : r}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {UNIFY_ANALYTICS_KPIS.map((kpi) => (
          <div
            key={kpi.label}
            className={cn('rounded-xl border border-stone-100 bg-[#faf9f7] border-l-4 p-4', kpi.border)}
          >
            <p className="text-[11px] font-medium text-stone-500">{kpi.label}</p>
            <p className="mt-1 text-2xl font-semibold text-stone-900">{kpi.value}</p>
            <p
              className={cn(
                'mt-1 text-xs font-medium',
                kpi.up ? 'text-emerald-600' : 'text-red-500',
              )}
            >
              {kpi.delta}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-stone-100 bg-[#faf9f7] p-4">
          <p className="text-sm font-semibold text-stone-800">Volume over time</p>
          <div className="mt-4 flex h-36 items-end justify-between gap-1">
            {UNIFY_VOLUME_BARS.map((h, i) => (
              <div
                key={i}
                className={cn(
                  'w-full max-w-[14px] rounded-t-sm',
                  i === 9 ? 'bg-[#5c1f2e]' : 'bg-stone-300',
                )}
                style={{ height: `${(h / maxVol) * 100}%` }}
              />
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-stone-100 bg-[#faf9f7] p-4">
          <p className="text-sm font-semibold text-stone-800">By sender</p>
          <div className="mt-5 space-y-4">
            {UNIFY_SENDER_BARS.map((row) => (
              <div key={row.label}>
                <div className="mb-1 flex justify-between text-xs text-stone-600">
                  <span>{row.label}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-stone-200">
                  <div
                    className={cn('h-full rounded-full', row.color)}
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function AutomationView() {
  return (
    <div className="min-h-[420px] p-5 md:p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-stone-900">Automation Rules</h3>
        <button type="button" className={cn('rounded-lg px-3 py-1.5 text-xs font-semibold text-white', BURGUNDY)}>
          + Add Rule
        </button>
      </div>
      <ul className="mt-5 space-y-3">
        {UNIFY_AUTOMATION_RULES.map((rule) => (
          <li
            key={rule.title}
            className="flex items-center justify-between rounded-xl border border-stone-100 bg-[#faf9f7] px-4 py-4"
          >
            <div className="flex items-start gap-3">
              <span
                className={cn(
                  'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                  rule.active ? 'bg-emerald-500' : 'bg-stone-300',
                )}
              />
              <div>
                <p className="text-sm font-semibold text-stone-900">{rule.title}</p>
                <p className="mt-0.5 text-xs text-stone-500">{rule.when}</p>
              </div>
            </div>
            <span
              className={cn(
                'rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                rule.active
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-stone-100 text-stone-500',
              )}
            >
              {rule.active ? 'Active' : 'Paused'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function SettingsView() {
  const [nav, setNav] = useState('Inboxes')

  return (
    <div className="grid min-h-[420px] md:grid-cols-[160px_1fr]">
      <aside className="border-r border-stone-100 bg-[#faf9f7] p-3">
        <ul className="space-y-0.5">
          {UNIFY_SETTINGS_NAV.map((item) => (
            <li key={item}>
              <button
                type="button"
                onClick={() => setNav(item)}
                className={cn(
                  'w-full rounded-lg px-3 py-2 text-left text-xs font-medium transition',
                  nav === item
                    ? 'bg-rose-50 text-[#5c1f2e]'
                    : 'text-stone-600 hover:bg-white/80',
                )}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <div className="p-5 md:p-6">
        <h3 className="text-lg font-semibold text-stone-900">Inboxes</h3>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {UNIFY_INBOX_INTEGRATIONS.map((ch) => (
            <div
              key={ch.name}
              className="flex items-center justify-between rounded-xl border border-stone-100 bg-[#faf9f7] px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold text-white',
                    ch.color,
                  )}
                >
                  {ch.letter}
                </span>
                <span className="text-sm font-medium text-stone-800">{ch.name}</span>
              </div>
              <span
                className={cn(
                  'relative h-6 w-11 rounded-full transition',
                  ch.on ? 'bg-emerald-500' : 'bg-stone-300',
                )}
              >
                <span
                  className={cn(
                    'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition',
                    ch.on ? 'left-[22px]' : 'left-0.5',
                  )}
                />
              </span>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-xl border border-stone-100 bg-[#faf9f7] p-4">
          <p className="text-sm font-semibold text-stone-900">Telegram Configuration</p>
          <label className="mt-4 block">
            <span className="text-xs font-medium text-stone-500">Bot Token</span>
            <input
              readOnly
              value="••••••••••••AAH..."
              className="mt-1 w-full rounded-lg border border-stone-200 bg-white px-3 py-2 font-mono text-xs text-stone-600"
            />
          </label>
          <label className="mt-3 block">
            <span className="text-xs font-medium text-stone-500">Webhook URL</span>
            <input
              readOnly
              value="https://api.unify.app/webhook/telegram"
              className="mt-1 w-full rounded-lg border border-stone-200 bg-white px-3 py-2 font-mono text-[11px] text-stone-600"
            />
          </label>
        </div>
      </div>
    </div>
  )
}

const VIEWS: Record<UnifyTabSlug, () => ReactNode> = {
  inbox: InboxView,
  ai: AiConversationsView,
  takeover: TakeoverView,
  analytics: AnalyticsView,
  automation: AutomationView,
  settings: SettingsView,
}

export function UnifyDashboardDemo() {
  const [activeTab, setActiveTab] = useState(0)
  const slug = UNIFY_TAB_SLUGS[activeTab]
  const View = VIEWS[slug]

  return (
    <div className="rounded-3xl bg-[#f0ebe3] p-3 md:p-4">
      <div className="mb-3 flex flex-wrap items-center justify-center gap-1 rounded-2xl bg-[#e8e2d9] p-1.5 md:gap-1.5">
        {UNIFY_TAB_LABELS.map((label, i) => {
          const Icon = TAB_ICONS[i]
          return (
            <button
              key={label}
              type="button"
              onClick={() => setActiveTab(i)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-medium transition md:text-xs',
                i === activeTab
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900',
              )}
            >
              <Icon className="h-3.5 w-3.5 shrink-0 opacity-70" />
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">
                {label.split(' ')[0]}
              </span>
            </button>
          )
        })}
      </div>
      <WindowChrome url={tabUrl(slug)}>
        <View />
      </WindowChrome>
    </div>
  )
}

/** @deprecated Use UnifyDashboardDemo */
export const UnifyInboxDemo = UnifyDashboardDemo
