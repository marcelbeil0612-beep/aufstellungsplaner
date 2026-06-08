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
import { prepareWordmark } from './prepare-assets.mjs'

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
/** Generierungsmonat dynamisch (z.B. „Juni 2026"), nicht hartkodiert. */
const DATE_LABEL = new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })
const OUT_PATH = path.join(repoRoot, 'public', 'downloads', 'formaxi-systembuch-mini.pdf')

/** Max. Listenlänge pro Säule (Teaser-Kuratierung der vier Säulen). */
const MAX_ITEMS = 3

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
      // ALLE Live-Coaching-Zurufe rendern – nicht slicen (Layout erlaubt 2 Seiten).
      coaching: entry.liveCoaching,
      pitchSVG: renderPitchSVG(sel.our, sel.opp),
    }
  })
}

async function main() {
  console.log('[lead-magnet] Systembuch-Daten laden & validieren …')
  const duels = buildDuels()
  console.log(`[lead-magnet] ${duels.length} Duelle selektiert:`)
  for (const d of duels) console.log(`   • Duell ${d.index}: ${d.title} (${d.rating})`)

  // Transparente Wortmarke (nur „FormaXI"-Schriftzug, keine Kachel) erzeugen & einbetten
  const logoPath = await prepareWordmark({ silent: true }).catch((err) => {
    console.warn('[lead-magnet] Wortmarke fehlgeschlagen:', err?.message ?? err)
    return null
  })
  let logoDataUri: string | null = null
  if (logoPath && existsSync(logoPath)) {
    logoDataUri = `data:image/png;base64,${readFileSync(logoPath).toString('base64')}`
    console.log('[lead-magnet] Wortmarke eingebettet.')
  } else {
    console.warn('[lead-magnet] Keine Wortmarke gefunden – Text-Fallback.')
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

    // Footer als nativer Puppeteer-Footer im reservierten Seitenrand (bottom-Margin),
    // damit er den Body-Inhalt NIE überlappt. Links formaxi.de, rechts „Seite X von Y".
    const footerTemplate = `
      <div style="width:100%; box-sizing:border-box; padding:0 12mm;
                  font-family:'Inter','Segoe UI',sans-serif; font-size:8px; color:#64748b;
                  display:flex; justify-content:space-between; align-items:center;">
        <span>formaxi.de</span>
        <span>Seite <span class="pageNumber"></span> von <span class="totalPages"></span></span>
      </div>`

    await page.pdf({
      path: OUT_PATH,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: false,
      displayHeaderFooter: true,
      headerTemplate: '<div></div>', // kein Header
      footerTemplate,
      // bottom groß genug, dass der Footer-Streifen frei bleibt und Inhalt nie hineinläuft
      margin: { top: '12mm', right: '12mm', bottom: '18mm', left: '12mm' },
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
  // Tatsächliche physische Seitenzahl aus dem PDF zählen (Duelle dürfen 2 Seiten nutzen).
  const pdfBuf = readFileSync(OUT_PATH)
  const physicalPages = (pdfBuf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length
  console.log('\n[lead-magnet] ✅ PDF erzeugt')
  console.log(`   Pfad:   ${path.relative(repoRoot, OUT_PATH)}`)
  console.log(`   Größe:  ${kb < 1024 ? kb.toFixed(1) + ' KB' : (kb / 1024).toFixed(2) + ' MB'}`)
  console.log(`   Logische Blöcke: ${data.totalPages} (Cover + Story + ${duels.length} Duelle + Outro)`)
  console.log(`   Physische Seiten: ${physicalPages}`)
  if (kb / 1024 > 2) console.warn('   ⚠ über 2 MB – ggf. Logo/QR weiter komprimieren.')
}

main().catch((err) => {
  console.error('[lead-magnet] Fehlgeschlagen:', err)
  process.exit(1)
})
