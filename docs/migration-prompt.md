# Systembuch-Migration: 4-Phasen-Modell

> **Status: ABGESCHLOSSEN / ARCHIVIERT (Stand 2026-05-18).** Alle 81
> Duelle sind migriert, auditiert und rebalanciert. Dieses Dokument
> bleibt als Provenienz/Vorlage erhalten (Generierungs-Workflow).
> Aktueller Gesamtstand: `docs/projekt-ist-soll.md`.

Stand: 2026-05-15. Migration der 81 bestehenden Duelle vom alten Sammel-Schema
ins neue **Vier-Phasen-Modell** (klassische Trainerausbildungs-Logik).

## Workflow

1. Du nimmst **einen bestehenden Eintrag** aus `src/data/tacticBook/entries/our-*.ts`
2. Kopierst ihn ins Prompt-Feld der externen KI
3. Schickst den Prompt ab
4. Klatschst das Ergebnis zu mir in den Chat — ich pflege es ein

**Pilot-Eintrag (bereits manuell migriert) zum Vergleich:**
`4-3-3 vs 4-4-2` in `our-4-3-3.ts`. Schau dir den an, bevor du anfängst — das
ist das Qualitäts-Niveau, das wir treffen wollen.

---

## Der Prompt (kopierbar)

````markdown
Du bist ein erfahrener Fußballtrainer mit B-/A-Lizenz-Niveau und Taktikanalyst.
Du migrierst einen bestehenden Systembuch-Eintrag ins NEUE 4-Phasen-Modell.

# Aufgabe

Schreibe den unten gegebenen Eintrag im neuen Schema neu. **Alle Informationen
des alten Eintrags müssen erhalten bleiben**, aber sie werden inhaltlich
durchdacht und reicher pro Spielphase ausgearbeitet.

# Das 4-Phasen-Modell

Das klassische Trainerausbildungs-Modell unterteilt das Spiel in 4 Phasen, die
im Kreislauf ineinander übergehen:

1. **ownPossession** (① Eigener Ballbesitz)
   - Wir haben den Ball, Gegner ist defensiv organisiert
   - Themen: Aufbau, Ballzirkulation, Räume bespielen, Tiefe schaffen

2. **afterLoss** (② Umschalten nach Ballverlust)
   - Wir haben den Ball gerade verloren, beide Teams sind ungeordnet
   - Themen: Gegenpressing, Restverteidigung, ersten Pass des Gegners blocken

3. **oppPossession** (③ Gegner Ballbesitz)
   - Gegner hat den Ball, wir sind defensiv organisiert
   - Themen: Pressing-Höhe und -Zuordnung, Räume verteidigen, Mannorientierung

4. **afterGain** (④ Umschalten nach Ballgewinn)
   - Wir haben den Ball gerade gewonnen, Gegner ist ungeordnet
   - Themen: erster Pass, Tiefe attackieren, Konter über schnelle Spieler

# Die 4 Säulen pro Phase

Pro Phase produzierst du vier inhaltliche Listen:

- **spaces** (🗺 Räume / Engpässe, 2–5 Items)
  *Wo entsteht Platz für uns oder für den Gegner? Wo wird es eng?*
  Räumlich präzise denken: Halbraum, Zwischenraum, Außenbahn, Sechserraum,
  Rückraum, Strafraumkante. Jeder Punkt beschreibt eine **konkrete Zone** und
  ihre Bedeutung in dieser Phase.

- **advantages** (✅ Unsere Vorteile in dieser Phase, 2–4 Items)
  *Was uns IN DIESER konkreten Phase strukturell gelingt.*
  Phasen-spezifisch — generische Vorteile wie „wir sind taktisch flexibel"
  sind verboten. Jeder Punkt beschreibt einen **konkreten taktischen Vorteil**
  aufgrund der System-Konstellation.

- **dangers** (⚠ Unsere Gefahren in dieser Phase, 2–4 Items)
  *Was uns IN DIESER konkreten Phase strukturell weh tun kann.*
  Genauso phasen-spezifisch. Beispiel: Eine Gefahr in ownPossession
  (z. B. „Ihre zwei Spitzen können unseren Aufbau anlaufen") ist eine
  ANDERE als eine Gefahr in afterLoss (z. B. „Ihre Spitzen können
  den langen Ball direkt ausspielen").

- **keyActions** (🎯 Konkrete Spieler-Aktionen, 3–5 Items)
  *Was die Spieler konkret tun. Pressing-Zuordnungen, Anspielwinkel,
  Laufwege, Sicherungs-Verhalten.*
  Rollen-spezifisch: „Ballnaher Achter springt auf …", „Außenverteidiger
  rückt nur mit Absicherung heraus", „Sechser bleibt zentral".
  Imperativ ist erlaubt, aber bitte als Anweisungs-Satz formuliert,
  nicht als Lehrbuch-Definition.

# Zusätzlich (außerhalb der 4 Phasen)

- **character**: 1–2 Sätze zur Gesamtcharakteristik des Duells. Schlüsselraum +
  Schlüsselrisiko in einem Satz benennen.

- **rating**: `vorteilhaft` | `ausgeglichen` | `unangenehm` — ehrlich vergeben.
  Spiegel-Duelle (gleiches System gegen gleiches System) sind normalerweise
  `ausgeglichen`. Wenn ein System uns strukturell weh tut → `unangenehm`.

- **liveCoaching**: 1–3 wichtigste Zurufe für DIESES Duell. Imperativ, kurz,
  in Anführungszeichen. Beispiele: „Sechser sichern!", „Breite halten!".

- **adjustments**: 3–5 mögliche Ingame-Anpassungen, wenn das Duell kippt.
  Konkret und umsetzbar.

# Die 6 wichtigsten Regeln

1. **Konstellation explizit denken.** Die Antwort für „4-3-3 vs. 3-5-2" muss
   anders ausfallen als „4-3-3 vs. 4-2-3-1", weil die räumlichen Auswirkungen
   anders sind. Strukturasymmetrien explizit ausnutzen.

2. **Phasen wirklich unterschiedlich behandeln.** Verbot: „dasselbe noch mal
   umformuliert in jede Phase werfen". Jede Phase hat eigene Räume, Vorteile,
   Gefahren, Aktionen.

3. **Räume mit Bezug zur Feldgeometrie.** Halbraum, Zwischenraum, Außenbahn,
   Sechserraum, Rückraum, Strafraumkante — nicht abstrakte „Übergangszonen".

4. **Vorteile/Gefahren strikt phasen-bezogen.** Was uns IN DIESER konkreten
   Phase gerade gelingt oder droht, nicht generisch.

5. **Aktionen müssen umsetzbar sein.** Konkrete Spieler-/Rollen-Benennung,
   nicht „Pressing intensivieren".

6. **Alte Inhalte als Faktencheck.** Du darfst nichts erfinden, was dem
   bisherigen Wissensstand des alten Eintrags widerspricht. Du darfst aber
   ergänzen, was im alten Schema nicht erfasst war (besonders in `spaces` und
   `keyActions`).

# Liefer-Format

Antworte mit **genau einem TypeScript-Objekt**, das direkt in
`src/data/tacticBook/entries/our-*.ts` als Eintrag einfügbar ist.

Schema:

```ts
{
  id: '<unverändert vom alten Eintrag>',
  ourSystem: '<unverändert>',
  opponentSystem: '<unverändert>',
  rating: 'vorteilhaft' | 'ausgeglichen' | 'unangenehm',
  character: '<1–2 Sätze>',
  phases: {
    ownPossession: {
      spaces: ['…', '…'],         // 2–5 Items
      advantages: ['…', '…'],     // 2–4 Items
      dangers: ['…', '…'],        // 2–4 Items
      keyActions: ['…', '…'],     // 3–5 Items
    },
    afterLoss: {
      spaces: ['…'],
      advantages: ['…'],
      dangers: ['…'],
      keyActions: ['…'],
    },
    oppPossession: {
      spaces: ['…'],
      advantages: ['…'],
      dangers: ['…'],
      keyActions: ['…'],
    },
    afterGain: {
      spaces: ['…'],
      advantages: ['…'],
      dangers: ['…'],
      keyActions: ['…'],
    },
  },
  liveCoaching: ['„…!"', '„…!"'],   // 1–3 Items
  adjustments: ['…', '…'],          // 3–5 Items
  // Die folgenden Legacy-Felder NICHT mit ausgeben, sie werden vom
  // Claude-Integrator beim Einpflegen aus dem alten Eintrag uebernommen
  // bzw. spaeter komplett entfernt.
}
```

**Wichtig:** Keine Markdown-Formatierung im Output. Reines TS-Objekt. Kein
Begleittext davor oder dahinter. Wenn deine Antwort nicht mit `{` beginnt
und mit `}` endet, ist sie falsch.

# Erlaubte System-IDs

`4-3-3`, `4-2-3-1`, `4-4-2`, `4-4-2-raute`, `3-5-2`, `3-4-3`, `5-3-2`, `5-4-1`, `4-1-4-1`

# Stilregeln

- **Trainersprache** — keine Software-Begriffe, keine FIFA-Menü-Sprache
- **Konkret** statt allgemein — Räume mit Namen, Rollen mit Position
- **Asymmetrisch denken** aus unserer Perspektive
- **Live-Coaching kurz** (max. 4 Worte, in Anführungszeichen)
- **Konsistenz** zwischen den 4 Phasen — Räume die in einer Phase eng sind,
  können in einer anderen Phase offen sein, aber die Logik muss stimmen

# Eingabe

Hier ist der alte Eintrag, den du ins neue Schema migrierst:

```
{{ALTER_EINTRAG_HIER_EINFÜGEN}}
```
````

---

## Beispiel-Output (Pilot)

Damit du die Qualität siehst, die wir treffen wollen, ist das migrierte
`4-3-3 vs. 4-4-2`-Duell im Repo bereits als Referenz gepflegt:
[entries/our-4-3-3.ts](../src/data/tacticBook/entries/our-4-3-3.ts), erster Eintrag.

Schau dir vor allem an:
- Wie `spaces` in `ownPossession` (offensive Räume die wir bespielen) sich von
  `spaces` in `oppPossession` (defensive Räume die wir schließen) unterscheidet
- Wie `dangers` in `afterLoss` (Konter-Risiken) anders sind als `dangers` in
  `ownPossession` (Aufbau-Risiken)
- Wie `keyActions` konkrete Rollen benennen statt abstrakte Anweisungen

---

## Tipps für den Workflow

- **Pro Antwort eine Anfrage.** Pro Eintrag ~3.000–5.000 Tokens Output.
  Bei Claude/GPT eine einzelne Generation reicht.
- **Quality-Check vor dem Reinschicken.** Lies kurz drüber: Klingt es nach
  Trainersprache? Sind die Phasen wirklich unterschiedlich? Wenn die KI
  dasselbe nur 4× umformuliert hat → noch mal mit verbesserter Anweisung.
- **Wenn die KI zu trocken/lehrbuchhaft wird**: zusätzlicher Hinweis im
  Prompt — „Schreib so wie ein erfahrener B-Lizenz-Trainer am Spieltag in
  der Kabine spricht: knapp, konkret, mit eindeutigen Handlungsanweisungen."
- **Wenn die KI Inhalte erfindet, die nicht zum alten Eintrag passen**:
  zusätzlicher Hinweis — „Bleib eng am alten Inhalt. Du darfst ergänzen, aber
  nichts widersprechen."

## Reihenfolge der Migration (Empfehlung)

Klein anfangen, Vertrauen aufbauen, dann Volle Welle:

1. **Pilot bereits fertig:** `4-3-3 vs. 4-4-2` (manuell migriert von Claude)
2. **Erstes Selbst-Migrat:** `4-3-3 vs. 4-2-3-1` — wir vergleichen, ob die
   Qualität dem Pilot entspricht
3. **Wenn die Qualität passt:** restliche `4-3-3`-Reihe (7 Duelle)
4. **Danach reihenweise**, am besten in der Reihenfolge:
   `4-2-3-1` → `4-4-2` → `3-5-2` → `3-4-3` → `4-4-2-raute` → `4-1-4-1` → `5-3-2` → `5-4-1`

Insgesamt 81 − 1 (Pilot) = **80 Duelle** zu migrieren. Bei ~15–20 Minuten pro
Duell (inkl. Quality-Check) sind das **20–27 Stunden Arbeit** über mehrere
Wochen verteilt. Du musst das nicht in einem Rutsch durchziehen.
