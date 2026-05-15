# Systembuch · Fehlende Duelle + Workflow

Stand: 2026-05-15 (zuletzt aktualisiert nach Einpflege 4-2-3-1 · 3 Duelle).
Basis: `src/data/tacticBook/entries/*.ts` und `src/data/tacticBook/systems.ts`.

## Workflow (so funktioniert das mit Claude im Aufstellungsplaner)

Da Claude (ich) nicht selbst mit einer anderen KI sprechen kann, läuft das so:

1. **Du** kopierst dir einen der beiden Prompts unten in deine Lieblings-KI (ChatGPT, Gemini, Claude.ai, …).
2. **Du** trägst im Feld `{{DUELLE}}` ein, was du brauchst (eine oder mehrere Paarungen).
3. **Du** kopierst die rohe Antwort der KI – egal ob JSON, TS-Objekt, Code-Block oder Fließtext – zurück in unseren Chat hier.
4. **Ich** parse die Antwort, lege/aktualisiere die richtige `entries/our-*.ts`-Datei an, registriere sie in `index.ts`, baue, committe, pushe.

Du brauchst dich **nicht** um Datei-Pfade, Imports oder Build-Schritte zu kümmern. Klatsch den Output rein, fertig.

---

## Übersicht

9 Systeme × 9 Gegner = **81 mögliche Duelle**. Aktuell erfasst: **66**. Offen: **15**.

Selbst-Duelle (z. B. 4-3-3 gegen 4-3-3) sind mitgezählt – Spiegelpartien gibt es im echten Trainerleben oft genug. Wenn du sie auslassen willst, sind es 72 mögliche und entsprechend **55 offene**.

### Matrix (Zeile = unser System, Spalte = Gegner)

|                | 4-3-3 | 4-2-3-1 | 4-4-2 | 4-4-2-raute | 3-5-2 | 3-4-3 | 5-3-2 | 5-4-1 | 4-1-4-1 |
|---             |:---:  |:---:    |:---:  |:---:        |:---:  |:---:  |:---:  |:---:  |:---:    |
| **4-3-3**      |  ✅   |  ✅     |  ✅   |  ✅         |  ✅   |  ✅   |  ✅   |  ✅   |  ✅     |
| **4-2-3-1**    |  ✅   |  ✅     |  ✅   |  ✅         |  ✅   |  ✅   |  ✅   |  ❌   |  ❌     |
| **4-4-2**      |  ✅   |  ❌     |  ❌   |  ❌         |  ❌   |  ✅   |  ❌   |  ❌   |  ❌     |
| **4-4-2-raute**|  ✅   |  ✅     |  ✅   |  ✅         |  ✅   |  ✅   |  ✅   |  ✅   |  ✅     |
| **3-5-2**      |  ✅   |  ✅     |  ✅   |  ❌         |  ❌   |  ❌   |  ❌   |  ❌   |  ❌     |
| **3-4-3**      |  ✅   |  ✅     |  ✅   |  ✅         |  ✅   |  ✅   |  ✅   |  ✅   |  ✅     |
| **5-3-2**      |  ✅   |  ✅     |  ✅   |  ✅         |  ✅   |  ✅   |  ✅   |  ✅   |  ✅     |
| **5-4-1**      |  ✅   |  ✅     |  ✅   |  ✅         |  ✅   |  ✅   |  ✅   |  ✅   |  ✅     |
| **4-1-4-1**    |  ✅   |  ✅     |  ✅   |  ✅         |  ✅   |  ✅   |  ✅   |  ✅   |  ✅     |

Komplett abgeschlossen: **4-3-3** 9/9, **4-4-2 (Raute)** 9/9, **3-4-3** 9/9, **4-1-4-1** 9/9, **5-3-2** 9/9, **5-4-1** 9/9. Keine komplett leere Reihe mehr – alle 9 Systeme haben mindestens einen Eintrag.

---

## Fehlende Duelle als Arbeitsliste

Hak ab, was du schon erledigt / mir geschickt hast.

### Unser System: 4-3-3 — 0 offen ✓

- [x] 4-3-3 vs 4-3-3
- [x] 4-3-3 vs 5-3-2
- [x] 4-3-3 vs 4-1-4-1

### Unser System: 4-2-3-1 — 2 offen

- [x] 4-2-3-1 vs 4-2-3-1
- [x] 4-2-3-1 vs 4-4-2-raute
- [x] 4-2-3-1 vs 3-4-3
- [ ] 4-2-3-1 vs 5-4-1
- [ ] 4-2-3-1 vs 4-1-4-1

### Unser System: 4-4-2 — 7 offen

- [ ] 4-4-2 vs 4-2-3-1
- [ ] 4-4-2 vs 4-4-2
- [ ] 4-4-2 vs 4-4-2-raute
- [ ] 4-4-2 vs 3-5-2
- [ ] 4-4-2 vs 5-3-2
- [ ] 4-4-2 vs 5-4-1
- [ ] 4-4-2 vs 4-1-4-1

### Unser System: 4-4-2 (Raute) — 0 offen ✓

- [x] 4-4-2-raute vs 4-3-3
- [x] 4-4-2-raute vs 4-2-3-1
- [x] 4-4-2-raute vs 4-4-2
- [x] 4-4-2-raute vs 4-4-2-raute
- [x] 4-4-2-raute vs 3-5-2
- [x] 4-4-2-raute vs 3-4-3
- [x] 4-4-2-raute vs 5-3-2
- [x] 4-4-2-raute vs 5-4-1
- [x] 4-4-2-raute vs 4-1-4-1

### Unser System: 3-5-2 — 6 offen

- [ ] 3-5-2 vs 4-4-2-raute
- [ ] 3-5-2 vs 3-5-2
- [ ] 3-5-2 vs 3-4-3
- [ ] 3-5-2 vs 5-3-2
- [ ] 3-5-2 vs 5-4-1
- [ ] 3-5-2 vs 4-1-4-1

### Unser System: 3-4-3 — 0 offen ✓

- [x] 3-4-3 vs 4-3-3
- [x] 3-4-3 vs 4-2-3-1
- [x] 3-4-3 vs 4-4-2
- [x] 3-4-3 vs 4-4-2-raute
- [x] 3-4-3 vs 3-5-2
- [x] 3-4-3 vs 3-4-3
- [x] 3-4-3 vs 5-3-2
- [x] 3-4-3 vs 5-4-1
- [x] 3-4-3 vs 4-1-4-1

### Unser System: 5-3-2 — 0 offen ✓

- [x] 5-3-2 vs 4-3-3
- [x] 5-3-2 vs 4-4-2
- [x] 5-3-2 vs 4-4-2-raute
- [x] 5-3-2 vs 3-5-2
- [x] 5-3-2 vs 3-4-3
- [x] 5-3-2 vs 5-3-2
- [x] 5-3-2 vs 5-4-1
- [x] 5-3-2 vs 4-1-4-1

### Unser System: 5-4-1 — 0 offen ✓

- [x] 5-4-1 vs 4-2-3-1
- [x] 5-4-1 vs 4-4-2
- [x] 5-4-1 vs 4-4-2-raute
- [x] 5-4-1 vs 3-5-2
- [x] 5-4-1 vs 3-4-3
- [x] 5-4-1 vs 5-3-2
- [x] 5-4-1 vs 5-4-1
- [x] 5-4-1 vs 4-1-4-1

### Unser System: 4-1-4-1 — 0 offen ✓

- [x] 4-1-4-1 vs 4-3-3
- [x] 4-1-4-1 vs 4-2-3-1
- [x] 4-1-4-1 vs 4-4-2
- [x] 4-1-4-1 vs 4-4-2-raute
- [x] 4-1-4-1 vs 3-5-2
- [x] 4-1-4-1 vs 3-4-3
- [x] 4-1-4-1 vs 5-3-2
- [x] 4-1-4-1 vs 5-4-1
- [x] 4-1-4-1 vs 4-1-4-1

---

## Prompt A — Batch-Modus (empfohlen)

Effizient: mehrere Duelle in einem Rutsch. Trag in `{{DUELLE}}` eine oder mehrere Paarungen ein – eine pro Zeile, im Format `Unser-System vs Gegner-System`. Beispiele:

```
4-4-2-raute vs 3-5-2
4-4-2-raute vs 4-3-3
3-4-3 vs 4-4-2
```

Dann diesen Block komplett kopieren und an die KI schicken:

````markdown
Du bist ein erfahrener Fußballtrainer und Taktikanalyst und hilfst mir, mein
Systembuch für den Spieltag zu erweitern. Ich brauche eine knappe, praxisnahe
Aufbereitung mehrerer System-Duelle – ausschließlich aus der Perspektive
**unseres** Systems (jeweils zuerst genannt).

## Duelle (eine Paarung pro Zeile)

{{DUELLE}}

## Liefer-Format (STRENG)

Antworte mit **genau einem JSON-Array**, das pro Duell ein Objekt im Schema unten
enthält. KEIN Markdown drumherum, KEIN Begleittext, KEINE Erklärungen vorher oder
hinterher. Nur das pure JSON. Wenn deine Antwort nicht mit `[` beginnt und mit `]`
endet, ist sie falsch.

```jsonc
[
  {
    "id": "<unser>_vs_<gegner>",                    // z. B. "4-4-2-raute_vs_3-5-2"
    "ourSystem": "<unser>",                         // exakt eine der erlaubten IDs (siehe unten)
    "opponentSystem": "<gegner>",                   // dito
    "rating": "vorteilhaft" | "ausgeglichen" | "unangenehm",
    "character": "<1–2 Sätze: Was prägt das Duell? Wo entscheidet es sich?>",
    "ourAdvantages":  ["…", "…"],   // 2–4 Items, jeweils 1 kurzer Satz
    "ourDangers":     ["…", "…"],   // 2–4 Items
    "importantZones": ["…", "…"],   // 2–4 Items – räumlich konkret
    "pressing":       ["…", "…"],   // 2–4 Items – Pressing-Zuordnung
    "inPossession":   ["…", "…"],   // 2–4 Items – wie überspielen wir den Block
    "transition":     ["…", "…"],   // 2–4 Items – nach Ballgewinn / -verlust
    "liveCoaching":   ["…", "…"],   // 2–4 Items – kurze Zurufe in Anführungszeichen, max. 4 Worte
    "adjustments":    ["…", "…"]    // 2–4 Items – Plan B während des Spiels
  }
  // weitere Duell-Objekte hier, getrennt durch Komma
]
```

## Erlaubte System-IDs (genau diese Schreibweise!)

`4-3-3`, `4-2-3-1`, `4-4-2`, `4-4-2-raute`, `3-5-2`, `3-4-3`, `5-3-2`, `5-4-1`, `4-1-4-1`

## Stilregeln

- **Knapp**: Trainer-Notizen, kein Lehrbuch. 1 Zeile pro Listenpunkt.
- **Konkret**: Räume, Spielerrollen, Aktionen – keine Phrasen wie „wir spielen unser Spiel".
- **Asymmetrisch denken**: aus unserer Perspektive – nicht „beide haben Vor- und Nachteile".
- **Live-Coaching**: Imperativ, in Anführungszeichen, max. 4 Worte.
  Beispiele: `"Zentrum besetzen!"`, `"Schnell verlagern!"`, `"Tiefer pressen!"`
- **Rating ehrlich**: nicht alles ist `ausgeglichen`. Strukturelle Probleme → `unangenehm`.
  Zentrale Überzahl → `vorteilhaft`.
- **Konsistenz**: pro Duell sollten Pressing, Ballbesitz und Transition zusammenpassen.
````

---

## Prompt B — Einzel-Modus (für Feinschliff)

Wenn du eine einzelne Paarung besonders gründlich behandelt haben willst, nimm
diesen Prompt. Identisches Schema wie oben, aber für **genau ein** Duell und mit
zusätzlich optionalen Feldern `trainingForms` und `typicalProblems`.

````markdown
Du bist ein erfahrener Fußballtrainer und Taktikanalyst. Erstelle eine knappe,
praxisnahe Analyse des folgenden System-Duells aus Perspektive **unseres** Systems.

## Duell

{{DUELL}}

(Format: "Unser-System vs Gegner-System", z. B. "4-4-2-raute vs 3-5-2".)

## Liefer-Format (STRENG)

Genau **ein JSON-Objekt**, kein Markdown drumherum, kein Begleittext.

```jsonc
{
  "id": "<unser>_vs_<gegner>",
  "ourSystem": "<unser>",
  "opponentSystem": "<gegner>",
  "rating": "vorteilhaft" | "ausgeglichen" | "unangenehm",
  "character": "<1–2 Sätze>",
  "ourAdvantages":  ["…"],
  "ourDangers":     ["…"],
  "importantZones": ["…"],
  "pressing":       ["…"],
  "inPossession":   ["…"],
  "transition":     ["…"],
  "liveCoaching":   ["…"],
  "adjustments":    ["…"],
  "trainingForms":  ["…"],          // OPTIONAL: 1–3 passende Trainingsformen
  "typicalProblems": [              // OPTIONAL: 1–3 typische Probleme + Lösung
    { "problem": "…", "solution": "…" }
  ]
}
```

## Erlaubte System-IDs

`4-3-3`, `4-2-3-1`, `4-4-2`, `4-4-2-raute`, `3-5-2`, `3-4-3`, `5-3-2`, `5-4-1`, `4-1-4-1`

## Stilregeln

(siehe Batch-Prompt – identisch)
````

---

## Wenn du die Antwort einpflegen willst

So formulierst du es im Chat zu mir:

> „Hier neue Duelle fürs Systembuch, bitte einpflegen:
>
> ```
> <hier den AI-Output reinklatschen – egal ob JSON-Array, einzelnes Objekt,
> mit oder ohne Code-Block, mit oder ohne Begleittext>
> ```"

Ich erkenne das Schema, mache die nötigen Code-Änderungen, builde, committe, pushe.
Falls einzelne Felder fehlen oder ein Rating fragwürdig wirkt, frag ich vorher nach.
