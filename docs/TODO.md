# Aufstellungsplaner · Backlog (priorisiert)

Stand: 2026-05-15, **nach Markt-Synthese**. Wenn du in einer neuen
Session ankommst, ist das hier der Startpunkt für „was war nochmal
offen?".

Für die strategische Begründung der Reihenfolge siehe
[market-analysis/synthesis.md](./market-analysis/synthesis.md).
Monetarisierung ist beschlossene Ausrichtung.

---

## 🔴 Sofort: 14-Tage-Schnellstart (kein Vorab-Entscheid nötig)

### S1 · Marken-Check (1 h, kein Code)

Top-3-Marken-Kandidaten + 2 eigene Ideen prüfen:
- **DPMA Markenregister** (Deutschland) — register.dpma.de
- **EUIPO eSearch plus** (EU) — euipo.europa.eu
- **WIPO Global Brand Database** — branddb.wipo.int
- **Domains** (.com/.app/.io/.de) — namecheap.com oder porkbun.com
- **App-Store-Namenssuche** (Apple + Google Play)

Kandidaten zum Prüfen: **TactoXI**, **PitchLogic**, **Matchplan** + 2 eigene.

Output: Tabelle „verfügbar / kollidiert / fragwürdig" → Entscheidung.

### S2 · PNG-Branding-Footer (30 Min, Code)

In `src/lib/exportLineup.ts` einen dezenten Footer-Streifen unten im
PNG einfügen: „Erstellt mit [Markenname] · [URL]". Hellgrauer Text,
nicht aufdringlich.

Jeder geteilte PNG ist ab dann Werbung. **Vorbedingung:** Markenname
aus S1.

### S3 · Verifizierungs-Skript `npm run verify-duels` — ERLEDIGT (Commit a4c8d40)

`npm run verify-duels` läuft den Audit (`tacticBook.audit.test.ts`):
Schema + Spiegel-Konsistenz = harte Fails (Exit ≠ 0, CI-fähig),
Bias-Cluster + Coverage = beratende Konsolen-Ausgabe. `missing-duels.md`
gelöscht (Coverage jetzt scriptgestützt). E4-Verweis siehe unten.

Ursprüngliche Spezifikation (umgesetzt) — Pure Datenfunktion über
`tacticBook`-Array, flaggt:

- **Spiegel-Konflikt:** „A vs B = vorteilhaft" UND „B vs A = vorteilhaft" — eines davon ist wahrscheinlich falsch (Trainer-Logik: derselbe Vorteil sieht aus zwei Perspektiven typischerweise umgekehrt aus)
- **Selbst-Duell-Anomalie:** Spiegel-Duell (z. B. 4-3-3 vs. 4-3-3), das nicht `ausgeglichen` ist
- **Bias-Cluster:** alle Duelle eines Systems gleich gewertet → KI war zu wohlwollend
- **Schema-Drift:** Felder mit < 2 oder > 5 Items, leere Strings, doppelte IDs
- **Coverage-Report:** „X / 81 erfasst" (ersetzt manuelle Pflege in `missing-duels.md`)

Ausgabe Konsole, Exit-Code ≠ 0 bei kritischen Verstößen (CI-fähig).

### S4 · Onboarding-Polish (2 h, Code)

First-Run-Overlay mit 3-Schritte-Hinweis: „Kader anlegen → Aufstellung
bauen → Teilen". Einmalig anzeigen, in localStorage als gesehen
markieren.

Trainer sollen in 3 Minuten verstehen, was das Tool macht.

### S5 · Demo-Aufstellung als öffentlicher Share-Link (2 h, Code)

Statische Demo-Aufstellung mit fiktiven Spielernamen, die über einen
festen Share-Link aufrufbar ist. **Read-only-Ansicht** — kein Import
nötig.

Wofür: Trainer-Foren-Posts können den Demo-Link ohne Reibung verlinken
(„so sieht das aus"). Niemand muss erst installieren oder anmelden.

### S6 · Trainer-Befragung (3 h, kein Code)

5–10 Trainerkollegen befragen:
1. „Welcher Name?" (Top 3 zeigen)
2. „Was würdest du zahlen — €19/J · €25/J · €30 einmalig · gar nichts?"
3. „Was sollte gratis sein?"
4. „Systembuch — nutzbar oder zu komplex?"

Output: validierte Hypothesen statt KI-Empfehlungen.

---

## 🟡 Qualität & UX Systembuch (parallel zum Schnellstart möglich)

### Q1 · Formulierungs- & Terminologie-Vereinheitlichung (global, alle 81 Einträge)

Durchgängig klare, einheitliche deutsche Sprache statt Jargon/Anglizismen
über das **gesamte** `tacticBook` (alle `our-*.ts`, alle Phasen-Säulen +
character + liveCoaching + adjustments).

Bekannte Auffälligkeiten (nicht abschließend):
- **„Wingback"** → ein einheitlicher Begriff (Kandidat: „Schienenspieler";
  aktuell gemischt mit „Flügelverteidiger"/„Wingback"). Soll-Begriff
  vorab festlegen.
- `auf „Rücklagen" spielen` → verständliche Formulierung
  (z. B. „den Ball zurücklegen" / „kurzer Rückpass aus der Tiefe").
- `Flanken am ersten „Kontakt" klären` → Klartext
  (z. B. „Flanken direkt im ersten Zweikampf klären").

Vorgehen: zuerst **Glossar / Soll-Begriffsliste** definieren (DE-Begriff
je Konzept), dann skriptweit konsistent ersetzen. Audit-Test
(`tacticBook.audit.test.ts`) muss grün bleiben (Mindestlänge/keine
Platzhalter). Synergie mit S3: der verify-duels-Lint kann verbotene
Begriffe künftig automatisch flaggen (Forbidden-Term-Check ergänzen).

### Q2 · Reiter „Im Spiel" + Live-Coaching-Ausbau

**Q2-UI — ERLEDIGT (Commit 173e500):** `PhaseHighlighter` → `DuelTabs`.
Echter 5-Tab-Selektor; „Alles" entfernt; Tabs = die vier Phasen + neuer
Reiter **„Im Spiel"** am Ende mit den zwei Boxen Live-Coaching +
Mögliche Ingame-Anpassung. Boxen aus der Dauer-Oben-Position entfernt,
Default-Tab = erste Phase. tsc + build grün. (Tab-Label „Im Spiel"
gewählt statt „Coaching" gemäß früherer Vorgabe „der Block soll im
Spiel/Live heißen" + Q1-Deutsch-Prinzip; trivial änderbar.)

**Q2-Content — OFFEN (bewusst deferred mit Mechanismus):**
`liveCoaching` pro Duell von 1–3 auf **5–6** ausbauen, alle 81.
- Generierungs-Prompt + Einpfleg-Workflow + Gate liegen bereit in
  `docs/livecoaching-ausbau-prompt.md` (gleicher externer-KI-Workflow
  wie die Systembuch-Migration — 450+ trennscharfe Zurufe sind eine
  Content-Aufgabe, keine mechanische Transformation).
- **Gate:** Audit-Spanne bleibt auf **1–3**, bis ALLE 81 auf 5–6 sind;
  dann `tacticBook.audit.test.ts` Spanne `1–3` → `5–6`, Suite grün,
  committen.

### Q3 · Rating-Realismus (Bias-Cluster) + Systembuch-Vorwort/Erklärseite

**Befund (2026-05-18):** Die 3-5-2-Reihe ist 7× `vorteilhaft`, 2×
`ausgeglichen`, **0× `unangenehm`** — das 3-5-2 verliert kein einziges
Duell. Spiegel bestätigt: 7 Systeme bewerten sich `unangenehm` gegen
das 3-5-2. Das ist ein Bias-Cluster: das Modell bildet Lehrbuch-
Strukturvorteile ab, nicht Spielrealität (Ausführung, Spielerqualität,
Risiko der 3-5-2-Außenräume). Der Spiegel-Audit hat das mitverstärkt
(Regel R3 zog mehrere 3-5-2-Duelle auf `vorteilhaft`); er prüfte
Spiegel-Konsistenz, nie die Reihen-Balance.

- **Q3a · Bias-Rebalance — ERLEDIGT (Commit cd7041f):** S3-Bias-Check
  fand zwei Cluster (3-5-2: V7/A2/U0; 5-3-2: V2/A7/U0 — beide verlieren
  nie). 5 Spiegelpaare matrix-weit inhaltlich nachjustiert (u. a.
  3-5-2 jetzt `unangenehm` vs 4-2-3-1, `ausgeglichen` vs 5-4-1/4-1-4-1;
  5-3-2 `unangenehm` vs 4-3-3/3-4-3). Ergebnis: keine Bias-Cluster
  mehr, jede Reihe V≥1/U≥1, Spiegel-Konsistenz erhalten, Audit grün.
  4-4-2 bleibt bewusst negativ-lastig (V1/A2/U6 — strukturell die am
  stärksten exponierte flache Form, taktisch realistisch). Doku:
  `docs/systembuch-rating-audit.md`.
- **Q3b · Vorwort / Erklärseite — ERLEDIGT (Commit 6fb3a99):** Der
  Leerzustand des Systembuchs ist jetzt die Erklärseite („So liest du
  das Systembuch") — erklärt Ampel-Lesart (Konstellations-Tendenz bei
  sauberer Umsetzung, kein absolutes Ranking), Einsatz und Grenzen.
  Platzierung gelöst: dauerhaft als Standard-Inhalt, bis ein Duell
  gewählt ist (kein Overlay, null Risiko).

---

## 🟡 Nach Schnellstart: Pro-System (Monat 2)

### P1 · Marken-Rebrand (1 h Code + Design)

Logo, Favicon, App-Name in:
- `package.json` (name)
- `vite.config.ts` (PWA-Manifest-name)
- `index.html` (Titel + Meta)
- `public/manifest.webmanifest`
- Alle UI-Stellen mit dem alten Namen

**Vorbedingung:** Marken-Check (S1) abgeschlossen, Kandidat fix.

### P2 · Feature-Flag-Architektur (4 h)

- `useProStatus()`-Hook (liest aus Pro-State)
- `<FeatureGate feature="…">`-Komponente die Pro-Inhalte schützt
- `isPro` State im Zustand-Store

Pro-Features laut Synthese:
- Alle 81 Systembuch-Duelle (außer 3 Schaufenster)
- Phasen-Umschalter „Gegen Ball" (Mit-Ball bleibt frei)
- Hungarian-Auto-Aufstellung
- Wechselplan
- Multi-Team (2–5 Mannschaften)
- Share-Link-Import (Read-only frei, Import Pro)
- Backup-Import (Export bleibt frei)

### P3 · Paywall-UI (6 h)

Dialog „Mit Pro freischalten" für gesperrte Features. Trigger-Stellen:
- Klick auf „Gegen Ball"-Phase (frei: Mit Ball)
- Klick auf „Beste Aufstellung"
- Klick auf Wechselplan-Button
- Klick auf gesperrtes Systembuch-Duell
- Hover/Tap auf neuen Multi-Team-Picker

Dialog soll klar machen, was Pro umfasst, mit Preis (laut Synthese:
€24,90/J · €3,90/M · €49 Lifetime Early Supporter limitiert).

### P4 · Paddle-Integration (1–2 Tage)

- Paddle-Account anlegen
- Produkt + 3 Preisstufen (Jahr / Monat / Lifetime) konfigurieren
- Paddle Checkout-Overlay einbinden
- License-Key-Empfang per Mail (Paddle macht das)
- License-Key-Eingabefeld in der App
- Vercel-Endpoint `/api/validate-license`: HMAC-Validierung gegen Server-Secret
- License-Status persistent in IndexedDB, 90 Tage offline-gültig

Alternative falls Paddle nicht passt: LemonSqueezy (ähnliches Modell).

---

## 🟡 Nach DACH-Validierung: Skalierung (Monat 3–4)

### S1 · Multi-Team-Workspace (2–3 Tage)

State-Refactor: pro Team eigener `players[]`, `savedLineups[]`,
`substitutions`, `matches`. Top-Level: `teams[]` + `activeTeamId`.
Switching zwischen U13 und U15 als App-Use-Case.

Migration v8 → v9: bestehende Daten in einen Default-Team „Standard"
wrappen. Header bekommt Team-Picker.

**Wird Pro-Feature** (Free: 1 Team, Pro: bis zu 5).

### S2 · Vereinslizenz-Stub (1–2 Tage)

1 Lizenz = bis zu 5 Trainer-Profile auf demselben Gerät
(Multi-Profile-Switching, lokaler Trainer-Pool). Kein Server, kein
Cloud-Sync — bewusst pragmatisch.

Preis: €99/Jahr Pilot, €199/Jahr nach Validierung.

### S3 · i18n-Layer (1–2 Tage)

- `react-i18next` installieren
- Alle DE-Strings extrahieren in `locales/de.json`
- Komponenten auf `useTranslation()`-Hook umstellen

Vorbereitet für EN-Launch, aber Launch erst nach Reviewer-Recruiting.

### S4 · EN-UI-Übersetzung (4–6 h)

Maschinen-Erstübersetzung Claude/GPT → in `locales/en.json` → Eigen-
Review. Ein einsprachiger Sprachen-Switch im Header (DE/EN).

### S5 · EN-Systembuch (2 Wochen Wartezeit + €600–1.000)

- Reviewer rekrutieren (Trainertalk-EN, LinkedIn, /r/bootroom)
- Bezahlung: Pro-Lifetime + €200–400 Honorar
- 81 Duelle MT (Claude Sonnet) → Reviewer-Pass → Endredaktion

---

## 🟢 Später: Internationalisierung + Reichweite (Monat 6+)

### L1 · Capacitor-Wrapper für App-Store

Ab ~500 aktiven Nutzern lohnt sich:
- Apple Developer Account ($99/Jahr)
- Google Play Developer ($25 einmalig)
- Capacitor-Wrapper über die PWA
- App-Store-Listings mit ASO-optimierten Screenshots + Description
- App-Store-IAP statt Paddle (15 % / 30 % Cut)

### L2 · ES-Lokalisierung (analog EN)

Spanischer Reviewer, MT + Review. LATAM ist preissensitiv — ggf.
mit kaufkraftbezogenen Preisen experimentieren.

### L3 · IT / FR / NL (selektiv)

Erst bei klarem internationalem Erfolg. Pro Sprache wieder
Reviewer-Honorar.

### L4 · Trainings-Modul mit Inhalt füllen

`TacticBookEntry.trainingForms` und `typicalProblems` sind im Type
vorgesehen, aber leer. Mit Inhalten füllen → UI-Switch in
`DuelDetail.tsx` (Ansicht „Training") aktivieren.

Aufwand: mehrere Wochen Trainer-Arbeit, Maschinen-Hilfe begrenzt
sinnvoll (didaktisch).

### L5 · Edit-Modus für Duell-Einträge im UI

Trainer liest am iPad einen Eintrag und will direkt korrigieren. Heute
sind die Einträge code-only.

Implikation: Inhalte werden vom Code in den persistierten Store
verlagert (ähnlich `playerListIsUserManaged`-Pattern). Default =
Code-Inhalt, sobald editiert → User-Override. Migration v? → v?+1.

UI: In `DuelDetail.tsx` pro Section ein ✎-Icon, das die Liste in
editierbare Inputs umschaltet. Save back into store. Reset-Knopf, der
zurück auf Code-Default fällt.

Aufwand: vergleichbar mit Spieler-CRUD-Feature.

### L6 · Auto-Aufstellung berücksichtigt Phase

Aktuell ignoriert `computeBestLineup` die `phase`. Idee: zwei
Score-Berechnungen mit unterschiedlichen Gewichtungen, „beste
Aufstellung" wählt nach beiden Phasen kombiniert.

### L7 · Skill-Trends über Zeit

Skills bekommen Timestamps, Mini-Liniendiagramm in der
RosterDialog-Zeile. Saison-Entwicklung. Datenmodell wird
zeitserien-fähig.

### L8 · Cloud-Sync (optional, opt-in)

**Nur wenn** Vereinslizenz das verlangt (mehrere Trainer im selben
Verein wollen Kader/Aufstellungen teilen). Bewusst nachrangig, damit
Privacy-USP nicht verwässert.

---

## 🔵 Externe Klärungen (kein Code, gehört zu dir)

### E1 · Marken-/Domain-Check
Siehe S1.

### E2 · Zahlungsabwicklung-Recherche
Paddle (empfohlen, Merchant-of-Record für EU-VAT) vs. Stripe vs.
LemonSqueezy. ~1 h Recherche + Account-Setup.

### E3 · DSGVO-Marketing-Claim
**Eine** Anwaltsstunde (~€250) zur Frage: „Wie darf ich werben mit
‚Ohne Cloud · Ohne Tracker'?". Lohnt sich, weil Privacy zentrales
Differenzierungsmerkmal ist.

### E4 · Verifizierungs-Prompt für externe KI
Gegenstück zum Generierungs-Prompt: KI als kritischer zweiter Trainer
reviewt bestehende Einträge.

Frage: stimmt Rating, Vorteile/Gefahren konsistent, fehlt etwas?
Output: Markdown-Bewertung pro Eintrag.

Landet als eigener Prompt-Doc in `docs/` (Muster:
`docs/livecoaching-ausbau-prompt.md`). Hinweis: `missing-duels.md`
wurde entfernt (Coverage jetzt via `npm run verify-duels`).

---

## Workflow zum Reaktivieren

In neuer Session:

1. Diese Datei aufschlagen (`cat docs/TODO.md`).
2. Item wählen, sagen „mach S2" oder „starte Multi-Team".
3. Claude weiß dann den Kontext (synthesis.md + market-analysis/) und
   legt los.

## Verlauf

- **2026-05-14:** initialer Backlog nach Code-Review (Systembuch-
  Verifizierung A/B/D, Mehrere Teams, Phase, Skill-Trends, Trainings-
  Modul) erstellt.
- **2026-05-15:** drei externe Marktanalysen eingegangen, Synthese
  erstellt, TODO neu priorisiert nach Monetarisierungs-Ausrichtung.
  Schnellstart-Block (S1–S6) als nächste 14 Tage definiert.
- **2026-05-18:** Systembuch-Migration (81/81) + Legacy-Cleanup +
  Rating-Audit (0 Widersprüche, voll spiegel-konsistent) + Browser-
  Smoke-Test abgeschlossen. Qualität/UX-Block ergänzt (Q1/Q2/Q3).
- **2026-05-18 (Folge):** S3 erledigt (verify-duels CI-fähig +
  Bias-Check + Coverage, missing-duels.md entfernt). Q3a erledigt
  (Bias-Cluster 3-5-2 + 5-3-2 matrix-weit rebalanciert). Q1 erledigt
  (Terminologie skriptweit vereinheitlicht, Glossar). Q2-UI erledigt
  (DuelTabs, „Alles" raus, „Im Spiel"-Reiter). Q2-Content bewusst
  deferred mit Mechanismus (`docs/livecoaching-ausbau-prompt.md`,
  Audit-Gate 1–3→5–6). Q3b erledigt (Vorwort/Erklärseite im
  Leerzustand). Projekt-IST/SOLL: `docs/projekt-ist-soll.md`.
