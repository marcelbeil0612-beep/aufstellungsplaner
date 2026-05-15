# Marktanalyse-Material

Sammelort für externe Markt-/Strategie-Inputs. Roh-Quellen werden hier
abgelegt und am Ende zu einer **strategischen Entscheidungsnotiz**
zusammengefasst.

## Stand

| Quelle | Datum | Status |
| --- | --- | --- |
| [ChatGPT Pro mit Web-Suche](./chatgpt-pro-2026-05-15.md) | 2026-05-15 | ✅ eingegangen, Bewertung am Ende der Datei |
| [Gemini Pro](./gemini-pro-2026-05-15.md) | 2026-05-15 | ✅ eingegangen, Bewertung am Ende der Datei |
| Dritte Expertise (noch unbenannt) | – | ⏳ angekündigt |
| Synthese / Entscheidungsnotiz | – | 🟡 wartet auf alle Quellen |

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
- Branding/Namensentscheidung ohne Marken-/Domaincheck
- i18n-Refactor vor DACH-Validierung
- Pricing-Festlegung ohne Marken- und Rechtskonsultation

## Vorläufiger Konsens (2 von erwarteten 3 Quellen)

Beide Quellen sind sich in vielen Kernpunkten einig — das ist ein
starkes Signal, dass die Richtung stimmt.

### Übereinstimmungen

| Punkt | Konsens beider Quellen |
| --- | --- |
| **Positionierung** | Sweet Spot zwischen flachen Lineup-Bilder-Tools und überladenen Premium-/Cloud-Suites. Kein direkter Konkurrent von Hudl/Wyscout/SpielerPlus. |
| **Zielmarkt zuerst** | Ambitionierte Amateur- und Jugendtrainer (Kreis-/Bezirks-/Verbandsliga, U13–U19) in DACH. |
| **Marktgröße DACH** | Beide kommen auf ~140k bestätigte Teams + Co-Trainer/Modellierung. Konsens-Range: **160k–250k erreichbare Trainer**. |
| **Geschäftsmodell** | Freemium mit einmaligem Pro-Unlock. Kein Abo. |
| **Wachstumskanal #1** | Organischer Share-/PNG-Loop in WhatsApp-Trainergruppen → dezentes Branding im PNG-Export. |
| **Größter Konkurrent ist Status quo** | Whiteboard-Foto + Excel + Screenshot, nicht eine bestimmte App. |
| **Datenschutz als USP** | Beide: lokale Speicherung ohne Cloud ist im Jugendbereich (Minderjährigenfotos) ein echter Differenziator. |
| **Systembuch als Hauptdifferenziator** | Beide: die 81 Duelle sind das stärkste Asset, das kein Wettbewerber in dieser Tiefe hat. Gehört hinter die Paywall. |
| **Lokalisierung Englisch** | Beide priorisieren EN als erste Zusatzsprache. |
| **MT + menschlicher Coach-Reviewer pro Sprache** | Beide: KI-Übersetzung kostet praktisch nichts, Reviewer-Kosten ~300–500 € pro Sprache. |
| **App-Store erst bei Traktion** | Beide: PWA reicht technisch, Wrapper erst wenn Proof da ist. |
| **„Aufstellungsplaner" ist als Marke schwach** | Beide: deskriptiv, nicht international, nicht schützbar. Neuer Brandname nötig. |

### Widersprüche / unterschiedliche Empfehlungen

| Thema | ChatGPT Pro | Gemini Pro | Was die dritte Quelle klären sollte |
| --- | --- | --- | --- |
| **Reihenfolge Lokalisierung** | „Erst DACH validieren, dann EN" (12 Monate) | „EN sofort, vervielfacht Potenzial" | Wie groß ist der Reibungsverlust durch zweisprachiges Maintaining vs. der Vorteil internationaler Validierung? |
| **Naming-Favorit** | **TactoXI** (Taktik + Elf) | **PitchLogic** (Algorithmus-USP) | Welcher Name funktioniert wirklich in DE + EN + ES? Ist einer der vorgeschlagenen Namen bereits markenrechtlich vergeben? |
| **Pro-Preispunkt** | €29 einmalig oder €19/Jahr | €24,99 einmalig | Welche Preis-Studien gibt es für Indie-Sport-Apps? Ist €24,99 vs €29 messbar? |
| **Marketing-Budget-Allokation** | Breit verteilt: €1.200 Influencer, €1.000 Demo-Assets, €800 Paid-Tests, Rest auf Beta/PR/Reserve | Konzentriert: €3.500 in Meta-Ads, €800 Influencer, €700 Branding | Realistischer ROI für Meta-Ads in dieser spitzen Nische — gibt es Benchmarks? |
| **DFB-Verbandsweg** | Pessimistisch („national schwierig, lokal versuchen") | Pessimistisch („Verbandsmühlen mahlen langsam, lieber Fachmagazine") | Konsens hier. |
| **TacticalPad-Jahrespreis** | €26–€59 je Paket | €24–€63 je Paket | Minor — Quellen-Schnappschuss zu unterschiedlichen Zeitpunkten. |

### Zusätzliche Insights aus Gemini, die ChatGPT übersehen hat

- **Easy2Coach** als Wettbewerber (deutscher Markt, B2SMB-SaaS, ~€80/Jahr Premium / ~€399/Jahr Vereinslizenz). Ergänzt das Bild im Mittelfeld zwischen Indie-Tool und Enterprise.
- **B-Lizenz-Curriculum-Match**: Die 81 Duelle decken sich strukturell mit dem B-Lizenz-Stoff (Mannschaftstaktik, Systeme coachen). Das ist ein konkreter Verkaufs-Hook für Lehrabende und Trainerfortbildung.
- **„Soccer Moms/Dads + High-School-Coaches"** als US-Sub-Zielgruppe — andere Zahlungsbereitschaft als DACH, vor allem in Privatschulen und Club-Soccer.

### Zusätzliche Insights aus ChatGPT, die Gemini übersehen hat

- Detaillierte Quellen für DACH-Zahlen (DFB, SFV, Sport Austria mit konkreten Mitglieds-/Vereinszahlen)
- **„Lifetime Early Supporter"** als zeitlich begrenztes Angebot (Beta-Anker) — gute Idee für initiale Conversion
- Explizit benannte **Marken-Kollisionen**: LineupLab, SquadPilot, CoachDeck bereits vergeben (eigene Web-Recherche)
- Konkrete **Sprach-Lokalisierungs-Tiefen-Tabelle**: was nur UI-Strings sind vs. was Coach-Sprache braucht

### Wo beide Quellen blinde Flecken haben

Beide beantworten **diese praktischen Implementierungsfragen nicht**:

1. **Free/Pro-Trennung technisch:** Wie verhindert man Piracy bei einer Client-Only-PWA ohne Server? Lizenzschlüssel? Trust-Model? App-Store-IAP (was dann den App-Store-Wrapper voraussetzt)?
2. **Zahlungsabwicklung:** Stripe Checkout? Paddle (handhabt EU-VAT)? LemonSqueezy? Direkt-App-Store? Welche Lösung passt zu einer Privacy-First-PWA, ohne sie zu untergraben?
3. **Konkrete Lookalike-Audience-Quelle für Meta-Ads:** Gemini empfiehlt Meta-Ads-Spend, aber woher die Lookalike-Seed-Audience kommen soll, bleibt offen.
4. **Update-/Support-Verpflichtungen bei Lifetime-Modell:** Wenn jemand €29 einmalig zahlt, was wird ihm an Updates garantiert? Für wie viele Jahre?
5. **Datenschutz-Marketingclaim rechtlich:** „Ohne Cloud, ohne Login" als Hauptverkaufsargument — wie nahe darf die DSGVO-Werbung kommen, ohne Verbraucherzentrale-Risiko?

Die dritte Quelle sollte idealerweise diese Lücken füllen — oder zumindest eine andere strategische Perspektive einbringen, die beide bisher zu wenig beleuchten.
