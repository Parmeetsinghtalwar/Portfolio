'use client'

import { useCallback, useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

export type Language = {
  code: string
  label: string
  videoSrc: string
}

export type MultiLangVideoPlayerProps = {
  languages: Language[]
  defaultLang?: string
  caption?: string
  poster?: string
  className?: string
}

const FILM_TICKS = 64

function cls(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

export function MultiLangVideoPlayer({
  languages,
  defaultLang,
  caption,
  poster,
  className,
}: MultiLangVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  // Restores playback state after a manual language swap. Auto-advance
  // (video ending) leaves this null so the next video starts from 0.
  const pendingResumeRef = useRef<{ time: number; wasPlaying: boolean } | null>(null)

  const initial = languages.find((l) => l.code === defaultLang) ?? languages[0]
  const [currentLang, setCurrentLang] = useState(initial.code)
  const active = languages.find((l) => l.code === currentLang) ?? initial

  const [muted, setMuted] = useState(true)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  // Bumping this remounts the sweep bar to restart its CSS animation.
  const [sweepKey, setSweepKey] = useState(0)

  // Custom-cursor state (only used on devices with a real pointer).
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [cursorVisible, setCursorVisible] = useState(false)

  // Auto-advance: when the current video ends, jump to the next language
  // in the list and wrap around. The new video starts at 0 because we
  // don't set pendingResumeRef here.
  const advanceLanguage = useCallback(() => {
    const idx = languages.findIndex((l) => l.code === currentLang)
    const next = languages[(idx + 1) % languages.length]
    setCurrentLang(next.code)
  }, [languages, currentLang])

  // Video lifecycle — bound per src change so the closure sees the
  // current language when computing the next one.
  useEffect(() => {
    const v = videoRef.current
    if (!v) return

    const onCanPlay = () => {
      const pending = pendingResumeRef.current
      if (pending) {
        const dur = v.duration
        v.currentTime = Number.isFinite(dur) && dur > 0 ? pending.time % dur : pending.time
        if (pending.wasPlaying) v.play().catch(() => {})
        pendingResumeRef.current = null
      }
      setLoading(false)
    }

    const onLoadedData = () => {
      // First frame ready — fire the projector sweep.
      setSweepKey((k) => k + 1)
    }

    const onTimeUpdate = () => {
      const t = v.currentTime
      const d = v.duration
      if (Number.isFinite(d) && d > 0) setProgress(t / d)
    }

    const onEnded = () => {
      // No loop attribute — when the video ends, advance to the next lang.
      // Keeps the showcase cycling through every language forever.
      advanceLanguage()
    }

    const onWaiting = () => setLoading(true)
    const onError = () => setLoading(false)

    v.addEventListener('canplay', onCanPlay)
    v.addEventListener('loadeddata', onLoadedData)
    v.addEventListener('timeupdate', onTimeUpdate)
    v.addEventListener('ended', onEnded)
    v.addEventListener('waiting', onWaiting)
    v.addEventListener('error', onError)
    v.load()

    return () => {
      v.removeEventListener('canplay', onCanPlay)
      v.removeEventListener('loadeddata', onLoadedData)
      v.removeEventListener('timeupdate', onTimeUpdate)
      v.removeEventListener('ended', onEnded)
      v.removeEventListener('waiting', onWaiting)
      v.removeEventListener('error', onError)
    }
  }, [active.videoSrc, advanceLanguage])

  const changeLanguage = useCallback(
    (code: string) => {
      if (muted) setMuted(false)
      if (code === currentLang) return
      const v = videoRef.current
      if (!v) return
      // Manual switch: preserve frame + play state.
      pendingResumeRef.current = { time: v.currentTime, wasPlaying: !v.paused }
      setLoading(true)
      setCurrentLang(code)
    },
    [currentLang, muted],
  )

  const toggleMute = useCallback(() => setMuted((m) => !m), [])

  const onVideoMouseMove = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }, [])

  return (
    <div
      className={cls(
        'relative w-full rounded-[2rem] bg-[#1d3afb] px-4 pt-5 pb-7 md:px-8 md:pt-6 md:pb-9',
        className,
      )}
    >
      {caption && (
        <p className="mx-auto mb-4 max-w-3xl whitespace-pre-line px-2 text-center text-base leading-relaxed text-white/95 md:mb-5 md:text-lg">
          {caption}
        </p>
      )}

      {/* Film-strip progress indicator */}
      <div
        className="relative mb-3 flex h-2 w-full items-stretch gap-[2px] overflow-hidden md:mb-4 md:h-2.5"
        aria-hidden
      >
        {Array.from({ length: FILM_TICKS }).map((_, i) => {
          const filled = i / FILM_TICKS <= progress
          return (
            <div
              key={i}
              className={cls(
                'flex-1 rounded-[1px] transition-colors duration-300',
                filled ? 'bg-white' : 'bg-white/15',
              )}
            />
          )
        })}
        <div className="pointer-events-none absolute inset-y-0 -inset-x-1/2 w-1/2 animate-shimmer bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </div>

      <div
        className="relative aspect-video cursor-none overflow-hidden rounded-2xl bg-black"
        onMouseMove={onVideoMouseMove}
        onMouseEnter={() => setCursorVisible(true)}
        onMouseLeave={() => setCursorVisible(false)}
        onClick={toggleMute}
      >
        <video
          ref={videoRef}
          src={active.videoSrc}
          poster={poster}
          muted={muted}
          autoPlay
          playsInline
          preload="auto"
          className="absolute inset-0 h-[114%] w-full -translate-y-[10%] scale-[1.1] object-cover object-[50%_40%]"
        />

        {/* Projector sweep — remounts via key on each video load. */}
        <div
          key={sweepKey}
          className="pointer-events-none absolute inset-x-0 z-10 h-[3px] animate-sweep bg-white shadow-[0_0_24px_6px_rgba(255,255,255,0.6)]"
        />

        {/* Small mute toggle at top-right (touch fallback for the custom cursor). */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            toggleMute()
          }}
          aria-label={muted ? 'Unmute' : 'Mute'}
          className="absolute right-3 top-3 z-20 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/55 text-white/90 backdrop-blur-md transition hover:bg-black/75"
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>

        {loading && (
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          </div>
        )}

        {/* Custom cursor pill — follows the mouse, hidden on touch. */}
        {cursorVisible && (
          <div
            className="pointer-events-none absolute z-30 flex items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-xs font-medium text-black shadow-lg"
            style={{
              left: cursorPos.x,
              top: cursorPos.y,
              transform: 'translate(18px, 18px)',
            }}
          >
            {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
            <span>{muted ? 'tap to unmute' : 'tap to mute'}</span>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 md:mt-8 md:gap-x-10">
        {languages.map((l) => {
          const isActive = l.code === currentLang
          return (
            <button
              key={l.code}
              type="button"
              onClick={() => changeLanguage(l.code)}
              aria-pressed={isActive}
              className={cls(
                'text-base lowercase transition-colors duration-200 md:text-lg',
                isActive
                  ? 'font-medium text-white'
                  : 'text-white/40 hover:text-white/70',
              )}
            >
              {l.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default MultiLangVideoPlayer
