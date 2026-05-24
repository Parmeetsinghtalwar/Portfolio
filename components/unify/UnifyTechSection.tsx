'use client'

import { Layers, Shield } from 'lucide-react'
import {
  UNIFY_ARCHITECTURE_LAYERS,
  UNIFY_CONTRIBUTIONS,
  UNIFY_FLOW_STEPS,
  UNIFY_MULTITENANT_POINTS,
  UNIFY_STACK_GROUPS,
  UNIFY_TECH_STATS,
} from '@/lib/unify-tech'

export function UnifyTechSection() {
  return (
    <>
      <section id="engineering" className="border-t border-slate-200/80 bg-slate-950 px-6 py-20 text-slate-100 md:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-indigo-400">
            Engineering
          </p>
          <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
            How Unify is built — multi-tenant platform + L1 agent
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-400">
            Production omni-channel support ships as two repos: a NestJS monorepo for
            conversations, RBAC, and channel webhooks, and a FastAPI agent for
            multilingual L1 automation. Below is the stack and what I implemented on
            top of it.
          </p>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {UNIFY_TECH_STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5"
              >
                <p className="text-2xl font-semibold text-indigo-300">{stat.value}</p>
                <p className="mt-1 text-sm font-semibold text-slate-100">{stat.label}</p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-500">
                  {stat.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200/80 bg-white px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-start gap-3">
            <Layers className="mt-1 h-6 w-6 text-indigo-600" />
            <div>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                System architecture
              </h2>
              <p className="mt-3 max-w-2xl text-slate-600">
                End-to-end path from a customer message on any channel to an AI or human
                reply — always scoped to one tenant.
              </p>
            </div>
          </div>

          <div className="mt-12 space-y-4">
            {UNIFY_ARCHITECTURE_LAYERS.map((layer, i) => (
              <article
                key={layer.title}
                className="grid gap-4 rounded-2xl border border-slate-200 bg-[#fafafa] p-6 md:grid-cols-[120px_1fr]"
              >
                <p className="font-mono text-sm font-semibold text-indigo-600">
                  Layer {i + 1}
                </p>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{layer.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {layer.detail}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-16">
            <h3 className="text-xl font-semibold text-slate-900">Message flow</h3>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {UNIFY_FLOW_STEPS.map((item) => (
                <div key={item.step} className="rounded-xl border border-slate-200 p-5">
                  <p className="font-mono text-sm font-semibold text-indigo-600">
                    {item.step}
                  </p>
                  <h4 className="mt-2 font-semibold text-slate-900">{item.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200/80 bg-[#f4f4f8] px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-start gap-3">
            <Shield className="mt-1 h-6 w-6 text-indigo-600" />
            <div>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Multi-tenant by design
              </h2>
              <p className="mt-3 max-w-2xl text-slate-600">
                One deployment serves multiple brands and workspaces. Isolation is enforced
                in the database, API middleware, and agent session store — not just in UI
                filters.
              </p>
            </div>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {UNIFY_MULTITENANT_POINTS.map((point) => (
              <article
                key={point.title}
                className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm"
              >
                <h3 className="font-semibold text-slate-900">{point.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{point.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200/80 bg-white px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            What I built
          </h2>
          <p className="mt-3 max-w-2xl text-slate-600">
            Scope across both repositories — platform wiring, agent intelligence, and the
            operator experience you see in the demo above.
          </p>
          <ul className="mt-10 space-y-4">
            {UNIFY_CONTRIBUTIONS.map((item) => (
              <li
                key={item}
                className="flex gap-3 rounded-xl border border-slate-200 bg-[#fafafa] px-5 py-4 text-sm leading-relaxed text-slate-700"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600" />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {UNIFY_STACK_GROUPS.map((group) => (
              <div
                key={group.group}
                className="rounded-2xl border border-slate-200 p-6"
              >
                <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-600">
                  {group.group}
                </h3>
                <ul className="mt-4 space-y-2">
                  {group.items.map((item) => (
                    <li key={item} className="text-sm text-slate-600">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
