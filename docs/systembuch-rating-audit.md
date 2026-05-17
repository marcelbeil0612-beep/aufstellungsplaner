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

### Verbleibende 20 weiche Asymmetrien

Kein logischer Fehler, aber ein klares **systematisches Muster**: In
fast allen Fällen hat die *früher* und sorgfältiger erzeugte Reihe
(4-3-3, 4-2-3-1, 4-4-2) ein scharfes Vorzeichen, während die *zuletzt*
erzeugte Gegen-Reihe (3-5-2, 3-4-3, 5-3-2, 5-4-1, 4-1-4-1, 4-4-2-raute)
auf `ausgeglichen` ausweicht.

Beispiel: `4-2-3-1 vs 3-5-2 = unangenehm`, aber
`3-5-2 vs 4-2-3-1 = ausgeglichen` — wenn das 4-2-3-1 dieses Duell als
schwer einschätzt, müsste das 3-5-2 es spiegelbildlich als vorteilhaft
sehen, nicht als ausgeglichen.

**Interpretation:** Das ist ein Generierungs-Drift der späten Reihen
(Tendenz zu „ausgeglichen"), keine bewusste taktische Bewertung.

**Empfohlene Auflösungsregel (noch offen, nicht angewendet):** Pro
weichem Paar gilt die Seite mit dem schärferen Vorzeichen als Referenz
(in der Regel die früher erzeugte, am Pilot `4-3-3 vs 4-4-2` geankerte
Reihe); der `ausgeglichen`-Spiegel wird auf das inverse Vorzeichen
gesetzt — **es sei denn**, eine kurze Inhaltsprüfung zeigt, dass das
Duell wirklich ausgeglichen ist (dann wird stattdessen die scharfe
Seite auf `ausgeglichen` gezogen).

Diese ~20 Paare wurden bewusst **nicht** automatisch umgesetzt, weil
jede Entscheidung eine kurze inhaltliche Einzelprüfung braucht — genau
das, was bei den 4 harten Paaren gemacht wurde. Als gescopter
Folge-Schritt jederzeit nachholbar.

## Regressions-Guard

`tacticBook.audit.test.ts` läuft ab jetzt in jeder `npm run test`. Neue
oder geänderte Duelle, die Struktur oder Spiegel-Logik (harte Ebene)
verletzen, lassen die Suite fehlschlagen. Weiche Asymmetrien erscheinen
als `stderr`-Warnung mit vollständiger Liste.

## Reproduktion

```
npx vitest run src/data/tacticBook/tacticBook.audit.test.ts --reporter=verbose
```
