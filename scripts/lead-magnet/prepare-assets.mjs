// Kopiert das FormaXI-Logo aus dem Workspace-Root nach assets/logo.png und
// skaliert es auf max. 400px Breite herunter (PDF-Größe sparen).
// Aufruf: node scripts/lead-magnet/prepare-assets.mjs   (läuft auch automatisch in generate.ts)
import { existsSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const here = path.dirname(fileURLToPath(import.meta.url))
const assetsDir = path.join(here, 'assets')
const out = path.join(assetsDir, 'logo.png')
const outWordmark = path.join(assetsDir, 'logo-wordmark.png')

// Logo liegt im Workspace-Root, eine Ebene über dem Repo:
//   <workspace>/Logo_FormaXI.png   und   <workspace>/repo/scripts/lead-magnet/
const candidates = [
  path.resolve(here, '../../../Logo_FormaXI.png'), // workspace root
  path.resolve(here, '../../Logo_FormaXI.png'), // repo root (Fallback)
  path.resolve(process.cwd(), '../Logo_FormaXI.png'),
  path.resolve(process.cwd(), 'Logo_FormaXI.png'),
]

export async function prepareLogo({ silent = false } = {}) {
  const src = candidates.find((p) => existsSync(p))
  if (!src) {
    if (!silent) {
      console.warn(
        '[prepare-assets] Logo_FormaXI.png nicht gefunden – Generator nutzt Text-Fallback.',
      )
      console.warn('[prepare-assets] gesucht in:\n  ' + candidates.join('\n  '))
    }
    return null
  }
  mkdirSync(assetsDir, { recursive: true })
  await sharp(src)
    .resize({ width: 400, withoutEnlargement: true })
    .png({ quality: 90, compressionLevel: 9 })
    .toFile(out)
  if (!silent) {
    console.log(`[prepare-assets] Logo → ${path.relative(process.cwd(), out)} (≤400px)`)
  }
  return out
}

/**
 * Erzeugt eine TRANSPARENTE Wortmarke — NUR der „FormaXI"-Schriftzug, OHNE Icon-Kachel
 * und ohne dunklen Hintergrundkasten — für den Cover-Header auf Navy.
 *
 * Quelle ist Logo_FormaXI.png: oben die große App-Icon-Kachel, unten die horizontale
 * Lockup (kleine Kachel + „FormaXI"). Wir isolieren die untere Lockup-Zeile, trennen
 * die Kachel (erster, quasi-quadratischer Spalten-Block) vom Text ab und behalten nur
 * den Schriftzug rechts davon. Der nahezu uniforme dunkle Hintergrund wird per Chroma-Key
 * zu echter Transparenz entfernt (weicher Alpha-Übergang an den Kanten).
 *
 * @returns {Promise<string|null>} Pfad zur Wortmarken-PNG oder null, wenn keine Quelle.
 */
export async function prepareWordmark({ silent = false } = {}) {
  const src = candidates.find((p) => existsSync(p))
  if (!src) {
    if (!silent) {
      console.warn('[prepare-assets] Logo_FormaXI.png nicht gefunden – Wortmarke übersprungen.')
    }
    return null
  }

  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const W = info.width
  const H = info.height
  const C = info.channels // 4 (ensureAlpha)

  // Hintergrundfarbe aus der Ecke ableiten (uniformes dunkles Navy/Schwarz).
  const bg = [data[0], data[1], data[2]]
  const dist = (x, y) => {
    const i = (y * W + x) * C
    const dr = data[i] - bg[0]
    const dg = data[i + 1] - bg[1]
    const db = data[i + 2] - bg[2]
    return Math.sqrt(dr * dr + dg * dg + db * db)
  }
  const CONTENT = 16

  // 1) Untere Lockup-Zeile isolieren: letzte zusammenhängende Inhaltszeilen-Gruppe.
  const rowHasContent = (y) => {
    for (let x = 0; x < W; x++) if (dist(x, y) > CONTENT) return true
    return false
  }
  let bandBottom = -1
  for (let y = H - 1; y >= 0; y--) {
    if (rowHasContent(y)) {
      bandBottom = y
      break
    }
  }
  if (bandBottom < 0) return null
  let bandTop = bandBottom
  while (bandTop > 0 && rowHasContent(bandTop - 1)) bandTop--
  const bandH = bandBottom - bandTop + 1

  // 2) Spalten-Blöcke der Zeile finden; erster Block ≈ quadratische Kachel → überspringen.
  const colHasContent = (x) => {
    for (let y = bandTop; y <= bandBottom; y++) if (dist(x, y) > CONTENT) return true
    return false
  }
  const runs = []
  let s = null
  for (let x = 0; x < W; x++) {
    const h = colHasContent(x)
    if (h && s === null) s = x
    if (!h && s !== null) {
      runs.push([s, x - 1])
      s = null
    }
  }
  if (s !== null) runs.push([s, W - 1])
  const blocks = runs.filter((r) => r[1] - r[0] >= 3)
  if (blocks.length === 0) return null
  // Kachel = erster Block, dessen Breite grob der Zeilenhöhe entspricht (quadratisch).
  const first = blocks[0]
  const firstW = first[1] - first[0] + 1
  const tileLikely = firstW >= bandH * 0.7
  const textStartX = tileLikely && blocks.length > 1 ? blocks[1][0] : first[0]

  // 3) Enge Bounding-Box des Schriftzugs (x >= textStartX innerhalb der Zeile).
  let minX = W
  let maxX = 0
  let minY = H
  let maxY = 0
  for (let y = bandTop; y <= bandBottom; y++) {
    for (let x = textStartX; x < W; x++) {
      if (dist(x, y) > CONTENT) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }
  const pad = 8
  minX = Math.max(0, minX - pad)
  minY = Math.max(0, minY - pad)
  maxX = Math.min(W - 1, maxX + pad)
  maxY = Math.min(H - 1, maxY + pad)
  const cw = maxX - minX + 1
  const ch = maxY - minY + 1

  // 4) Chroma-Key: Hintergrund → transparent (weicher Alpha-Übergang lo..hi).
  const lo = 8
  const hi = 18
  const outBuf = Buffer.alloc(cw * ch * 4)
  let q = 0
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const i = (y * W + x) * C
      const d = dist(x, y)
      const a = d <= lo ? 0 : d >= hi ? 255 : Math.round(((d - lo) / (hi - lo)) * 255)
      outBuf[q++] = data[i]
      outBuf[q++] = data[i + 1]
      outBuf[q++] = data[i + 2]
      outBuf[q++] = a
    }
  }

  mkdirSync(assetsDir, { recursive: true })
  await sharp(outBuf, { raw: { width: cw, height: ch, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(outWordmark)
  if (!silent) {
    console.log(
      `[prepare-assets] Wortmarke → ${path.relative(process.cwd(), outWordmark)} (${cw}×${ch})`,
    )
  }
  return outWordmark
}

// Direkter CLI-Aufruf
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('prepare-assets.mjs')) {
  Promise.all([prepareLogo(), prepareWordmark()]).catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
