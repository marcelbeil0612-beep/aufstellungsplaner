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

// Direkter CLI-Aufruf
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('prepare-assets.mjs')) {
  prepareLogo().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
