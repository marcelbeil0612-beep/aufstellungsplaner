import { positionShort } from '../data/positionWeights'
import { usePhotoStore } from '../store/photoStore'
import type { Formation, Player, PlayerStatus, Slot } from '../types'
import { shapeSlots, type PhaseShape } from './phaseShift'
import { initials } from './photoUtils'

type ExportInput = {
  formation: Formation
  shape: PhaseShape
  assignments: Record<string, string | null>
  players: Player[]
  /** Anzeigetitel über dem Spielfeld (z. B. „Heimspiel · 4-3-3"). */
  title?: string
}

const STATUS_GLYPH: Record<PlayerStatus, string> = {
  injured: '🤕',
  suspended: '🟥',
  absent: '🚫',
}

async function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Foto konnte nicht geladen werden: ${url}`))
    img.src = url
  })
}

/** Lädt alle Fotos der aufgestellten Spieler in Image-Elemente. */
async function loadPhotos(
  input: ExportInput,
): Promise<Map<string, HTMLImageElement>> {
  const urls = usePhotoStore.getState().urls
  const out = new Map<string, HTMLImageElement>()
  const tasks: Promise<void>[] = []
  for (const playerId of Object.values(input.assignments)) {
    if (!playerId) continue
    const player = input.players.find((p) => p.id === playerId)
    if (!player) continue
    const url =
      (player.photoId ? urls[player.photoId] : undefined) ?? player.photo
    if (!url) continue
    tasks.push(
      loadImage(url)
        .then((img) => {
          out.set(player.id, img)
        })
        .catch(() => {
          /* Foto silent ignorieren; Chip rendert dann Initialen. */
        }),
    )
  }
  await Promise.all(tasks)
  return out
}

/** Zeichnet die Spielfeld-Linien (vertikal, eigenes Tor unten). */
function drawPitch(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  // Hintergrund: Verlauf wie im SVG.
  const grad = ctx.createLinearGradient(0, 0, 0, h)
  grad.addColorStop(0, '#25823d')
  grad.addColorStop(1, '#1a5d2c')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)

  // Dezente horizontale Streifen.
  ctx.fillStyle = 'rgba(255,255,255,0.05)'
  const stripeH = h / 12
  for (let y = 0; y < h; y += stripeH * 2) ctx.fillRect(0, y, w, stripeH)

  // Vignette außen.
  const vignette = ctx.createRadialGradient(w / 2, h / 2, h * 0.4, w / 2, h / 2, h * 0.75)
  vignette.addColorStop(0, 'rgba(0,0,0,0)')
  vignette.addColorStop(1, 'rgba(0,0,0,0.45)')
  ctx.fillStyle = vignette
  ctx.fillRect(0, 0, w, h)

  // Linien skaliert relativ zu 100 × 150 (wie das SVG-viewBox in Pitch.tsx).
  const sx = w / 100
  const sy = h / 150
  ctx.strokeStyle = '#f8fafc'
  ctx.lineWidth = 0.5 * Math.min(sx, sy)
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  const line = (x1: number, y1: number, x2: number, y2: number) => {
    ctx.beginPath()
    ctx.moveTo(x1 * sx, y1 * sy)
    ctx.lineTo(x2 * sx, y2 * sy)
    ctx.stroke()
  }
  const rect = (x: number, y: number, rw: number, rh: number) => {
    ctx.strokeRect(x * sx, y * sy, rw * sx, rh * sy)
  }
  const circle = (cx: number, cy: number, r: number) => {
    ctx.beginPath()
    ctx.arc(cx * sx, cy * sy, r * Math.min(sx, sy), 0, Math.PI * 2)
    ctx.stroke()
  }
  const dot = (cx: number, cy: number, r: number) => {
    ctx.beginPath()
    ctx.arc(cx * sx, cy * sy, r * Math.min(sx, sy), 0, Math.PI * 2)
    ctx.fill()
  }
  const arc = (cx: number, cy: number, r: number, start: number, end: number) => {
    ctx.beginPath()
    ctx.arc(cx * sx, cy * sy, r * Math.min(sx, sy), start, end)
    ctx.stroke()
  }

  ctx.fillStyle = '#f8fafc'

  // Außenlinie
  rect(2, 2, 96, 146)
  // Mittellinie + Anstoßkreis + Punkt
  line(2, 75, 98, 75)
  circle(50, 75, 9)
  dot(50, 75, 0.7)
  // Gegnerischer Strafraum + 6er + Punkt + Halbkreis + Torlinie
  rect(22, 2, 56, 18)
  rect(36, 2, 28, 6)
  dot(50, 14, 0.7)
  arc(50, 20, 9, Math.PI, 0)
  ctx.lineWidth = 1 * Math.min(sx, sy)
  line(44, 2, 56, 2)
  // Eigener Strafraum + 6er + Punkt + Halbkreis + Torlinie
  ctx.lineWidth = 0.5 * Math.min(sx, sy)
  rect(22, 130, 56, 18)
  rect(36, 142, 28, 6)
  dot(50, 136, 0.7)
  arc(50, 130, 9, 0, Math.PI)
  ctx.lineWidth = 1 * Math.min(sx, sy)
  line(44, 148, 56, 148)
}

/** Zeichnet einen einzelnen Slot inkl. Spielerinfo (Foto/Initialen, Name, Nummer, Status). */
function drawSlot(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  slot: Slot,
  player: Player | undefined,
  photo: HTMLImageElement | undefined,
  radius: number,
): void {
  const isGK = slot.position === 'GK'
  const ringColor = isGK ? '#fbbf24' : '#38bdf8'

  // Schatten unter dem Chip.
  ctx.save()
  ctx.fillStyle = 'rgba(0,0,0,0.45)'
  ctx.beginPath()
  ctx.ellipse(cx, cy + radius * 0.95, radius * 0.85, radius * 0.18, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  // Ring
  ctx.save()
  ctx.lineWidth = radius * 0.18
  ctx.strokeStyle = ringColor
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.stroke()

  // Avatar-Hintergrund + Foto/Initialen-Clip.
  ctx.beginPath()
  ctx.arc(cx, cy, radius - radius * 0.05, 0, Math.PI * 2)
  ctx.clip()
  if (photo) {
    const size = (radius - radius * 0.05) * 2
    ctx.drawImage(photo, cx - size / 2, cy - size / 2, size, size)
  } else {
    // Farbverlauf wie auf dem normalen Chip.
    const g = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius)
    if (isGK) {
      g.addColorStop(0, '#fbbf24')
      g.addColorStop(1, '#92400e')
    } else {
      g.addColorStop(0, '#38bdf8')
      g.addColorStop(1, '#312e81')
    }
    ctx.fillStyle = g
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2)
    ctx.fillStyle = '#ffffff'
    ctx.font = `bold ${Math.round(radius * 0.95)}px Inter, system-ui, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(player ? initials(player.name) : positionShort[slot.position], cx, cy)
  }
  ctx.restore()

  // Positions-Badge oben links (immer).
  ctx.save()
  ctx.fillStyle = isGK ? '#f59e0b' : '#0284c7'
  ctx.strokeStyle = 'rgba(255,255,255,0.7)'
  ctx.lineWidth = 1.5
  const posText = positionShort[slot.position]
  ctx.font = `900 ${Math.round(radius * 0.36)}px Inter, system-ui, sans-serif`
  const posMetrics = ctx.measureText(posText)
  const posPadX = radius * 0.16
  const posPadY = radius * 0.1
  const posW = posMetrics.width + posPadX * 2
  const posH = radius * 0.55
  const posX = cx - radius * 0.8
  const posY = cy - radius * 1.05
  roundedRect(ctx, posX, posY, posW, posH, 4)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText(posText, posX + posPadX, posY + posH / 2 + posPadY * 0.05)
  ctx.restore()

  // Status-Badge unten rechts (falls gesetzt).
  if (player?.status) {
    ctx.save()
    const sx = cx + radius * 0.7
    const sy = cy + radius * 0.7
    const sr = radius * 0.32
    const colors: Record<PlayerStatus, string> = {
      injured: '#f43f5e',
      suspended: '#f59e0b',
      absent: '#64748b',
    }
    ctx.fillStyle = colors[player.status]
    ctx.strokeStyle = '#0f172a'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(sx, sy, sr, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    ctx.font = `${Math.round(sr * 1.1)}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(STATUS_GLYPH[player.status], sx, sy + 1)
    ctx.restore()
  }

  // Name-Pill unten.
  const label = player
    ? typeof player.number === 'number'
      ? `${player.number} · ${player.name}`
      : player.name
    : '— frei —'
  ctx.save()
  ctx.font = `bold ${Math.round(radius * 0.4)}px Inter, system-ui, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const metrics = ctx.measureText(label)
  const pillPadX = radius * 0.3
  const pillPadY = radius * 0.18
  const pillW = Math.min(metrics.width + pillPadX * 2, radius * 4)
  const pillH = radius * 0.65
  const pillX = cx - pillW / 2
  const pillY = cy + radius + radius * 0.25
  ctx.fillStyle = 'rgba(0,0,0,0.75)'
  roundedRect(ctx, pillX, pillY, pillW, pillH, 5)
  ctx.fill()
  // Truncate falls Text zu lang
  let drawn = label
  while (ctx.measureText(drawn).width > pillW - pillPadX * 2 && drawn.length > 1) {
    drawn = drawn.slice(0, -1)
  }
  if (drawn !== label) drawn = drawn.slice(0, -1) + '…'
  ctx.fillStyle = player ? '#ffffff' : '#94a3b8'
  ctx.fillText(drawn, cx, pillY + pillH / 2 + pillPadY * 0.05)
  ctx.restore()
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

/**
 * Rendert die aktuelle Aufstellung in ein PNG und gibt das Blob zurück.
 */
export async function renderLineupPng(input: ExportInput): Promise<Blob> {
  const W = 1000
  const H = 1500
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas-Kontext nicht verfügbar.')

  drawPitch(ctx, W, H)

  // Fotos für die aufgestellten Spieler vorladen.
  const photos = await loadPhotos(input)

  const slots = shapeSlots(input.formation.slots, input.shape)
  const slotRadius = Math.min(W, H) * 0.06
  for (const slot of slots) {
    const cx = (slot.x / 100) * W
    const cy = ((100 - slot.y) / 100) * H
    const playerId = input.assignments[slot.id] ?? null
    const player = playerId ? input.players.find((p) => p.id === playerId) : undefined
    const photo = player ? photos.get(player.id) : undefined
    drawSlot(ctx, cx, cy, slot, player, photo, slotRadius)
  }

  // Titel oben.
  if (input.title) {
    ctx.save()
    ctx.fillStyle = 'rgba(0,0,0,0.55)'
    roundedRect(ctx, 20, 20, Math.min(W - 40, 360), 60, 12)
    ctx.fill()
    ctx.fillStyle = '#ffffff'
    ctx.font = `bold 28px Inter, system-ui, sans-serif`
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText(input.title, 36, 50)
    ctx.restore()
  }

  // Dezenter Marken-Footer: jeder geteilte Export ist zugleich Werbung.
  // Untere rechte Ecke (freie Rasenfläche, kollidiert nicht mit dem
  // mittig tief stehenden Torwart-Label), klein & halbtransparent.
  {
    ctx.save()
    const footer = 'Erstellt mit FormaXI · formaxi.de'
    ctx.font = '20px Inter, system-ui, sans-serif'
    ctx.textBaseline = 'middle'
    const tw = ctx.measureText(footer).width
    const padX = 16
    const padY = 8
    const pillW = tw + padX * 2
    const pillH = 20 + padY * 2
    const pillX = W - pillW - 16
    const pillY = H - pillH - 14
    ctx.fillStyle = 'rgba(0,0,0,0.40)'
    roundedRect(ctx, pillX, pillY, pillW, pillH, 8)
    ctx.fill()
    ctx.fillStyle = 'rgba(255,255,255,0.72)'
    ctx.textAlign = 'center'
    ctx.fillText(footer, pillX + pillW / 2, pillY + pillH / 2 + 1)
    ctx.restore()
  }

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Konnte kein PNG erzeugen.'))),
      'image/png',
    )
  })
}

/** Startet den Browser-Download der gerenderten Aufstellung als PNG. */
export async function downloadLineupPng(
  input: ExportInput,
  filename = 'aufstellung.png',
): Promise<void> {
  const blob = await renderLineupPng(input)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 4000)
}

/** Datei-Vorschlag mit Datum, ähnlich wie bei Backups. */
export function suggestedLineupFilename(formationName: string): string {
  const stamp = new Date().toISOString().slice(0, 10)
  const safe = formationName.replace(/[^a-z0-9-]+/gi, '-').toLowerCase()
  return `aufstellung-${safe}-${stamp}.png`
}
