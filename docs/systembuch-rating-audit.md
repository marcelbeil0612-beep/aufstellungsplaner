# Systembuch · Konsistenz-Audit der Duell-Ratings

Stand: 2026-05-17. Nach Abschluss der 4-Phasen-Migration (81/81 Duelle)
wurde die Ampel-Konsistenz (`rating`: vorteilhaft / ausgeglichen /
unangenehm) über alle Duelle hinweg geprüft.

## Methode

Da jedes der 81 Duelle einzeln (teils von verschiedenen KI-Läufen)
erzeugt wurde, ist das Hauptrisiko nicht „Taktik X ist falsch", sondern
**Inkonsistenz zwischen Duell `A vs B` und seinem Spiegel `B vs A`**.
Logische Forderung an ein Spiegel-Paar:

- `vorteilhaft` ⇔ `unangenehm`
- `ausgeglichen` ⇔ `ausgeglichen`
- Spiegelduell `A vs A` ⇒ immer `ausgeglichen`

Geprüft wird automatisiert durch
`src/data/tacticBook/tacticBook.audit.test.ts` (Teil der normalen
Test-Suite, `npm run test`). Der Test trennt bewusst:

- **Harte Widersprüche** – beide Seiten behaupten dasselbe Vorzeichen
  (beide `vorteilhaft` oder beide `unangenehm`). Logisch unmöglich →
  Test schlägt fehl.
- **Weiche Asymmetrien** – eine Seite hat ein klares Vorzeichen, die
  andere `ausgeglichen`. Taktisch teils vertretbar → nur Warnung,
  kein Fehler.

Zusätzlich prüft der Test die Struktur (Stufe 2): 81 Einträge, 9 pro
System, IDs, vollständige Phasen, Säulen-Mengen laut `types.ts`, keine
Platzhalter/Dubletten.

## Ergebnis Stufe 2 (Struktur)

Vollständig sauber. Keine Befunde.

## Ergebnis Stufe 1 (Spiegel-Konsistenz)

Initial: **4 harte Widersprüche**, **18–20 weiche Asymmetrien**.
Self-Mirror-Duelle (`A vs A`) alle korrekt `ausgeglichen`.

### Auflösung der 4 harten Widersprüche

Entscheidung jeweils inhaltlich aus den `character`-Texten und der
Phasen-Substanz beider Seiten abgeleitet, nicht nach Bauchgefühl.

| Paar | Vorher | Befund | Nachher | Begründung |
|---|---|---|---|---|
| `4-3-3 vs 3-4-3` ↔ `3-4-3 vs 4-3-3` | beide `unangenehm` | beide Texte beschreiben einen echten Vorteil **und** ein echtes Risiko: 4-3-3 hat zentrale Mittelfeld-Überzahl, 3-4-3 hat Front drei + Wingback-Breite. Kein struktureller Vorteil einer Seite. | beide `ausgeglichen` | Echtes Tradeoff-Duell; Stärke des einen ist die Exposition des anderen. |
| `4-2-3-1 vs 4-4-2-raute` ↔ `4-4-2-raute vs 4-2-3-1` | beide `vorteilhaft` | Klassisches Breite-gegen-Zentrum-Tradeoff: 4-2-3-1 hat Außenbreite gegen die enge Raute, die Raute hat zentrale Überzahl. Keine Seite klar überlegen. | beide `ausgeglichen` | Symmetrisches Tradeoff. |
| `4-4-2 vs 5-4-1` ↔ `5-4-1 vs 4-4-2` | beide `vorteilhaft` | Beide Texte beschreiben dieselbe Dynamik: 4-4-2 dominiert ballbesitzend (zwei Spitzen, Breite, nachrückende AV), 5-4-1 reagiert tief und braucht Anschluss an den isolierten Stürmer. | `4-4-2 vs 5-4-1` bleibt `vorteilhaft`, `5-4-1 vs 4-4-2` → `unangenehm` | Inhalt sagt klar: proaktive Seite (4-4-2) im Vorteil, reaktive Seite (5-4-1) im Nachteil. |
| `3-4-3 vs 5-3-2` ↔ `5-3-2 vs 3-4-3` | beide `unangenehm` | Kontrolle-gegen-Konter: 3-4-3 hat Ball/Territorium, muss aber den kompakten Block knacken und ist konteranfällig; 5-3-2 verteidigt stabil, wird aber breit auseinandergezogen. Beide mit echtem Problem. | beide `ausgeglichen` | Ausgeglichenes Kontroll-vs-Konter-Duell. |

Korrigierte Einträge (Rating + angeglichener `character`-Eingangssatz,
taktische Substanz unverändert): `our-4-3-3.ts`, `our-3-4-3.ts` (2×),
`our-4-2-3-1.ts`, `our-4-4-2-raute.ts`, `our-5-4-1.ts`, `our-5-3-2.ts`.

Nach den Korrekturen: **0 harte Widersprüche**, Audit-Test grün.

### 20 weiche Asymmetrien — aufgelöst

Ursache war ein **Generierungs-Drift**: zuletzt erzeugte Reihen
(3-5-2, 3-4-3, 5-3-2, 5-4-1, 4-1-4-1, 4-4-2-raute) wichen systematisch
auf `ausgeglichen` aus, während die früher/am Pilot geankerten Reihen
(4-3-3, 4-2-3-1, 4-4-2) scharfe Vorzeichen hatten.

Alle 20 Paare wurden inhaltlich einzeln aus beiden `character`-Texten
entschieden (kein Bauchgefühl). Dabei wurde ein konsistentes
Regelsystem abgeleitet und über alle Paare hinweg angewandt:

**R1 — Balldominante Struktur mit echter Breite vs. tiefer 5-4-1-Block:**
angreifende Seite `vorteilhaft`, 5-4-1 `unangenehm`. Gilt für 4-4-2,
4-2-3-1, 4-3-3, 3-4-3 (alle haben Flügel/Wingback-Breite).

**R2 — Enge Raute (4-4-2-raute):** gegen jedes Wingback-System
(3-5-2, 3-4-3, 5-3-2, 5-4-1) ist die Raute `unangenehm`, das
Wingback-System `vorteilhaft` (fehlende natürliche Breite der Raute);
gegen die *flache* 4-4-2 dagegen Raute `vorteilhaft` / 4-4-2
`unangenehm` (zentrale Überzahl ist dort lehrbuchmäßig entscheidend);
gegen Viererketten *mit* natürlicher Breite (4-3-3, 4-2-3-1, 4-1-4-1)
echtes Tradeoff → beide `ausgeglichen`.

**R3 — Zentrale Überzahl entscheidet:** 3-5-2 / 4-1-4-1 (drei zentrale
MF) gegen Doppelsechs-Systeme → Überzahl-Seite `vorteilhaft`,
Gegenseite `unangenehm`, sofern die Texte keine echte Gegenstärke
belegen.

**R4 — Kontrolle-gegen-Konter ohne klaren Vorteil** (z. B. Possession-
System vs. kompaktes 5-3-2; zwei Fünferketten gegeneinander): beide
`ausgeglichen`.

Entscheidungs-Übersicht (Referenzseite → Spiegel angepasst):

| Paar | Ergebnis | Regel |
|---|---|---|
| 4-3-3 ↔ 4-4-2-raute | beide `ausgeglichen` | R2 |
| 4-3-3 / 5-4-1 | 4-3-3 `vorteilhaft`, 5-4-1 `unangenehm` | R1 |
| 4-2-3-1 / 4-4-2 | 4-2-3-1 `vorteilhaft`, 4-4-2 `unangenehm` | R3 |
| 4-2-3-1 / 3-5-2 | 4-2-3-1 `unangenehm`, 3-5-2 `vorteilhaft` | R3 |
| 4-2-3-1 / 3-4-3 | 4-2-3-1 `unangenehm`, 3-4-3 `vorteilhaft` | R3 |
| 4-2-3-1 / 5-4-1 | 4-2-3-1 `vorteilhaft`, 5-4-1 `unangenehm` | R1 |
| 4-4-2 / 4-4-2-raute | raute `vorteilhaft`, 4-4-2 `unangenehm` | R2 |
| 4-4-2 ↔ 5-3-2 | beide `ausgeglichen` | R4 |
| 4-4-2 / 4-1-4-1 | 4-1-4-1 `vorteilhaft`, 4-4-2 `unangenehm` | R3 |
| 4-4-2-raute / 3-5-2 | raute `unangenehm`, 3-5-2 `vorteilhaft` | R2 |
| 4-4-2-raute / 3-4-3 | raute `unangenehm`, 3-4-3 `vorteilhaft` | R2 |
| 4-4-2-raute / 5-3-2 | raute `unangenehm`, 5-3-2 `vorteilhaft` | R2 |
| 4-4-2-raute / 5-4-1 | raute `unangenehm`, 5-4-1 `vorteilhaft` | R2 |
| 4-4-2-raute ↔ 4-1-4-1 | beide `ausgeglichen` | R2 |
| 3-5-2 / 3-4-3 | 3-5-2 `vorteilhaft`, 3-4-3 `unangenehm` | R3 |
| 3-5-2 / 4-1-4-1 | 3-5-2 `vorteilhaft`, 4-1-4-1 `unangenehm` | R3 |
| 3-4-3 / 5-4-1 | 3-4-3 `vorteilhaft`, 5-4-1 `unangenehm` | R1 |
| 3-4-3 / 4-1-4-1 | 3-4-3 `vorteilhaft`, 4-1-4-1 `unangenehm` | R3 |
| 5-3-2 ↔ 5-4-1 | beide `ausgeglichen` | R4 |
| 5-3-2 ↔ 4-1-4-1 | beide `ausgeglichen` | R4 |

21 Einträge geändert (Rating + angeglichener `character`-Text,
taktische Substanz erhalten). Danach: **0 harte Widersprüche, 0 weiche
Asymmetrien** — die komplette 81-Duell-Matrix ist spiegel-konsistent.

## Regressions-Guard

`tacticBook.audit.test.ts` läuft ab jetzt in jeder `npm run test`. Neue
oder geänderte Duelle, die Struktur oder Spiegel-Logik (harte Ebene)
verletzen, lassen die Suite fehlschlagen. Weiche Asymmetrien erscheinen
als `stderr`-Warnung mit vollständiger Liste.

## Reproduktion

```
npx vitest run src/data/tacticBook/tacticBook.audit.test.ts --reporter=verbose
```
