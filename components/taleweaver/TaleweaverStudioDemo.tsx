'use client'

import { useState } from 'react'
import { BookOpen, Download, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const CHAPTERS = [
  { id: '1', title: 'The threshold', words: 2840, status: 'done' as const },
  { id: '2', title: 'Paper cities', words: 3120, status: 'done' as const },
  { id: '3', title: 'What the river kept', words: 1960, status: 'generating' as const },
  { id: '4', title: 'Epilogue — ash light', words: 0, status: 'queued' as const },
]

export function TaleweaverStudioDemo() {
  const [activeChapter, setActiveChapter] = useState('2')

  const chapter = CHAPTERS.find((c) => c.id === activeChapter) ?? CHAPTERS[1]

  return (
    <div className="overflow-hidden rounded-2xl border border-amber-900/15 bg-[#fffdf8] shadow-2xl shadow-amber-950/10 ring-1 ring-amber-950/5">
      <div className="flex items-center gap-2 border-b border-amber-900/10 bg-[#f7f2e8] px-4 py-2.5">
        <div className="h-2 w-2 rounded-full bg-red-400/90" />
        <div className="h-2 w-2 rounded-full bg-amber-400/90" />
        <div className="h-2 w-2 rounded-full bg-emerald-500/90" />
        <span className="ml-2 font-mono text-[10px] text-amber-900/50">
          taleweaver.studio / manuscript
        </span>
      </div>

      <div className="grid min-h-[360px] md:grid-cols-[220px_1fr]">
        <aside className="border-r border-amber-900/10 bg-[#faf6ee] p-3">
          <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-wider text-amber-900/55">
            Chapters
          </p>
          <ul className="space-y-1">
            {CHAPTERS.map((ch) => (
              <li key={ch.id}>
                <button
                  type="button"
                  onClick={() => setActiveChapter(ch.id)}
                  className={cn(
                    'w-full rounded-lg px-2 py-2 text-left text-xs transition',
                    activeChapter === ch.id
                      ? 'bg-white shadow-sm ring-1 ring-amber-900/10'
                      : 'hover:bg-white/60',
                  )}
                >
                  <span className="font-medium text-amber-950">{ch.title}</span>
                  <span className="mt-0.5 flex items-center gap-2 text-[10px] text-amber-900/50">
                    {ch.status === 'done' && `${ch.words.toLocaleString()} words`}
                    {ch.status === 'generating' && (
                      <span className="inline-flex items-center gap-1 text-violet-700">
                        <Sparkles className="h-3 w-3" />
                        Generating…
                      </span>
                    )}
                    {ch.status === 'queued' && 'Queued'}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-lg border border-dashed border-amber-900/20 bg-white/50 p-2">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-900/50">
              Style source
            </p>
            <p className="mt-1 text-[11px] text-amber-950/80">author-sample.epub</p>
            <p className="mt-1 text-[10px] text-emerald-700">Fine-tune locked ✓</p>
          </div>
        </aside>

        <div className="flex flex-col p-4 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-900/10 pb-3">
            <div>
              <p className="font-editorial text-lg font-medium text-amber-950">
                {chapter.title}
              </p>
              <p className="text-[11px] text-amber-900/50">Literary fiction · voice-locked</p>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full bg-amber-950 px-3 py-1.5 text-[11px] font-medium text-amber-50"
            >
              <Download className="h-3 w-3" />
              Export EPUB
            </button>
          </div>
          <div className="mt-4 flex-1 space-y-3 font-editorial text-sm leading-relaxed text-amber-950/85">
            <p>
              The station clock had stopped at eleven, or maybe it had never started — she
              could not remember which story she had been told about it. What mattered was
              the platform: empty, lit only by the vending machine, humming like a patient
              animal.
            </p>
            <p>
              When the draft line appeared on her phone, it did not read like a machine had
              written it. That was the point of the fine-tune: her commas, her hesitation,
              the way she broke a paragraph when the thought needed air.
            </p>
            <p className="text-amber-900/40 italic">
              … chapter continues · tuned from uploaded EPUB …
            </p>
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-violet-50 px-3 py-2 text-[11px] text-violet-900">
            <BookOpen className="h-3.5 w-3.5 shrink-0" />
            Detection-aware polish pass · natural cadence · no generic LLM filler
          </div>
        </div>
      </div>
    </div>
  )
}
