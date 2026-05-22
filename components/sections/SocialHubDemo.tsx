'use client'

import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import {
  Check,
  ImageIcon,
  Loader2,
  Send,
  Unplug,
  Upload,
} from 'lucide-react'
import {
  getDefaultPreset,
  getPresetById,
  SOCIALHUB_DEMO_PRESETS,
} from '@/lib/socialhub-demo-presets'
import { cn } from '@/lib/utils'

type Profile = {
  name: string
  email?: string
  picture?: string
  connectedAt: number
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.126 0 2.075 2.075 0 01-2.063 2.064zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

type SocialHubDemoInnerProps = {
  variant?: 'page' | 'modal'
  onLinkedInOAuthHandled?: () => void
}

export function SocialHubDemoInner({
  variant = 'page',
  onLinkedInOAuthHandled,
}: SocialHubDemoInnerProps) {
  const searchParams = useSearchParams()
  const isModal = variant === 'modal'
  const fileRef = useRef<HTMLInputElement>(null)

  const [configured, setConfigured] = useState(true)
  const [connected, setConnected] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [banner, setBanner] = useState<string | null>(null)

  const defaultPreset = getDefaultPreset()
  const [presetId, setPresetId] = useState<string>(defaultPreset.id)
  const [cloudinaryUrl, setCloudinaryUrl] = useState<string>(
    defaultPreset.cloudinaryUrl,
  )
  const [uploading, setUploading] = useState(false)
  const [caption, setCaption] = useState(
    'Testing SocialHub — one image, one caption, published with scoped LinkedIn OAuth.',
  )
  const [posting, setPosting] = useState(false)
  const [posted, setPosted] = useState(false)

  const refreshSession = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/linkedin/me')
      const data = (await res.json()) as {
        configured: boolean
        connected: boolean
        profile: Profile | null
      }
      setConfigured(data.configured)
      setConnected(data.connected)
      setProfile(data.profile)
    } catch {
      setConfigured(false)
      setConnected(false)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refreshSession()
  }, [refreshSession])

  useEffect(() => {
    const status = searchParams.get('linkedin')
    const reason = searchParams.get('reason')
    if (status === 'connected') {
      setBanner('LinkedIn connected — pick an image and post.')
      void refreshSession()
      window.history.replaceState(null, '', '/projects/socialhub')
      onLinkedInOAuthHandled?.()
    } else if (status === 'error') {
      setBanner(
        reason === 'not_configured'
          ? 'Add LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET to .env'
          : `LinkedIn error${reason ? `: ${decodeURIComponent(reason)}` : ''}`,
      )
      window.history.replaceState(null, '', '/projects/socialhub')
      onLinkedInOAuthHandled?.()
    }
  }, [searchParams, refreshSession, onLinkedInOAuthHandled])

  useEffect(() => {
    if (connected && profile && !banner) {
      setBanner(`Signed in as ${profile.name} — ready to post.`)
    }
  }, [connected, profile, banner])

  const uploadToCloudinary = async (file: File) => {
    const body = new FormData()
    body.append('file', file)
    body.append('scope', 'socialhub-demo')
    const res = await fetch('/api/cloudinary/upload', { method: 'POST', body })
    const data = (await res.json()) as {
      ok?: boolean
      url?: string
      error?: string
      resourceType?: string
    }
    if (!res.ok || !data.ok || !data.url) {
      throw new Error(data.error ?? 'Cloudinary upload failed')
    }
    if (data.resourceType === 'video') {
      throw new Error('LinkedIn demo posts require an image (not video)')
    }
    return data.url
  }

  const handleFileChange = async (file: File | null) => {
    setPosted(false)
    if (!file) {
      if (fileRef.current) fileRef.current.value = ''
      return
    }
    setUploading(true)
    setBanner('Uploading to Cloudinary…')
    try {
      const url = await uploadToCloudinary(file)
      setCloudinaryUrl(url)
      setPresetId('')
      setBanner('Custom image ready — write your caption and post.')
    } catch (err) {
      setBanner(err instanceof Error ? err.message : 'Upload failed')
      if (fileRef.current) fileRef.current.value = ''
    } finally {
      setUploading(false)
    }
  }

  const handlePreset = (id: string) => {
    const preset = getPresetById(id)
    if (!preset) return
    setPresetId(id)
    setCloudinaryUrl(preset.cloudinaryUrl)
    setPosted(false)
    if (fileRef.current) fileRef.current.value = ''
    setBanner(`${preset.label} selected — edit caption and post.`)
  }

  const handleDisconnect = async () => {
    await fetch('/api/oauth/linkedin/disconnect', { method: 'POST' })
    setConnected(false)
    setProfile(null)
    setPosted(false)
    setBanner(null)
  }

  const handlePost = async () => {
    if (posting) return
    setPosting(true)
    setBanner(null)
    try {
      const body = new FormData()
      body.append('caption', caption.trim())
      body.append('mediaUrl', cloudinaryUrl)

      const res = await fetch('/api/linkedin/post', { method: 'POST', body })
      const data = (await res.json()) as {
        ok?: boolean
        error?: string
        postId?: string
      }

      if (!res.ok || !data.ok) {
        setBanner(data.error ?? 'Post failed')
        return
      }

      setPosted(true)
      setBanner(
        data.postId
          ? `Published to LinkedIn (id: ${data.postId})`
          : 'Published to LinkedIn',
      )
    } catch {
      setBanner('Network error — try again')
    } finally {
      setPosting(false)
    }
  }

  const canPost =
    connected &&
    caption.trim().length >= 3 &&
    Boolean(cloudinaryUrl) &&
    !posting &&
    !uploading

  const postDisabledReason = !connected
    ? 'Connect LinkedIn to enable posting'
    : caption.trim().length < 3
      ? 'Caption needs at least 3 characters'
      : !cloudinaryUrl
        ? 'Select or upload an image'
        : uploading
          ? 'Wait for upload to finish'
          : null

  const linkedInAuthBar = (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 rounded-xl border border-foreground/10 bg-foreground/[0.03] px-4 py-3',
        isModal && 'shrink-0',
      )}
    >
      {loading ? (
        <div className="flex items-center gap-2 font-mono text-xs text-foreground/50">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Checking LinkedIn session…
        </div>
      ) : !configured ? (
        <p className="text-sm text-foreground/70">
          LinkedIn OAuth is not configured on this server.
        </p>
      ) : connected && profile ? (
        <>
          <div className="flex min-w-0 items-center gap-3">
            {profile.picture ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.picture}
                alt=""
                className="h-10 w-10 shrink-0 rounded-full ring-2 ring-foreground/10"
              />
            ) : (
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#0A66C2]/15 text-[#0A66C2]">
                <LinkedInIcon className="h-5 w-5" />
              </div>
            )}
            <div className="min-w-0">
              <p className="flex items-center gap-1 truncate text-sm font-medium">
                <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                {profile.name}
              </p>
              {profile.email ? (
                <p className="truncate font-mono text-[10px] text-foreground/50">
                  {profile.email}
                </p>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            onClick={() => void handleDisconnect()}
            className="inline-flex shrink-0 items-center gap-1 font-mono text-[10px] uppercase text-foreground/50 hover:text-foreground"
          >
            <Unplug className="h-3 w-3" />
            Sign out
          </button>
        </>
      ) : (
        <>
          <div className="min-w-0">
            <p className="text-sm font-medium">Sign in with LinkedIn</p>
            <p className="mt-0.5 text-xs text-foreground/60">
              Required to publish posts from this demo.
            </p>
          </div>
          <a
            href="/api/oauth/linkedin/connect?return=/projects/socialhub?demo=1"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#0A66C2] px-4 py-2 text-sm font-medium text-white transition hover:brightness-110"
          >
            <LinkedInIcon className="h-4 w-4" />
            Connect LinkedIn
          </a>
        </>
      )}
    </div>
  )

  const postButton = (
    <button
      type="button"
      onClick={() => void handlePost()}
      disabled={!canPost || posted}
      className={cn(
        'inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition',
        canPost && !posted
          ? 'bg-[#0A66C2] text-white hover:brightness-110'
          : 'bg-foreground/15 text-foreground/45',
      )}
    >
      {posting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Send className="h-4 w-4" />
      )}
      {posted ? 'Posted to LinkedIn' : 'Post to LinkedIn'}
    </button>
  )

  const editorContent = configured ? (
    <div className={cn('space-y-5', isModal ? 'flex flex-col' : 'grid gap-8 lg:grid-cols-12')}>
      <div className={isModal ? 'space-y-4' : 'lg:col-span-4 space-y-4'}>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-foreground/45">
            Pre-saved images
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {SOCIALHUB_DEMO_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handlePreset(preset.id)}
                className={cn(
                  'relative aspect-square overflow-hidden rounded-lg ring-2 transition',
                  presetId === preset.id
                    ? 'ring-foreground'
                    : 'ring-foreground/15 hover:ring-foreground/35',
                )}
              >
                <Image
                  src={preset.cloudinaryUrl}
                  alt={preset.label}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-1.5 py-1 font-mono text-[8px] uppercase tracking-wide text-white">
                  {preset.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-foreground/45">
            Or upload your image
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={(e) => void handleFileChange(e.target.files?.[0] ?? null)}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full border border-dashed border-foreground/25 py-2.5 font-mono text-xs uppercase tracking-wider text-foreground/70 transition hover:border-foreground/40 hover:bg-foreground/[0.03] disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Upload className="h-3.5 w-3.5" />
            )}
            {uploading ? 'Uploading…' : 'Choose image from device'}
          </button>
        </div>
      </div>

      <div className={isModal ? 'space-y-4' : 'lg:col-span-8 space-y-4'}>
        <div
          className={cn(
            'relative overflow-hidden rounded-xl bg-foreground/5 ring-1 ring-foreground/10',
            isModal ? 'aspect-[16/9] max-h-44 w-full' : 'aspect-[16/10]',
          )}
        >
          {cloudinaryUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cloudinaryUrl}
              alt="Preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-foreground/40">
              <ImageIcon className="h-8 w-8" />
              <p className="font-mono text-xs">Select or upload an image</p>
            </div>
          )}
        </div>

        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-wider text-foreground/45">
            Caption
          </span>
          <textarea
            value={caption}
            onChange={(e) => {
              setCaption(e.target.value)
              setPosted(false)
            }}
            rows={isModal ? 3 : 4}
            className="mt-2 w-full resize-none rounded-xl border border-foreground/15 bg-background px-4 py-3 text-sm leading-relaxed focus:border-foreground/40 focus:outline-none"
            placeholder="Write your LinkedIn post…"
          />
        </label>

        {!isModal ? (
          <>
            {postButton}
            <p className="font-mono text-[10px] leading-relaxed text-foreground/45">
              Presets on Cloudinary · POST /api/linkedin/post · OAuth:
              /api/oauth/linkedin/*
            </p>
          </>
        ) : null}
      </div>
    </div>
  ) : null

  const shellBody = (
    <>
      {banner ? (
        <p className="rounded-xl bg-foreground/5 px-4 py-3 font-mono text-xs text-foreground/75 ring-1 ring-foreground/10">
          {banner}
        </p>
      ) : null}

      {!configured && !loading ? (
        <div className="space-y-2 text-sm text-foreground/70">
          <p>
            Set{' '}
            <code className="font-mono text-xs">LINKEDIN_CLIENT_ID</code>,{' '}
            <code className="font-mono text-xs">LINKEDIN_CLIENT_SECRET</code>, and{' '}
            <code className="font-mono text-xs">LINKEDIN_SESSION_SECRET</code> in{' '}
            <code className="font-mono text-xs">.env</code>.
          </p>
        </div>
      ) : (
        editorContent
      )}
    </>
  )

  const shell = (
    <div
      className={cn(
        isModal
          ? 'space-y-4 rounded-xl border border-foreground/10 bg-foreground/[0.02] p-4'
          : 'mt-8 space-y-5 rounded-2xl border border-foreground/12 bg-foreground/[0.02] p-5 md:p-8',
      )}
    >
      {linkedInAuthBar}
      {shellBody}
    </div>
  )

  if (isModal) {
    return (
      <div id="socialhub-demo" className="flex min-h-0 flex-1 flex-col">
        <p className="shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/45">
          Post to LinkedIn
        </p>
        <p className="mt-1 shrink-0 text-sm text-foreground/65">
          Sign in, pick or upload an image, write a caption, then post.
        </p>

        <div className="mt-3 min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain pr-1">
          {shell}
        </div>

        <div className="shrink-0 border-t border-foreground/10 bg-background pt-4">
          {postButton}
          {postDisabledReason && !posted ? (
            <p className="mt-2 text-center font-mono text-[10px] text-foreground/45">
              {postDisabledReason}
            </p>
          ) : null}
        </div>
      </div>
    )
  }

  return (
    <section
      id="socialhub-demo"
      className="mt-20 scroll-mt-28 border-t border-foreground/10 pt-14"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/45">
        Live demo
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
        SocialHub · Post to LinkedIn
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground/65 md:text-base">
        Connect LinkedIn, pick a pre-saved campaign image (hosted on Cloudinary),
        write your caption, and post in one step — no upload wait at publish time.
      </p>
      {shell}
    </section>
  )
}

export function SocialHubDemo() {
  return (
    <Suspense
      fallback={
        <div
          id="socialhub-demo"
          className="mt-20 font-mono text-sm text-foreground/50"
        >
          Loading SocialHub demo…
        </div>
      }
    >
      <SocialHubDemoInner />
    </Suspense>
  )
}
