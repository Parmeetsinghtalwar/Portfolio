'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { FolderOpen, Trash2, X } from 'lucide-react'
import type { ReviewMemory } from '@/components/sections/ContactReviewPanel'

type MemoryCornerProps = {
  open: boolean
  onClose: () => void
  memories: ReviewMemory[]
  onRemove: (id: string) => void
  onClearAll: () => void
  preview: ReviewMemory | null
  onPreview: (memory: ReviewMemory | null) => void
}

function memoryLabel(m: ReviewMemory): string {
  if (m.typedText) return m.typedText.slice(0, 48)
  return 'memory'
}

export function MemoryCorner({
  open,
  onClose,
  memories,
  onRemove,
  onClearAll,
  preview,
  onPreview,
}: MemoryCornerProps) {
  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-label="Close memory corner"
              className="fixed inset-0 z-[55] bg-black/50 backdrop-blur-sm"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="fixed right-0 top-0 z-[60] flex h-full w-full max-w-md flex-col border-l border-white/15 bg-black/92 text-white shadow-2xl backdrop-blur-xl"
              role="dialog"
              aria-modal="true"
              aria-label="Memory corner"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5 text-emerald-400" />
                  <div>
                    <p className="font-mono text-xs uppercase tracking-wider text-white/50">
                      Memory corner
                    </p>
                    <p className="text-sm font-medium">
                      {memories.length} saved on this device
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full bg-white/10 p-2 ring-1 ring-white/20"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {memories.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-white/20 px-4 py-12 text-center font-mono text-sm text-white/50">
                    Nothing saved yet. Draw, sign, or type — then hit Save.
                  </p>
                ) : (
                  <ul className="grid grid-cols-2 gap-3">
                    {memories.map((m) => (
                      <li
                        key={m.id}
                        className="group relative aspect-[4/3] overflow-hidden rounded-xl ring-1 ring-white/15"
                      >
                        <button
                          type="button"
                          onClick={() => onPreview(m)}
                          className="absolute inset-0 block w-full"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={m.dataUrl}
                            alt="Saved memory"
                            className="h-full w-full object-cover transition group-hover:scale-105"
                          />
                        </button>
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-2">
                          <p className="line-clamp-1 font-mono text-[9px] text-white/85">
                            {memoryLabel(m)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemove(m.id)}
                          className="absolute right-1.5 top-1.5 rounded-full bg-black/75 p-1 text-white/90 opacity-0 ring-1 ring-white/20 transition group-hover:opacity-100"
                          aria-label="Remove memory"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {memories.length > 0 && (
                <div className="border-t border-white/10 p-4">
                  <button
                    type="button"
                    onClick={onClearAll}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 py-2 font-mono text-xs uppercase tracking-wider text-white/70 hover:bg-white/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Clear all memories
                  </button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-6 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            onClick={() => onPreview(null)}
          >
            <div
              className="relative max-h-[90vh] w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview.dataUrl}
                alt="Memory preview"
                className="w-full rounded-2xl object-contain ring-1 ring-white/15"
              />
              {preview.typedText && (
                <p className="mt-3 font-mono text-xs text-white/80">{preview.typedText}</p>
              )}
              <div className="mt-4 flex justify-end gap-2">
                <a
                  href={preview.dataUrl}
                  download={`memory-${preview.id}.jpg`}
                  className="rounded-full bg-white/10 px-3 py-1.5 font-mono text-xs text-white"
                >
                  Download
                </a>
                <button
                  type="button"
                  onClick={() => onPreview(null)}
                  className="rounded-full bg-white/10 px-3 py-1.5 font-mono text-xs text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
