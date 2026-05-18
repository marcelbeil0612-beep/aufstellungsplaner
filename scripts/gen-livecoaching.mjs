// Erzeugt livecoaching.map.json regelbasiert und nachvollziehbar:
// 4 System-Basis-Zurufe (wiederkehrende Hebel der eigenen Grundordnung
// über alle ihre Duelle, aus den keyActions abgeleitet) + 2–3 Gegner-
// Signatur-Zurufe (distinktiver Hebel gegen diese Form). 5–6 je Duell,
// dedupliziert. Spiegelduell (X vs X) nutzt einen eigenen Satz.
import { writeFileSync } from 'node:fs'

const SYSTEMS = ['4-3-3','4-2-3-1','4-4-2','4-4-2-raute','3-5-2','3-4-3','5-3-2','5-4-1','4-1-4-1']

// System-Basis: 4 Zurufe, gegründet auf den über alle Duelle dieser
// Grundordnung wiederkehrenden keyActions.
const base = {
  '4-3-3': ['„Sechser zeigt sich!"', '„Achter in den Halbraum!"', '„Flügel breit, dann Tempo!"', '„Restverteidigung sichern!"'],
  '4-2-3-1': ['„Sechser löst sich!"', '„Zehner zwischen die Linien!"', '„Flügel hält Breite!"', '„Ballfern absichern!"'],
  '4-4-2': ['„Spitzen versetzt staffeln!"', '„Zentrum eng halten!"', '„Zweite Bälle holen!"', '„Direkt vertikal!"'],
  '4-4-2-raute': ['„Zentrum überladen!"', '„Zehner zeigt sich!"', '„Spät die Breite suchen!"', '„Sechser sichert ab!"'],
  '3-5-2': ['„Ruhig aus der Dreierkette!"', '„Schienenspieler hoch!"', '„Achter in den Halbraum!"', '„Sechser sichert den Konter!"'],
  '3-4-3': ['„Front drei bindet!"', '„Hinter den Schienenspieler!"', '„Doppelsechs eng!"', '„Konter absichern!"'],
  '5-3-2': ['„Fünferkette kompakt!"', '„Zwei Spitzen als Konter!"', '„Mitte zustellen!"', '„Zweite Bälle sichern!"'],
  '5-4-1': ['„Tiefer Block kompakt!"', '„Stürmer Anschluss geben!"', '„Konter über außen!"', '„Rückraum gegen langen Ball!"'],
  '4-1-4-1': ['„Sechser absichern!"', '„Achter in den Halbraum!"', '„Außen die Breite nutzen!"', '„Zentrum überzahlen!"'],
}

// Gegner-Signatur: distinktiver Hebel gegen genau diese Form.
const sig = {
  '4-3-3': ['„Ihren Sechser zustellen!"', '„Flügel-Duelle gewinnen!"'],
  '4-2-3-1': ['„Zehnerraum zu!"', '„Doppelsechs binden!"'],
  '4-4-2': ['„Flügel hinterlaufen!"', '„Zweite Bälle erobern!"'],
  '4-4-2-raute': ['„Raus auf außen!"', '„Zehner nicht drehen lassen!"'],
  '3-5-2': ['„Hinter den Schienenspieler!"', '„Zentrum eng halten!"'],
  '3-4-3': ['„Halbraum dicht!"', '„Diagonal absichern!"'],
  '5-3-2': ['„Nicht blind flanken!"', '„Rückraum besetzen!"', '„Spitzen blocken!"'],
  '5-4-1': ['„Geduldig verlagern!"', '„Zielspieler zustellen!"', '„Rückraum besetzen!"'],
  '4-1-4-1': ['„Ihren Sechser binden!"', '„Tempo über außen!"'],
}

// Spiegelduell X vs X: Grundordnung identisch → über Details entschieden.
const mirrorSig = ['„Abstände eng halten!"', '„Erste Aktion sauber!"', '„Zweite Bälle entscheiden!"']

const map = {}
for (const our of SYSTEMS) {
  for (const opp of SYSTEMS) {
    const sigSet = our === opp ? mirrorSig : sig[opp]
    const seen = new Set()
    const cues = []
    for (const c of [...base[our], ...sigSet]) {
      if (seen.has(c)) continue
      seen.add(c)
      cues.push(c)
      if (cues.length === 6) break
    }
    if (cues.length < 5) throw new Error(`${our}_vs_${opp}: nur ${cues.length} Zurufe`)
    map[`${our}_vs_${opp}`] = cues
  }
}

writeFileSync('livecoaching.map.json', JSON.stringify(map, null, 1))
console.log(`Map erzeugt: ${Object.keys(map).length} Duelle`)
const lens = Object.values(map).map((a) => a.length)
console.log(`Zuruf-Anzahl min/max: ${Math.min(...lens)}/${Math.max(...lens)}`)
