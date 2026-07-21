import { describe, expect, it } from 'vitest'
import type { Player } from '../types'
import { buildShareHash, matchShareToRoster, parseShareHash } from './shareUrl'

const roster: Player[] = [
  { id: 'p1', name: 'Marcel', role: 'FIELD' },
  { id: 'p2', name: 'Tijan',  role: 'GK' },
  { id: 'p3', name: 'Erik',   role: 'FIELD' },
]

describe('shareUrl', () => {
  it('encodiert + decodiert verlustfrei (Roundtrip)', () => {
    const hash = buildShareHash({
      formationId: '4-3-3',
      assignments: { gk: 'p2', cb1: 'p1', lw: 'p3' },
      substitutions: [
        { id: 'x', minute: 60, outPlayerId: 'p1', inPlayerId: 'p3', note: 'für 6er' },
      ],
      players: roster,
      title: 'Saisonstart',
    })
    const payload = parseShareHash(hash)
    expect(payload).not.toBeNull()
    expect(payload!.f).toBe('4-3-3')
    expect(payload!.a).toContainEqual(['gk', 'Tijan'])
    expect(payload!.a).toContainEqual(['cb1', 'Marcel'])
    expect(payload!.t).toBe('Saisonstart')
    expect(payload!.s?.[0]).toMatchObject({ m: 60, o: 'Marcel', i: 'Erik', n: 'für 6er' })
  })

  it('gibt für ungültige Hashes null zurück', () => {
    expect(parseShareHash('')).toBeNull()
    expect(parseShareHash('#nonsense')).toBeNull()
    expect(parseShareHash('#share=!!!')).toBeNull()
  })

  it('nimmt die Ersatzbank positionstreu mit', () => {
    const hash = buildShareHash({
      formationId: '4-3-3',
      assignments: { gk: 'p2' },
      substitutions: [],
      bench: ['p1', null, null, 'p3', null, null, null],
      players: roster,
    })
    const payload = parseShareHash(hash)!
    expect(payload.b).toEqual(['Marcel', null, null, 'Erik', null, null, null])

    const match = matchShareToRoster(payload, roster)
    expect(match.bench).toEqual(['p1', null, null, 'p3', null, null, null])
  })

  it('lässt das Bank-Feld weg, wenn niemand nominiert ist', () => {
    const hash = buildShareHash({
      formationId: '4-3-3',
      assignments: { gk: 'p2' },
      substitutions: [],
      bench: [null, null, null, null, null, null, null],
      players: roster,
    })
    expect(parseShareHash(hash)!.b).toBeUndefined()
  })

  it('alte Links ohne Bank-Feld ergeben eine leere Bank statt eines Fehlers', () => {
    const legacy = buildShareHash({
      formationId: '4-3-3',
      assignments: { gk: 'p2' },
      substitutions: [],
      players: roster,
    })
    const match = matchShareToRoster(parseShareHash(legacy)!, roster)
    expect(match.bench).toEqual([])
  })

  it('ein Bankspieler, den der Empfänger nicht kennt, wird als fehlend gemeldet', () => {
    const hash = buildShareHash({
      formationId: '4-3-3',
      assignments: { gk: 'p2' },
      substitutions: [],
      bench: ['p3', null, null, null, null, null, null],
      players: roster,
    })
    const otherRoster: Player[] = [{ id: 'q2', name: 'Tijan', role: 'GK' }]
    const match = matchShareToRoster(parseShareHash(hash)!, otherRoster)
    expect(match.bench).toEqual([null, null, null, null, null, null, null])
    expect(match.missingPlayers).toContain('Erik')
  })

  it('matcht Spieler case-insensitive über Namen, listet Fehlende auf', () => {
    const hash = buildShareHash({
      formationId: '4-3-3',
      assignments: { cb1: 'p1', lw: 'p3' },
      substitutions: [],
      players: roster,
    })
    const payload = parseShareHash(hash)!
    // Anderer Empfänger-Kader: Erik fehlt komplett, "marcel" hat klein geschriebene Variante.
    const otherRoster: Player[] = [
      { id: 'q1', name: 'marcel', role: 'FIELD' },
      { id: 'q2', name: 'Lukas',  role: 'FIELD' },
    ]
    const match = matchShareToRoster(payload, otherRoster)
    expect(match.assignments).toEqual([['cb1', 'q1']])
    expect(match.missingPlayers).toEqual(['Erik'])
  })
})
