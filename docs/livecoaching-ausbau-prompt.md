# Q2-Content · Generierungs-Prompt: Live-Coaching auf 5–6 ausbauen

Zweck: das Feld `liveCoaching` jedes der 81 Duelle von aktuell 1–3 auf
**5–6 kurze Coaching-Zurufe** ausbauen — gleicher externer-KI-Workflow
wie die Systembuch-Migration (Codex/KI erzeugt pro Duell den Block, wird
hier eingepflegt, Audit + Build prüfen).

## Warum dieser Workflow

450+ trennscharfe, taktisch passende Touchline-Zurufe sind eine
Content-Aufgabe, keine mechanische Transformation. Sie werden — wie die
Migration — extern generiert und hier kontrolliert eingepflegt.

## Gate / Definition of Done

- Jeder der 81 Einträge hat `liveCoaching` mit **5 oder 6** Items.
- Erst danach wird im Audit-Test (`tacticBook.audit.test.ts`) die Spanne
  von `1–3` auf `5–6` umgestellt — solange das nicht für alle 81 gilt,
  bleibt sie auf 1–3, damit die Suite grün ist.
- `npm run verify-duels` + `npm run build` grün.

## Prompt für die externe KI

> Du erweiterst das Feld `liveCoaching` eines Fußball-System-Duells.
> Eingabe: ein bestehender Eintrag (character + phases mit den vier
> Phasen ownPossession/afterLoss/oppPossession/afterGain, je
> spaces/advantages/dangers/keyActions + bisheriges liveCoaching +
> adjustments).
>
> Aufgabe: Gib **genau 5 oder 6** kurze Coaching-Zurufe aus, wie sie ein
> Trainer vom Spielfeldrand ruft. Regeln:
> - Sehr kurz, je 2–5 Wörter, im Imperativ, in deutschen
>   Anführungszeichen „…!" (Stil exakt wie bestehende: `„Sechser
>   sichern!"`, `„Tempo nach außen!"`).
> - Inhaltlich aus genau diesem Duell abgeleitet — die Zurufe sind
>   Kondensate der wichtigsten `keyActions` über alle vier Phasen.
> - Trennscharf, keine Dubletten, keine Allgemeinplätze; jeder Zuruf
>   adressiert einen konkreten Hebel dieses Duells.
> - Begriffe konsistent mit dem Glossar:
>   **Schienenspieler** (nicht Wingback/Flügelverteidiger),
>   **flacher Rückpass** (nicht Rücklage),
>   **erster Ballkontakt** (nicht „erster Kontakt").
> - Nur das JS-Array ausgeben, z. B.:
>   `liveCoaching: ['„Sechser absichern!"', '„Tempo nach außen!"', …],`
> - Keine Imports, kein weiterer Text, kein Phasen-Inhalt.
>
> Nimm das nächste offene Duell aus der Reihenfolge
> 4-3-3 → 4-2-3-1 → 4-4-2 → 4-4-2-raute → 3-5-2 → 3-4-3 → 5-3-2 →
> 5-4-1 → 4-1-4-1 (je 9 Gegner-Systeme).

## Einpfleg-Workflow (wie Migration)

1. KI liefert pro Duell das `liveCoaching:`-Array.
2. Array im jeweiligen `src/data/tacticBook/entries/our-*.ts` ersetzen.
3. Nach jedem Batch `npm run verify-duels` (Audit bleibt grün, da
   Spanne noch 1–3; Schema/Spiegel/Bias unverändert).
4. Wenn alle 81 auf 5–6 sind: Audit-Spanne `1–3` → `5–6` in
   `tacticBook.audit.test.ts`, `npm run test` + `npm run build`,
   committen.
