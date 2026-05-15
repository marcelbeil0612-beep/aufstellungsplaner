# Aufstellungsplaner · Offene Themen

Stand: 2026-05-15. Wenn du in einer neuen Session ankommst, ist das hier der
Startpunkt für „was war nochmal offen?".

## Systembuch-Verifizierung

Hintergrund: Die Duelle im Systembuch werden aktuell durch externe KIs erzeugt
und von Claude eingepflegt. Strukturell sauber, inhaltlich aber unverifiziert.
Drei Tools, die das ändern – nach Aufwand sortiert:

### A. Konsistenz-Check als npm-Skript (klein, sofort nützlich)

`npm run verify-duels` soll automatisch flaggen:

- **Spiegel-Konflikt:** „A vs B = vorteilhaft" UND „B vs A = vorteilhaft" – eines
  davon ist wahrscheinlich falsch (Trainer-Logik: aus zwei Perspektiven sieht
  derselbe Vorteil typischerweise umgekehrt aus).
- **Selbst-Duell-Anomalie:** Spiegel-Duell (z. B. 4-3-3 vs 4-3-3), das nicht
  `ausgeglichen` ist – verdächtig.
- **Bias-Cluster:** wenn alle Duelle eines Systems dasselbe Rating haben
  (z. B. 4-4-2-Raute = alles vorteilhaft) → KI ist zu wohlwollend.
- **Schema-Drift:** Felder mit < 2 oder > 5 Items (außerhalb der Stilvorgabe
  im Prompt), leere Strings, doppelte Items, doppelte IDs über alle Entries.
- **Coverage-Report:** „X / 81 erfasst", Liste der offenen Duelle (ersetzt
  manuelle Pflege in `missing-duels.md`).

Skript läuft als pure Datenfunktion über `tacticBook`-Array. Ausgabe in
Konsole, Exit-Code != 0 bei kritischen Verstößen (für CI-Hook später).

### B. Verifizierungs-Prompt für externe KI (klein, manueller Workflow)

Gegenstück zum Generierungs-Prompt: Eingabe = bestehender Eintrag (JSON oder
TS), KI soll als kritischer zweiter Trainer reviewen:

- Stimmt das Rating mit der Realität überein?
- Welche Punkte fehlen oder sind oberflächlich?
- Wo widerspricht sich der Eintrag intern (z. B. „vorteilhaft" aber alle
  liveCoaching-Sätze sind defensiv)?
- Output: kurze Markdown-Bewertung mit konkreten Änderungsvorschlägen.

Landet als Prompt-C in `docs/missing-duels.md`.

### D. Edit-Modus für Duell-Einträge im UI (größer, eigenes Feature)

Trainer liest am iPad einen Eintrag und will direkt korrigieren („nein, das
Live-Coaching passt nicht"). Heute sind die Einträge code-only.

Implikation: Inhalte werden vom Code in den persistierten Store verlagert
(ähnlich `playerListIsUserManaged`-Pattern). Default = Code-Inhalt, sobald
editiert → User-Override. Migration v8 → v9 nötig.

UI: In `DuelDetail.tsx` pro Section ein ✎-Icon, das die Liste in editierbare
Inputs umschaltet. Save back into store. Reset-Knopf, der zurück auf
Code-Default fällt.

Aufwand: vergleichbar mit Spieler-CRUD-Feature.

---

## Anderer Backlog (vom 2026-05-14 Code-Review)

### Mehrere Teams / Kader-Workspaces

State-Refactor: pro Team eigener `players[]`, `savedLineups[]`,
`substitutions`, `matches`. Top-Level: `teams[]` + `activeTeamId`. Switching
zwischen U13 und U15 als App-Use-Case.

Migration v?→v?+1: bestehende Daten in einen Default-Team „Standard" wrappen.
Header bekommt Team-Picker. Invasiv, aber strukturell sauber – sollte BEVOR
weitere große Features kommen, sonst doppelte Migration.

### Auto-Aufstellung berücksichtigt Phase

Aktuell ignoriert `computeBestLineup` die `phase` (mit Ball / gegen Ball).
Idee: zwei Score-Berechnungen mit unterschiedlichen Gewichtungen, „beste
Aufstellung" wählt nach beiden Phasen kombiniert.

### Skill-Trends über Zeit

Skills bekommen Timestamps, ein Mini-Liniendiagramm in der RosterDialog-Zeile.
Zeigt Entwicklung über die Saison. Datenmodell wird zeitserien-fähig.

### Trainings-Modul im Systembuch

Die `TacticBookEntry`-Felder `trainingForms` und `typicalProblems` sind im
Type vorgesehen, in den Entries aber leer. Mit Inhalten füllen + UI-Switch
in `DuelDetail.tsx` (Ansicht „Training") nutzbar machen.

---

## Workflow zum Reaktivieren

In neuer Session:

1. Diese Datei aufschlagen (`cat docs/TODO.md`).
2. Item wählen, sagen „mach A" oder „Mehrere Teams angehen".
3. Claude weiß dann den Kontext und legt los.
