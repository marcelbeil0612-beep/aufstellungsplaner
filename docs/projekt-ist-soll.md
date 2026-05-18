# Aufstellungsplaner · IST / SOLL · Wie weit vom Ziel

Stand: 2026-05-18. Single Source of Truth für „wo stehen wir, wo wollen
wir hin, was fehlt". Detail-Backlog: `docs/TODO.md`. Strategie:
`docs/market-analysis/synthesis.md`.

## Das Ziel (SOLL)

Ein **monetarisierbares Trainer-Tool**: lokale, datensparsame PWA für
Aufstellung, Kader, Wechselplan und ein taktisches Systembuch.
Free-Tier als Köder, Pro-Tier (Paddle, €24,90/J · €3,90/M · €49
Lifetime) als Umsatz. DACH zuerst, danach EN/Skalierung. „Produkt
fertig" = Free/Pro sauber getrennt, Marke + Bezahlung live, Onboarding
reibungsarm.

## IST — was steht und läuft

**Kern-App (stabil, getestet):**
- Aufstellungsbau, Kader-CRUD, Hungarian-Auto-Aufstellung, Wechselplan,
  Phasen (Mit/Gegen Ball), PNG-Export, Share-Link, Backup, PWA.
- Persistenz versioniert; Testsuite grün (`npm run test` 31/31),
  `npm run build` sauber.

**Systembuch (inhaltlich abgeschlossen + qualitätsgesichert):**
- 81/81 Duelle im 4-Phasen-Schema; Legacy-Schema entfernt; `phases`
  Pflichtfeld.
- Ratings spiegel-konsistent (0 harte Widersprüche, 0 weiche
  Asymmetrien) und Bias-rebalanciert (keine Reihe ohne Sieg/Niederlage;
  realistisch).
- Terminologie skriptweit vereinheitlicht (Glossar).
- UI: Reiter pro Phase + „Im Spiel"-Reiter; Vorwort/Erklärseite im
  Leerzustand (Lesart/Grenzen der Ampel).
- Regressions-Guard `npm run verify-duels` (Schema + Spiegel = harte
  Fails; Bias + Coverage = Report). Browser-Smoke-Test bestanden.

**Dokumentation:** TODO, Rating-Audit, Migration (archiviert),
Live-Coaching-Ausbau-Prompt, dieses IST/SOLL — alle auf Live-Stand.

## SOLL − IST = die Lücke

| Bereich | IST | SOLL | Distanz |
|---|---|---|---|
| Produktkern | vollständig, getestet | — | **0** (fertig) |
| Systembuch-Qualität | auditiert, rebalanciert, konsistent | — | **0** (fertig) |
| Systembuch-Inhalt | liveCoaching 1–3 | 5–6 pro Duell (alle 81) | **Q2-Content** offen, Mechanismus+Prompt+Gate bereit |
| Marke/Domain | nicht entschieden | Name fix, Domain, Stores geprüft | **S1/E1** offen (No-Code, deine Aufgabe) |
| Monetarisierung | keine | Feature-Gates + Paywall + Paddle live | **P2–P4** offen (größter Code-Block) |
| Wachstums-Polish | — | Onboarding, Demo-Link, Branding-Footer | **S2/S4/S5** offen |
| Validierung | KI-Hypothesen | Trainer-Befragung | **S6** offen (No-Code) |
| Skalierung | 1 Team, DE | Multi-Team, i18n, EN | **Monat 3–4+** (bewusst später) |

**Kurz:** Produktkern und Systembuch-Qualität sind am Ziel. Die Distanz
zum Umsatz-Ziel ist im Wesentlichen: (1) eine externe
Marken-Entscheidung, (2) der Monetarisierungs-Block P2–P4, (3) etwas
Wachstums-Polish. Inhaltlich offen ist nur noch der liveCoaching-Ausbau
(klar gescopt, Workflow bereit).

## Empfohlener Pfad zum Ziel (kürzeste sinnvolle Linie)

1. **S1 Marken-Check** (du, ~1 h, kein Code) — entsperrt S2 + P1.
2. **Q2-Content** liveCoaching 5–6 über den bereitliegenden
   KI-Workflow (`docs/livecoaching-ausbau-prompt.md`), dann Audit-Gate
   1–3 → 5–6 schließen.
3. **P1 Rebrand** → **S2 Branding-Footer** (Marke vorausgesetzt).
4. **P2 Feature-Flags → P3 Paywall-UI → P4 Paddle** — der eigentliche
   Monetarisierungs-Block, größter zusammenhängender Code-Aufwand.
5. **S4 Onboarding + S5 Demo-Link** parallel (Reichweite).
6. **S6 Trainer-Befragung** (du) validiert Preis/Naming vor P4-Launch.
7. Danach Skalierung (Multi-Team, i18n, EN) laut Backlog Monat 3–4+.

Engpass ist nicht die Technik, sondern die externen Entscheidungen
(Marke, Preis, Bezahl-Account) — die liegen bei dir und blocken den
restlichen Code-Pfad.
