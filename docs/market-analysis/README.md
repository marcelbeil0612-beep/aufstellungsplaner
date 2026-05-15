# Marktanalyse-Material

Sammelort für externe Markt-/Strategie-Inputs. Roh-Quellen werden hier
abgelegt und am Ende zu einer **strategischen Entscheidungsnotiz**
zusammengefasst.

## Stand

| Quelle | Datum | Status |
| --- | --- | --- |
| [ChatGPT Pro mit Web-Suche](./chatgpt-pro-2026-05-15.md) | 2026-05-15 | ✅ eingegangen, Bewertung am Ende der Datei |
| [Gemini Pro](./gemini-pro-2026-05-15.md) | 2026-05-15 | ✅ eingegangen, Bewertung am Ende der Datei |
| [Dritte Quelle](./third-research-2026-05-15.md) (vermutlich Claude.ai mit Web-Suche) | 2026-05-15 | ✅ eingegangen, Bewertung am Ende der Datei |
| Synthese / Entscheidungsnotiz | – | 🟡 bereit zu starten, sobald keine weitere Quelle erwartet wird |

## Workflow

1. Jede externe Analyse landet als eigene MD-Datei in diesem Ordner.
   Volltext + kurze Bewertung am Ende (Stärken, zu validieren, Lücken).
2. Wenn alle Inputs da sind: **Synthese** in `synthesis.md`. Konsens-
   Aussagen, Widersprüche, finale Strategieempfehlung.
3. Aus der Synthese werden konkrete **Code-Implikationen** ins
   [TODO.md](../TODO.md) übertragen (z. B. „PNG-Branding-Footer",
   „Free/Pro-Feature-Gates", „Multi-Team-Workspace").

## Was noch NICHT passieren sollte

- Code-Änderungen auf Basis einer einzelnen Quelle (selbst wenn gut)
- Branding/Namensentscheidung ohne Marken-/Domaincheck (alle drei
  Quellen warnen davor!)
- i18n-Refactor vor expliziter Strategie-Entscheidung
- Pricing-Festlegung — die drei Quellen empfehlen drei verschiedene
  Preispunkte (€19,90/J · €24,99 einmalig · €29 einmalig oder €19/J)

## 3-Quellen-Konsens (sehr stark)

Punkte, in denen alle drei Quellen unabhängig zur selben Empfehlung kommen.
Das ist die **belastbarste Basis** für eine Entscheidung.

| Punkt | Konsens aller drei Quellen |
| --- | --- |
| **Positionierung** | Sweet Spot zwischen flachen Lineup-Bilder-Tools und überladenen Premium-/Cloud-Suites. Kein direkter Konkurrent von Hudl/Wyscout/SpielerPlus. |
| **Zielmarkt zuerst** | Ambitionierte Amateur- und Jugendtrainer (Kreis-/Bezirks-/Verbandsliga, U13–U19) in DACH. |
| **Curriculum-Match** | Inhalte des Systembuchs passen zur **B-Lizenz**-Ausbildung (alle drei nennen das explizit). |
| **Marktgröße DACH** | Konsens-Range: **150k–400k erreichbare Trainer/Teams** (je nach Methodik der Schätzung). |
| **Geschäftsmodell** | Freemium mit Pro-Unlock. Kein Abo-Zwang. |
| **Wachstumskanal #1** | Organischer Share-/PNG-Loop in WhatsApp-Trainergruppen → dezentes Branding im PNG-Export. |
| **Wachstumskanal #2** | Indie-Story in Trainer-Foren (Trainertalk.de DE / r/bootroom EN). |
| **Größter Konkurrent ist Status quo** | Stift, Zettel, Whiteboard-Foto, Excel — keine bestimmte App. |
| **Datenschutz als USP** | Lokale Speicherung ohne Cloud ist im Jugendbereich (Minderjährigenfotos) ein echter Differenziator. |
| **Systembuch ist Hauptdifferenziator** | Die 81 Duelle sind das stärkste Asset — schwer kopierbar, da monatelange Trainer-Arbeit. Gehört (teilweise) hinter Paywall. |
| **Lokalisierung Englisch zuerst** | Alle drei priorisieren EN als erste Zusatzsprache (Reihenfolge danach: ES → IT/FR/NL). |
| **Pro Sprache: MT + Coach-Reviewer** | KI-Übersetzung kostet praktisch nichts (€0,50–€5), Reviewer-Kosten ~300–1.500 € pro Sprache. |
| **App-Store erst bei Traktion** | PWA reicht technisch. Wrapper (Quelle 3: Capacitor) erst wenn Proof da ist. |
| **„Aufstellungsplaner" als Marke schwach** | Deskriptiv, nicht international, schwer schützbar. Neuer Brandname nötig — **alle drei warnen vor Naming ohne formellen Marken-/Domain-Check** (DPMA, EUIPO, WIPO). |
| **DFB-/Verbandsweg langsam** | Alle drei pessimistisch bei direkter DFB-Kooperation, optimistischer bei lokalen Landesverbänden + Fachmagazinen. |

## Punkte mit unterschiedlicher Empfehlung

| Thema | ChatGPT Pro | Gemini Pro | Dritte Quelle | Wer hat den besten Punkt? |
| --- | --- | --- | --- | --- |
| **EN-Lokalisierungs-Reihenfolge** | erst DACH validieren (12 Monate), dann EN | EN sofort, vervielfacht Potenzial | EN als Priorität in Monat 1, parallel zum DACH-Launch | Quelle 3: pragmatischer Mittelweg, da EN-MT-Kosten praktisch null sind und der Reviewer-Aufwand parallel laufen kann |
| **Naming-Favorit** | TactoXI | PitchLogic | Matchplan (Favorit) + Lineable / Squadlab / Frontfoot / Vantage11 / Coachboard / Coachly | Keiner — **alle drei sind sich einig, dass ein formeller Marken-/Domain-Check zwingend ist**. Entscheidung erst nach Check. |
| **Pro-Preispunkt** | €29 einmalig oder €19/Jahr | €24,99 einmalig | €19,90/Jahr oder €2,99/Monat | Quelle 3 wirkt am besten begründet (Anker easy2coach €79,99/J vs. SpielerPlus ab €9,99/M), aber das ist eine Test-Frage, keine Recherche-Frage |
| **Marketing-Budget-Allokation** | breit verteilt mit Reserve | konzentriert in Meta-Ads (€3.500) | breit, kein Meta-Ads, dafür Mikro-Influencer + Vereinspilot + Mini-PDF-Marketing | Quelle 3: Gemini's Meta-Ads-Empfehlung mit Lookalike Audiences von Trainermagazinen ist in der Praxis schwierig umzusetzen |
| **Positionierung gegenüber SpielerPlus** | nicht explizit | „komplementär", aber nicht ausgearbeitet | **explizit „Coaching-Companion neben SpielerPlus, nicht Ersatz"** | Quelle 3 hat die schärfste und realistischste These |
| **Free-Tier-Cut** | Free: 1 Team, begrenzte Aufstellungen, PNG mit Branding, „9 Beispielduelle" | Free: 1 Team, Basis-Formationen, PNG-Export | Free: 1 Team, alle Formationen, PNG, Spielprotokoll, **3 konkret benannte Systembuch-Duelle** als Schaufenster | Quelle 3 ist am konkretesten und Conversion-orientiert |

## Wichtigste neue Erkenntnisse aus Quelle 3

1. **SpielerPlus hat 410.000 Teams + DFBnet-Anbindung.** Realistische Konkurrenzlage: SpielerPlus ist der unangreifbare Kommunikations-Layer. Konsequenz: **nicht versuchen, SpielerPlus zu ersetzen** — als „Coaching-Companion" daneben positionieren.
2. **1,7 Millionen Ehrenamtliche im DFB-Umfeld, viele ohne Lizenz** („der Papa, der ausgeholfen hat"). Das verkleinert die wirklich erreichbare Zielgruppe drastisch — das Systembuch ist nicht für jedermann, sondern für die **Subgruppe mit C-/B-Lizenz oder in Ausbildung**.
3. **Mini-PDFs als Top-of-Funnel:** 5–10 Systembuch-Duelle als kostenlose Lead-Magnete (mit Watermark). Stärkster Reach-Hack, der monatelange Trainer-Arbeit als Marketing-Asset nutzbar macht.
4. **Capacitor-Wrapper** für App-Store-Sichtbarkeit ohne Rewrite — die App bleibt eine PWA, gewinnt aber App-Store-Listing-Sichtbarkeit.
5. **Konkrete 12-Monats-ARR-Prognose:** €2.400–8.400/Jahr + €500–1.500/Jahr aus 5–15 Vereinslizenzen. Realistisch, nicht euphorisch.

## Vorsichtshinweise / Halluzinations-Verdacht

- **Quelle 3 erwähnt „SV Steinheim" und „Bayern-Trainer-Kreis"** als angeblich vorhandene Vereins-Anbindung des Nutzers. Diese Information stand nirgendwo im Prompt. → Vor Distributionsplanung explizit verifizieren, ob ein solcher Trainerkreis existiert.
- **Quelle 3 nennt deutsche Mikro-Influencer „Trainerbüro, Taktiklabor, Maurice Welter"** — bitte selbst auf Existenz, Reach und Themenfit prüfen, bevor Outreach-Listen daraus gebaut werden.
- **SpielerPlus-Nutzerzahlen** unterscheiden sich zwischen den Quellen (Gemini „5M+ Nutzer", Quelle 3 „410k Teams + 4,5M User"). Beide aus Anbieter-Selbstauskunft, beide nicht unabhängig verifiziert.

## Gemeinsame blinde Flecken aller drei Quellen

Keiner der drei Outputs beantwortet:

1. **Piracy-Schutz bei Client-Only-PWA** ohne Server-Validierung — Lizenzschlüssel? Trust-Model? Akzeptierter Verlust?
2. **Konkrete Zahlungsabwicklung** Stripe Checkout vs. Paddle (handhabt EU-VAT) vs. LemonSqueezy vs. App-Store-IAP nach Capacitor-Wrapper
3. **DSGVO-Marketing-Claim rechtlich** — „Ohne Cloud, ohne Login" als Hauptverkaufsargument darf wie nahe an „DSGVO-konform" werben?
4. **Update-/Support-Versprechen** beim Lifetime-Modell (falls Quelle 1/2 gewählt) — was bekommt der Käufer für €29 einmalig?
5. **Konversion-Rate-Benchmarks** für Indie-Sport-Apps mit Freemium-Modell — die genannten 5–12 % Pro-Konversion sind Erfahrungswerte, keine Benchmark-Studie.

Diese fünf Punkte werden in der Synthese zur **Liste offener strategischer Entscheidungen**, die der Nutzer selbst klären muss (oder mit einer vierten, sehr spezifischen Anfrage an z. B. einen Steuer-/Marken-/Datenschutzanwalt).
