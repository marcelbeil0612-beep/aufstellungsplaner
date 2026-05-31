// Generator für das Lead-Magnet-PDF.
//   npm run generate:lead-magnet
//
// Lädt die Systembuch-Daten direkt aus der App (Single Source of Truth),
// selektiert die 5 Duelle, rendert das HTML-Template und druckt mit Puppeteer
// nach /public/downloads/formaxi-systembuch-mini.pdf
import { existsSync, mkdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import QRCode from 'qrcode'
import puppeteer from 'puppeteer'

import { findEntry, systemLabels, type SystemId } from '../../src/data/tacticBook/index'
import { renderPitchSVG } from './pitch'
import { renderDocument, type DuelVM, type TemplateData } from './template'
import { prepareLogo } from './prepare-assets.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(here, '../..')

// ── Konfiguration (leicht änderbar) ──────────────────────────────────────────
/** Die 5 Duelle in Reihenfolge. ourSystem = Formation A (voll dargestellt). */
const SELECTED_DUELS: Array<{ our: SystemId; opp: SystemId }> = [
  { our: '4-3-3', opp: '4-4-2' },
  { our: '4-2-3-1', opp: '4-4-2' },
  { our: '3-5-2', opp: '4-3-3' },
  { our: '4-4-2-raute', opp: '4-3-3' },
  { our: '5-3-2', opp: '4-3-3' },
]

const CTA_URL = 'https://formaxi.de'
const DATE_LABEL = 'Mai 2026'
const OUT_PATH = path.join(repoRoot, 'public', 'downloads', 'formaxi-systembuch-mini.pdf')

/** Max. Listenlänge pro Säule, damit jede Duell-Seite auf eine A4-Seite passt. */
const MAX_ITEMS = 3
const MAX_COACHING = 4

// ── View-Model bauen ─────────────────────────────────────────────────────────
function buildDuels(): DuelVM[] {
  return SELECTED_DUELS.map((sel, i) => {
    const entry = findEntry(sel.our, sel.opp)
    if (!entry) {
      throw new Error(
        `Duell nicht im Systembuch gefunden: ${sel.our} vs ${sel.opp}. ` +
          `Bitte SELECTED_DUELS in generate.ts prüfen.`,
      )
    }
    return {
      index: i + 1,
      pageNumber: i + 3, // Seiten 1=Cover, 2=Story, 3..7=Duelle
      title: `${systemLabels[sel.our]} gegen ${systemLabels[sel.opp]}`,
      rating: entry.rating,
      character: entry.character,
      // Phase-Mapping (bestätigt):
      advantages: entry.phases.ownPossession.advantages.slice(0, MAX_ITEMS),
      dangers: entry.phases.oppPossession.dangers.slice(0, MAX_ITEMS),
      spaces: entry.phases.ownPossession.spaces.slice(0, MAX_ITEMS),
      pressing: entry.phases.oppPossession.keyActions.slice(0, MAX_ITEMS),
      coaching: entry.liveCoaching.slice(0, MAX_COACHING),
      pitchSVG: renderPitchSVG(sel.our, sel.opp),
    }
  })
}

async function main() {
  console.log('[lead-magnet] Systembuch-Daten laden & validieren …')
  const duels = buildDuels()
  console.log(`[lead-magnet] ${duels.length} Duelle selektiert:`)
  for (const d of duels) console.log(`   • Duell ${d.index}: ${d.title} (${d.rating})`)

  // Logo vorbereiten (kopieren + skalieren), dann als Data-URI einbetten
  const logoPath = await prepareLogo({ silent: true }).catch(() => null)
  let logoDataUri: string | null = null
  if (logoPath && existsSync(logoPath)) {
    logoDataUri = `data:image/png;base64,${readFileSync(logoPath).toString('base64')}`
    console.log('[lead-magnet] Logo eingebettet.')
  } else {
    console.warn('[lead-magnet] Kein Logo gefunden – Wortmarke als Fallback.')
  }

  // QR-Code
  const qrDataUri = await QRCode.toDataURL(CTA_URL, {
    margin: 1,
    width: 480,
    color: { dark: '#0f172a', light: '#ffffff' },
    errorCorrectionLevel: 'M',
  })

  const data: TemplateData = {
    duels,
    totalPages: duels.length + 3, // Cover + Story + Duelle + Outro
    logoDataUri,
    qrDataUri,
    dateLabel: DATE_LABEL,
  }

  const html = renderDocument(data)

  console.log('[lead-magnet] Puppeteer startet (headless) …')
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
  try {
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'load' })
    // Webfonts/SVG sicher gerendert
    await page.evaluateHandle('document.fonts.ready')

    mkdirSync(path.dirname(OUT_PATH), { recursive: true })
    await page.pdf({
      path: OUT_PATH,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: false,
      margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' },
    })

    // Optionaler Debug-Output: PNG-Screenshots je Seite (LEAD_MAGNET_SHOTS=1)
    if (process.env.LEAD_MAGNET_SHOTS) {
      const shotDir = path.join(here, '.preview')
      mkdirSync(shotDir, { recursive: true })
      await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1.5 })
      const handles = await page.$$('.page')
      for (let i = 0; i < handles.length; i++) {
        await handles[i].screenshot({ path: path.join(shotDir, `page-${i + 1}.png`) })
      }
      console.log(`[lead-magnet] ${handles.length} Vorschau-PNGs → ${path.relative(repoRoot, shotDir)}`)
    }
  } finally {
    await browser.close()
  }

  const { size } = statSync(OUT_PATH)
  const kb = size / 1024
  console.log('\n[lead-magnet] ✅ PDF erzeugt')
  console.log(`   Pfad:   ${path.relative(repoRoot, OUT_PATH)}`)
  console.log(`   Größe:  ${kb < 1024 ? kb.toFixed(1) + ' KB' : (kb / 1024).toFixed(2) + ' MB'}`)
  console.log(`   Seiten: ${data.totalPages} (Ziel: 8)`)
  if (kb / 1024 > 2) console.warn('   ⚠ über 2 MB – ggf. Logo/QR weiter komprimieren.')
}

main().catch((err) => {
  console.error('[lead-magnet] Fehlgeschlagen:', err)
  process.exit(1)
})
