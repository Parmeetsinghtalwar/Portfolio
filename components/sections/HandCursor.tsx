'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
// Type-only import — erased at build time so the heavy mediapipe value
// imports happen lazily inside start() via dynamic import().
import type { HandLandmarker as HandLandmarkerT } from '@mediapipe/tasks-vision'

type Status = 'idle' | 'starting' | 'ready' | 'error'

// MediaPipe HandLandmarker indices — 8 is the index-finger tip.
const INDEX_TIP = 8

// Smoothing factor for cursor follow (0..1). Higher = snappier, more jitter.
const SMOOTH = 0.25

export function HandCursor() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const landmarkerRef = useRef<HandLandmarkerT | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number | null>(null)
  // The "raw" target (latest detected finger position) and the smoothed
  // position the cursor element lerps toward each frame. Refs because we
  // update them at 60fps and don't want React renders.
  const targetRef = useRef({ x: -200, y: -200 })
  const smoothRef = useRef({ x: -200, y: -200 })

  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const start = useCallback(async () => {
    setStatus('starting')
    setErrorMsg(null)
    try {
      // 1) Camera. facingMode: 'user' = front-facing on mobile.
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: false,
      })
      streamRef.current = stream
      const video = videoRef.current
      if (!video) throw new Error('Video element unavailable')
      video.srcObject = stream
      await video.play()

      // 2) MediaPipe — dynamic import so the ~500KB module is split into
      //    its own chunk and never ships unless someone opens this section.
      const { HandLandmarker, FilesetResolver, DrawingUtils } = await import(
        '@mediapipe/tasks-vision'
      )
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm',
      )
      const landmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numHands: 1,
      })
      landmarkerRef.current = landmarker
      setStatus('ready')

      // 3) Detection + render loop. detectForVideo expects a monotonically
      //    increasing timestamp (we use performance.now()).
      const canvas = canvasRef.current
      if (!canvas) throw new Error('Canvas unavailable')
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('2D context unavailable')
      const draw = new DrawingUtils(ctx)

      let lastDetectAt = 0
      const loop = () => {
        const v = videoRef.current
        const lm = landmarkerRef.current
        if (!v || !lm) return

        const now = performance.now()
        // Cap detection at ~60fps; MediaPipe itself runs faster than we
        // need for cursor follow, but the canvas redraw is the bottleneck.
        if (v.readyState >= 2 && now - lastDetectAt >= 16) {
          const result = lm.detectForVideo(v, now)
          lastDetectAt = now

          // Mirror the canvas so the preview matches a real mirror — the
          // landmark coords are still in unmirrored video space, so we flip
          // x when computing the on-page cursor target below.
          ctx.save()
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.scale(-1, 1)
          ctx.translate(-canvas.width, 0)
          ctx.drawImage(v, 0, 0, canvas.width, canvas.height)
          for (const hand of result.landmarks ?? []) {
            draw.drawConnectors(hand, HandLandmarker.HAND_CONNECTIONS, {
              color: 'rgba(255,255,255,0.7)',
              lineWidth: 2,
            })
            draw.drawLandmarks(hand, { color: '#1d3afb', radius: 3 })
          }
          ctx.restore()

          const tip = result.landmarks?.[0]?.[INDEX_TIP]
          if (tip) {
            // tip.x/y are normalized 0..1 in the raw video frame. The
            // displayed preview is mirrored, so flip x to align cursor
            // direction with the user's hand movement.
            targetRef.current.x = (1 - tip.x) * window.innerWidth
            targetRef.current.y = tip.y * window.innerHeight
          }
        }

        // Smooth the cursor toward the target every frame. Direct DOM
        // mutation (not state) avoids re-rendering React 60 times/sec.
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
      console.error('[HandCursor]', err)
      setStatus('error')
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Could not start camera or load the hand model.',
      )
    }
  }, [])

  // Clean up camera stream and detection loop on unmount.
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      streamRef.current?.getTracks().forEach((t) => t.stop())
      try {
        landmarkerRef.current?.close?.()
      } catch {
        // ignore — already disposed
      }
    }
  }, [])

  return (
    <section
      id="hand-tracking"
      className="relative min-h-screen overflow-hidden bg-neutral-950"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-0 [background-image:radial-gradient(circle_at_center,rgba(29,58,251,0.18),transparent_60%)]"
      />

      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-accent">
          Hand tracking
        </p>
        <h2 className="text-4xl font-semibold leading-tight tracking-tight text-white md:text-6xl">
          Move your hand,
          <br />
          <span className="italic text-accent">move the cursor.</span>
        </h2>
        <p className="mt-6 max-w-md text-white/60">
          Webcam + MediaPipe running entirely in your browser. Your index-finger tip drives the dot.
        </p>

        {status === 'idle' && (
          <button
            type="button"
            onClick={start}
            className="mt-10 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-white/90 active:scale-95"
          >
            Enable camera
          </button>
        )}
        {status === 'starting' && (
          <p className="mt-10 font-mono text-sm text-white/60">
            Requesting access · loading hand model…
          </p>
        )}
        {status === 'error' && (
          <div className="mt-10 max-w-md rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-200 ring-1 ring-red-500/30">
            {errorMsg ?? 'Camera unavailable.'}
            <button
              type="button"
              onClick={start}
              className="ml-3 underline underline-offset-2 hover:text-white"
            >
              Retry
            </button>
          </div>
        )}
      </div>

      {/* Live camera preview with landmark overlay */}
      <div
        className={[
          'absolute bottom-6 right-6 w-44 overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/10 transition-opacity duration-500 md:w-56',
          status === 'ready' ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
      >
        {/* Hidden video — we draw frames onto the canvas below instead. */}
        <video
          ref={videoRef}
          muted
          playsInline
          className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
        />
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="block aspect-[4/3] w-full"
        />
        <div className="absolute left-2 top-2 flex items-center gap-1.5 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white/80 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
          live
        </div>
      </div>

      {/* Cursor — positioned via transform from the RAF loop, not state. */}
      <div
        ref={cursorRef}
        aria-hidden
        className={[
          'pointer-events-none fixed left-0 top-0 z-50 h-9 w-9 rounded-full bg-accent shadow-lg shadow-accent/50 ring-2 ring-white transition-opacity duration-300',
          status === 'ready' ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
      />
    </section>
  )
}

export default HandCursor
