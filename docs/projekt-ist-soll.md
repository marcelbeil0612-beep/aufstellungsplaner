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

**Monetarisierung (P2 + P3):**
- P2: `isPro` im Store (Migration v8→v9, lokal persistiert, NICHT in
  Backups), `proAccess.ts`, `<FeatureGate>`.
- P3: `usePaywallStore` + `PaywallDialog` (Wert + 3 Preisstufen,
  Checkout-Stub → P4) + `useProGuard`. Trigger verdrahtet &
  browser-verifiziert: Gegen-Ball-Phase, Beste Aufstellung,
  Wechselplan, Systembuch (3 Schaufenster-Duelle frei, Rest Pro).
- Offen: nur noch P4 (echter Paddle-Checkout + Lizenz-Validierung).

**Wachstums-Polish:**
- S4 Onboarding live: First-Run-Overlay mit drei Schritten, einmalig
  über eigenen localStorage-Key, ohne Store-Migration.
- S5 Demo-Link live: fester Link `…/#demo` zeigt eine read-only
  Beispiel-Aufstellung (fiktive Spieler, gerendert wie der PNG-Export,
  kein Import) — reibungsfreies Foren-/Werbe-Asset.
- Offen: nur noch S2 Branding-Footer (wartet auf Markenname S1).

**Dokumentation:** TODO, Rating-Audit, Migration (archiviert),
Live-Coaching-Ausbau-Prompt, dieses IST/SOLL — alle auf Live-Stand.

## SOLL − IST = die Lücke

| Bereich | IST | SOLL | Distanz |
|---|---|---|---|
| Produktkern | vollständig, getestet | — | **0** (fertig) |
| Systembuch-Qualität | auditiert, rebalanciert, konsistent | — | **0** (fertig) |
| Systembuch-Inhalt | liveCoaching 5–6 (alle 81) | — | **0** (fertig, Audit-Gate 5–6 aktiv) |
| Marke/Domain | nicht entschieden | Name fix, Domain, Stores geprüft | **S1/E1** offen (No-Code, deine Aufgabe) |
| Monetarisierung | Feature-Gates + Paywall live (P2+P3) | + echter Checkout/Lizenz | **P4** offen (Paddle) |
| Wachstums-Polish | Onboarding + Demo-Link erledigt | + Branding-Footer | **S2** offen (wartet auf S1) |
| Validierung | KI-Hypothesen | Trainer-Befragung | **S6** offen (No-Code) |
| Skalierung | 1 Team, DE | Multi-Team, i18n, EN | **Monat 3–4+** (bewusst später) |

**Kurz:** Produktkern und Systembuch (Qualität + Inhalt) sind komplett
am Ziel. Die Distanz zum Umsatz-Ziel ist rein: (1) eine externe
Marken-Entscheidung (S1, kein Code), (2) der Monetarisierungs-Block
(P2 + P3 erledigt → nur noch P4 Paddle: echter Checkout + Lizenz),
(3) nur noch S2 Branding-Footer im Wachstums-Polish (wartet auf S1).
Inhaltlich ist am Systembuch nichts mehr offen.

## Empfohlener Pfad zum Ziel (kürzeste sinnvolle Linie)

1. **S1 Marken-Check** (du, ~1 h, kein Code) — entsperrt S2 + P1.
2. **P1 Rebrand** → **S2 Branding-Footer** (Marke vorausgesetzt).
3. ~~P2 Feature-Flags~~ ~~P3 Paywall-UI~~ (erledigt) → **P4 Paddle** —
   echter Checkout + Lizenz-Validierung; letzter Baustein des
   Monetarisierungs-Blocks.
4. **S4 Onboarding** + **S5 Demo-Link** erledigt; offen nur S2 (nach S1).
5. **S6 Trainer-Befragung** (du) validiert Preis/Naming vor P4-Launch.
6. Danach Skalierung (Multi-Team, i18n, EN) laut Backlog Monat 3–4+.

(Q2-Content liveCoaching-Ausbau ist erledigt — war vormals Schritt 2.)

Engpass ist nicht die Technik, sondern die externen Entscheidungen
(Marke, Preis, Bezahl-Account) — die liegen bei dir. **Wichtig:** sie
blocken nur **P1 (Rebrand)** und **S2 (Branding-Footer)**. Der größte
Code-Block **P2 (Feature-Flag-Architektur)** hängt nicht am
Marken-Entscheid und kann sofort starten; P3 (Paywall-UI) braucht nur
den bereits in der Synthese festgelegten Preis, P4 (Paddle) den
Bezahl-Account. Heißt: an der Monetarisierung lässt sich auch ohne S1
unmittelbar echter Fortschritt machen.
