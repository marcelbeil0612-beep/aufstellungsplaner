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

### S4 · Onboarding-Polish — ERLEDIGT (2026-05-18)

First-Run-Overlay mit 3-Schritte-Hinweis: „Kader anlegen → Aufstellung
bauen → Teilen". Einmalig anzeigen, in eigenem localStorage-Key
`aufstellungsplaner:onboarding-seen` als gesehen markieren (bewusst
nicht im persistierten Zustand-Store).

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

**Q2-Content — ERLEDIGT (Commit 6bf13b8):** `liveCoaching` aller 81
Duelle auf **5–6** ausgebaut. Regelbasiert & nachvollziehbar:
4 System-Basis-Zurufe (aus den wiederkehrenden keyActions der
Grundordnung) + 2–3 Gegner-Signatur-Zurufe, dedupliziert,
glossarkonform; Spiegelduelle eigener Satz. Deterministisch eingefügt
via `scripts/gen-livecoaching.mjs` + `scripts/apply-livecoaching.mjs`
(re-runnbar). Audit-Gate `1–3` → `5–6` umgestellt; verify-duels 6/6,
build + tsc grün.

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

### P2 · Feature-Flag-Architektur — ERLEDIGT (2026-05-18)

Umgesetzt: `isPro` im Zustand-Store (Default false, partialize-persistiert,
Migration v8→v9, Setter `setProStatus`); bewusst NICHT in Backup-
Export/-Import (sonst per JSON-Datei umgehbar — `restoreFromBackup`
ignoriert `isPro` explizit). `src/lib/proAccess.ts`: `ProFeature`-Typ
(7 Gate-Schlüssel aus der Synthese), `isProFeature()`, `useProStatus()`,
`useFeatureAccess(feature)`. `src/components/FeatureGate.tsx`:
deklaratives `<FeatureGate feature="…" fallback={…}>` (fallback offen
für P3-Paywall). Tests: `proAccess.test.ts` (test 36/36 grün, tsc 0,
build ✓). Noch NICHT verdrahtet an Call-Sites — das passiert mit P3
(Paywall + Trigger-Stellen), damit ohne Paywall keine UX-Regression
entsteht.

Ursprüngliche Spezifikation (umgesetzt):
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

### P3 · Paywall-UI — ERLEDIGT (2026-05-18)

Umgesetzt: `usePaywallStore` (ephemer, NICHT persistiert),
`PaywallDialog` (Wert-Liste + 3 Preisstufen €24,90/J · €3,90/M · €49
Lifetime, feature-spezifische Anreißzeile, „Vielleicht später"; Plan-
Klick zeigt „Bezahlung folgt in Kürze" — echter Checkout = P4).
`useProGuard(feature)` für klick-gegatete Aktionen. Trigger verdrahtet
& browser-verifiziert:
- „Gegen Ball"-Phase (PhaseToggle) — 🔒, Klick → Paywall
- „Beste Aufstellung" (Header) — 🔒, Klick → Paywall
- Wechselplan (Bench) — 🔒, Klick → Paywall
- Systembuch: nur die 3 Schaufenster-Duelle frei (4-3-3 vs 4-4-2,
  4-2-3-1 vs 5-3-2, 3-5-2 vs 4-3-3), alle anderen 🔒/„Pro" → Paywall;
  persistiertes gesperrtes Duell wird beim Öffnen nicht wiederhergestellt;
  Rating-Ampel gesperrter Duelle neutralisiert (kein Info-Leak).
- Multi-Team-Picker: existiert noch nicht (Skalierung) — übersprungen.

Browser-Smoke-Test bestanden: Free zeigt Schlösser & Paywall, freie
Schaufenster-Duelle öffnen normal; mit `isPro=true` (per IndexedDB
gesetzt) alle Schlösser weg, alle Features frei; 390px ohne Overflow,
0 Console-Errors. test 39/39, tsc 0, build ✓.

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
  (DuelTabs, „Alles" raus, „Im Spiel"-Reiter). Q2-Content erledigt
  (liveCoaching aller 81 auf 5–6, regelbasiert via scripts/, Audit-Gate
  5–6). Q3b erledigt (Vorwort/Erklärseite im Leerzustand).
  Projekt-IST/SOLL: `docs/projekt-ist-soll.md`. → Qualität/UX-Block
  (S3, Q1, Q2, Q3) vollständig abgeschlossen.
- **2026-05-18 (Folge 2):** Q-Block-Browser-Smoke-Test tatsächlich
  ausgeführt (war zuvor nur dokumentarisch vorweggenommen) und
  bestanden: Vorwort/Leerzustand scrollbar & ohne Overflow; Duell-Detail
  genau 5 Reiter (4 Phasen + „Im Spiel"), stets genau einer aktiv, kein
  „Alles"-Tab; „Im Spiel" zeigt Live-Coaching (6 Zurufe) + Mögliche
  Ingame-Anpassung; Rating-Stichproben bestätigt (3-5-2 vs 4-2-3-1 =
  unangenehm, 5-3-2 vs 4-3-3 = unangenehm); mobile 390px ohne
  horizontalen Overflow, 0 Console-Errors. Verifikation grün: test
  31/31, tsc 0, verify-duels 6/6, keine Bias-Cluster. Keine Code-Fixes
  nötig. Neu (untracked): `.claude/launch.json` für das Preview-Tooling.
  → Damit ist der gesamte Systembuch-Komplex auch UI-seitig live
  verifiziert; nächster Engpass ist rein extern (S1 Marken-Check).
- **2026-05-18 (Folge 3):** P2 Feature-Flag-Architektur erledigt
  (`isPro` im Store + Migration v8→v9 + Setter; `proAccess.ts` mit
  `ProFeature`/`isProFeature`/`useProStatus`/`useFeatureAccess`;
  `<FeatureGate>`-Komponente; `isPro` bewusst aus Backup ausgeklammert).
  test 36/36, tsc 0, build ✓. Noch nicht an Call-Sites verdrahtet
  (bewusst → P3). Nächster Code-Schritt: P3 Paywall-UI.
- **2026-05-18 (Folge 4):** P3 Paywall-UI erledigt — `usePaywallStore`,
  `PaywallDialog` (3 Preisstufen, Checkout-Stub → P4), `useProGuard`;
  Trigger an Gegen-Ball-Phase / Beste Aufstellung / Wechselplan /
  Systembuch (3 Schaufenster-Duelle frei) verdrahtet & browser-
  verifiziert (Free + Pro-Pfad). test 39/39, tsc 0, build ✓.
  Nächster Code-Schritt: P4 Paddle (echter Checkout + Lizenz).
- **2026-05-18 (Folge 5):** S4 Onboarding-Polish erledigt: First-Run-
  Overlay direkt nach dem Header, drei Schritte („Kader anlegen →
  Aufstellung bauen → Teilen"), eigener SSR-sicherer localStorage-Key
  `aufstellungsplaner:onboarding-seen`, kein Store-/Migrations-Eingriff.
  Nach Schließen erscheint das Overlay beim Reload nicht erneut.
