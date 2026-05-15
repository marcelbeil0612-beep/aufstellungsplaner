# Marktanalyse-Prompt für externe KI

Kopier den Block unten in eine starke KI (Claude.ai mit Web-Suche, Gemini Deep Research, GPT-5 mit Web-Browsing). Antwort sollte strukturiert mit konkreten Zahlen/Quellen kommen. Web-Suche aktivieren, damit Konkurrenten + Marktgrößen aktuell recherchiert werden statt halluziniert.

---

````markdown
Du bist Senior Product-Marketing-Researcher und Go-to-Market-Strategist
mit Schwerpunkt Sport-Tech und B2C/B2SMB-SaaS. Bitte recherchiere im
Web (aktuelle Konkurrenten, Marktgrößen, App-Store-Preise) statt zu
schätzen, wo möglich. Wenn du etwas nicht recherchieren kannst, sag es
explizit.

# Produkt: „Aufstellungsplaner" (Arbeitstitel)

Web-App + PWA für Fußballtrainer. Aktuell auf Deutsch, gebaut vom Indie-
Entwickler/Trainer für die eigene Mannschaft (Amateur-/Jugendbereich)
und auf Herz und Nieren in echten Spielsituationen erprobt. Quellcode
und Datenhoheit liegen beim Entwickler; kein Login, kein Server,
keine Cloud.

## Was die App kann (Feature-Inventar)

### Aufstellung & Formationen
- 10 vorkonfigurierte Formationen: 4-3-3, 4-3-3 (False 9), 4-2-3-1, 4-4-2,
  4-4-2 (Raute), 3-5-2, 3-4-3, 5-3-2, 5-4-1, 4-1-4-1
- Drag-and-Drop von Spielern auf 11 Slots, Touch-optimiert (iPad/iPhone)
- Phasen-Umschalter „Mit Ball / Gegen den Ball": Slot-Koordinaten
  verschieben sich dynamisch je Position (z. B. Außenverteidiger
  schieben offensiv hoch, defensiv tucken sie nach innen)
- Modernes SVG-Spielfeld mit Vignette, Linien-Glow, Rasenstreifen

### Kader-Verwaltung
- Spieler-CRUD: hinzufügen, umbenennen, löschen
- Spielerfotos (komprimiert in separatem IDB-Store, kein Aufblähen
  des Haupt-States)
- Trikotnummern + Status-Badge: verfügbar / verletzt / gesperrt / abwesend
- Skill-Werte 1–99 je Spieler:
  - Feldspieler: Tempo, Schuss, Pass, Dribbling, Verteidigung, Physis
  - Torhüter: Reflexe, Fangen, Flugparaden, Stellungsspiel, Abschlag, Tempo
- Stammpositionen (1–3 bevorzugte Positionen pro Spieler) → fließt mit
  +5 Score-Bonus in die Auto-Aufstellung ein

### Auto-Aufstellung („Beste Aufstellung")
- Mathematisch optimale Zuordnung Spieler → Position via
  **Hungarian-Algorithmus** (Jonker-Volgenant-Variante)
- Score je Spieler × Position mit Positions-Gewichtungen, angelehnt an
  FIFA-/Wyscout-Profile
- Berücksichtigt fehlende Skills mit neutralem 50er-Ersatzwert
  (transparent in der UI)
- Vorschau-Dialog mit Per-Slot-Score + Akzeptier-Button

### Speichern & Wiederverwenden
- Beliebig viele benannte Aufstellungen mit Erstell- und Update-Datum
- „Aktive Aufstellung" mit „Änderungen speichern"-Hinweis
- Daten-Backup als JSON-Datei (Export + Import) mit Magic-Header und
  versionierter Migration

### Teilen
- **PNG-Export** der Aufstellung (1000×1500 Canvas-Rendering mit
  Spielfeld-Linien, Spielerchips inkl. Foto/Initialen, Trikotnummer,
  Status, Positions-Badge). Trainer teilen das direkt in
  WhatsApp-Gruppen.
- **Share-Link** als `#share=base64...`-Hash im URL-Fragment:
  Co-Trainer öffnet den Link, App matcht Spieler über Namen, legt
  Aufstellung als neuen Eintrag an. Komplett P2P, keine Server-Infra.

### Wechselplan
- Bis zu N geplante Substitutionen pro Aufstellung mit Minute,
  Spieler-raus, Spieler-rein, freier Notiz
- Wird beim Speichern an die Aufstellung gebunden, beim Laden wieder
  hergestellt

### Spielprotokoll
- Match-Log mit Datum, Gegner, Heim/Auswärts, Ergebnis,
  optionaler Verknüpfung zu einer gespeicherten Aufstellung, Notizen
- Sortiert nach Datum, Ergebnis-Badge mit Sieg/Niederlage/Remis

### Systembuch (taktisches Nachschlagewerk)
- **Vollständige 9×9-Matrix: 81 System-vs-System-Duelle** komplett
  ausgearbeitet (kein anderes Tool dürfte das in dieser Tiefe haben).
- Pro Duell:
  - Ampel-Rating (vorteilhaft / ausgeglichen / unangenehm)
  - Spielcharakter (1–2 Sätze)
  - Unsere Vorteile, unsere Gefahren
  - Wichtige Räume / Halbräume
  - Pressing-Zuordnung
  - Ballbesitz-Lösungen
  - Umschalt-Verhalten
  - Live-Coaching-Zurufe (in Anführungszeichen, max. 4 Worte)
  - Mögliche Ingame-Anpassungen
- Drei Detailtiefen: **Spieltag** (kompakt), **Trainer** (alles),
  **Training** (mit Trainingsformen, perspektivisch ausbaubar)
- Phasen-Highlighter: Knöpfe „Aufbau / Pressing / Ballbesitz /
  Umschalten / Verteidigen" heben die relevanten Sections hervor,
  Rest wird ausgegraut → super Spieltags-Tool für die Coachzone

### Technik & UX
- PWA: installierbar als App auf iPad/iPhone/Android/Desktop,
  offline-tauglich, App-Icon auf dem Homescreen
- 100% clientseitig: IndexedDB, keine Datenbank, kein Backend,
  kein Login, keine Tracker, keine Werbung
- Versionierte Schema-Migrationen (v1 → v8), Backup-Imports laufen
  durch dieselbe Migrations-Kette
- Drag-Mechanik mit DragOverlay-Pattern (sauberes Gefühl, keine
  Layout-Sprünge)
- Safe-Area-Insets, iOS-Install-Hint, Touch-Sensor mit 80 ms Delay
- 25 Unit-Tests, sauberer TypeScript-Build

## USPs (was die App von Konkurrenten unterscheidet)

1. **Privacy by design**: alle Daten lokal, kein Account, keine Cloud.
   Trainer im Jugendbereich + Datenschutz für Minderjährigenfotos =
   echtes Problem, das viele kommerzielle Tools schlecht lösen.
2. **Mathematisch optimale Auto-Aufstellung**: Hungarian-Algorithmus
   statt Greedy-Heuristik. Bei 25-Mann-Kader und 11 Slots löst er das
   echte Zuordnungsproblem, nicht eine schnelle Schätzung.
3. **Systembuch mit kompletter 9×9-Matrix**: 81 ausgearbeitete
   System-Duelle aus Trainer-Perspektive. Konkurrenz hat eher
   isolierte Lehrbuchartikel oder Video-Kurse, nicht ein direkt am
   Spieltag nutzbares Nachschlagewerk.
4. **Phasen-Umschalter „mit/gegen Ball"**: dynamische Slot-Koordinaten
   pro Position. Die meisten Tools sind statisch.
5. **PNG- und Link-Export**: WhatsApp-tauglicher Output, P2P-Sharing
   ohne Backend. Senkt Reibung im Trainer-Alltag deutlich.
6. **Wechselplan + Spielprotokoll**: Saison-Tracking ohne Excel.
7. **Indie / Open-Source-Optik**: kein Subscription-Zwang, keine
   In-App-Käufe, keine Cookies. Sympathisch für Trainerszene.

## Aktuelle Limitierungen / nicht implementiert

- **Nur Deutsch** (UI-Strings, Positionsbezeichnungen, Systembuch-Texte
  alle hartkodiert in DE)
- Keine Multi-Team-Workspaces (ein Kader pro Installation; Trainer mit
  U13 + U15 muss zwei Browser-Profile nutzen)
- Kein Trainings-Modul mit Übungen (Datenstruktur ist vorbereitet,
  Inhalte fehlen)
- Keine Video-Integration, keine GPS/Tracking-Daten
- Keine Cloud-Synchronisation zwischen Geräten (nur Backup-Datei)

## Tech-Stack (für Einschätzung der Skalierbarkeit)

- React 18 + TypeScript + Vite
- Tailwind CSS, Zustand (State-Management), @dnd-kit (Drag-and-Drop)
- IndexedDB via idb-keyval (Persistenz + Photo-Blobs)
- Vite-Plugin-PWA (Service Worker, Web-Manifest)
- Hosting: Vercel-fähig (statisches Bundle)
- Bundle: ~300 KB gzip

# Was ich von dir brauche

Strukturierte Marktanalyse + Go-to-Market-Empfehlung. Bitte mit
**konkreten Zahlen und Quellen** (Web-Suche), nicht halluzinierten
Schätzungen. Sag explizit, wenn du etwas nicht verifizieren kannst.

## 1. Zielgruppen-Analyse

- Wer sind die primären / sekundären Zielgruppen?
  (Jugendtrainer Kreisliga, Damen, Altherren, Schulsport, Futsal …)
- Wie groß ist die jeweilige Zielgruppe in DACH (Zahlen, Quellen)?
- Welche Pain-Points hat sie heute, wie löst sie die aktuell?
- Welche Trainerausbildung passt am besten zur Sprache und Tiefe
  des Systembuchs (B-Lizenz, C-Lizenz, Schulsport-Lehrer, …)?

## 2. Konkurrenz-Analyse (DACH + global)

Recherchiere und vergleiche aktuelle Konkurrenten, sortiert nach
Marktsegment:

- Indie/Free-Tools (z. B. lineup-builder-Webseiten)
- Premium-Apps (TacticalPad, Coach Tactic Board, etc.)
- Enterprise-Profi-Tools (Wyscout, Hudl, StatsBomb)
- Generische Whiteboard-Apps, die zweckentfremdet werden

Pro Konkurrent: Funktionen, Preis, Plattformen, Sprachen, geschätzte
Nutzerzahl/Downloads, Stärken, Schwächen. Wo ist die Lücke, in die der
Aufstellungsplaner stößt?

## 3. Geschäftsmodell-Optionen

Bewerte die folgenden Modelle mit Pro/Contra und realistischer
ARPU-Schätzung:

a. Komplett kostenlos / Open-Source mit „Buy me a coffee"
b. Freemium: Grundfunktionen frei, Premium-Features kostenpflichtig
   (welche Features lassen sich gut paywallen, ohne die App zu
   verkrüppeln?)
c. One-Time-Purchase (App-Store-Pay-Once)
d. Abo, monatlich/jährlich
e. Vereins-Lizenz (B2SMB): mehrere Trainer + Mannschaften pro Verein
f. Sponsoring / Affiliate (Sportausrüster, Vereinsbedarf)
g. Spendenmodell / Patreon

Empfiehl ein konkretes Primärmodell und ggf. ein Sekundärmodell.

## 4. Lokalisierung / Mehrsprachen-Strategie

Die App ist aktuell rein deutsch. UI-Strings, Positionsbezeichnungen
(z. B. „Linker Verteidiger" / „Innenverteidiger") und vor allem das
**Systembuch mit 81 Duellen** sind in der Sprache verfasst, die
deutsche Trainer in der Coachzone sprechen.

a. Priorisiere die Top 5–7 Zielsprachen nach Markt-Potenzial und
   gleichzeitig Wettbewerbsdichte. Pro Sprache:
   - geschätzte Anzahl aktiver Vereinstrainer
   - dominante Konkurrenz vor Ort
   - Trainer-Kultur (eher datenaffin, eher klassisch, eher
     Video-getrieben)
   - Preisniveau (was zahlen Trainer dort für vergleichbare Tools)
b. Welche Inhalte sind „nur Wörter tauschen" (UI-Strings) und welche
   brauchen echte Lokalisierung mit Fachvokabular (Systembuch)?
   Lohnt sich ein Sprachpaar pro Lizenz?
c. Reicht eine maschinelle Übersetzung mit menschlichem Reviewer
   oder braucht es einen einheimischen Co-Trainer pro Sprache?
   Was kostet das je Sprache realistisch?
d. KI-gestützte Übersetzung des Systembuchs (81 Einträge × ~10
   Bullet-Listen): wie hoch sind die Token-Kosten bei Claude/GPT?

## 5. Vermarktungskanäle (Akquise)

Bewerte jeden Kanal nach Aufwand, voraussichtlichem CAC und Eignung
für das Produkt:

- Trainer-Foren (Reddit /r/Soccer, /r/bootroom, deutsche
  Trainerforen, soccer-coach.de, soccerdrive.com, …)
- YouTube-Trainer-Channels (Coaches‘ Voice, Match of the Day Tactics,
  deutsche Taktik-YouTuber)
- WhatsApp-Trainergruppen (organisch über Share-Link-Feature)
- TikTok / Instagram Reels (Aufstellung als animierte Grafik?)
- DFB-/UEFA-Trainerausbildung (kann man als „Übungstool" platzieren?)
- App-Store-SEO (welche Keywords?)
- Newsletter-Sponsoring von Taktik-Newslettern
- Influencer-Trainer (Mikro-Influencer mit < 50 k Followern)
- Vereins-Direktansprache (DFB-Kreisverbände, Landesverbände)
- PR: Trainerzeitschriften (DFB-Trainermagazin, Trainermagazin AT/CH)

## 6. Branding / Naming

„Aufstellungsplaner" ist deskriptiv, SEO-stark in Deutsch, aber als
Brand:
- schwer aussprechbar für Englischsprachige
- generisch, schwer schützbar
- in anderen Sprachen unbrauchbar

Schlage 3–5 alternative Markennamen vor, die:
- in mindestens 3 Sprachen funktionieren (DE/EN/ES)
- aussprechbar sind (max. 4 Silben)
- domaintechnisch realistisch verfügbar sind (.app / .com / .io)
- nicht mit existierenden Marken kollidieren (Marken-Check empfehlen)
- den Trainer-Fokus klar machen ohne lehrbuchhaft zu wirken

## 7. Roadmap-Priorisierung

Wenn nur 3 Monate Entwicklungszeit + 5.000 € Marketingbudget zur
Verfügung stünden: was würdest du in welcher Reihenfolge tun, um in
12 Monaten eine selbsttragende Nutzerbasis aufzubauen?

# Antwortformat

- Strukturiert nach den 7 Sektionen oben
- Konkrete Zahlen mit Quelle (oder explizit „nicht verifizierbar")
- Pro/Contra-Tabellen, wo es passt
- Zum Schluss eine **3-Punkte-Empfehlung** (was als Erstes anpacken)
- Deutsch oder Englisch, deine Wahl — Hauptsache präzise
````

---

## Tipps für die Nutzung

- **KI-Wahl**: Web-Recherche ist hier essenziell. Claude.ai mit Search oder Gemini Deep Research liefern hier deutlich bessere Ergebnisse als ein Modell ohne Web-Zugang.
- **Schicke den Block in einem Stück**, nicht zerstückelt. Die Sektionen referenzieren sich.
- **Iteriere**: nach der ersten Antwort gerne Folge-Fragen stellen („zoom in auf den spanischen Markt", „rechne den Freemium-Case mit 200 zahlenden Trainern durch").
- **Vorsicht bei Zahlen**: Auch web-recherchierende KIs erfinden gerne präzise Zahlen. Frag explizit „mit Quelle bitte" oder vergleiche zwei Quellen.
