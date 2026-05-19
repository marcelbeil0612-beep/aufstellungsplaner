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

### S2 · PNG-Branding-Footer — ERLEDIGT (2026-05-18)

In `src/lib/exportLineup.ts` ergänzt: dezente, halbtransparente Pille
„Erstellt mit FormaXI · formaxi.de" in der unteren rechten Ecke
(bewusst Ecke statt Mitte, kollidiert sonst mit dem tief stehenden
Torwart-Label). Wirkt auf jedem geteilten/exportierten PNG als Werbung.

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

### S5 · Demo-Aufstellung als öffentlicher Share-Link — ERLEDIGT (2026-05-18)

Umgesetzt: fester Link `…/#demo` (`src/data/demoLineup.ts`:
deterministisches 4-3-3 mit 11 rein fiktiven Spielern, `isDemoHash`,
`demoExportInput`). `DemoDialog` rendert die Demo read-only über
`renderLineupPng` (identische Spielfeld-Grafik wie der PNG-Export,
kein Drag-and-Drop, kein Store, **kein Import**); CTA „Eigene
Aufstellung bauen" schließt nur. App.tsx wertet `#demo`/`#share=` beim
Mount aus und putzt den Hash. Tests `demoLineup.test.ts`
(Determinismus + Integrität). Browser-Smoke-Test bestanden (Link
öffnet Demo, PNG rendert, CTA schließt, ohne Hash kein Dialog, 390px
ohne Overflow, 0 Console-Errors). test 47/47, tsc 0, build ✓.

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

## 🟢 Produktvertiefung (nutzergetrieben)

### F1 · Form-Regler pro Phase (Breite/Höhe)

**Stufe A — ERLEDIGT (2026-05-18):** Die früher fest verdrahtete
Phasen-Verschiebung (`phaseShift`-Offset-Tabelle) ist ersetzt durch
zwei nutzergesteuerte Regler **Breite** + **Höhe**, pro Phase
gespeichert. Der Mit-/Gegen-Ball-Switch wechselt damit zwischen
offensiver und defensiver Ausrichtung (eigene Form je Phase). Defaults
bewusst kompakter als die rohen Formationskoordinaten (löst „Abstände
zu groß"). `shapeSlots()` skaliert Breite um die Mittelachse, Höhe um
einen Anker am eigenen Tor; Torwart bleibt fix. Store-Migration
v9→v10, in Backup-Export/Import enthalten, PNG-Export berücksichtigt
die Form. Browser-verifiziert (Regler live, Persistenz + Phasen-
Trennung über Reload, mobil ohne Overflow, 0 Console-Errors).
test 52/52, tsc 0, build ✓.

**Stufe A · Nachschärfung — ERLEDIGT (2026-05-19):** Nutzer-Feedback:
voller Höhe-Regler zog das Team unrealistisch auseinander; Mit Ball
braucht keine Höhe. Umgesetzt: **Mit Ball = nur Breite**, Höhe fix
realistisch (`WITHBALL_HEIGHT` ≈ 0,70). Höhe-Regler nur noch defensiv,
Grenzen getrennt (`WIDTH_*` vs `HEIGHT_MAX` = 0,95) + harte y-Klemmung
auf Strafraumhöhe (`Y_MAX` = 82) → **kein Überstrecken mehr**.
`effectiveShape(phase,…)` zentralisiert das (Pitch/Overlay/PNG).
Pressing-Presets in den kompakten Bereich nachjustiert. Browser-
verifiziert (Mit Ball ohne Höhe-Regler & realistisch; Defensiv-Max
bleibt kompakt). test 56/56, tsc 0, build ✓.

**Stufe B — ERLEDIGT (2026-05-18):** In der Defensivphase 3
Pressinghöhen-Presets (Angriffs-/Mittelfeld-/Abwehrpressing) als
Schnellwahl des Höhe-Reglers (`PRESSING_PRESETS`), aktiver Button
hervorgehoben. Overlay nur „Gegen den Ball": schattierte
Pressingzone-Band + gestrichelte Linie des ersten Störers
(`pressingLineY` = vorderster Feldspieler) mit Label, im Feld und
im PNG-Export. Browser-verifiziert: Presets verschieben Linie/Zone
(hoch ~12 % ↔ tief ~48 %), Mit-Ball ohne Overlay, 0 Console-Errors.
PNG-Export code-parallel zum verifizierten Feld-Overlay (gleiche
Koordinaten-Mathematik wie die Chips), tsc/build grün. test 54/54.

### F2 · Linien-Kompaktheit — ERLEDIGT (2026-05-19)

Modell getrennt: **Block-Position** vs. **Linien-Kompaktheit**.
`shapeSlots` front-verankert: vorderster Feldspieler auf `frontY`,
dahinter alle Linien mit festem Faktor `k` herangezogen (Enge
konstant, unabhängig von der Position). Je Phase fest: Mit Ball
`K_ATTACK` (deutlich enger) + feste offensive Front (ST ~Strafraum);
Gegen den Ball `K_DEFENSE` (sehr eng) + Front aus Pressinghöhe
(Presets/Slider verschieben nur den Block). Kein neuer Regler.
Browser-verifiziert: Linien-Abstand bei Angriffs- und Abwehrpressing
**konstant** (gemessen 24 ↔ 24), nur Block verschoben; Mit Ball
deutlich enger & hoch. test 56/56, tsc 0, build ✓.

### F3 · Adaptive Chipgröße gegen Überlappen — ERLEDIGT (2026-05-19)

Nutzer-Befund: enge Linien + fixe Pixel-Chips (Foto+Name) →
Überlappung. Entscheidung Hybrid (Foto bleibt, nur kleiner). Umgesetzt:
`Pitch` misst die Feldbreite (ResizeObserver), berechnet aus dem
Slot-Mindestabstand einen `chipScale` (Floor 0.48), gereicht über
`SlotDropZone`→`PlayerChip`→`PlayerChipVisual` (Avatar/Initialen
inline skaliert, leerer Platzhalter ebenfalls). Namens-Pille (Haupt-
Überlapper) blendet ab `scale < 0.88` aus — Positions-Badge bleibt,
Identität klar; Foto bleibt immer. Dazu moderate Enge-Obergrenze
(K_ATTACK 0.56 / K_DEFENSE 0.47). PNG-Export unverändert (eigene
Leinwand → Fotos dort weiter groß). Browser-verifiziert: Desktop mit
Namen, mobil/eng ohne Namen, kein Stapeln; Bank unverändert.
test 56/56, tsc 0, build ✓.

(Ursprüngliche Anforderung F2:)

Der Nutzer will **durchgängig deutlich engere Abstände ZWISCHEN den
Linien** (Abwehr↔Mittelfeld↔Angriff), **unabhängig von der Höhe** und
**für Mit Ball und Gegen den Ball** separat. Das aktuelle Modell
skaliert alle Slots proportional um einen Anker → bei höherem Block
ziehen die Linien zu weit auseinander. Soll: **Block-Höhe/-Position
und Linien-Kompaktheit trennen** (Bänder zur Mittelfeldlinie
zusammenziehen; Höhe/Position separat). Konkreter Kompaktheits-Grad
je Phase wird per Rückfragen mit dem Nutzer abgestimmt, dann
`phaseShift` umbauen (eigener Kompaktheits-Faktor je Phase, sehr enge
Defaults), alle Aufrufer + Tests anpassen, browser-verifizieren.

### BUG · Slider nicht ziehbar — ERLEDIGT (2026-05-19)

**Tatsächliche Ursache** (nicht dnd-kit): die Tailwind-Klassen
kombinierten `appearance-none` **mit** `accent-*`. `appearance-none`
entfernt den nativen Thumb; ohne explizite `::-webkit-slider-thumb`-
Regel kollabiert der Greifpunkt auf 0 px → nur Track-Klick (einzelnes
Change) funktioniert, kein Thumb-Drag. Fix: `appearance-none` (und
manuelles Track-Styling) entfernt, nativer Range mit `accent-emerald-500`
→ sichtbarer, ziehbarer Thumb. (Die Folge-13-Modulebene-Änderung war
unabhängig/harmlos.) Browser: Thumb sichtbar; finale Drag-Bestätigung
durch Nutzer auf dem Deploy.

### Bezahlung (P4) — Go-live vom Nutzer geparkt

P4-Code komplett & **Sandbox end-to-end live verifiziert**
(`formaxi.de`: Checkout → `issue-license` → signierte Lizenz → Pro;
Persistenz). Offen nur die Production-Umstellung (Paddle-Production-
Produkt/Preise/Token/Secrets in Vercel-Env, `…ENV=production`,
Redeploy, Payout-Bankdaten, Paddle-Go-live-Checklist). Bewusst
**später** — Nutzer priorisiert erst die Aufstellungs-Optik (F2/Bug).

## 🟡 Nach Schnellstart: Pro-System (Monat 2)

### P1 · Marken-Rebrand — ERLEDIGT (Code-Teil, 2026-05-18)

Marke = **FormaXI** (Domain `formaxi.de` gesichert). Umbenannt:
`package.json`+`package-lock.json` (name → formaxi), `vite.config.ts`
(PWA-Manifest name/short_name/description), `index.html`
(Titel + Meta-Description + apple-mobile-web-app-title), Header-H1.
**Bewusst NICHT umbenannt** (Storage-/Format-IDs — Umbenennen =
Datenverlust bei Bestandsnutzern): Persist-Key `aufstellungsplaner:v1`,
IndexedDB `aufstellungsplaner-db`/`-photos`, Backup-MAGIC
`aufstellungsplaner-backup`, localStorage-Keys (iOS-Hint/Onboarding).
Browser-verifiziert: Titel/H1 = FormaXI, Bestandsdaten (16 Spieler,
isPro) überleben den Rebrand, 0 Console-Errors. test 47/47, tsc 0,
build ✓.

**Logo/Icons — ERLEDIGT (2026-05-18):** FormaXI-Markenmotiv als
`assets/icon-source.png` (randloses Grün, Motiv in Maskable-Safe-Zone).
Pipeline `scripts/generate-pwa-icons.mjs` (`npm run icons`) erzeugt
apple-touch / pwa-192 / pwa-512 / maskable-512 / favicon(48/32) nach
`public/`. index.html + vite.config auf PNG-Favicon umgestellt, alte
Brand-SVGs entfernt. Browser-verifiziert: App-/PWA-/Maskable-Icons sehr
gut. Favicon nutzt eine separate, fette Sondervariante
(`assets/favicon-source.png`) → bei **16 px klar als „XI" lesbar**
(32/48 px gestochen). Zwei Markenquellen, ein Pipeline-Skript.

**Offen (kein Code, deine Aufgabe):**
- Formale DPMA-Markenanmeldung nach professioneller Markenrecherche
  (`formaxi.it` als bestehende Fußball-Trainingsseite gegenprüfen).

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

### P4 · Paddle-Integration — CODE ERLEDIGT (2026-05-18), env-gesteuert

Umgesetzt (sandbox-ready, Sandbox→Prod nur Env, kein Code-Umbau):
- Paddle.js per CDN (`src/lib/paddle.ts`), Checkout-Overlay an die 3
  Paywall-Pläne verdrahtet (`purchaseAndActivate`).
- **Asymmetrische Lizenz (ECDSA P-256):** Server signiert
  (`server/licenseSign.mjs`), Client verifiziert offline mit Public Key
  (`src/lib/license.ts`) → kein Secret im Frontend.
- Vercel-Functions: `api/issue-license.mjs` (Paddle-Transaktion prüfen →
  Token), `api/refresh-license.mjs` (Abo verlängern / 410 bei Kündigung),
  `api/paddle-webhook.mjs` (Signaturprüfung; Lifecycle-Ausbau später).
- Store: `license`-Token persistiert (Migration v10→v11, in Backup),
  `proActivation.ts` (Start-Aktivierung, Einlösen, Kauf→Pro);
  90-Tage-Offline-Karenz (`LICENSE_GRACE_DAYS`).
- PaywallDialog: echter Checkout **oder** Graceful-Stub (ohne Env),
  „Lizenzschlüssel einlösen“-Feld. Browser-verifiziert: Stub + Einlösen
  eines signierten Test-Tokens → Pro, über Reload persistent.
- Konfig via `.env`/Vercel-Env (`.env.example`), `.env` gitignored,
  Keypair via `scripts/gen-license-keys.mjs`.
- test 54/54, tsc 0, build ✓.

**Offen (deine Aufgabe, kein Code):** in Paddle-Sandbox Produkt + 3
Preise anlegen → Price-IDs; Client-Token; API-Key + Webhook-Secret;
Keypair erzeugen; alle Werte in Vercel-Env eintragen; Sandbox-
Testkauf; danach Prod-Env + Go-live-Checklist + Payout-Daten.
Webhook-URL: `https://formaxi.de/api/paddle-webhook`.

Hinweis: Abo-Sofort-Kündigung wird (noch) nicht serverseitig
gepusht — `refresh-license` + 90-Tage-Karenz deckt den Fall ab;
voller Webhook-Lifecycle = optionaler späterer Ausbau.

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
  (An Codex delegiert, hier verifiziert & als eigene Einheit committet.)
- **2026-05-18 (Folge 6):** S5 Demo-Share-Link erledigt — fester Link
  `…/#demo`, deterministisches Demo-4-3-3 mit fiktiven Spielern
  (`demoLineup.ts`), `DemoDialog` rendert read-only via
  `renderLineupPng` (kein Import), CTA schließt nur; App.tsx wertet
  `#demo`/`#share=` aus. Tests `demoLineup.test.ts`, Browser-Smoke-Test
  bestanden. test 47/47, tsc 0, build ✓. S2+S5 (Wachstums-Polish):
  S5 erledigt, S2 wartet weiter auf Markenname. Offener Code-Pfad:
  P4 Paddle (extern blockiert: Paddle-Account + S1 Marke).
- **2026-05-18 (Folge 7):** S1 entschieden — Marke = **FormaXI**,
  `formaxi.de` gesichert. P1 Rebrand (Code-Teil) + S2 Branding-Footer
  erledigt: Anzeige-/Metadaten-Strings → FormaXI, Storage-/Format-IDs
  bewusst unverändert (kein Datenverlust, browser-verifiziert: 16
  Spieler + isPro überleben), dezenter PNG-Footer „Erstellt mit
  FormaXI · formaxi.de" unten rechts. test 47/47, tsc 0, build ✓.
  Rest extern: Logo-Grafik + DPMA-Anmeldung nach Profi-Recherche
  (`formaxi.it` gegenprüfen). Einziger offener Code-Block: P4 Paddle
  (braucht Paddle-Account; P4a-Lizenz-Mechanik wäre vorab baubar).
- **2026-05-18 (Folge 8):** App live auf `formaxi.de` deployt (Vercel,
  korrekter Build verifiziert). Bezahl-Entscheidung: Merchant of
  Record (Paddle oder LemonSqueezy), nicht Stripe — final offen.
  Neues nutzergetriebenes Feature **F1 Stufe A** erledigt: feste
  Phasen-Verschiebung ersetzt durch Breite/Höhe-Regler pro Phase
  (Store-Migration v9→v10, kompaktere Defaults, Switch = offensiv/
  defensiv). test 52/52, tsc 0, build ✓, browser-verifiziert.
  Offen: F1 Stufe B (3 Pressinghöhen + Zone + Störer-Linie),
  P4 (MoR-Account von dir), DPMA-Anmeldung, S6.
- **2026-05-18 (Folge 9):** F1 Stufe B erledigt: 3 Pressinghöhen-
  Presets in der Defensivphase + Pressingzone-Band + Linie des ersten
  Störers (Feld + PNG-Export), nur „Gegen den Ball". Browser-
  verifiziert (Presets verschieben Linie hoch↔tief, Mit-Ball clean).
  test 54/54, tsc 0, build ✓. Damit F1 komplett. Offene Code-Arbeit:
  nur noch P4 (MoR-Account von dir). Rest extern: DPMA, S6.
- **2026-05-18 (Folge 10):** Bezahl-Entscheidung = **Paddle**, KYB
  gestartet (Produktbeschreibung + Website-Verifizierung). Für Paddle-
  Verifizierung Rechts-/Infoseiten gebaut: `/preise /agb /datenschutz
  /widerruf /impressum` als statische Seiten auf `formaxi.de` (eigene
  `legal.css`), Platzhalter `[NAME]/[ANSCHRIFT]/[E-MAIL]/[USt-IdNr]`
  (Nutzer ist Gewerbe mit USt-IdNr, kein §19). 14-Tage-Geld-zurück.
  Footer-Links in der App. **Fix:** bestehender SPA-Catch-all-Rewrite
  in `vercel.json` hätte die Seiten geschluckt → `cleanUrls:true`
  ergänzt; SW-`navigateFallbackDenylist` für die Pfade. build/test
  grün; Live-Verifizierung der sauberen URLs nach Deploy. Offen vom
  Nutzer: echte Impressumsdaten; P4-Sandbox-Bau kann starten.
- **2026-05-18 (Folge 11):** Paddle KYB **verifiziert**. Echte
  Impressumsdaten eingesetzt (Marcel Beil, Memmingen,
  marcelbeil0612@gmail.com); Nutzer ist **§19-Kleinunternehmer ohne
  USt-IdNr** → §27a-Zeile entfernt, MoR-USt-Wording, live geprüft.
  **P4 Code komplett** (env-gesteuert, sandbox-ready): Paddle.js-
  Checkout, ECDSA-Lizenz (Server signiert / Client verifiziert offline),
  `api/issue-license|refresh-license|paddle-webhook`, Store-
  Lizenz-Persistenz (v10→v11) + 90-Tage-Karenz, PaywallDialog mit
  Einlösen + Graceful-Stub. Browser-verifiziert (Stub + Token-Einlösen
  → Pro, persistent). test 54/54, tsc 0, build ✓. Offen: nur noch
  Nutzer-Aufgaben (Paddle-Produkt/Preise/Token/Secrets in Vercel-Env,
  Sandbox-Testkauf, dann Prod/Go-live).
- **2026-05-19 (Folge 12):** F1 Stufe A nachgeschärft (Nutzer-
  Feedback): Mit Ball ohne Höhe-Regler (feste realistische Staffelung
  ≈0,70), Höhe nur defensiv, getrennte Grenzen + y-Klemmung auf
  Strafraumhöhe → kein Überstrecken. `effectiveShape` zentral.
  Browser-verifiziert. test 56/56, tsc 0, build ✓.
- **2026-05-19 (Folge 13):** Mit-Ball-Staffelung höher/offensiver
  (`WITHBALL_HEIGHT` 0,70→0,95, ST ≈ Strafraumkreis, gleichmäßiges
  Aufrücken, weiter auf Strafraumhöhe gedeckelt). **Bug-Fix:** Breite-
  Regler reagierte nur auf Klick, nicht aufs Ziehen — Ursache: Slider-
  Komponente war in `FormationShapeControls` verschachtelt → Remount
  des `<input>` pro Wertänderung. Slider auf Modulebene gehoben →
  Drag durchgehend (browser-verifiziert: Node bleibt stabil).
  test 56/56, tsc 0, build ✓.
- **2026-05-19 (Folge 14):** Paddle **Sandbox end-to-end live
  verifiziert** auf `formaxi.de` (Domain/Default-Payment-Link in Paddle
  gesetzt → Checkout-Overlay ok; Testkauf 4242 → `issue-license` →
  signierte Lizenz → Pro freigeschaltet). Go-live (Production-Env) vom
  Nutzer geparkt. Zwei offene Punkte priorisiert: **F2 Linien-
  Kompaktheit** (Modell muss Block-Höhe und Linien-Kompaktheit trennen;
  Grad per Rückfragen) und **Bug: Slider nicht ziehbar** (Hypothese:
  dnd-kit `PointerSensor` fängt Pointer-Events des Range-Inputs ab).
  Doku/Memory aktualisiert. Slider-„Fix" aus Folge 13 war unzureichend.
- **2026-05-19 (Folge 15):** F2 + Slider-Bug erledigt. Kompaktheits-
  Modell: Block-Position (frontY) und Linien-Enge (festes `k` je Phase)
  getrennt; Mit Ball deutlich enger & offensiv hoch, Gegen den Ball
  sehr eng, Pressinghöhe verschiebt nur den Block (Linien-Abstand
  gemessen konstant 24↔24). Slider-Bug: echte Ursache war
  `appearance-none`+`accent-*` (Thumb 0 px) → behoben. test 56/56,
  tsc 0, build ✓, browser-verifiziert. Nächste Prio danach:
  Paddle-Go-live (Production-Env), sonst nichts Offenes im Code.
- **2026-05-19 (Folge 16):** F3 erledigt — adaptive Chipgröße gegen
  Überlappen bei engem Block (Hybrid: Foto bleibt/kleiner, Namens-Pille
  blendet aus, Positions-Badge bleibt; moderate Enge-Obergrenze;
  PNG-Export unverändert). Desktop + mobil/eng browser-verifiziert,
  kein Stapeln. test 56/56, tsc 0, build ✓. Offen im Code weiterhin
  nur Paddle-Go-live (Production-Env), vom Nutzer geparkt.
- **2026-05-19 (Folge 17):** Anleitung/Hilfeseite erledigt — statische
  `public/hilfe/index.html` nach dem `/preise`-Muster (`legal.css`,
  `cleanUrls` → URL `formaxi.de/hilfe`, SEO-`<meta description>`,
  forenverlinkbar). 10 Abschnitte (App-Idee, Kader, Aufstellung,
  Phasen/Pressing, Beste Aufstellung, Wechselplan, Systembuch,
  Export/Teilen, Installation, Free/Pro). Verdrahtet: `?`-Button im
  Header → `/hilfe`, Footer-Link „Hilfe", „Mehr erfahren →" im
  Onboarding-Overlay. Doppelnutzen: In-App-Hilfe + Marketing-Landing
  (Funnel `#demo` sehen → `/hilfe` verstehen → App). Browser-
  verifiziert (Header/Footer-Link → `/hilfe`, Seite rendert, 0
  Console-Errors; `/hilfe` verhält sich wie live `/preise`).
  test 56/56, tsc 0, build ✓. Offen im Code weiterhin nur
  Paddle-Go-live (Production-Env), vom Nutzer geparkt.
