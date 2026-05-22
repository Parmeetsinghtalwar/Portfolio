export type CanvasTool = 'type' | 'play' | 'sign' | 'sticker' | 'hand' | 'erase'

export type StickerKind = 'emoji' | 'graphic'

export type StickerDef = {
  id: string
  label: string
  kind: StickerKind
  emoji?: string
  src?: string
}

export const CANVAS_COLORS = [
  '#ffffff',
  '#000000',
  '#22c55e',
  '#3b82f6',
  '#eab308',
  '#ef4444',
  '#a855f7',
  '#f97316',
  '#ec4899',
  '#06b6d4',
] as const

export const PLAY_BRUSH_SIZES = [3, 6, 10, 16] as const
export const SIGN_BRUSH_SIZES = [2, 3, 4] as const
export const ERASE_RADIUS = 28
export const DEFAULT_STICKER_SIZE = 56

export const EMOJI_STICKERS: StickerDef[] = [
  { id: 'star', label: 'Star', kind: 'emoji', emoji: '⭐' },
  { id: 'heart', label: 'Heart', kind: 'emoji', emoji: '❤️' },
  { id: 'fire', label: 'Fire', kind: 'emoji', emoji: '🔥' },
  { id: 'sparkle', label: 'Sparkle', kind: 'emoji', emoji: '✨' },
  { id: 'rocket', label: 'Rocket', kind: 'emoji', emoji: '🚀' },
  { id: 'party', label: 'Party', kind: 'emoji', emoji: '🎉' },
  { id: 'thumbs', label: 'Thumbs up', kind: 'emoji', emoji: '👍' },
  { id: 'wave', label: 'Wave', kind: 'emoji', emoji: '👋' },
  { id: 'cool', label: 'Cool', kind: 'emoji', emoji: '😎' },
  { id: 'laugh', label: 'Laugh', kind: 'emoji', emoji: '😂' },
]

export const GRAPHIC_STICKERS: StickerDef[] = [
  { id: 'star-badge', label: 'Gold star', kind: 'graphic', src: '/stickers/star-badge.svg' },
  { id: 'heart-pop', label: 'Heart', kind: 'graphic', src: '/stickers/heart-pop.svg' },
  { id: 'bolt', label: 'Lightning', kind: 'graphic', src: '/stickers/bolt.svg' },
  { id: 'flower', label: 'Flower', kind: 'graphic', src: '/stickers/flower.svg' },
  { id: 'crown', label: 'Crown', kind: 'graphic', src: '/stickers/crown.svg' },
  { id: 'smiley', label: 'Smiley', kind: 'graphic', src: '/stickers/smiley.svg' },
]

export type StickerPlacement = {
  id: string
  kind: StickerKind
  stickerId: string
  emoji?: string
  src?: string
  x: number
  y: number
  size: number
}

const imageCache = new Map<string, HTMLImageElement>()

export function preloadStickerImages(
  defs: StickerDef[] = GRAPHIC_STICKERS,
): Promise<void> {
  const loads = defs
    .filter((d) => d.kind === 'graphic' && d.src)
    .map(
      (d) =>
        new Promise<void>((resolve, reject) => {
          if (imageCache.has(d.id)) {
            resolve()
            return
          }
          const img = new Image()
          img.onload = () => {
            imageCache.set(d.id, img)
            resolve()
          }
          img.onerror = () => reject(new Error(`Failed to load ${d.src}`))
          img.src = d.src!
        }),
    )
  return Promise.all(loads).then(() => undefined)
}

export function drawSticker(
  ctx: CanvasRenderingContext2D,
  sticker: StickerPlacement,
) {
  if (sticker.kind === 'emoji' && sticker.emoji) {
    ctx.save()
    ctx.font = `${sticker.size}px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(sticker.emoji, sticker.x, sticker.y)
    ctx.restore()
    return
  }

  const img = imageCache.get(sticker.stickerId)
  if (!img) return
  const s = sticker.size
  ctx.save()
  ctx.drawImage(img, sticker.x - s / 2, sticker.y - s / 2, s, s)
  ctx.restore()
}

export function eraseAtPoint<T extends { points: { x: number; y: number }[] }>(
  strokes: T[],
  stickers: StickerPlacement[],
  x: number,
  y: number,
  radius: number,
): { strokes: T[]; stickers: StickerPlacement[] } {
  const r2 = radius * radius
  const filteredStrokes = strokes
    .map((stroke) => ({
      ...stroke,
      points: stroke.points.filter((p) => {
        const dx = p.x - x
        const dy = p.y - y
        return dx * dx + dy * dy > r2
      }),
    }))
    .filter((s) => s.points.length > 1)

  const filteredStickers = stickers.filter((s) => {
    const dx = s.x - x
    const dy = s.y - y
    const hitR = radius + s.size * 0.45
    return dx * dx + dy * dy > hitR * hitR
  })

  return { strokes: filteredStrokes, stickers: filteredStickers }
}

export function signDefaults() {
  return { color: '#ffffff' as const, size: SIGN_BRUSH_SIZES[1] }
}

export function playDefaults() {
  return { color: CANVAS_COLORS[0], size: PLAY_BRUSH_SIZES[1] }
}
