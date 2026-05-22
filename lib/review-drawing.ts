import getStroke from 'perfect-freehand'

export type InkPoint = { x: number; y: number; pressure?: number }

/** @deprecated Use CanvasTool from canvas-playground */
export type InputMode = 'type' | 'play' | 'sign' | 'sticker' | 'hand' | 'erase'

export type InkStrokeData = {
  points: InkPoint[]
  color: string
  size: number
}

export function getStrokeOptions(size: number) {
  return {
    size: size * 2.2,
    thinning: 0.62,
    smoothing: 0.58,
    streamline: 0.58,
    easing: (t: number) => t,
    simulatePressure: true,
  } as const
}

export function getStrokeOutline(points: InkPoint[], brushSize: number): number[][] {
  if (points.length < 1) return []
  return getStroke(
    points.map((p) => [p.x, p.y, p.pressure ?? 0.5]),
    getStrokeOptions(brushSize),
  )
}

export function fillStrokePath(
  ctx: CanvasRenderingContext2D,
  outline: number[][],
  color = '#ffffff',
) {
  if (outline.length < 2) return
  ctx.fillStyle = color
  ctx.beginPath()
  const [first, ...rest] = outline
  ctx.moveTo(first[0], first[1])
  for (const [x, y] of rest) {
    ctx.lineTo(x, y)
  }
  ctx.closePath()
  ctx.fill()
}

export function drawStrokeOnCanvas(
  ctx: CanvasRenderingContext2D,
  stroke: InkStrokeData | InkPoint[],
  brushSizeOrColor?: number | string,
  maybeColor?: string,
) {
  let points: InkPoint[]
  let size: number
  let color: string
  if (Array.isArray(stroke)) {
    points = stroke
    size = (brushSizeOrColor as number) ?? 6
    color = maybeColor ?? '#ffffff'
  } else {
    points = stroke.points
    size = stroke.size
    color = stroke.color
  }
  if (points.length > 0) {
    fillStrokePath(ctx, getStrokeOutline(points, size), color)
  }
}

export function redrawInkCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  strokes: InkStrokeData[],
  current: InkPoint[],
  brushSize: number,
  color: string,
) {
  ctx.clearRect(0, 0, width, height)
  for (const stroke of strokes) {
    drawStrokeOnCanvas(ctx, stroke)
  }
  if (current.length > 0) {
    drawStrokeOnCanvas(ctx, current, brushSize, color)
  }
}

/** Fill gaps when the pointer jumps (fast hand / mouse moves). */
export function appendInkPoint(
  stroke: InkPoint[],
  p: InkPoint,
  opts: {
    minDistance?: number
    breakDistance?: number
    interpolateStep?: number
  } = {},
): 'append' | 'break' | 'skip' {
  const minDistance = opts.minDistance ?? 1
  const breakDistance = opts.breakDistance ?? 140
  const interpolateStep = opts.interpolateStep ?? 6

  if (stroke.length === 0) {
    stroke.push(p)
    return 'append'
  }

  const last = stroke[stroke.length - 1]
  const dist = Math.hypot(p.x - last.x, p.y - last.y)
  if (dist < minDistance) return 'skip'
  if (dist > breakDistance) return 'break'

  if (dist > interpolateStep) {
    const steps = Math.ceil(dist / interpolateStep)
    for (let i = 1; i <= steps; i++) {
      const t = i / steps
      stroke.push({
        x: last.x + (p.x - last.x) * t,
        y: last.y + (p.y - last.y) * t,
        pressure: p.pressure ?? 0.5,
      })
    }
  } else {
    stroke.push(p)
  }
  return 'append'
}

export function clientToCanvasPoint(
  canvas: HTMLCanvasElement,
  clientX: number,
  clientY: number,
  allowOutside = false,
): InkPoint | null {
  const rect = canvas.getBoundingClientRect()
  if (rect.width <= 0 || rect.height <= 0) return null
  if (
    !allowOutside &&
    (clientX < rect.left ||
      clientX > rect.right ||
      clientY < rect.top ||
      clientY > rect.bottom)
  ) {
    return null
  }
  const nx = (clientX - rect.left) / rect.width
  const ny = (clientY - rect.top) / rect.height
  return {
    x: Math.min(canvas.width, Math.max(0, nx * canvas.width)),
    y: Math.min(canvas.height, Math.max(0, ny * canvas.height)),
    pressure: 0.5,
  }
}

/** White ink on black — best for Tesseract. */
export function inkCanvasForOcr(source: HTMLCanvasElement): string {
  const c = document.createElement('canvas')
  c.width = source.width
  c.height = source.height
  const ctx = c.getContext('2d')
  if (!ctx) return ''
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, c.width, c.height)
  ctx.drawImage(source, 0, 0)
  return c.toDataURL('image/png')
}
