# Strategie-Synthese · Aufstellungsplaner

Stand: 2026-05-15. Basis: drei externe Marktanalysen (ChatGPT Pro,
Gemini Pro, dritte Quelle) in diesem Ordner.

Diese Datei ist der **entscheidungsreife Destillat** aus den drei
Analysen. Sie trennt sauber zwischen:

1. **Fest entschieden** (Konsens aller drei Quellen, sicher)
2. **Test-Hypothesen** (Quellen uneinig, im Launch validieren)
3. **Externe Klärungen** (kein KI-Thema mehr, gehört zu dir bzw. Anwalt/Marken-Check)
4. **Code-Implikationen** (sortiert nach „sofort machbar" vs. „wartet auf Entscheidung")
5. **14-Tage-Schnellstart**
6. **12-Monats-Pfad**
7. **Was wir bewusst NICHT machen**

---

## 1. Ausgangslage

- Du hast die App **fertig gebaut** — das ist kein „Idee", das ist ein Asset.
- 81/81 Systembuch-Duelle erfasst (echter, monatelang nicht kopierbarer Moat).
- Drei unabhängige Marktanalysen stimmen in 15 Kernpunkten überein.
- Ziel: **Monetarisierung**, beginnend mit Side-Income, mittelfristig Vollzeit möglich.

Realistische ARR-Skala (Konsens der drei Quellen):

| Horizont | DACH only | DACH + EN | DACH + EN + ES/IT/FR |
|---|---|---|---|
| 12 Monate | €2.000–5.000 | €4.000–10.000 | unwahrscheinlich, zu früh |
| 24 Monate | €5.000–12.000 | €15.000–35.000 | €25.000–60.000 |
| 36 Monate (gut gelaufen) | €10.000–20.000 | €30.000–60.000 | €60.000–120.000+ |

---

## 2. Fest entschieden (Konsens-basiert)

### Positionierung

**„Coaching-Companion neben SpielerPlus/Spond — NICHT als Ersatz."**

Konkurrenz ist nicht eine bestimmte App, sondern **Stift, Zettel,
WhatsApp-Foto und Excel**. SpielerPlus hat den Kommunikations-Layer
(Eltern, Termine, Absagen) — da kommt man als Solo-Entwickler nicht
rein. Die Lücke ist der **taktische Layer für den Spieltag**, den
keine bestehende App besitzt.

**Tagline-Richtung:** „Das taktische OS für den Spieltag. Privat,
offline, ohne Account."

### Zielgruppe Phase 1

- **Bullseye:** Jugendtrainer U13–U19 in DACH, B-/C-Lizenz oder gerade in Ausbildung, mit iPad/modernem Handy
- **Sekundär:** Amateur-Herren/Damen Kreis- bis Bezirksliga, Schulsport mit Fußball-AG
- **Bewusst nicht primär:** Altherren, Bambini bis F-Jugend, Futsal, Profis

### Geschäftsmodell

**Freemium mit Pro-Unlock.** Konkret:

**Free:**
- 1 Mannschaft
- Alle 10 Formationen
- Drag-and-Drop, Mit-Ball-Phase, PNG-Export, Spielprotokoll
- Beliebig viele gespeicherte Aufstellungen (NICHT begrenzen — das wäre frustrierend bei dem geringen Speicherbedarf)
- **3 Schaufenster-Duelle aus dem Systembuch** (Vorschlag: 4-3-3 vs. 4-4-2, 4-2-3-1 vs. 5-3-2, 3-5-2 vs. 4-3-3)

**Pro:**
- Alle 81 Systembuch-Duelle
- Phasen-Umschalter „Gegen den Ball" (Mit-Ball bleibt frei)
- Hungarian-Auto-Aufstellung („Beste Elf")
- Wechselplan
- Multi-Team (2–5 Mannschaften lokal)
- Share-Link-Import (ohne Pro nur Lese-Ansicht)
- Backup-Import (Export bleibt frei)

**Vereinslizenz (Phase 2, ab ~500 Pro-Usern):**
- 1 Account = bis zu 5 Trainer-Profile auf demselben Gerät (Multi-Profile-Switching)
- Konsolidierter Kader-Pool für gemeinsam betreute Spieler

### Wachstumskanal #1: Organischer PNG-Share-Loop

Jeder geteilte PNG ist Werbung. Konkret:

- **Dezenter Branding-Footer** im exportierten PNG: „Erstellt mit [Markenname] · [URL]"
- **Share-Link mit Landing-Ansicht:** Empfänger sieht eine schöne Read-Only-Vorschau bevor er importiert
- **Demo-Modus:** öffentlich klickbare Demo-Aufstellung als Werbe-Asset („so sieht das aus")

### Lokalisierung-Reihenfolge

1. **DACH bleibt Hauptmarkt** in Monat 1–3 (Validierung)
2. **Englisch parallel ab Monat 1** vorbereiten (i18n-Layer, MT, Reviewer-Recruiting) → Launch Monat 3–4
3. **Spanisch danach** (Monat 6+) — großer Markt, taktikaffin
4. **Italienisch / Französisch / Niederländisch** ab Monat 9+, nur bei klarer EN-Traktion

### App-Store-Strategie

- PWA bleibt Hauptpfad — kein Native-Rewrite
- **Capacitor-Wrapper** für App-Store-Listing, sobald ~500 aktive Nutzer erreicht sind (sonst rentiert sich die Apple-Developer-Gebühr nicht und das ASO-Setup wird zu früh)

---

## 3. Test-Hypothesen (im Launch validieren)

Die drei Analysen sind sich an folgenden Stellen uneinig — und das ist
in Ordnung. Diese Punkte sind keine Recherche-Fragen, sondern
**Markt-Fragen, die nur ein echter Launch beantwortet**.

### Pricing

- ChatGPT: €29 einmalig oder €19/Jahr
- Gemini: €24,99 einmalig
- Quelle 3: €19,90/Jahr oder €2,99/Monat

**Empfehlung: starte mit jährlichem Abo, eine harte Lifetime-Beta als FOMO-Anker.**

| Plan | Preis | Anmerkung |
|---|---|---|
| Pro Jahresabo | **€24,90/Jahr** | Mittlerer Preispunkt, einfach kalkulierbar |
| Pro Monatsabo | **€3,90/Monat** | ~50% Aufschlag vs. Jahresabo, bewusste „Annual ist günstiger"-Logik |
| Lifetime Early Supporter | **€49 einmalig** | Limitiert auf erste 100 Nutzer, FOMO-Anker für initiale Conversion |

Nach 3 Monaten Daten: ggf. auf €19,90 senken (wenn Conversion < 5 %) oder bei €24,90 bleiben.

### Free/Pro-Grenze: Welcher Phasen-Umschalter ist frei?

Quelle 3 schlägt vor: nur „Mit Ball" frei, „Gegen Ball" hinter Paywall.

**Empfehlung:** so machen. Schafft konkretes „Aha"-Moment beim ersten Pro-Click, weil Trainer beide Phasen sehen wollen.

### Marken-Name

Top 3 Vorschläge aus den Analysen: **TactoXI · PitchLogic · Matchplan**.

**Empfehlung:** keinen automatischen Pick. Marken-/Domain-Check (siehe Sektion 4) zwingend vorab, dann mit 5 echten Trainerkollegen testen, welcher Name am besten haftet.

---

## 4. Externe Klärungen (kein KI-Thema)

### Marken- und Domain-Check (Aufwand: ~2 Stunden)

Diese fünf Quellen kostenlos prüfen für die 3–5 Marken-Kandidaten:

1. **DPMA Markenregister Deutschland** — register.dpma.de
2. **EUIPO eSearch plus** — euipo.europa.eu
3. **WIPO Global Brand Database** — branddb.wipo.int
4. **Domain-Verfügbarkeit:** namecheap.com oder porkbun.com — .com, .app, .io, .de prüfen
5. **App-Store-Namen:** Apple App Store + Google Play nach gleichem Namen suchen

**Output:** Tabelle mit „verfügbar / vergeben / dringend prüfen" pro Kandidat.

### Zahlungsabwicklung (Aufwand: ~1 Stunde + Account-Setup)

**Empfehlung: Paddle (Merchant of Record)** statt Stripe Direct.

Warum:
- Paddle übernimmt EU-VAT und Rechnungsstellung
- Bei <€100k Umsatz/Jahr keine Umsatzsteuer-Voranmeldung als Privatperson nötig
- Funktioniert mit PWA (Stripe Checkout-style)
- ~5 % + €0,50 pro Transaktion — bei €24,90 Pro entspricht das ~€1,75 Gebühr (7 %)

Alternativen:
- **Stripe Checkout** günstiger (~3 %), aber du musst EU-VAT selbst handhaben (Reverse-Charge, OSS-Meldung)
- **LemonSqueezy** ähnlich Paddle, US-basiert
- **App-Store-IAP** (nach Capacitor-Wrapper) — 15 % bis $1M, dann 30 %. Erst sinnvoll bei nativem App-Store-Listing.

### DSGVO-Marketing-Claim (Aufwand: 1 Anwaltsgespräch, ~€250)

**Frage an einen DSGVO-Anwalt:** „Darf ich werben mit ‚Ohne Cloud · Ohne Tracker · Keine Eltern- oder Spielerdaten verlassen das Gerät'? Wo ist die rechtssichere Formulierung, ohne dass die Verbraucherzentrale klagt?"

Aufwand: 1 Stunde Beratung, einmalig. Lohnt sich, weil der Privacy-Claim **dein zentrales Unterscheidungsmerkmal** ist.

### Piracy-Schutz (Architektur-Entscheidung, kein externer Aufwand)

**Empfehlung:** pragmatisch klein halten.

- License-Key wird beim Pro-Kauf von Paddle generiert + per Mail zugestellt
- License-Key wird einmal gegen einen winzigen Vercel-Endpoint validiert (HMAC mit Server-Secret)
- Validierungs-Ergebnis (signiert) im IndexedDB persistiert — danach offline für 90 Tage gültig, dann Re-Validierung
- Wer das knackt: knackt es. 90 % der Trainer haben weder Interesse noch Skill dafür. Die 10 % hätten sowieso nicht gezahlt.

**Was wir NICHT machen:** Online-Pflicht zur Laufzeit (würde Privacy-USP untergraben), DRM, hardware-binding.

### Update-Versprechen

- **Pro Jahresabo:** beinhaltet alle Updates während Laufzeit (klar)
- **Lifetime Early Supporter:** „lifetime updates for this product, solange das Produkt weiterentwickelt wird" — kein hartes Jahres-Versprechen, aber klares Commitment

---

## 5. Code-Implikationen

Sortiert nach „heute machbar (kein Vorab-Entscheid)" → „nach kleinen Entscheidungen" → „wartet auf Strategie".

### Sofort umsetzbar (Tag 1–7)

| TODO | Aufwand | Reversibel? |
|---|---|---|
| **PNG-Branding-Footer** in `exportLineup.ts` | 30 Min | Ja |
| **Verifizierungs-Skript** `npm run verify-duels` (war schon im TODO, jetzt timing-richtig) | 2–3 Stunden | Ja |
| **Onboarding-Polish:** First-Run-Hinweis (3 Schritte) | 2 Stunden | Ja |
| **Demo-Aufstellung** als öffentlich klickbarer Share-Link (statische Demo-Spieler) | 2 Stunden | Ja |

### Nach Pricing-/Naming-Entscheidung (Woche 2–4)

| TODO | Aufwand | Abhängigkeit |
|---|---|---|
| **Marken-Rebrand** (Logo, Favicon, package.json, vite.config, manifest, PNG-Footer-Text) | 1 Stunde Code + Design | Marken-Check abgeschlossen |
| **Feature-Flag-Architektur:** `useProStatus()`-Hook + `<FeatureGate>` | 4 Stunden | Pricing-Strategie geklärt |
| **Paywall-UI** an gesperrten Features (Phasen-Toggle „Gegen Ball", Auto-Aufstellung, Wechselplan, etc.) | 6 Stunden | Free/Pro-Grenze fix |
| **Paddle-Integration** + License-Key-Validierung | 1–2 Tage | Paddle-Account + Vercel-Endpoint |

### Nach DACH-Validierung (Monat 2–3)

| TODO | Aufwand | Abhängigkeit |
|---|---|---|
| **Multi-Team-Workspace** (war schon im TODO) — wird Pro-Feature | 2–3 Tage | Pro-System läuft |
| **Vereinslizenz-Stub:** 1 Lizenz = bis zu 5 Trainer-Profile lokal | 1–2 Tage | Multi-Team fertig |
| **i18n-Layer** (react-i18next, alle Strings extrahieren) | 1–2 Tage | DACH-Launch-Feedback eingearbeitet |
| **EN-UI-Übersetzung** (MT + Eigen-Review) | 4–6 Stunden | i18n-Layer steht |
| **EN-Systembuch** (MT + Coach-Review) | Wartezeit 2 Wochen + €600–1.000 | Reviewer rekrutiert |

### Später / spekulativ

| TODO | Aufwand | Wann? |
|---|---|---|
| Capacitor-Wrapper für App-Store-Listing | 1 Woche | Bei ~500 aktiven Nutzern |
| ES-Lokalisierung | analog EN | Nach EN-Traktion |
| Trainings-Modul mit Inhalt füllen | mehrere Wochen | Phase 3 |
| Cloud-Sync (optional, opt-in) | mehrere Wochen | Nur wenn Vereinslizenz das verlangt |
| Edit-Modus für Duell-Einträge im UI | mehrere Tage | Wenn Inhalts-Feedback aus Pro-Nutzern kommt |

---

## 6. 14-Tage-Schnellstart

Diese 14 Tage kannst du **ohne große Vorab-Entscheidungen** abarbeiten.
Sie schaffen die Voraussetzungen für alle späteren Schritte.

### Tag 1 (1 Stunde) — Marken-Check

Top-3-Kandidaten + 2 eigene Ideen durch:
- DPMA Markenregister
- Domain-Verfügbarkeit (.com, .app, .io)
- App-Store-Namenssuche

Ergebnis: Tabelle „verfügbar / kollidiert" pro Name.

### Tag 2–3 (2 Stunden) — PNG-Branding

`exportLineup.ts` erweitern: dezenter Footer unten im PNG mit
„Erstellt mit [Markenname] · [URL]".

Output: jeder ab jetzt geteilte PNG ist Werbung.

### Tag 4–7 (5–8 Stunden) — Verify-Skript

`npm run verify-duels` bauen (war schon im TODO). Flaggt:
- Spiegel-Konflikte (z. B. 4-3-3 vs. 4-4-2 = vorteilhaft UND 4-4-2 vs. 4-3-3 = vorteilhaft)
- Selbst-Duell-Anomalien
- Bias-Cluster (alle Duelle eines Systems gleich gewertet)
- Schema-Drift (Listen < 2 oder > 5 Items)

Wenn Konflikte gefunden: korrigieren oder begründen.
Output: 81 Duelle sind validiert, du kannst sie selbstbewusst vermarkten.

### Tag 8–10 (3–4 Stunden) — Trainer-Befragung

5–10 Trainerkollegen (eigener Verein, Trainerkurs, LinkedIn-Kontakte) befragen:

1. „Welcher Name klingt nach einem Tool, das du nutzen würdest?" (Top 3 zeigen)
2. „Was würdest du für so eine App zahlen — €19/Jahr · €25/Jahr · €30 einmalig · gar nichts?"
3. „Was sollte gratis sein, was wäre dir Geld wert?"
4. „Wenn du das Systembuch siehst — würdest du das nutzen oder ist es zu komplex?"

Output: validierte Hypothesen statt KI-Empfehlungen.

### Tag 11–14 (3–5 Stunden) — Demo-fähig machen

- **Onboarding-Polish:** First-Run-Overlay mit „Kader anlegen → Aufstellung → Teilen"
- **Demo-Aufstellung:** öffentlich klickbarer Share-Link mit fiktiven Spielernamen (z. B. „Demo-Elf 4-3-3"), der ohne Import nur betrachtbar ist

Output: App ist bereit, sich Fremden zu präsentieren. Du kannst den Demo-Link in jedem Trainer-Forum verlinken, ohne dass jemand sich erst anmelden oder etwas installieren muss.

**Nach 14 Tagen Stand:**
- Marken-Kandidat geklärt
- PNG-Loop verbessert
- Systembuch verifiziert
- Trainer-Resonanz auf Naming + Pricing vorhanden
- App ist demo-fähig

Erst **danach** kommt die schwere Arbeit (Feature-Flags, Paddle, Multi-Team, i18n).

---

## 7. 12-Monats-Pfad (kompakt)

| Monat | Code-Fokus | Marketing-Fokus | Ziel |
|---|---|---|---|
| **1** | 14-Tage-Schnellstart abschließen, dann Feature-Flags + Paddle-Integration starten | Trainer-Befragung, Naming-Check, Demo-Link, Verify | 50 organische Trainer im eigenen Kreis |
| **2** | Marken-Rebrand, Paywall-UI, Pro-Aktivierung live | Trainertalk.de Vorstellungs-Thread, LinkedIn-Story | 100–200 User, erste 5–10 zahlende |
| **3** | Multi-Team, i18n-Layer, Vereinslizenz-Stub | DACH-Launch über Mikro-Influencer, PR an Trainermagazin | 300–500 User, 20–40 zahlende |
| **4–6** | EN-UI + EN-Systembuch (Reviewer-Phase), Bug-Fixes | r/bootroom, UK-Trainerforen, ASO | 800–1.500 User, 50–100 zahlende |
| **7–9** | ES-UI + Polish + Onboarding-Iterationen | Capacitor-Wrapper + App-Store-Listings | 1.500–2.500 User, 100–200 zahlende |
| **10–12** | Vereinslizenz-Vollausbau, IT/FR-MT | Vereins-Direktansprache, B-Lizenz-Lehrgang-Demos | 2.500–4.000 User, 200–400 zahlende, 5–15 Vereinslizenzen |

**Realistisches 12-Monats-Ziel-ARR: €4.000–€10.000.**

---

## 8. Was wir bewusst NICHT machen

- ❌ Keine Cloud-Sync-Funktion (würde Privacy-USP verwässern)
- ❌ Kein Native-Rewrite vor Traktion (PWA + Capacitor reicht)
- ❌ Kein monatliches Abo als Standard (jährlich + Lifetime, kein Kündigungs-Stress)
- ❌ Keine Werbung im Free-Plan (zerstört Privacy-Vertrauen)
- ❌ Keine harte Paywall vor dem Aha-Moment (drei Schaufenster-Duelle bleiben frei)
- ❌ Kein DFB-/Verbands-Direktansprache vor 500 zahlende Nutzern
- ❌ Keine vierte Marktanalyse-KI — drei reichen
- ❌ Keine vorzeitige Investition in IT/FR/NL — erst nach EN-Validierung
- ❌ Keine Meta-Lookalike-Audience-Ads (Gemini-Empfehlung) — Targeting-Quelle fehlt, lieber Influencer + organisch

---

## 9. Offene Punkte, die diese Synthese NICHT beantwortet

Diese Punkte werden bewusst dem realen Launch überlassen:

- **Exakter Pricing-Punkt** (€19,90 vs. €24,90 vs. €29) — wird in Monat 3–4 mit echten Conversion-Daten geklärt
- **EN-Launch-Timing** (Monat 3 vs. Monat 6) — abhängig vom Reviewer-Recruiting und DACH-Feedback
- **Vereinslizenz-Preis** (€99/Jahr vs. €199/Jahr) — wird mit den ersten 5 Pilot-Vereinen ausgehandelt
- **Marketing-Budget-Allokation** — abhängig davon, wie organisches Wachstum anläuft

Diese vier Punkte sind keine Schwäche der Synthese, sondern korrekte
Anerkennung, dass sie **Markt-Fragen, nicht Analyse-Fragen** sind.
