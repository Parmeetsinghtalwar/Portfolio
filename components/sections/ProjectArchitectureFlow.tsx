'use client'

import { useCallback, useMemo, useState, type ComponentType } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  type Edge,
  type Node,
  type NodeProps,
  type NodeMouseHandler,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity,
  Cog,
  Database,
  Globe,
  Layers,
  Monitor,
  Send,
  Shield,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import type {
  ArchGroup,
  ArchNodeData,
  ProjectArchitectureGraph,
} from '@/lib/project-architecture'
import { cn } from '@/lib/utils'

type ArchNode = Node<ArchNodeData, 'arch'>

type GroupStyle = {
  label: string
  icon: LucideIcon
  card: string
  iconBg: string
  ring: string
  pill: string
}

const GROUP_STYLES: Record<ArchGroup, GroupStyle> = {
  client: {
    label: 'Client',
    icon: Monitor,
    card: 'bg-amber-50 border-amber-300 text-amber-950',
    iconBg: 'bg-amber-100 text-amber-700',
    ring: 'ring-amber-400/60',
    pill: 'border-amber-300 bg-amber-50 text-amber-900',
  },
  edge: {
    label: 'Edge',
    icon: Shield,
    card: 'bg-sky-50 border-sky-300 text-sky-950',
    iconBg: 'bg-sky-100 text-sky-700',
    ring: 'ring-sky-400/60',
    pill: 'border-sky-300 bg-sky-50 text-sky-900',
  },
  app: {
    label: 'Service',
    icon: Layers,
    card: 'bg-violet-50 border-violet-300 text-violet-950',
    iconBg: 'bg-violet-100 text-violet-700',
    ring: 'ring-violet-400/60',
    pill: 'border-violet-300 bg-violet-50 text-violet-900',
  },
  ai: {
    label: 'AI / ML',
    icon: Sparkles,
    card: 'bg-rose-50 border-rose-300 text-rose-950',
    iconBg: 'bg-rose-100 text-rose-700',
    ring: 'ring-rose-400/60',
    pill: 'border-rose-300 bg-rose-50 text-rose-900',
  },
  worker: {
    label: 'Worker',
    icon: Cog,
    card: 'bg-orange-50 border-orange-300 text-orange-950',
    iconBg: 'bg-orange-100 text-orange-700',
    ring: 'ring-orange-400/60',
    pill: 'border-orange-300 bg-orange-50 text-orange-900',
  },
  data: {
    label: 'Data',
    icon: Database,
    card: 'bg-emerald-50 border-emerald-300 text-emerald-950',
    iconBg: 'bg-emerald-100 text-emerald-700',
    ring: 'ring-emerald-400/60',
    pill: 'border-emerald-300 bg-emerald-50 text-emerald-900',
  },
  channel: {
    label: 'Channel',
    icon: Send,
    card: 'bg-teal-50 border-teal-300 text-teal-950',
    iconBg: 'bg-teal-100 text-teal-700',
    ring: 'ring-teal-400/60',
    pill: 'border-teal-300 bg-teal-50 text-teal-900',
  },
  external: {
    label: 'External',
    icon: Globe,
    card: 'bg-indigo-50 border-indigo-300 text-indigo-950',
    iconBg: 'bg-indigo-100 text-indigo-700',
    ring: 'ring-indigo-400/60',
    pill: 'border-indigo-300 bg-indigo-50 text-indigo-900',
  },
  obs: {
    label: 'Observability',
    icon: Activity,
    card: 'bg-slate-50 border-slate-300 text-slate-900',
    iconBg: 'bg-slate-200 text-slate-700',
    ring: 'ring-slate-400/60',
    pill: 'border-slate-300 bg-slate-50 text-slate-900',
  },
}

function ArchNodeView({ data, selected }: NodeProps<ArchNode>) {
  const style = GROUP_STYLES[data.group]
  const Icon = style.icon
  return (
    <div
      className={cn(
        'group relative min-w-[150px] max-w-[180px] rounded-xl border px-3 py-2.5 shadow-sm transition-all',
        style.card,
        selected ? `ring-2 ${style.ring} scale-[1.04] shadow-lg` : 'hover:shadow-md',
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: 'currentColor', opacity: 0.4, width: 6, height: 6 }}
      />
      <div className="flex items-start gap-2">
        <span
          className={cn(
            'flex h-6 w-6 shrink-0 items-center justify-center rounded-md',
            style.iconBg,
          )}
        >
          <Icon className="h-3.5 w-3.5" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="truncate text-[12px] font-semibold leading-tight">
            {data.label}
          </p>
          {data.subLabel ? (
            <p className="mt-0.5 truncate font-mono text-[9px] leading-tight opacity-70">
              {data.subLabel}
            </p>
          ) : null}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: 'currentColor', opacity: 0.4, width: 6, height: 6 }}
      />
    </div>
  )
}

const nodeTypes = {
  arch: ArchNodeView as unknown as ComponentType<NodeProps>,
}

type ProjectArchitectureFlowProps = {
  graph: ProjectArchitectureGraph
}

export function ProjectArchitectureFlow({ graph }: ProjectArchitectureFlowProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const activeId = selectedId ?? hoveredId

  const activeNeighbours = useMemo(() => {
    if (!activeId) return { incoming: [] as string[], outgoing: [] as string[] }
    const incoming: string[] = []
    const outgoing: string[] = []
    for (const edge of graph.edges) {
      if (edge.target === activeId) incoming.push(edge.source)
      if (edge.source === activeId) outgoing.push(edge.target)
    }
    return { incoming, outgoing }
  }, [activeId, graph.edges])

  const flowNodes: ArchNode[] = useMemo(
    () =>
      graph.nodes.map((node) => ({
        id: node.id,
        type: 'arch' as const,
        position: node.position,
        data: node.data,
        selected: node.id === activeId,
        draggable: false,
      })),
    [graph.nodes, activeId],
  )

  const flowEdges: Edge[] = useMemo(
    () =>
      graph.edges.map((edge) => {
        const involved =
          activeId !== null &&
          (edge.source === activeId || edge.target === activeId)
        return {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          label: edge.label,
          type: 'smoothstep' as const,
          animated: edge.animated || involved,
          style: {
            stroke: involved ? '#171717' : '#9ca3af',
            strokeWidth: involved ? 2 : 1.2,
            opacity: activeId && !involved ? 0.2 : 0.85,
            strokeDasharray: edge.dashed ? '6 6' : undefined,
          },
          labelStyle: {
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            fontSize: 10,
            fill: '#525252',
          },
          labelBgPadding: [6, 3] as [number, number],
          labelBgBorderRadius: 4,
          labelBgStyle: { fill: '#ffffff', fillOpacity: 0.95 },
        }
      }),
    [graph.edges, activeId],
  )

  const handleEnter = useCallback<NodeMouseHandler>((_, node) => {
    setHoveredId(node.id)
  }, [])

  const handleLeave = useCallback(() => {
    setHoveredId(null)
  }, [])

  const handleClick = useCallback<NodeMouseHandler>((_, node) => {
    setSelectedId((prev) => (prev === node.id ? null : node.id))
  }, [])

  const handlePaneClick = useCallback(() => {
    setSelectedId(null)
  }, [])

  const activeNode = useMemo(
    () => (activeId ? graph.nodes.find((n) => n.id === activeId) : null),
    [activeId, graph.nodes],
  )

  const presentGroups = useMemo(() => {
    const set = new Set<ArchGroup>()
    for (const n of graph.nodes) set.add(n.data.group)
    return Array.from(set)
  }, [graph.nodes])

  return (
    <div className="relative h-[640px] w-full overflow-hidden rounded-2xl border border-foreground/12 bg-[#fafafa]">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        onNodeMouseEnter={handleEnter}
        onNodeMouseLeave={handleLeave}
        onNodeClick={handleClick}
        onPaneClick={handlePaneClick}
        fitView
        fitViewOptions={{ padding: 0.18 }}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        edgesFocusable={false}
        panOnScroll={false}
        zoomOnScroll={false}
        zoomOnPinch
        panOnDrag
        minZoom={0.4}
        maxZoom={1.5}
      >
        <Background gap={20} size={1} color="#e5e7eb" />
        <Controls
          showInteractive={false}
          className="!shadow-none !border !border-foreground/10 !bg-white/95"
        />
      </ReactFlow>

      <div className="pointer-events-none absolute left-4 top-4 z-10 flex max-w-[60%] flex-wrap gap-1.5">
        {presentGroups.map((g) => {
          const s = GROUP_STYLES[g]
          const Icon = s.icon
          return (
            <span
              key={g}
              className={cn(
                'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider',
                s.pill,
              )}
            >
              <Icon className="h-2.5 w-2.5" aria-hidden />
              {s.label}
            </span>
          )
        })}
      </div>

      <div className="pointer-events-none absolute bottom-4 left-4 z-10 rounded-full bg-white/90 px-3 py-1 font-mono text-[10px] text-foreground/60 ring-1 ring-foreground/10 backdrop-blur">
        Hover or tap any service to see how it&apos;s used
      </div>

      <AnimatePresence>
        {activeNode ? (
          <motion.aside
            key={activeNode.id}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 20, opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-4 top-4 z-20 w-[290px] max-w-[80%] rounded-2xl border border-foreground/12 bg-white/95 p-4 shadow-xl backdrop-blur"
          >
            <ActivePanel
              data={activeNode.data}
              incoming={activeNeighbours.incoming
                .map((id) => graph.nodes.find((n) => n.id === id)?.data.label)
                .filter((label): label is string => Boolean(label))}
              outgoing={activeNeighbours.outgoing
                .map((id) => graph.nodes.find((n) => n.id === id)?.data.label)
                .filter((label): label is string => Boolean(label))}
              pinned={selectedId === activeNode.id}
              onClear={() => setSelectedId(null)}
            />
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

type ActivePanelProps = {
  data: ArchNodeData
  incoming: string[]
  outgoing: string[]
  pinned: boolean
  onClear: () => void
}

function ActivePanel({
  data,
  incoming,
  outgoing,
  pinned,
  onClear,
}: ActivePanelProps) {
  const style = GROUP_STYLES[data.group]
  const Icon = style.icon
  return (
    <div className="text-foreground">
      <div className="flex items-start gap-3">
        <span
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
            style.iconBg,
          )}
        >
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/45">
            {style.label}
          </p>
          <h3 className="mt-0.5 text-base font-semibold leading-tight tracking-tight">
            {data.label}
          </h3>
          {data.subLabel ? (
            <p className="mt-0.5 font-mono text-[11px] text-foreground/55">
              {data.subLabel}
            </p>
          ) : null}
        </div>
        {pinned ? (
          <button
            type="button"
            onClick={onClear}
            className="ml-auto rounded-full border border-foreground/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
          >
            Clear
          </button>
        ) : null}
      </div>

      <p className="mt-3 text-sm leading-relaxed text-foreground/80">
        {data.usage}
      </p>

      {data.tech?.length ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {data.tech.map((t) => (
            <span
              key={t}
              className="rounded-full border border-foreground/12 bg-foreground/[0.03] px-2 py-0.5 font-mono text-[10px] text-foreground/75"
            >
              {t}
            </span>
          ))}
        </div>
      ) : null}

      {incoming.length || outgoing.length ? (
        <div className="mt-4 space-y-2 border-t border-foreground/10 pt-3">
          {incoming.length ? (
            <div>
              <p className="font-mono text-[9px] uppercase tracking-wider text-foreground/45">
                Called by
              </p>
              <p className="mt-1 text-xs text-foreground/75">
                {incoming.join(' · ')}
              </p>
            </div>
          ) : null}
          {outgoing.length ? (
            <div>
              <p className="font-mono text-[9px] uppercase tracking-wider text-foreground/45">
                Calls
              </p>
              <p className="mt-1 text-xs text-foreground/75">
                {outgoing.join(' · ')}
              </p>
            </div>
          ) : null}
        </div>
      ) : null}

      <p className="mt-3 font-mono text-[9px] uppercase tracking-wider text-foreground/40">
        {pinned ? 'Pinned · click Clear or background to dismiss' : 'Click to pin'}
      </p>
    </div>
  )
}
