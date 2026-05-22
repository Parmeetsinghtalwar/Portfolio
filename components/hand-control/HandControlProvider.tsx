'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type {
  HandLandmarker as HandLandmarkerT,
  NormalizedLandmark,
} from '@mediapipe/tasks-vision'

// ──────────────────────────────────────────────────────────────────────────────
// MediaPipe landmark indices (just the two we need for a single-finger model)
// ──────────────────────────────────────────────────────────────────────────────
const THUMB_TIP = 4
const INDEX_TIP = 8

// ──────────────────────────────────────────────────────────────────────────────
// Gesture thresholds (tuned empirically; expose later if needed)
// ──────────────────────────────────────────────────────────────────────────────
const PINCH_THRESHOLD = 0.05            // thumb↔index distance in normalized coords
const SMOOTH = 0.3                      // cursor lerp factor
const ZOOM_MIN = 0.6
const ZOOM_MAX = 2.0

// Zone thresholds in the camera frame (normalized 0..1).
// Wider bands than initially shipped — empirically people don't move their
// finger to the absolute edge of the frame, they hover ~25-30% from center.
const SCROLL_ZONE_TOP = 0.30            // tip.y below this → scroll up
const SCROLL_ZONE_BOTTOM = 0.70         // tip.y above this → scroll down
const ZOOM_ZONE_LEFT = 0.20             // mirrored x below this → zoom out
const ZOOM_ZONE_RIGHT = 0.80            // mirrored x above this → zoom in
const SCROLL_MAX_PX = 60                // per-frame scroll at the extreme edge
const ZOOM_STEP = 0.015                 // per-frame zoom delta at extreme edge

type Phase = 'splash' | 'loading' | 'ready' | 'skipped' | 'error'

type HandControlContextValue = {
  phase: Phase
  /** True when camera + model are running. */
  active: boolean
}

const HandControlContext = createContext<HandControlContextValue>({
  phase: 'splash',
  active: false,
})

export function useHandControl() {
  return useContext(HandControlContext)
}

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────
function dist2D(a: NormalizedLandmark, b: NormalizedLandmark): number {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

// ──────────────────────────────────────────────────────────────────────────────
// Provider
// ──────────────────────────────────────────────────────────────────────────────
export function HandControlProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>('splash')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [previewOpen, setPreviewOpen] = useState(true)
  // Number of hands the model currently sees — surfaced in the preview chip
  // so you can confirm at a glance whether detection is working.
  const [handCount, setHandCount] = useState(0)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorRingRef = useRef<HTMLDivElement>(null)
  const cursorLabelRef = useRef<HTMLDivElement>(null)

  const streamRef = useRef<MediaStream | null>(null)
  const landmarkerRef = useRef<HandLandmarkerT | null>(null)
  const rafRef = useRef<number | null>(null)

  const targetRef = useRef({ x: -300, y: -300 })
  const smoothRef = useRef({ x: -300, y: -300 })
  const wasPinchingRef = useRef(false)
  const currentZoomRef = useRef(1)

  const dispatchClickAtCursor = useCallback((x: number, y: number) => {
    const el = document.elementFromPoint(x, y) as HTMLElement | null
    if (!el) return
    // Fire a sequence so React handlers, links, and buttons all respond.
    const init: PointerEventInit & MouseEventInit = {
      bubbles: true,
      cancelable: true,
      clientX: x,
      clientY: y,
      pointerType: 'mouse',
    }
    el.dispatchEvent(new PointerEvent('pointerdown', init))
    el.dispatchEvent(new PointerEvent('pointerup', init))
    el.dispatchEvent(new MouseEvent('click', init))
  }, [])

  const start = useCallback(async () => {
    setPhase('loading')
    setErrorMsg(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: false,
      })
      streamRef.current = stream
      const video = videoRef.current
      if (!video) throw new Error('Video element unavailable')
      video.srcObject = stream
      await video.play()

      // Lazy-load MediaPipe so it never ships unless the user opts in.
      const { HandLandmarker, FilesetResolver, DrawingUtils } = await import(
        '@mediapipe/tasks-vision'
      )
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm',
      )
      // Try GPU delegate first, fall back to CPU if it fails (some browsers /
      // hardware don't support the WebGL/WebGPU path MediaPipe wants).
      const MODEL_URL =
        'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task'
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
      setPhase('ready')

      const canvas = canvasRef.current
      if (!canvas) throw new Error('Canvas unavailable')
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('2D context unavailable')
      const draw = new DrawingUtils(ctx)

      let lastDetectAt = 0

      const loop = () => {
        const v = videoRef.current
        const lm = landmarkerRef.current
        if (!v || !lm) {
          rafRef.current = requestAnimationFrame(loop)
          return
        }

        const now = performance.now()
        if (v.readyState >= 2 && now - lastDetectAt >= 16) {
          let result
          try {
            result = lm.detectForVideo(v, now)
          } catch (err) {
            console.error('[HandControl] detectForVideo failed', err)
            rafRef.current = requestAnimationFrame(loop)
            return
          }
          lastDetectAt = now

          // Draw mirrored preview onto canvas.
          ctx.save()
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.scale(-1, 1)
          ctx.translate(-canvas.width, 0)
          ctx.drawImage(v, 0, 0, canvas.width, canvas.height)
          // HAND_CONNECTIONS is a static array in recent versions but has been
          // missing in some — guard so a missing constant doesn't kill the loop.
          const connections = (HandLandmarker as unknown as { HAND_CONNECTIONS?: Array<{ start: number; end: number }> })
            .HAND_CONNECTIONS
          for (const hand of result.landmarks ?? []) {
            if (connections) {
              draw.drawConnectors(hand, connections, {
                color: 'rgba(255,255,255,0.7)',
                lineWidth: 2,
              })
            }
            draw.drawLandmarks(hand, { color: '#1d3afb', radius: 3 })
          }
          ctx.restore()

          const primary = result.landmarks?.[0]
          let label: string | null = null
          if (primary) {
            const tip = primary[INDEX_TIP]
            // Mirror x because the preview is mirrored — natural left/right.
            const mirroredX = 1 - tip.x
            targetRef.current.x = mirroredX * window.innerWidth
            targetRef.current.y = tip.y * window.innerHeight

            // ── Pinch click — thumb tip meets index tip.
            const pinchDist = dist2D(primary[THUMB_TIP], primary[INDEX_TIP])
            const isPinching = pinchDist < PINCH_THRESHOLD
            if (isPinching && !wasPinchingRef.current) {
              const ring = cursorRingRef.current
              if (ring) {
                ring.classList.add('scale-50', 'bg-white')
                setTimeout(() => ring.classList.remove('scale-50', 'bg-white'), 120)
              }
              dispatchClickAtCursor(smoothRef.current.x, smoothRef.current.y)
            }
            wasPinchingRef.current = isPinching

            // ── Scroll — finger in top/bottom band.
            //   We mutate scrollTop directly instead of window.scrollBy
            //   because every form of scrollBy honors CSS scroll-behavior,
            //   and the global html { scroll-behavior: smooth } makes
            //   60fps scroll calls queue up so nothing actually moves.
            //   Direct property assignment is always instant.
            const scroller = document.scrollingElement || document.documentElement
            if (tip.y < SCROLL_ZONE_TOP) {
              const intensity = (SCROLL_ZONE_TOP - tip.y) / SCROLL_ZONE_TOP
              scroller.scrollTop -= intensity * SCROLL_MAX_PX
              label = '↑ scroll up'
            } else if (tip.y > SCROLL_ZONE_BOTTOM) {
              const intensity = (tip.y - SCROLL_ZONE_BOTTOM) / (1 - SCROLL_ZONE_BOTTOM)
              scroller.scrollTop += intensity * SCROLL_MAX_PX
              label = '↓ scroll down'
            }

            // ── Zoom — finger in left/right band.
            if (mirroredX > ZOOM_ZONE_RIGHT) {
              const intensity = (mirroredX - ZOOM_ZONE_RIGHT) / (1 - ZOOM_ZONE_RIGHT)
              currentZoomRef.current = Math.min(
                ZOOM_MAX,
                currentZoomRef.current + intensity * ZOOM_STEP,
              )
              document.body.style.zoom = String(currentZoomRef.current)
              label = `+ zoom (${currentZoomRef.current.toFixed(2)}×)`
            } else if (mirroredX < ZOOM_ZONE_LEFT) {
              const intensity = (ZOOM_ZONE_LEFT - mirroredX) / ZOOM_ZONE_LEFT
              currentZoomRef.current = Math.max(
                ZOOM_MIN,
                currentZoomRef.current - intensity * ZOOM_STEP,
              )
              document.body.style.zoom = String(currentZoomRef.current)
              label = `– zoom (${currentZoomRef.current.toFixed(2)}×)`
            }
          }

          // Surface what the system is doing right now next to the cursor.
          if (cursorLabelRef.current) {
            cursorLabelRef.current.textContent = label ?? ''
            cursorLabelRef.current.style.opacity = label ? '1' : '0'
          }

          setHandCount(result.landmarks?.length ?? 0)
        }

        // Smooth cursor toward target every frame; mutate DOM directly to skip
        // React's render path.
        smoothRef.current.x += (targetRef.current.x - smoothRef.current.x) * SMOOTH
        smoothRef.current.y += (targetRef.current.y - smoothRef.current.y) * SMOOTH
        if (cursorRef.current) {
          cursorRef.current.style.transform = `translate3d(${
            smoothRef.current.x - 18
          }px, ${smoothRef.current.y - 18}px, 0)`
        }

        rafRef.current = requestAnimationFrame(loop)
      }
      rafRef.current = requestAnimationFrame(loop)
    } catch (err) {
      console.error('[HandControl]', err)
      setPhase('error')
      setErrorMsg(
        err instanceof Error ? err.message : 'Could not access the camera.',
      )
    }
  }, [dispatchClickAtCursor])

  const skip = useCallback(() => {
    setPhase('skipped')
  }, [])

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      streamRef.current?.getTracks().forEach((t) => t.stop())
      try {
        landmarkerRef.current?.close?.()
      } catch {
        // already disposed
      }
      document.body.style.zoom = ''
    }
  }, [])

  const showSplash = phase !== 'ready' && phase !== 'skipped'
  const active = phase === 'ready'

  return (
    <HandControlContext.Provider value={{ phase, active }}>
      {/* Always-mounted hidden video element so we have a node to attach the
          stream to once start() is called. */}
      <video
        ref={videoRef}
        muted
        playsInline
        className="pointer-events-none fixed h-px w-px opacity-0"
        aria-hidden
      />

      {children}

      {/* Splash / onboarding */}
      {showSplash && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black px-6">
          <div
            aria-hidden
            className="absolute inset-0 [background-image:radial-gradient(circle_at_center,rgba(29,58,251,0.25),transparent_60%)]"
          />
          <div className="relative max-w-lg text-center">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
              No mouse. No touch.
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Navigate with your <span className="italic text-accent">hands</span>.
            </h1>
            <p className="mt-6 text-white/60">
              Your camera reads hand gestures in real time. Everything runs in
              your browser — no frames leave your device.
            </p>

            <ul className="mx-auto mt-8 grid w-fit grid-cols-2 gap-x-8 gap-y-3 text-left text-sm text-white/70">
              <li>
                <span className="text-white">Point</span> — move cursor
              </li>
              <li>
                <span className="text-white">Pinch</span> — click
              </li>
              <li>
                <span className="text-white">Top / bottom</span> — scroll
              </li>
              <li>
                <span className="text-white">Left / right</span> — zoom
              </li>
            </ul>

            {phase === 'splash' && (
              <div className="mt-10 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={start}
                  className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-white/90 active:scale-95"
                >
                  Enable camera
                </button>
                <button
                  type="button"
                  onClick={skip}
                  className="rounded-full bg-white/10 px-6 py-3 text-sm font-medium text-white/80 transition hover:bg-white/20"
                >
                  Skip — use mouse
                </button>
              </div>
            )}

            {phase === 'loading' && (
              <p className="mt-10 animate-pulse font-mono text-sm text-white/60">
                Requesting permission · loading model…
              </p>
            )}

            {phase === 'error' && (
              <>
                <p className="mt-10 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-200 ring-1 ring-red-500/30">
                  {errorMsg ?? 'Something went wrong.'}
                </p>
                <div className="mt-4 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={start}
                    className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-white/90"
                  >
                    Retry
                  </button>
                  <button
                    type="button"
                    onClick={skip}
                    className="rounded-full bg-white/10 px-5 py-2.5 text-sm font-medium text-white/80 hover:bg-white/20"
                  >
                    Continue without
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Mini camera preview — kept mounted so canvasRef is always available
          for the detection loop. Visibility toggles via opacity. */}
      <div
        className={[
          'fixed bottom-4 right-4 z-[60] overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/10 transition-all duration-300',
          previewOpen ? 'w-44 md:w-56' : 'w-12',
          active ? 'opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
      >
        <button
          type="button"
          onClick={() => setPreviewOpen((v) => !v)}
          aria-label={previewOpen ? 'Minimize camera preview' : 'Expand camera preview'}
          className="absolute right-1.5 top-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs text-white/80 backdrop-blur-sm hover:bg-black/80"
        >
          {previewOpen ? '–' : '+'}
        </button>
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className={['block aspect-[4/3] w-full', previewOpen ? '' : 'opacity-30'].join(' ')}
        />
        {previewOpen && (
          <>
            <div className="absolute left-2 top-2 flex items-center gap-1.5 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white/80 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
              live
            </div>
            <div className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 font-mono text-[10px] text-white/80 backdrop-blur-sm">
              {handCount > 0 ? `hand ✓` : 'no hand'}
            </div>
          </>
        )}
      </div>

      {/* Global cursor — also kept mounted so the RAF loop can mutate its
          transform without waiting for a React commit. */}
      <div
        ref={cursorRef}
        aria-hidden
        className={[
          'pointer-events-none fixed left-0 top-0 z-[70] h-9 w-9 transition-opacity duration-300',
          active ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
      >
        <div
          ref={cursorRingRef}
          className="h-full w-full rounded-full bg-accent/80 shadow-lg shadow-accent/40 ring-2 ring-white transition-transform duration-100 will-change-transform"
        />
        <div
          ref={cursorLabelRef}
          className="absolute left-11 top-1 whitespace-nowrap rounded-full bg-black/80 px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-md backdrop-blur-sm transition-opacity duration-150"
        />
      </div>
    </HandControlContext.Provider>
  )
}
