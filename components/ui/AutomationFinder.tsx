'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Blocks,
  ChevronLeft,
  Download,
  FolderOpen,
  Home,
  Sparkles,
  Workflow,
  Zap,
} from 'lucide-react'
import {
  AUTOMATION_FOLDERS,
  FINDER_PATH_ROOT,
  getFolderById,
  getWorkflowsForFolder,
  type AutomationFolder,
  type AutomationFolderId,
} from '@/lib/automation-finder'
import type { AutomationWorkflow } from '@/lib/automation-types'
import { cn } from '@/lib/utils'

const FINDER_BG = '#F6F3EC'
const FINDER_SIDEBAR = '#EFE9DF'
const FINDER_BORDER = '#E0D9CE'
const FINDER_TEXT = '#3D3832'
const FINDER_MUTED = '#7A736A'

function FolderIcon({
  folder,
  selected,
  onClick,
}: {
  folder: AutomationFolder
  selected: boolean
  onClick: () => void
}) {
  const Icon =
    folder.icon === 'sparkles'
      ? Sparkles
      : folder.icon === 'blocks'
        ? Blocks
        : folder.icon === 'zap'
          ? Zap
          : Workflow

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col items-center gap-2 text-center transition-transform hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8DB9D3]/50"
    >
      <div className="relative">
        <div
          className={cn(
            'relative h-[72px] w-[88px] rounded-t-xl shadow-sm transition-shadow group-hover:shadow-md',
            selected && 'ring-2 ring-[#3D3832]/25 ring-offset-2 ring-offset-[#F6F3EC]',
          )}
          style={{ backgroundColor: folder.color }}
        >
          <div
            className="absolute -top-2 left-0 h-4 w-10 rounded-t-md"
            style={{ backgroundColor: folder.color, filter: 'brightness(0.92)' }}
          />
          <div className="flex h-full items-center justify-center">
            <Icon className="h-7 w-7 text-white/90" strokeWidth={1.5} />
          </div>
        </div>
        {selected ? (
          <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-[#3D3832] ring-2 ring-[#F6F3EC]" />
        ) : null}
      </div>
      <span
        className="max-w-[110px] text-sm font-medium leading-snug"
        style={{ color: FINDER_TEXT }}
      >
        {folder.label}
      </span>
    </button>
  )
}

function WorkflowDetail({
  workflow,
  folder,
}: {
  workflow: AutomationWorkflow
  folder: AutomationFolder
}) {
  const importHint =
    folder.id === 'n8n'
      ? 'n8n → ⋮ menu → Import from File → select JSON → wire credentials → Activate'
      : folder.id === 'comfyui'
        ? 'ComfyUI → Load (or drag) JSON workflow → fix checkpoint / LoRA paths → Queue Prompt'
        : folder.id === 'make'
          ? 'Make.com → Create scenario → Import blueprint (when provided)'
          : 'Zapier → Create Zap → Import template (when provided)'

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="finder-scroll min-h-0 flex-1 overflow-y-auto p-6 md:p-8">
        <p
          className="font-mono text-xs uppercase tracking-[0.2em]"
          style={{ color: FINDER_MUTED }}
        >
          {folder.label}
        </p>
        <h3
          className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl"
          style={{ color: FINDER_TEXT }}
        >
          {workflow.title}
        </h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {workflow.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider"
              style={{ backgroundColor: `${folder.color}33`, color: FINDER_TEXT }}
            >
              {tag}
            </span>
          ))}
        </div>
        <p
          className="mt-6 text-base leading-relaxed md:text-lg"
          style={{ color: FINDER_MUTED }}
        >
          {workflow.detail ?? workflow.description}
        </p>
        {workflow.relatedHref ? (
          <Link
            href={workflow.relatedHref}
            className="mt-6 inline-block text-base font-medium underline underline-offset-4"
            style={{ color: FINDER_TEXT }}
          >
            {workflow.relatedLabel ?? 'Related project'} →
          </Link>
        ) : null}
        <p className="mt-8 font-mono text-xs leading-relaxed" style={{ color: FINDER_MUTED }}>
          {importHint}
        </p>
      </div>
      <div
        className="shrink-0 border-t p-5 md:p-6"
        style={{ borderColor: FINDER_BORDER, backgroundColor: '#FAF8F4' }}
      >
        <a
          href={workflow.jsonPath}
          download
          className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-base font-semibold text-white shadow-sm transition hover:brightness-105"
          style={{ backgroundColor: folder.color, color: '#1a1a1a' }}
        >
          <Download className="h-4 w-4" />
          Download JSON
        </a>
      </div>
    </div>
  )
}

export function AutomationFinder() {
  const [activeFolderId, setActiveFolderId] = useState<AutomationFolderId | null>(
    null,
  )
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(
    null,
  )

  const activeFolder = activeFolderId ? getFolderById(activeFolderId) : null
  const workflows = activeFolderId ? getWorkflowsForFolder(activeFolderId) : []

  const selectedWorkflow = useMemo(
    () => workflows.find((w) => w.id === selectedWorkflowId) ?? workflows[0],
    [workflows, selectedWorkflowId],
  )

  useEffect(() => {
    if (workflows.length > 0) {
      setSelectedWorkflowId((prev) =>
        prev && workflows.some((w) => w.id === prev) ? prev : workflows[0].id,
      )
    } else {
      setSelectedWorkflowId(null)
    }
  }, [activeFolderId, workflows])

  const path = activeFolder
    ? `${FINDER_PATH_ROOT}/${activeFolder.id}`
    : FINDER_PATH_ROOT

  const openFolder = (id: AutomationFolderId) => {
    setActiveFolderId(id)
  }

  const goHome = () => {
    setActiveFolderId(null)
    setSelectedWorkflowId(null)
  }

  return (
    <div
      className="flex max-h-[min(75vh,680px)] min-h-[min(56vh,520px)] flex-col overflow-hidden rounded-2xl shadow-lg ring-1"
      style={{
        backgroundColor: FINDER_BG,
        borderColor: FINDER_BORDER,
        boxShadow: '0 24px 48px rgba(61, 56, 50, 0.12)',
      }}
      data-lenis-prevent
    >
      {/* Title bar */}
      <div
        className="flex items-center gap-3 border-b px-4 py-3"
        style={{ borderColor: FINDER_BORDER, backgroundColor: '#FAF8F4' }}
      >
        <div className="flex gap-1.5" aria-hidden>
          <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
          <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
          <span className="h-3 w-3 rounded-full bg-[#28C840]" />
        </div>
        <p
          className="flex-1 text-center font-mono text-sm tracking-wide"
          style={{ color: FINDER_MUTED }}
        >
          {path}
        </p>
        {activeFolder ? (
          <button
            type="button"
            onClick={goHome}
            className="flex items-center gap-1 font-mono text-xs uppercase tracking-wider transition hover:opacity-70"
            style={{ color: FINDER_TEXT }}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Back
          </button>
        ) : (
          <span className="w-12" />
        )}
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Sidebar */}
        <aside
          className="finder-scroll hidden w-48 shrink-0 overflow-y-auto border-r py-4 md:block lg:w-52"
          style={{ borderColor: FINDER_BORDER, backgroundColor: FINDER_SIDEBAR }}
        >
          <p
            className="px-4 font-mono text-xs uppercase tracking-[0.15em]"
            style={{ color: FINDER_MUTED }}
          >
            Favorites
          </p>
          <nav className="mt-3 space-y-0.5 px-2">
            <button
              type="button"
              onClick={goHome}
              className={cn(
                'flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-base transition',
                !activeFolderId && 'bg-[#E5DDD0]',
              )}
              style={{ color: FINDER_TEXT }}
            >
              <Home className="h-4 w-4 opacity-60" />
              All folders
            </button>
            {AUTOMATION_FOLDERS.map((folder) => (
              <button
                key={folder.id}
                type="button"
                onClick={() => openFolder(folder.id)}
                className={cn(
                  'flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-base transition hover:bg-[#E5DDD0]/80',
                  activeFolderId === folder.id && 'bg-[#E5DDD0]',
                )}
                style={{ color: FINDER_TEXT }}
              >
                <FolderOpen className="h-4 w-4 opacity-60" />
                {folder.sidebarLabel}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main */}
        {!activeFolder ? (
          <div className="finder-scroll flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto p-8 md:p-12">
            <p
              className="mb-8 font-mono text-xs uppercase tracking-[0.2em] md:hidden"
              style={{ color: FINDER_MUTED }}
            >
              Tap a folder
            </p>
            <div className="grid grid-cols-2 gap-10 sm:grid-cols-2 md:grid-cols-4 md:gap-12">
              {AUTOMATION_FOLDERS.map((folder) => (
                <FolderIcon
                  key={folder.id}
                  folder={folder}
                  selected={false}
                  onClick={() => openFolder(folder.id)}
                />
              ))}
            </div>
            <p
              className="mt-10 max-w-md text-center text-base leading-relaxed md:text-lg"
              style={{ color: FINDER_MUTED }}
            >
              Open a folder — workflows I built while learning nodes. Download
              JSON and import into n8n, ComfyUI, Make, or Zapier.
            </p>
          </div>
        ) : (
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden md:flex-row">
            {/* File list — Finder-style scrollable column */}
            <div
              className="flex max-h-[min(42%,240px)] min-h-0 w-full shrink-0 flex-col overflow-hidden border-b md:max-h-none md:h-full md:w-[240px] md:border-b-0 md:border-r lg:w-[280px]"
              style={{ borderColor: FINDER_BORDER }}
            >
              <div
                className="hidden shrink-0 items-center gap-2 border-b px-4 py-3 md:flex"
                style={{ borderColor: FINDER_BORDER }}
              >
                <div
                  className="h-8 w-8 rounded-lg"
                  style={{ backgroundColor: activeFolder.color }}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-base font-semibold" style={{ color: FINDER_TEXT }}>
                    {activeFolder.label}
                  </p>
                  <p className="text-xs leading-snug" style={{ color: FINDER_MUTED }}>
                    {activeFolder.tagline}
                  </p>
                </div>
              </div>
              {workflows.length > 6 ? (
                <p
                  className="shrink-0 border-b px-4 py-2 font-mono text-[11px] uppercase tracking-wider"
                  style={{ borderColor: FINDER_BORDER, color: FINDER_MUTED }}
                >
                  {workflows.length} workflows · scroll
                </p>
              ) : null}
              <ul className="finder-scroll min-h-0 flex-1 overflow-y-auto p-2">
                {workflows.length === 0 ? (
                  <li
                    className="rounded-lg px-3 py-8 text-center text-sm leading-relaxed"
                    style={{ color: FINDER_MUTED }}
                  >
                    No JSON yet — add files to{' '}
                    <code className="text-xs">
                      public/automations/{activeFolder.id}/
                    </code>
                  </li>
                ) : (
                  workflows.map((w) => (
                    <li key={w.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedWorkflowId(w.id)}
                        className={cn(
                          'w-full rounded-lg px-3 py-3 text-left text-base transition',
                          selectedWorkflow?.id === w.id && 'bg-[#E5DDD0]',
                        )}
                        style={{ color: FINDER_TEXT }}
                      >
                        <span className="line-clamp-2 font-medium">{w.title}</span>
                        <span
                          className="mt-1 block font-mono text-[11px] uppercase tracking-wider"
                          style={{ color: FINDER_MUTED }}
                        >
                          .json
                        </span>
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>

            {/* Detail pane */}
            <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[#FAF8F4]">
              {selectedWorkflow && activeFolder ? (
                <WorkflowDetail
                  workflow={selectedWorkflow}
                  folder={activeFolder}
                />
              ) : (
                <div
                  className="flex flex-1 items-center justify-center p-8 text-center text-base"
                  style={{ color: FINDER_MUTED }}
                >
                  Select a workflow or add JSON to this folder.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
