import { describe, expect, it } from 'vitest'
import { tacticBook } from './index'
import { phaseOrder, type DuelRating, type SystemId } from './types'

const SYSTEMS: SystemId[] = [
  '4-3-3',
  '4-2-3-1',
  '4-4-2',
  '4-4-2-raute',
  '3-5-2',
  '3-4-3',
  '5-3-2',
  '5-4-1',
  '4-1-4-1',
]

const RATINGS: DuelRating[] = ['vorteilhaft', 'ausgeglichen', 'unangenehm']

/** Soll-Bereiche je Säule laut types.ts. [min, max] */
const PILLAR_RANGE: Record<string, [number, number]> = {
  spaces: [2, 5],
  advantages: [2, 4],
  dangers: [2, 4],
  keyActions: [3, 5],
}

const key = (a: string, b: string) => `${a}_vs_${b}`

const byId = new Map(tacticBook.map((e) => [e.id, e]))

describe('Systembuch-Audit · Struktur (Stufe 2)', () => {
  it('hat genau 81 Einträge, 9 pro System, keine Dubletten/Lücken', () => {
    const issues: string[] = []
    if (tacticBook.length !== 81) {
      issues.push(`Gesamtzahl ${tacticBook.length}, erwartet 81`)
    }
    const ids = new Set<string>()
    for (const e of tacticBook) {
      if (ids.has(e.id)) issues.push(`Doppelte id: ${e.id}`)
      ids.add(e.id)
      if (e.id !== key(e.ourSystem, e.opponentSystem)) {
        issues.push(`id "${e.id}" passt nicht zu ${e.ourSystem}/${e.opponentSystem}`)
      }
    }
    for (const our of SYSTEMS) {
      for (const opp of SYSTEMS) {
        if (!byId.has(key(our, opp))) issues.push(`Fehlt: ${key(our, opp)}`)
      }
      const n = tacticBook.filter((e) => e.ourSystem === our).length
      if (n !== 9) issues.push(`${our}: ${n} Einträge, erwartet 9`)
    }
    expect(issues, `\n${issues.join('\n')}\n`).toEqual([])
  })

  it('jeder Eintrag erfüllt Schema und Säulen-Mengen', () => {
    const issues: string[] = []
    for (const e of tacticBook) {
      if (!RATINGS.includes(e.rating)) {
        issues.push(`${e.id}: ungültiges rating "${e.rating}"`)
      }
      if (!e.character || e.character.trim().length < 40) {
        issues.push(`${e.id}: character zu kurz/leer (${e.character?.length ?? 0} Zeichen)`)
      }
      for (const phase of phaseOrder) {
        const p = e.phases?.[phase]
        if (!p) {
          issues.push(`${e.id}: Phase "${phase}" fehlt`)
          continue
        }
        for (const [pillar, [min, max]] of Object.entries(PILLAR_RANGE)) {
          const arr = (p as Record<string, string[]>)[pillar]
          if (!Array.isArray(arr)) {
            issues.push(`${e.id}/${phase}: Säule "${pillar}" fehlt`)
            continue
          }
          if (arr.length < min || arr.length > max) {
            issues.push(
              `${e.id}/${phase}/${pillar}: ${arr.length} Items (Soll ${min}-${max})`,
            )
          }
          const seen = new Set<string>()
          for (const item of arr) {
            const t = item.trim()
            if (t.length < 25) {
              issues.push(`${e.id}/${phase}/${pillar}: zu kurz/Platzhalter -> "${item}"`)
            }
            if (seen.has(t.toLowerCase())) {
              issues.push(`${e.id}/${phase}/${pillar}: Dublette -> "${item}"`)
            }
            seen.add(t.toLowerCase())
            if (/\b(todo|tbd|xxx|platzhalter|noch keine)\b/i.test(t)) {
              issues.push(`${e.id}/${phase}/${pillar}: Platzhalter-Text -> "${item}"`)
            }
          }
        }
      }
      if (e.liveCoaching.length < 1 || e.liveCoaching.length > 3) {
        issues.push(`${e.id}: liveCoaching ${e.liveCoaching.length} Items (Soll 1-3)`)
      }
      if (e.adjustments.length < 1) {
        issues.push(`${e.id}: adjustments leer`)
      }
    }
    expect(issues, `\n${issues.join('\n')}\n`).toEqual([])
  })
})

describe('Systembuch-Audit · Spiegel-Konsistenz (Stufe 1)', () => {
  // vorteilhaft <-> unangenehm, ausgeglichen <-> ausgeglichen
  const mirror = (r: DuelRating): DuelRating =>
    r === 'vorteilhaft' ? 'unangenehm' : r === 'unangenehm' ? 'vorteilhaft' : 'ausgeglichen'

  it('Spiegel-Duelle (A vs A) sind ausgeglichen', () => {
    const issues: string[] = []
    for (const s of SYSTEMS) {
      const e = byId.get(key(s, s))
      if (e && e.rating !== 'ausgeglichen') {
        issues.push(`${e.id}: rating "${e.rating}", erwartet "ausgeglichen" (Spiegelduell)`)
      }
    }
    expect(issues, `\n${issues.join('\n')}\n`).toEqual([])
  })

  it('keine harten Rating-Widersprüche zwischen A vs B und B vs A', () => {
    const hard: string[] = []
    const soft: string[] = []
    const done = new Set<string>()
    for (const a of SYSTEMS) {
      for (const b of SYSTEMS) {
        if (a === b) continue
        const pairKey = [a, b].sort().join('|')
        if (done.has(pairKey)) continue
        done.add(pairKey)
        const ab = byId.get(key(a, b))
        const ba = byId.get(key(b, a))
        if (!ab || !ba) continue
        const expected = mirror(ab.rating)
        if (ba.rating === expected) continue
        // Hart: beide behaupten Vorteil bzw. beide Nachteil -> echter Widerspruch
        if (
          (ab.rating === 'vorteilhaft' && ba.rating === 'vorteilhaft') ||
          (ab.rating === 'unangenehm' && ba.rating === 'unangenehm')
        ) {
          hard.push(
            `${ab.id}=${ab.rating}  <->  ${ba.id}=${ba.rating}  (beide behaupten dasselbe Vorzeichen)`,
          )
        } else {
          soft.push(
            `${ab.id}=${ab.rating}  <->  ${ba.id}=${ba.rating}  (erwartet ${ab.id}->${ba.id} = ${expected})`,
          )
        }
      }
    }
    if (soft.length) {
      // Asymmetrien, die taktisch vertretbar sein können -> nur Hinweis, kein Fail.
      console.warn(
        `\n[Audit] ${soft.length} weiche Rating-Asymmetrien (prüfen, kein harter Fehler):\n` +
          soft.join('\n') +
          '\n',
      )
    }
    expect(hard, `\n${hard.join('\n')}\n`).toEqual([])
  })
})

describe('Systembuch-Audit · Bias-Cluster + Coverage (Stufe 3)', () => {
  it('gibt Coverage-Report aus (ersetzt manuelle Pflege)', () => {
    const lines: string[] = []
    let total = 0
    for (const our of SYSTEMS) {
      const row = tacticBook.filter((e) => e.ourSystem === our)
      total += row.length
      lines.push(`  ${our.padEnd(12)} ${row.length}/9`)
    }
    console.warn(
      `\n[Audit] Coverage ${total}/81 erfasst:\n` + lines.join('\n') + '\n',
    )
    expect(total).toBe(81)
  })

  it('meldet Bias-Cluster (Reihe ohne unangenehm bzw. ohne vorteilhaft)', () => {
    // Eine Reihe sollte über ihre 9 Duelle eine plausible Mischung haben.
    // 0x unangenehm  -> System verliert nie  -> KI zu wohlwollend.
    // 0x vorteilhaft -> System gewinnt nie   -> KI zu streng.
    // Beratend (kein Fail): Rebalance ist menschliche Entscheidung (Q3a).
    const flags: string[] = []
    const table: string[] = []
    for (const our of SYSTEMS) {
      const row = tacticBook.filter((e) => e.ourSystem === our)
      const v = row.filter((e) => e.rating === 'vorteilhaft').length
      const a = row.filter((e) => e.rating === 'ausgeglichen').length
      const u = row.filter((e) => e.rating === 'unangenehm').length
      table.push(`  ${our.padEnd(12)} V:${v}  A:${a}  U:${u}`)
      if (u === 0) flags.push(`${our}: 0x unangenehm (verliert nie — zu wohlwollend?)`)
      if (v === 0) flags.push(`${our}: 0x vorteilhaft (gewinnt nie — zu streng?)`)
    }
    console.warn(
      `\n[Audit] Rating-Verteilung je Reihe:\n` +
        table.join('\n') +
        (flags.length
          ? `\n\n[Audit] ${flags.length} Bias-Cluster (beratend, kein Fehler — Q3a):\n` +
            flags.map((f) => '  ' + f).join('\n')
          : '\n\n[Audit] Keine Bias-Cluster.') +
        '\n',
    )
    expect(SYSTEMS.length).toBe(9)
  })
})
