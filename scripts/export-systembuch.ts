// Exportiert das komplette FormaXI-Systembuch als EIN lesbares Markdown-Dokument.
//   npm run export:systembuch
//
// Zweck: inhaltliche Beurteilung aller Duelle als mögliche Buch-/Premium-PDF-Basis.
// Single Source of Truth ist tacticBook[] aus der App — nichts wird hier dupliziert
// oder gekürzt. Schreibt nach exports/systembuch-vollstaendig.md.
//
// Entkoppelt vom App-Build: liegt unter scripts/ (nicht in tsconfig include),
// nutzt relative Imports (keine @/-Aliase) und wird nur über tsx ausgeführt.
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { tacticBook } from '../src/data/tacticBook/index'
import type {
  DuelRating,
  PhaseAnalysis,
  PhaseKey,
  SystemId,
  TacticBookEntry,
} from '../src/data/tacticBook/types'

const here = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(here, '..')
const outDir = path.join(repoRoot, 'exports')
const outFile = path.join(outDir, 'systembuch-vollstaendig.md')

// ── Rating → Ampel-Label ─────────────────────────────────────────────────────
// Der Typ verwendet 'unangenehm'; im Buch zeigen wir das neutralere 'nachteilig'.
const ampelLabel: Record<DuelRating, string> = {
  vorteilhaft: 'vorteilhaft',
  ausgeglichen: 'ausgeglichen',
  unangenehm: 'nachteilig',
}

// ── Phasen: Reihenfolge + Überschriften (laut Aufgabenstellung) ───────────────
const phaseHeadings: Array<{ key: PhaseKey; heading: string }> = [
  { key: 'ownPossession', heading: 'Eigener Ballbesitz' },
  { key: 'afterLoss', heading: 'Nach Ballverlust' },
  { key: 'oppPossession', heading: 'Gegner-Ballbesitz' },
  { key: 'afterGain', heading: 'Nach Balleroberung' },
]

// Die vier inhaltlichen Säulen je Phase, mit Anzeige-Label.
const pillars: Array<{ key: keyof PhaseAnalysis; label: string }> = [
  { key: 'spaces', label: 'Räume' },
  { key: 'advantages', label: 'Vorteile' },
  { key: 'dangers', label: 'Gefahren' },
  { key: 'keyActions', label: 'Schlüsselaktionen' },
]

// ── Helfer ────────────────────────────────────────────────────────────────────
/** Normiert ein Feld (string | string[] | leer) zu einer Liste von Items. */
function toItems(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim()).filter((v) => v.length > 0)
  }
  if (typeof value === 'string') {
    const s = value.trim()
    return s.length > 0 ? [s] : []
  }
  return []
}

/** Rendert ein Feld als Bullet-Liste; leere Felder als "—". */
function bullets(value: unknown): string {
  const items = toItems(value)
  if (items.length === 0) return '—'
  return items.map((i) => `- ${i}`).join('\n')
}

/** Zählt Wörter über alle übergebenen Datenwerte (nur Inhalt, keine Labels). */
function countWords(...values: unknown[]): number {
  let n = 0
  for (const v of values) {
    for (const item of toItems(v)) {
      const words = item.split(/\s+/).filter((w) => w.length > 0)
      n += words.length
    }
  }
  return n
}

/** Sammelt alle reinen Datenwerte eines Eintrags für die Wortzählung. */
function entryDataValues(e: TacticBookEntry): unknown[] {
  const vals: unknown[] = [e.character]
  for (const { key } of phaseHeadings) {
    const phase = e.phases[key]
    for (const { key: pk } of pillars) {
      vals.push(phase[pk])
    }
  }
  vals.push(e.liveCoaching, e.adjustments)
  return vals
}

// ── Gruppierung nach ourSystem in Erst-Auftreten-Reihenfolge ──────────────────
const chapters: Array<{ system: SystemId; entries: TacticBookEntry[] }> = []
const chapterIndex = new Map<SystemId, number>()
for (const entry of tacticBook) {
  let idx = chapterIndex.get(entry.ourSystem)
  if (idx === undefined) {
    idx = chapters.length
    chapterIndex.set(entry.ourSystem, idx)
    chapters.push({ system: entry.ourSystem, entries: [] })
  }
  chapters[idx].entries.push(entry)
}

// ── Markdown bauen ────────────────────────────────────────────────────────────
const dateDE = new Date().toLocaleDateString('de-DE', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

const duelCount = tacticBook.length
const systemCount = chapters.length

const lines: string[] = []
lines.push('# Das FormaXI-Systembuch — Vollständiger Inhalt')
lines.push('')
lines.push(`> ${duelCount} Duelle · ${systemCount} Systeme · generiert am ${dateDE}`)
lines.push('')

let totalWords = 0

for (const chapter of chapters) {
  lines.push(`## Kapitel: Wenn wir ${chapter.system} spielen`)
  lines.push('')

  chapter.entries.forEach((entry, i) => {
    lines.push(
      `### ${entry.ourSystem} gegen ${entry.opponentSystem}   [Ampel: ${ampelLabel[entry.rating]}]`,
    )
    lines.push('')
    lines.push(`*Spielcharakter:* ${entry.character || '—'}`)
    lines.push('')

    for (const { key, heading } of phaseHeadings) {
      const phase = entry.phases[key]
      lines.push(`**${heading}**`)
      lines.push('')
      for (const { key: pk, label } of pillars) {
        lines.push(`*${label}*`)
        lines.push(bullets(phase[pk]))
        lines.push('')
      }
    }

    lines.push('**Live-Coaching-Zurufe**')
    lines.push(bullets(entry.liveCoaching))
    lines.push('')

    lines.push('**Mögliche Anpassungen**')
    lines.push(bullets(entry.adjustments))
    lines.push('')

    totalWords += countWords(...entryDataValues(entry))

    // Trenner zwischen den Duellen (nicht nach dem letzten im Kapitel)
    if (i < chapter.entries.length - 1) {
      lines.push('---')
      lines.push('')
    }
  })
}

// ── Umfang-Statistik ──────────────────────────────────────────────────────────
const avgWords = duelCount > 0 ? Math.round(totalWords / duelCount) : 0
lines.push('## Umfang-Statistik')
lines.push('')
lines.push(`- Duelle gesamt: ${duelCount}`)
lines.push(`- Inhalts-Wörter gesamt (nur Datenwerte, ohne Überschriften/Labels): ${totalWords}`)
lines.push(`- Durchschnitt pro Duell: ${avgWords}`)
lines.push('')

// ── Schreiben ─────────────────────────────────────────────────────────────────
mkdirSync(outDir, { recursive: true })
writeFileSync(outFile, lines.join('\n'), 'utf8')

// ── Konsolen-Bericht ──────────────────────────────────────────────────────────
const relOut = path.relative(repoRoot, outFile)
console.log('Systembuch exportiert.')
console.log(`  Ausgabepfad:        ${relOut}`)
console.log(`  Duelle:             ${duelCount}`)
console.log(`  Systeme (Kapitel):  ${systemCount}`)
console.log(`  Wörter gesamt:      ${totalWords}`)
console.log(`  Ø Wörter / Duell:   ${avgWords}`)
