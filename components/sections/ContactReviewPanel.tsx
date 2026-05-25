'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Camera,
  Check,
  Eraser,
  Folder,
  Hand,
  Keyboard,
  Loader2,
  Palette,
  PenLine,
  Pencil,
  Save,
  Signature,
  Smile,
  Sparkles,
  Video,
} from 'lucide-react'
import { MemoryCorner } from '@/components/sections/MemoryCorner'
import { SITE } from '@/lib/constants'
import { homeSectionEyebrow } from '@/lib/home-sections'
import {
  getCameraStream,
  releaseCameraStream,
  requestCameraAccess,
  setCameraStream,
} from '@/lib/camera-session'
import type { HandLandmarker as HandLandmarkerT } from '@mediapipe/tasks-vision'
import {
  CANVAS_COLORS,
  DEFAULT_STICKER_SIZE,
  drawSticker,
  EMOJI_STICKERS,
  ERASE_RADIUS,
  eraseAtPoint,
  GRAPHIC_STICKERS,
  playDefaults,
  preloadStickerImages,
  signDefaults,
  PLAY_BRUSH_SIZES,
  SIGN_BRUSH_SIZES,
  type CanvasTool,
  type StickerDef,
  type StickerPlacement,
} from '@/lib/canvas-playground'
import {
  appendInkPoint,
  clientToCanvasPoint,
  drawStrokeOnCanvas,
  type InkPoint,
  type InkStrokeData,
} from '@/lib/review-drawing'

const INDEX_TIP = 8
const THUMB_TIP = 4
const PINCH_CLICK_THRESHOLD = 0.07
const HAND_LOST_GRACE_MS = 400
/** Cursor ring only — ink follows the raw fingertip for responsive signing. */
const CURSOR_SMOOTHING = {
  steady: 0.38,
  balanced: 0.58,
  fast: 0.82,
} as const
type SmoothingLevel = keyof typeof CURSOR_SMOOTHING
const INK_INTERPOLATE_STEP = 5
const INK_BREAK_DISTANCE = 160
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task'

type ModeGuide = {
  title: string
  steps: string[]
  tip?: string
}

const MODE_GUIDES: Record<CanvasTool, ModeGuide> = {
  type: {
    title: 'Type a message',
    steps: [
      'Tap Type in the toolbar.',
      'Use the text box at the bottom — keyboard and trackpad work normally.',
      'Optional: switch to Draw or Hand to add ink on the canvas, then come back.',
      'Tap Save when you are done.',
    ],
  },
  play: {
    title: 'Draw on the canvas',
    steps: [
      'Tap Draw in the toolbar.',
      'Pick a color and brush size.',
      'Drag with mouse, trackpad, or finger on the transparent canvas.',
      'Use Clear to start over, then Save to keep it in Memory corner.',
    ],
  },
  sign: {
    title: 'Sign your name',
    steps: [
      'Tap Sign in the toolbar.',
      'Use the dashed line near the bottom as your baseline.',
      'Sign with white ink — drag slowly for a clean line.',
      'Tap Save to store the snapshot.',
    ],
  },
  sticker: {
    title: 'Add stickers',
    steps: [
      'Tap Stickers in the toolbar.',
      'Choose a graphic or emoji from the row below.',
      'Tap anywhere on the canvas to place it — tap again to add more.',
      'Switch back to Draw or Hand if you want ink too, then Save.',
    ],
  },
  erase: {
    title: 'Erase strokes & stickers',
    steps: [
      'Tap Eraser in the toolbar.',
      'Drag over anything you want to remove.',
      'Switch back to Draw or Hand to keep editing.',
    ],
    tip: 'Eraser only removes ink and stickers — it does not delete typed text.',
  },
  hand: {
    title: 'Draw with your hand (camera)',
    steps: [
      'Use the Open your camera notification (top center) or tap Allow camera below.',
      'Tap Hand in the toolbar — wait for the green dot on your index finger.',
      'Hold one hand in frame; move your index finger to draw in the air.',
      'Lift your hand briefly to end a stroke, then move again to start a new one.',
      'Adjust Color, Brush, and Cursor (steady / balanced / fast) if the line feels shaky.',
      'Tap Save when finished — camera turns off when you scroll away.',
    ],
    tip: 'Good lighting and a plain background help tracking. Camera is only used in this section.',
  },
}

const SNAPSHOT_W = 640
const SNAPSHOT_H = 480
const MEMORY_KEY = 'parmeet-portfolio-memories'
const MEMORY_LIMIT = 40

export type ReviewMemory = {
  id: string
  dataUrl: string
  createdAt: number
  typedText?: string
  ocrText?: string
  aiText?: string
  inputMode?: CanvasTool
}

type Status = 'idle' | 'loading' | 'ready' | 'error'

function loadMemories(): ReviewMemory[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(MEMORY_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as ReviewMemory[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function persistMemories(memories: ReviewMemory[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(MEMORY_KEY, JSON.stringify(memories))
  } catch (err) {
    console.warn('[ContactReview] could not persist memories', err)
  }
}

export function ContactReviewPanel() {
  const cameraPanelRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawCanvasRef = useRef<HTMLCanvasElement>(null)
  const inkCacheRef = useRef<HTMLCanvasElement | null>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorRingRef = useRef<HTMLDivElement>(null)

  const landmarkerRef = useRef<HandLandmarkerT | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number | null>(null)
  const strokesRef = useRef<InkStrokeData[]>([])
  const stickersRef = useRef<StickerPlacement[]>([])
  const currentStrokeRef = useRef<InkPoint[]>([])
  const strokeMetaRef = useRef({ color: '#ffffff', size: 6 })
  const handPresentRef = useRef(false)
  const handLostUntilRef = useRef(0)
  const isPinchingRef = useRef(false)
  const wasPinchingRef = useRef(false)
  const statusRef = useRef<Status>('idle')
  const inputModeRef = useRef<CanvasTool>('play')
  const submittedRef = useRef(false)
  const panelVisibleRef = useRef(false)

  const isDrawingRef = useRef(false)
  const isErasingRef = useRef(false)
  const hasInkRef = useRef(false)

  const targetRef = useRef({ x: -200, y: -200 })
  const smoothRef = useRef({ x: -200, y: -200 })
  const smoothingAlphaRef = useRef<number>(CURSOR_SMOOTHING.fast)

  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [inputMode, setInputMode] = useState<CanvasTool>('play')
  const [inkColor, setInkColor] = useState<string>(playDefaults().color)
  const [brushSize, setBrushSize] = useState<number>(playDefaults().size)
  const [selectedSticker, setSelectedSticker] = useState<StickerDef>(
    GRAPHIC_STICKERS[0],
  )
  const [stickerTab, setStickerTab] = useState<'graphics' | 'emoji'>('graphics')
  const [smoothingLevel, setSmoothingLevel] = useState<SmoothingLevel>('fast')
  const [typedText, setTypedText] = useState('')
  const [hasInk, setHasInk] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<string | null>(null)
  const [lastReadout, setLastReadout] = useState<{
    typed?: string
    ocr?: string
    ai?: string
  } | null>(null)
  const [userDisabled, setUserDisabled] = useState(false)
  const [memories, setMemories] = useState<ReviewMemory[]>([])
  const [memoryOpen, setMemoryOpen] = useState(false)
  const [previewMemory, setPreviewMemory] = useState<ReviewMemory | null>(null)
  const [cameraPromptDismissed, setCameraPromptDismissed] = useState(false)

  useEffect(() => {
    setMemories(loadMemories())
    void preloadStickerImages()
  }, [])

  const inkCanvasActive =
    inputMode === 'play' ||
    inputMode === 'sign' ||
    inputMode === 'hand' ||
    inputMode === 'erase' ||
    inputMode === 'sticker'

  useEffect(() => {
    smoothingAlphaRef.current = CURSOR_SMOOTHING[smoothingLevel]
  }, [smoothingLevel])

  useEffect(() => {
    strokeMetaRef.current = { color: inkColor, size: brushSize }
  }, [inkColor, brushSize])

  useEffect(() => {
    if (inputMode === 'sign') {
      const d = signDefaults()
      setInkColor(d.color)
      setBrushSize(d.size)
    }
  }, [inputMode])

  useEffect(() => {
    if (inputMode === 'hand') setCameraPromptDismissed(false)
  }, [inputMode])

  useEffect(() => {
    if (status === 'ready') setCameraPromptDismissed(false)
  }, [status])

  useEffect(() => {
    inputModeRef.current = inputMode
    submittedRef.current = submitted
  }, [inputMode, submitted])

  useEffect(() => {
    statusRef.current = status
  }, [status])

  const syncHasInk = useCallback(() => {
    const ink =
      strokesRef.current.length > 0 ||
      currentStrokeRef.current.length > 0 ||
      stickersRef.current.length > 0
    hasInkRef.current = ink
    setHasInk(ink)
  }, [])

  const rebuildInkCache = useCallback(() => {
    const c = drawCanvasRef.current
    if (!c) return
    const cache = document.createElement('canvas')
    cache.width = c.width
    cache.height = c.height
    const cacheCtx = cache.getContext('2d')
    if (!cacheCtx) return
    for (const stroke of strokesRef.current) {
      drawStrokeOnCanvas(cacheCtx, stroke)
    }
    for (const sticker of stickersRef.current) {
      drawSticker(cacheCtx, sticker)
    }
    inkCacheRef.current = cache
  }, [])

  const paintCurrentStroke = useCallback(() => {
    const c = drawCanvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')
    if (!ctx) return
    let cache = inkCacheRef.current
    if (!cache || cache.width !== c.width || cache.height !== c.height) {
      rebuildInkCache()
      cache = inkCacheRef.current
    }
    ctx.clearRect(0, 0, c.width, c.height)
    if (cache) ctx.drawImage(cache, 0, 0)
    drawStrokeOnCanvas(
      ctx,
      currentStrokeRef.current,
      strokeMetaRef.current.size,
      strokeMetaRef.current.color,
    )
  }, [rebuildInkCache])

  const redraw = useCallback(() => {
    rebuildInkCache()
    paintCurrentStroke()
  }, [paintCurrentStroke, rebuildInkCache])

  const syncInkCanvasSize = useCallback(() => {
    const panel = cameraPanelRef.current
    const canvas = drawCanvasRef.current
    if (!panel || !canvas) return
    const rect = panel.getBoundingClientRect()
    const scale = Math.min(window.devicePixelRatio || 1, 1.5)
    const w = Math.max(1, Math.round(rect.width * scale))
    const h = Math.max(1, Math.round(rect.height * scale))
    if (canvas.width === w && canvas.height === h) return

    const cache = document.createElement('canvas')
    cache.width = w
    cache.height = h
    const cacheCtx = cache.getContext('2d')
    const prevCtx = canvas.getContext('2d')
    if (cacheCtx && prevCtx && canvas.width > 0 && canvas.height > 0) {
      cacheCtx.drawImage(canvas, 0, 0, w, h)
    }
    canvas.width = w
    canvas.height = h
    inkCacheRef.current = cache
    rebuildInkCache()
    paintCurrentStroke()
  }, [paintCurrentStroke, rebuildInkCache])

  useEffect(() => {
    syncInkCanvasSize()
    const panel = cameraPanelRef.current
    if (!panel) return
    const ro = new ResizeObserver(() => syncInkCanvasSize())
    ro.observe(panel)
    return () => ro.disconnect()
  }, [syncInkCanvasSize])

  const commitStroke = useCallback(() => {
    if (currentStrokeRef.current.length === 0) return
    const stroke: InkStrokeData = {
      points: [...currentStrokeRef.current],
      color: strokeMetaRef.current.color,
      size: strokeMetaRef.current.size,
    }
    strokesRef.current.push(stroke)
    currentStrokeRef.current = []
    const c = drawCanvasRef.current
    let cache = inkCacheRef.current
    if (c && (!cache || cache.width !== c.width || cache.height !== c.height)) {
      rebuildInkCache()
      cache = inkCacheRef.current
    }
    if (cache) {
      const cacheCtx = cache.getContext('2d')
      if (cacheCtx) drawStrokeOnCanvas(cacheCtx, stroke)
    }
    paintCurrentStroke()
    syncHasInk()
  }, [paintCurrentStroke, rebuildInkCache, syncHasInk])

  const eraseAtClient = useCallback(
    (clientX: number, clientY: number) => {
      const c = drawCanvasRef.current
      if (!c) return
      const p = clientToCanvasPoint(c, clientX, clientY, true)
      if (!p) return
      const result = eraseAtPoint(
        strokesRef.current,
        stickersRef.current,
        p.x,
        p.y,
        ERASE_RADIUS,
      )
      strokesRef.current = result.strokes
      stickersRef.current = result.stickers
      rebuildInkCache()
      paintCurrentStroke()
      syncHasInk()
    },
    [paintCurrentStroke, rebuildInkCache, syncHasInk],
  )

  const placeStickerAt = useCallback(
    (clientX: number, clientY: number) => {
      const c = drawCanvasRef.current
      if (!c) return
      const p = clientToCanvasPoint(c, clientX, clientY, true)
      if (!p) return
      const scale = c.width / Math.max(c.getBoundingClientRect().width, 1)
      const def = selectedSticker
      stickersRef.current.push({
        id:
          typeof crypto !== 'undefined' && 'randomUUID' in crypto
            ? crypto.randomUUID()
            : `st_${Date.now()}`,
        kind: def.kind,
        stickerId: def.id,
        emoji: def.emoji,
        src: def.src,
        x: p.x,
        y: p.y,
        size: DEFAULT_STICKER_SIZE * Math.min(scale, 2),
      })
      rebuildInkCache()
      paintCurrentStroke()
      syncHasInk()
    },
    [paintCurrentStroke, rebuildInkCache, selectedSticker, syncHasInk],
  )

  const addInkPoint = useCallback(
    (p: InkPoint) => {
      const cur = currentStrokeRef.current
      const result = appendInkPoint(cur, p, {
        minDistance: inputModeRef.current === 'hand' ? 0.5 : 1,
        breakDistance: INK_BREAK_DISTANCE,
        interpolateStep: INK_INTERPOLATE_STEP,
      })
      if (result === 'skip') return
      if (result === 'break') {
        commitStroke()
        currentStrokeRef.current = [p]
      }
      paintCurrentStroke()
      syncHasInk()
    },
    [commitStroke, paintCurrentStroke, syncHasInk],
  )

  const addPointFromClient = useCallback(
    (clientX: number, clientY: number, allowOutside = false) => {
      const c = drawCanvasRef.current
      if (!c) return false
      const p = clientToCanvasPoint(c, clientX, clientY, allowOutside)
      if (!p) return false
      addInkPoint(p)
      return true
    },
    [addInkPoint],
  )

  const dispatchClickAt = useCallback((clientX: number, clientY: number) => {
    const el = document.elementFromPoint(clientX, clientY) as HTMLElement | null
    if (!el) return
    const form = formRef.current
    if (form && !form.contains(el)) return
    const init: PointerEventInit & MouseEventInit = {
      bubbles: true,
      cancelable: true,
      clientX,
      clientY,
      pointerType: 'mouse',
    }
    el.dispatchEvent(new PointerEvent('pointerdown', init))
    el.dispatchEvent(new PointerEvent('pointerup', init))
    el.dispatchEvent(new MouseEvent('click', init))
  }, [])

  const pauseLoop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  const start = useCallback(async () => {
    if (statusRef.current === 'loading' || statusRef.current === 'ready') return
    setStatus('loading')
    setErrorMsg(null)
    try {
      let stream = getCameraStream()
      if (!stream?.active) {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error('Camera not supported in this browser')
        }
        const result = await requestCameraAccess()
        stream = getCameraStream()
        if (result !== 'granted' || !stream?.active) {
          throw new Error(
            'Camera blocked — click Allow camera below and approve in your browser.',
          )
        }
      }
      streamRef.current = stream
      setCameraStream(stream)
      const video = videoRef.current
      if (!video) throw new Error('Video element unavailable')
      video.srcObject = stream
      await video.play()

      const { HandLandmarker, FilesetResolver, DrawingUtils } = await import(
        '@mediapipe/tasks-vision'
      )
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm',
      )
      let landmarker: HandLandmarkerT
      try {
        landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: MODEL_URL, delegate: 'GPU' },
          runningMode: 'VIDEO',
          numHands: 1,
        })
      } catch {
        landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: MODEL_URL },
          runningMode: 'VIDEO',
          numHands: 1,
        })
      }
      landmarkerRef.current = landmarker
      setStatus('ready')

      const canvas = canvasRef.current
      if (!canvas) throw new Error('Canvas unavailable')
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('2D context unavailable')
      const draw = new DrawingUtils(ctx)
      const connections = (
        HandLandmarker as unknown as {
          HAND_CONNECTIONS?: Array<{ start: number; end: number }>
        }
      ).HAND_CONNECTIONS

      let lastDetect = 0
      const loop = () => {
        const v = videoRef.current
        const lm = landmarkerRef.current
        const panel = cameraPanelRef.current
        if (!v || !lm || !panel) {
          rafRef.current = requestAnimationFrame(loop)
          return
        }

        if (!panelVisibleRef.current) {
          rafRef.current = requestAnimationFrame(loop)
          return
        }

        const now = performance.now()
        if (v.readyState >= 2 && now - lastDetect >= 16) {
          let result
          try {
            result = lm.detectForVideo(v, now)
          } catch (err) {
            console.error('[ContactReview]', err)
            rafRef.current = requestAnimationFrame(loop)
            return
          }
          lastDetect = now

          ctx.save()
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.scale(-1, 1)
          ctx.translate(-canvas.width, 0)
          ctx.drawImage(v, 0, 0, canvas.width, canvas.height)
          for (const hand of result.landmarks ?? []) {
            if (connections) {
              draw.drawConnectors(hand, connections, {
                color: 'rgba(255,255,255,0.7)',
                lineWidth: 2,
              })
            }
            draw.drawLandmarks(hand, { color: 'hsl(var(--accent))', radius: 3 })
          }
          ctx.restore()

          const primary = result.landmarks?.[0]
          if (primary) {
            handPresentRef.current = true
            handLostUntilRef.current = now + HAND_LOST_GRACE_MS
            const tip = primary[INDEX_TIP]
            const rect = panel.getBoundingClientRect()
            targetRef.current.x = (1 - tip.x) * rect.width
            targetRef.current.y = tip.y * rect.height

            const pinch = Math.hypot(
              primary[THUMB_TIP].x - primary[INDEX_TIP].x,
              primary[THUMB_TIP].y - primary[INDEX_TIP].y,
            )
            const isPinching = pinch < PINCH_CLICK_THRESHOLD
            isPinchingRef.current = isPinching

            if (inputModeRef.current !== 'hand' && isPinching && !wasPinchingRef.current) {
              const ring = cursorRingRef.current
              if (ring) {
                ring.classList.add('scale-50', 'bg-white')
                setTimeout(() => ring.classList.remove('scale-50', 'bg-white'), 130)
              }
              dispatchClickAt(
                rect.left + smoothRef.current.x,
                rect.top + smoothRef.current.y,
              )
            }
            wasPinchingRef.current = isPinching
          } else {
            handPresentRef.current = false
            isPinchingRef.current = false
            wasPinchingRef.current = false
            if (now > handLostUntilRef.current) commitStroke()
          }
        }

        const alpha = smoothingAlphaRef.current
        smoothRef.current.x += (targetRef.current.x - smoothRef.current.x) * alpha
        smoothRef.current.y += (targetRef.current.y - smoothRef.current.y) * alpha

        const handActive =
          handPresentRef.current || now < handLostUntilRef.current

        if (
          inputModeRef.current === 'hand' &&
          !submittedRef.current &&
          handActive &&
          panel
        ) {
          const panelRect = panel.getBoundingClientRect()
          addPointFromClient(
            panelRect.left + targetRef.current.x,
            panelRect.top + targetRef.current.y,
            true,
          )
        }

        if (cursorRef.current && inputModeRef.current === 'hand') {
          cursorRef.current.style.transform = `translate3d(${
            smoothRef.current.x - 18
          }px, ${smoothRef.current.y - 18}px, 0)`
        }

        rafRef.current = requestAnimationFrame(loop)
      }
      rafRef.current = requestAnimationFrame(loop)
    } catch (err) {
      console.error('[ContactReview]', err)
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Camera unavailable')
    }
  }, [addPointFromClient, commitStroke, dispatchClickAt])

  const stop = useCallback(
    (releaseTracks = false) => {
      pauseLoop()
      try {
        landmarkerRef.current?.close?.()
      } catch {
        // ignore
      }
      landmarkerRef.current = null
      if (releaseTracks) {
        releaseCameraStream()
        streamRef.current = null
        if (videoRef.current) videoRef.current.srcObject = null
        setStatus('idle')
      }
    },
    [pauseLoop],
  )

  const stopManually = useCallback(() => {
    setUserDisabled(true)
    stop(true)
  }, [stop])

  const startManually = useCallback(() => {
    setUserDisabled(false)
    void start()
  }, [start])

  useEffect(() => {
    const node = cameraPanelRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            panelVisibleRef.current = false
            if (
              statusRef.current === 'ready' ||
              statusRef.current === 'loading'
            ) {
              stop(true)
            }
            continue
          }
          panelVisibleRef.current = true
        }
      },
      { threshold: 0.35 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [start, stop, userDisabled])

  useEffect(() => {
    return () => {
      pauseLoop()
      try {
        landmarkerRef.current?.close?.()
      } catch {
        // ignore
      }
    }
  }, [pauseLoop])

  const onDrawDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (inputMode !== 'play' && inputMode !== 'sign') return
      e.preventDefault()
      try {
        e.currentTarget.setPointerCapture(e.pointerId)
      } catch {
        // ignore
      }
      isDrawingRef.current = true
      commitStroke()
      const c = drawCanvasRef.current
      if (!c) return
      const p = clientToCanvasPoint(c, e.clientX, e.clientY)
      if (p) currentStrokeRef.current = [p]
      paintCurrentStroke()
      syncHasInk()
    },
    [commitStroke, inputMode, paintCurrentStroke, syncHasInk],
  )

  const onDrawMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (
        (inputMode !== 'play' && inputMode !== 'sign') ||
        !isDrawingRef.current
      ) {
        return
      }
      const c = drawCanvasRef.current
      if (!c) return
      const p = clientToCanvasPoint(c, e.clientX, e.clientY)
      if (!p) return
      addInkPoint(p)
    },
    [addInkPoint, inputMode],
  )

  const onEraseUp = useCallback(() => {
    isErasingRef.current = false
  }, [])

  const onEraseMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (inputMode !== 'erase' || !isErasingRef.current) return
      eraseAtClient(e.clientX, e.clientY)
    },
    [eraseAtClient, inputMode],
  )

  const onDrawUp = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      isDrawingRef.current = false
      commitStroke()
      try {
        e.currentTarget.releasePointerCapture(e.pointerId)
      } catch {
        // ignore
      }
    },
    [commitStroke],
  )

  const liftStroke = useCallback(() => {
    commitStroke()
  }, [commitStroke])

  const clearDrawing = useCallback(() => {
    strokesRef.current = []
    stickersRef.current = []
    currentStrokeRef.current = []
    inkCacheRef.current = null
    const c = drawCanvasRef.current
    c?.getContext('2d')?.clearRect(0, 0, c.width, c.height)
    hasInkRef.current = false
    setHasInk(false)
  }, [])

  const clearAfterSave = useCallback(() => {
    clearDrawing()
    setTypedText('')
    setSaveStatus(null)
    setInputMode('play')
  }, [clearDrawing])

  const canSave = hasInk || typedText.trim().length > 0

  const handleSubmit = useCallback(async () => {
    if (!canSave || saving) return
    setSaving(true)
    setSaveStatus('Saving snapshot…')

    const cam = canvasRef.current
    const ink = drawCanvasRef.current
    const typed = typedText.trim()

    const out = document.createElement('canvas')
    out.width = SNAPSHOT_W
    out.height = SNAPSHOT_H
    const ctx = out.getContext('2d')
    if (!ctx) {
      setSaving(false)
      return
    }

    if (cam) ctx.drawImage(cam, 0, 0, out.width, out.height)
    else {
      ctx.fillStyle = '#111'
      ctx.fillRect(0, 0, out.width, out.height)
    }

    if (ink && hasInkRef.current) {
      ctx.drawImage(ink, 0, 0, out.width, out.height)
    }

    const displayText = typed || ''
    if (displayText) {
      ctx.fillStyle = 'rgba(0,0,0,0.55)'
      ctx.fillRect(16, 16, out.width - 32, 56)
      ctx.fillStyle = '#fff'
      ctx.font = '600 18px system-ui, sans-serif'
      const words = displayText.slice(0, 120)
      ctx.fillText(words, 28, 48)
    }

    ctx.fillStyle = '#ffffff'
    ctx.font = '700 20px system-ui, sans-serif'
    ctx.fillText("LET'S BUILD SOMETHING GREAT", 20, out.height - 52)
    ctx.fillStyle = 'rgba(255,255,255,0.75)'
    ctx.font = '12px ui-monospace, Menlo, monospace'
    ctx.fillText(new Date().toLocaleString(), 20, out.height - 24)

    const snapshotDataUrl = out.toDataURL('image/jpeg', 0.82)

    const memory: ReviewMemory = {
      id:
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `m_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      dataUrl: snapshotDataUrl,
      createdAt: Date.now(),
      typedText: typed || undefined,
      inputMode,
    }

    setMemories((prev) => {
      const next = [memory, ...prev].slice(0, MEMORY_LIMIT)
      persistMemories(next)
      return next
    })
    setLastReadout(typed ? { typed } : null)
    setSaveStatus(null)
    setSaving(false)
    setSubmitted(true)
    clearAfterSave()
  }, [canSave, clearAfterSave, hasInk, inputMode, saving, typedText])

  const removeMemory = useCallback((id: string) => {
    setMemories((prev) => {
      const next = prev.filter((m) => m.id !== id)
      persistMemories(next)
      return next
    })
    setPreviewMemory((p) => (p?.id === id ? null : p))
  }, [])

  const clearMemories = useCallback(() => {
    if (memories.length > 0 && !window.confirm('Clear all memories on this device?')) {
      return
    }
    setMemories([])
    persistMemories([])
    setPreviewMemory(null)
  }, [memories.length])

  const brushSizes =
    inputMode === 'sign' ? SIGN_BRUSH_SIZES : PLAY_BRUSH_SIZES

  const showCameraNotification =
    !submitted &&
    status !== 'ready' &&
    status !== 'loading' &&
    (inputMode === 'hand' || !cameraPromptDismissed)

  const onCanvasPointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (inputMode === 'sticker') {
        e.preventDefault()
        placeStickerAt(e.clientX, e.clientY)
        return
      }
      if (inputMode === 'erase') {
        e.preventDefault()
        try {
          e.currentTarget.setPointerCapture(e.pointerId)
        } catch {
          // ignore
        }
        isErasingRef.current = true
        eraseAtClient(e.clientX, e.clientY)
        return
      }
      if (inputMode === 'play' || inputMode === 'sign') {
        onDrawDown(e)
      }
    },
    [eraseAtClient, inputMode, onDrawDown, placeStickerAt],
  )

  const modeBtn = (mode: CanvasTool, label: string, Icon: typeof Keyboard) => (
    <button
      key={mode}
      type="button"
      title={MODE_GUIDES[mode].title}
      onClick={() => setInputMode(mode)}
      className={[
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider ring-1 transition',
        inputMode === mode
          ? 'bg-white text-black ring-white'
          : 'bg-white/10 text-white/90 ring-white/20 hover:bg-white/20',
      ].join(' ')}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  )

  return (
    <div
      ref={cameraPanelRef}
      className="relative h-screen w-full overflow-hidden bg-black text-white"
    >
      <video
        ref={videoRef}
        muted
        playsInline
        className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
      />
      {status !== 'ready' && (
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-neutral-950 to-black"
        />
      )}
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        className={[
          'absolute inset-0 h-full w-full object-cover transition-opacity duration-300',
          status === 'ready' ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/55 via-black/15 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/55"
      />

      {!submitted && inkCanvasActive && (
        <>
          <canvas
            ref={drawCanvasRef}
            onPointerDown={onCanvasPointerDown}
            onPointerMove={(e) => {
              if (inputMode === 'erase') onEraseMove(e)
              else onDrawMove(e)
            }}
            onPointerUp={(e) => {
              if (inputMode === 'erase') onEraseUp()
              else onDrawUp(e)
            }}
            onPointerCancel={(e) => {
              if (inputMode === 'erase') onEraseUp()
              else onDrawUp(e)
            }}
            className={[
              'absolute inset-0 z-[12] h-full w-full touch-none bg-transparent',
              inputMode === 'sticker' ? 'cursor-copy' : '',
              inputMode === 'erase' ? 'cursor-cell' : 'cursor-crosshair',
            ].join(' ')}
          />
          {inputMode === 'sign' && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-6 bottom-28 z-[13] md:inset-x-12 md:bottom-32"
            >
              <div className="border-b border-dashed border-white/45 pb-1">
                <span className="font-mono text-[10px] uppercase tracking-wider text-white/50">
                  Sign here
                </span>
              </div>
            </div>
          )}
        </>
      )}

      <AnimatePresence>
        {showCameraNotification && (
          <motion.div
            role="alert"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="pointer-events-auto absolute left-1/2 top-20 z-[45] w-[min(100%,22rem)] -translate-x-1/2 px-4 md:top-24 md:w-auto md:max-w-md"
          >
            <div
              className={[
                'rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur-xl',
                inputMode === 'hand'
                  ? 'border-amber-400/50 bg-amber-950/90 ring-2 ring-amber-400/30'
                  : 'border-emerald-400/35 bg-black/85 ring-1 ring-emerald-400/25',
              ].join(' ')}
            >
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-500/20">
                  <Camera className="h-5 w-5 text-emerald-300" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-300">
                    {inputMode === 'hand' ? 'Camera required' : 'Optional camera'}
                  </p>
                  <p className="mt-1 text-sm font-medium leading-snug text-white">
                    {inputMode === 'hand'
                      ? 'Open your camera to draw with your hand.'
                      : 'Open your camera for hand tracking, or keep drawing with mouse or trackpad.'}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-white/65">
                    Tap Allow below — your browser will ask for permission. Camera only runs in
                    this section.
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={startManually}
                      className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-black transition hover:bg-emerald-400"
                    >
                      <Camera className="h-4 w-4" />
                      Open camera
                    </button>
                    {inputMode !== 'hand' && (
                      <button
                        type="button"
                        onClick={() => setCameraPromptDismissed(true)}
                        className="rounded-full px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-white/70 hover:bg-white/10"
                      >
                        Not now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setMemoryOpen(true)}
        className="absolute right-6 top-24 z-30 grid h-12 w-12 place-items-center rounded-2xl bg-black/40 ring-1 ring-white/25 backdrop-blur-md transition hover:bg-black/55 md:right-12"
        aria-label="Open memory corner — saved drawings and notes"
        title="Memory corner — your saved drawings"
      >
        <Folder className="h-5 w-5 text-white" />
        {memories.length > 0 && (
          <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-emerald-400 px-1 text-[10px] font-bold leading-none text-black">
            {memories.length > 99 ? '99+' : memories.length}
          </span>
        )}
      </button>

      <div className="absolute left-6 top-5 z-20 md:left-12">
        <div className="flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-white/80 backdrop-blur-sm">
          <span
            className={[
              'h-1.5 w-1.5 rounded-full',
              status === 'ready' ? 'animate-pulse bg-red-500' : 'bg-white/30',
            ].join(' ')}
          />
          {status === 'ready' ? 'camera on' : status === 'loading' ? 'starting' : status === 'error' ? 'error' : 'camera off'}
        </div>
      </div>

      <div
        ref={formRef}
        className="pointer-events-none absolute inset-0 z-20 flex h-full flex-col justify-between px-6 pb-10 pt-24 md:px-12 md:pb-14 md:pt-28"
      >
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
            {homeSectionEyebrow('contact')}
          </p>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-6 text-5xl font-semibold leading-[0.95] md:text-7xl"
            style={{ textShadow: '0 2px 18px rgba(0,0,0,0.55)' }}
          >
            Let&apos;s build
            <br />
            <span className="italic text-emerald-300">something great.</span>
          </motion.h2>
          <a
            href={`mailto:${SITE.email}`}
            className="pointer-events-auto mt-6 inline-flex gap-3 border-b border-white/40 pb-1 font-mono text-sm"
          >
            {SITE.email} →
          </a>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/80">
            Leave a note on the guest wall — type, draw, sign, add stickers, or trace
            with your hand. For hand mode, use the notification above to{' '}
            <span className="font-medium text-white">open your camera</span>. Tap{' '}
            <span className="font-medium text-white">Save</span> when done — memories live in
            the <span className="font-medium text-white">folder (top right)</span>.
          </p>
        </div>

        {submitted ? (
          <div className="pointer-events-auto max-w-lg rounded-2xl bg-black/55 p-6 ring-1 ring-white/10 backdrop-blur-md">
            <Check className="h-10 w-10 text-emerald-400" />
            <p className="mt-3 text-lg">Saved to your memory corner.</p>
            {lastReadout && (
              <div className="mt-4 space-y-2 font-mono text-xs text-white/80">
                {lastReadout.typed && (
                  <p>
                    <span className="text-white/50">Typed · </span>
                    {lastReadout.typed}
                  </p>
                )}
              </div>
            )}
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false)
                  setMemoryOpen(true)
                }}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs text-white"
              >
                <Folder className="h-3.5 w-3.5" />
                Open memory corner
              </button>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-xs underline text-white/70"
              >
                Create another
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="pointer-events-auto flex max-w-3xl flex-col gap-2 self-start">
              <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-black/50 px-2 py-2 ring-1 ring-white/15 backdrop-blur-md">
                {modeBtn('type', 'Type', Keyboard)}
                {modeBtn('play', 'Draw', Pencil)}
                {modeBtn('sign', 'Sign', Signature)}
                {modeBtn('sticker', 'Stickers', Smile)}
                {modeBtn('erase', 'Eraser', Eraser)}
                {modeBtn('hand', 'Hand', Hand)}

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canSave || saving}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-black disabled:opacity-40"
                >
                  {saving ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Save className="h-3.5 w-3.5" />
                  )}
                  Save
                </button>

                {(inputMode === 'play' ||
                  inputMode === 'sign' ||
                  inputMode === 'hand' ||
                  inputMode === 'erase') && (
                  <>
                    <div className="inline-flex items-center gap-1 rounded-full bg-white/10 px-1 py-0.5 ring-1 ring-white/20">
                      <Palette className="ml-1 h-3.5 w-3.5 text-white/70" />
                      {CANVAS_COLORS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setInkColor(color)}
                          aria-label={`Color ${color}`}
                          className={[
                            'h-6 w-6 rounded-full ring-2 transition',
                            inkColor === color
                              ? 'ring-white scale-110'
                              : 'ring-transparent hover:ring-white/40',
                          ].join(' ')}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <div className="inline-flex items-center gap-1 rounded-full bg-white/10 px-1 py-0.5 ring-1 ring-white/20">
                      <span className="px-2 font-mono text-[10px] text-white/70">Brush</span>
                      {brushSizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setBrushSize(size)}
                          className={[
                            'grid h-7 w-7 place-items-center rounded-full',
                            brushSize === size ? 'bg-white text-black' : 'text-white/90',
                          ].join(' ')}
                        >
                          <span
                            className="rounded-full"
                            style={{
                              width: `${Math.max(2, size)}px`,
                              height: `${Math.max(2, size)}px`,
                              backgroundColor: inkColor,
                            }}
                          />
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={liftStroke}
                      className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 font-mono text-[10px] uppercase text-white/90 ring-1 ring-white/20"
                    >
                      <PenLine className="h-3.5 w-3.5" />
                      Lift
                    </button>
                    <button
                      type="button"
                      onClick={clearDrawing}
                      className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 font-mono text-[10px] uppercase text-white/90 ring-1 ring-white/20"
                    >
                      <Eraser className="h-3.5 w-3.5" />
                      Clear
                    </button>
                    {inputMode === 'hand' && (
                      <div className="inline-flex items-center gap-1 rounded-full bg-white/10 px-1 py-0.5 ring-1 ring-white/20">
                        <span className="px-2 font-mono text-[10px] text-white/70">Cursor</span>
                        {(Object.keys(CURSOR_SMOOTHING) as SmoothingLevel[]).map((level) => (
                          <button
                            key={level}
                            type="button"
                            onClick={() => setSmoothingLevel(level)}
                            className={[
                              'rounded-full px-2 py-1 font-mono text-[10px] capitalize',
                              smoothingLevel === level
                                ? 'bg-white text-black'
                                : 'text-white/90',
                            ].join(' ')}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              {inputMode === 'sticker' && (
                <div className="flex flex-col gap-2 rounded-2xl bg-black/50 px-3 py-2 ring-1 ring-white/15 backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase text-white/60">
                      Tap canvas to place
                    </span>
                    <button
                      type="button"
                      onClick={() => setStickerTab('graphics')}
                      className={[
                        'rounded-full px-2 py-0.5 font-mono text-[10px] uppercase',
                        stickerTab === 'graphics' ? 'bg-white text-black' : 'text-white/70',
                      ].join(' ')}
                    >
                      Stickers
                    </button>
                    <button
                      type="button"
                      onClick={() => setStickerTab('emoji')}
                      className={[
                        'rounded-full px-2 py-0.5 font-mono text-[10px] uppercase',
                        stickerTab === 'emoji' ? 'bg-white text-black' : 'text-white/70',
                      ].join(' ')}
                    >
                      Emoji
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {(stickerTab === 'graphics' ? GRAPHIC_STICKERS : EMOJI_STICKERS).map(
                      (s) => (
                        <button
                          key={s.id}
                          type="button"
                          title={s.label}
                          onClick={() => setSelectedSticker(s)}
                          className={[
                            'grid h-10 w-10 place-items-center rounded-xl ring-1 transition',
                            selectedSticker.id === s.id
                              ? 'bg-white ring-white'
                              : 'bg-white/10 ring-white/20 hover:bg-white/20',
                          ].join(' ')}
                        >
                          {s.kind === 'emoji' ? (
                            <span className="text-lg">{s.emoji}</span>
                          ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={s.src}
                              alt={s.label}
                              className="h-7 w-7 object-contain"
                            />
                          )}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              )}

              <motion.div
                key={inputMode}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-3xl rounded-2xl border border-white/15 bg-black/55 p-4 backdrop-blur-md"
              >
                <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
                  How to use · {MODE_GUIDES[inputMode].title}
                </p>
                <ol className="mt-3 space-y-2 text-sm leading-snug text-white/90">
                  {MODE_GUIDES[inputMode].steps.map((step, index) => (
                    <li key={step} className="flex gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/15 font-mono text-[10px] text-white/70">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
                {MODE_GUIDES[inputMode].tip ? (
                  <p className="mt-3 border-t border-white/10 pt-3 text-xs leading-relaxed text-white/60">
                    {MODE_GUIDES[inputMode].tip}
                  </p>
                ) : null}
              </motion.div>

              <div
                className={[
                  'w-full max-w-3xl rounded-2xl border bg-black/55 p-4 backdrop-blur-md',
                  inputMode === 'hand'
                    ? 'border-emerald-400/40 ring-1 ring-emerald-400/20'
                    : 'border-white/15',
                ].join(' ')}
              >
                <div className="flex items-start gap-3">
                  <Video className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-white/55">
                      Camera {inputMode === 'hand' ? '(required for Hand mode)' : '(optional)'}
                    </p>
                    <p className="mt-1 text-sm leading-snug text-white/85">
                      {inputMode === 'hand' && status !== 'ready'
                        ? 'Hand drawing needs your webcam. Tap Allow camera, approve the browser popup, then select Hand in the toolbar above.'
                        : inputMode === 'hand' && status === 'ready'
                          ? 'Camera is live — you should see yourself behind the canvas. Move your index finger to draw; the green dot is your cursor.'
                          : status === 'ready'
                            ? 'Camera is on. Switch to Hand mode anytime, or keep drawing with mouse/trackpad.'
                            : 'Camera stays off until you tap Allow camera. Only used in this contact section.'}
                    </p>
                    {inputMode === 'hand' && status === 'ready' && (
                      <p className="mt-2 text-xs leading-relaxed text-emerald-200/90">
                        One hand in frame, index finger extended. Lift your hand to finish a stroke.
                        Use Cursor steady / balanced / fast if the line wobbles.
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {(status === 'idle' || status === 'error') && (
                        <button
                          type="button"
                          onClick={startManually}
                          className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-xs font-medium text-black"
                        >
                          <Camera className="h-4 w-4" />
                          Allow camera
                        </button>
                      )}
                      {status === 'loading' && (
                        <span className="font-mono text-xs text-white/60">
                          Starting camera… hold on
                        </span>
                      )}
                      {status === 'ready' && (
                        <button
                          type="button"
                          onClick={stopManually}
                          className="rounded-full bg-white/15 px-3 py-1.5 font-mono text-xs text-white"
                        >
                          Turn camera off
                        </button>
                      )}
                      {inputMode === 'hand' && status !== 'ready' && (
                        <span className="font-mono text-[10px] uppercase tracking-wider text-white/45">
                          Step 1 for hand mode
                        </span>
                      )}
                    </div>
                    {status === 'error' && errorMsg && (
                      <p className="mt-2 font-mono text-xs text-red-300">{errorMsg}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {saveStatus && (
              <p className="pointer-events-none flex items-center gap-2 font-mono text-xs text-emerald-200">
                <Sparkles className="h-3.5 w-3.5" />
                {saveStatus}
              </p>
            )}

            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="pointer-events-auto flex flex-wrap gap-4 font-mono text-sm text-white/75">
                <a href={SITE.social.github} target="_blank" rel="noopener noreferrer">
                  github
                </a>
                <a href={SITE.social.linkedin} target="_blank" rel="noopener noreferrer">
                  linkedin
                </a>
                <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer">
                  instagram
                </a>
              </div>
              <p className="max-w-md text-right font-mono text-[10px] leading-relaxed text-white/55">
                {inputMode === 'type' && 'Active: Type — message box at bottom'}
                {inputMode === 'play' && 'Active: Draw — drag on canvas'}
                {inputMode === 'sign' && 'Active: Sign — use the dashed baseline'}
                {inputMode === 'sticker' && 'Active: Stickers — tap canvas to place'}
                {inputMode === 'erase' && 'Active: Eraser — drag to remove ink'}
                {inputMode === 'hand' &&
                  (status === 'ready'
                    ? 'Active: Hand — index finger draws; green dot = cursor'
                    : 'Active: Hand — turn on camera first')}
              </p>
            </div>
          </div>
        )}
      </div>

      {inputMode === 'type' && !submitted && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[40] px-6 pb-36 md:px-12 md:pb-40">
          <div className="pointer-events-auto mx-auto max-w-lg rounded-2xl bg-black/70 p-4 ring-1 ring-white/20 backdrop-blur-md">
            <label className="font-mono text-[10px] uppercase tracking-wider text-white/60">
              Type your message
            </label>
            <textarea
              value={typedText}
              onChange={(e) => setTypedText(e.target.value)}
              rows={4}
              autoFocus
              autoComplete="off"
              spellCheck
              placeholder="Write here — trackpad and keyboard work normally…"
              style={{ touchAction: 'manipulation' }}
              className="mt-2 w-full resize-none rounded-xl border border-white/30 bg-black/80 px-4 py-3 text-base text-white caret-emerald-400 placeholder:text-white/40 focus:border-emerald-400 focus:outline-none"
            />
          </div>
        </div>
      )}

      {inputMode === 'hand' && status === 'ready' && (
        <div
          ref={cursorRef}
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-40 h-9 w-9"
        >
          <div
            ref={cursorRingRef}
            className="h-full w-full rounded-full bg-emerald-400/90 shadow-lg ring-2 ring-white"
          />
        </div>
      )}

      <MemoryCorner
        open={memoryOpen}
        onClose={() => setMemoryOpen(false)}
        memories={memories}
        onRemove={removeMemory}
        onClearAll={clearMemories}
        preview={previewMemory}
        onPreview={setPreviewMemory}
      />
    </div>
  )
}
