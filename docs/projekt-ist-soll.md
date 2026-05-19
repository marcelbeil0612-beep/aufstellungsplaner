# Aufstellungsplaner · IST / SOLL · Wie weit vom Ziel

Stand: 2026-05-19. Single Source of Truth für „wo stehen wir, wo wollen
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

**Live:** öffentlich deployt auf **`https://formaxi.de`** (Vercel,
korrekter Build verifiziert) — installierbare PWA, weltweit erreichbar.

**Kern-App (stabil, getestet):**
- Aufstellungsbau, Kader-CRUD, Hungarian-Auto-Aufstellung, Wechselplan,
  PNG-Export, Share-Link, Backup, PWA.
- **Form-Regler pro Phase (F1):** Breite/Höhe nutzergesteuert, je
  Phase gespeichert; Mit-/Gegen-Ball-Switch = offensive/defensive
  Ausrichtung (ersetzt die alte feste Phasen-Verschiebung). Defensiv
  zusätzlich 3 Pressinghöhen-Presets + Pressingzone + Störer-Linie
  (Feld + PNG). F1 (A+B) + **F2** umgesetzt: Block-Position und
  Linien-Kompaktheit getrennt — durchgängig enge Linien (Mit Ball
  deutlich enger, Gegen den Ball sehr eng), Höhe/Pressing verschiebt
  nur den Block (Abstand konstant). Slider-Drag-Bug behoben.
  F3: adaptive Chipgröße gegen Überlappen (Foto bleibt/kleiner,
  Namens-Pille blendet eng aus, Positions-Badge bleibt; PNG-Export
  unverändert groß).
- Persistenz versioniert (Store v11); Testsuite grün (`npm run test`
  56/56), `npm run build` sauber.

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
- Rechts-/Infoseiten live: `/preise /agb /datenschutz /widerruf
  /impressum` (statisch, `cleanUrls`, Footer-verlinkt, echte Daten,
  §19-Kleinunternehmer). Paddle KYB **verifiziert**.
- **P4 Code komplett** (env-gesteuert, sandbox-ready): Paddle.js-
  Checkout, ECDSA-Lizenz (Server signiert / Client verifiziert offline),
  `api/issue-license|refresh-license|paddle-webhook`, Store-Lizenz
  (v10→v11) + 90-Tage-Karenz, PaywallDialog mit Einlösen + Graceful-
  Stub. **Sandbox end-to-end live verifiziert** (Checkout→Lizenz→Pro
  auf formaxi.de).
- Offen: **Go-live geparkt** (Production-Env-Umstellung + Payout) —
  Nutzer priorisiert erst F2 Linien-Kompaktheit + Slider-Drag-Bug.

**Marke (S1/P1):**
- Name = **FormaXI**, `formaxi.de` gesichert. Rebrand live
  (Titel/Manifest/UI = FormaXI; Storage-IDs bewusst unverändert →
  kein Datenverlust). Logo/App-Icons live: FormaXI-Motiv als
  `assets/icon-source.png`, reproduzierbare Pipeline `npm run icons`
  → apple-touch/pwa/maskable; Favicon aus separater fetter
  Sondervariante (bei 16 px klar lesbar). Browser-verifiziert.
- Offen extern: nur noch DPMA-Anmeldung nach Profi-Markenrecherche
  (`formaxi.it` gegenprüfen).

**Wachstums-Polish:**
- S4 Onboarding live: First-Run-Overlay mit drei Schritten, einmalig
  über eigenen localStorage-Key, ohne Store-Migration.
- S5 Demo-Link live: fester Link `…/#demo` zeigt eine read-only
  Beispiel-Aufstellung (fiktive Spieler, gerendert wie der PNG-Export,
  kein Import) — reibungsfreies Foren-/Werbe-Asset.
- S2 Branding-Footer live: dezente „Erstellt mit FormaXI · formaxi.de"-
  Pille auf jedem exportierten/geteilten PNG.
- Anleitung/Hilfeseite live: statische `/hilfe` (10 Abschnitte) nach
  `/preise`-Muster — eigene SEO-/forenverlinkbare URL + In-App über
  `?`-Button (Header), Footer-Link und „Mehr erfahren" im Onboarding.
  Doppelnutzen: Nutzerhilfe + Marketing-Landing (Funnel `#demo` →
  `/hilfe` → App).
- Offen: nichts mehr im Polish-Block.

**Dokumentation:** TODO, Rating-Audit, Migration (archiviert),
Live-Coaching-Ausbau-Prompt, dieses IST/SOLL — alle auf Live-Stand.

## SOLL − IST = die Lücke

| Bereich | IST | SOLL | Distanz |
|---|---|---|---|
| Produktkern | vollständig, getestet | — | **0** (fertig) |
| Systembuch-Qualität | auditiert, rebalanciert, konsistent | — | **0** (fertig) |
| Systembuch-Inhalt | liveCoaching 5–6 (alle 81) | — | **0** (fertig, Audit-Gate 5–6 aktiv) |
| Marke/Domain | FormaXI fix, formaxi.de gesichert, Rebrand live | + Logo + DPMA-Anmeldung | **extern** (Grafik + Anwalt) |
| Monetarisierung | P2+P3+P4-Code; Paddle **Sandbox e2e verifiziert** | Production-Env + Payout (Go-live) | **geparkt** (Nutzer-Prio später) |
| Aufstellungs-Optik | F1 A+B + F2 live, Slider-Bug behoben | — | **0** (fertig) |
| Wachstums-Polish | Onboarding + Demo-Link + Branding-Footer live | — | **0** (fertig) |
| Validierung | KI-Hypothesen | Trainer-Befragung | **S6** offen (No-Code) |
| Skalierung | 1 Team, DE | Multi-Team, i18n, EN | **Monat 3–4+** (bewusst später) |

**Kurz:** Produktkern, Systembuch, P2/P3, Wachstums-Polish, Rebrand
und der **P4-Bezahlpfad (Sandbox end-to-end live verifiziert)** sind
fertig. Aufstellungs-Optik (F2 + Slider-Bug) ist erledigt. **Einziger
offener Code-Schritt: Paddle-Go-live** (Production-Env + Payout),
vom Nutzer bewusst noch geparkt. Rein extern: Logo-Grafik, DPMA, S6.

## Empfohlener Pfad zum Ziel (kürzeste sinnvolle Linie)

1. ~~S1 Marken-Check~~ erledigt (FormaXI, formaxi.de).
2. ~~P1 Rebrand~~ ~~S2 Branding-Footer~~ erledigt (Code-Teil).
3. ~~P2 Feature-Flags~~ ~~P3 Paywall-UI~~ erledigt → **P4 Paddle** —
   echter Checkout + Lizenz-Validierung; letzter Code-Baustein.
   Vorab ohne Account baubar: **P4a** (Lizenzschlüssel-UI, IndexedDB-
   Persistenz mit Offline-Karenz, `/api/validate-license`-Gerüst).
4. ~~S4 Onboarding~~ ~~S5 Demo-Link~~ erledigt.
5. **S6 Trainer-Befragung** (du) validiert Preis/Naming vor P4-Launch.
6. Extern: Logo-/Icon-Grafik + DPMA-Anmeldung nach Profi-Recherche
   (`formaxi.it` gegenprüfen).
7. Danach Skalierung (Multi-Team, i18n, EN) laut Backlog Monat 3–4+.

(Q2-Content liveCoaching-Ausbau ist erledigt — war vormals Schritt 2.)

Engpass ist nicht die Technik, sondern die externen Entscheidungen
(Marke, Preis, Bezahl-Account) — die liegen bei dir. **Wichtig:** sie
blocken nur **P1 (Rebrand)** und **S2 (Branding-Footer)**. Der größte
Code-Block **P2 (Feature-Flag-Architektur)** hängt nicht am
Marken-Entscheid und kann sofort starten; P3 (Paywall-UI) braucht nur
den bereits in der Synthese festgelegten Preis, P4 (Paddle) den
Bezahl-Account. Heißt: an der Monetarisierung lässt sich auch ohne S1
unmittelbar echter Fortschritt machen.
