# Systembuch-Migration · Checkliste

Stand: 2026-05-15. Migration aller 81 Duelle vom alten Sammel-Schema
ins **Vier-Phasen-Modell**.

**Status: 10 / 81 migriert (12 %).**

Diese Datei wird nach jedem Migrat aktualisiert. Du kannst sie zusätzlich
zum [Migrations-Prompt](./migration-prompt.md) deiner externen KI mitgeben,
damit sie sieht, was noch fehlt und was schon fertig ist.

## Statussymbole

- ✅ = im neuen 4-Phasen-Schema gepflegt
- ⬜ = noch im alten Schema, Migration offen
- 🟨 = Pilot (manuell von Claude migriert als Qualitäts-Anker)

---

## 4-3-3 · 9 / 9 migriert ✨

- 🟨 `4-3-3_vs_4-4-2` *(Pilot)*
- ✅ `4-3-3_vs_4-2-3-1`
- ✅ `4-3-3_vs_4-4-2-raute`
- ✅ `4-3-3_vs_3-5-2`
- ✅ `4-3-3_vs_3-4-3`
- ✅ `4-3-3_vs_5-4-1`
- ✅ `4-3-3_vs_4-3-3`
- ✅ `4-3-3_vs_4-1-4-1`
- ✅ `4-3-3_vs_5-3-2`

## 4-2-3-1 · 1 / 9 migriert

- ✅ `4-2-3-1_vs_4-4-2`
- ⬜ `4-2-3-1_vs_4-3-3`
- ⬜ `4-2-3-1_vs_3-5-2`
- ⬜ `4-2-3-1_vs_5-3-2`
- ⬜ `4-2-3-1_vs_4-2-3-1`
- ⬜ `4-2-3-1_vs_4-4-2-raute`
- ⬜ `4-2-3-1_vs_3-4-3`
- ⬜ `4-2-3-1_vs_5-4-1`
- ⬜ `4-2-3-1_vs_4-1-4-1`

## 4-4-2 · 0 / 9 migriert

- ⬜ `4-4-2_vs_4-3-3`
- ⬜ `4-4-2_vs_3-4-3`
- ⬜ `4-4-2_vs_4-2-3-1`
- ⬜ `4-4-2_vs_4-4-2`
- ⬜ `4-4-2_vs_4-4-2-raute`
- ⬜ `4-4-2_vs_3-5-2`
- ⬜ `4-4-2_vs_5-3-2`
- ⬜ `4-4-2_vs_5-4-1`
- ⬜ `4-4-2_vs_4-1-4-1`

## 4-4-2 (Raute) · 0 / 9 migriert

- ⬜ `4-4-2-raute_vs_4-3-3`
- ⬜ `4-4-2-raute_vs_4-2-3-1`
- ⬜ `4-4-2-raute_vs_4-4-2`
- ⬜ `4-4-2-raute_vs_4-4-2-raute`
- ⬜ `4-4-2-raute_vs_3-5-2`
- ⬜ `4-4-2-raute_vs_3-4-3`
- ⬜ `4-4-2-raute_vs_5-3-2`
- ⬜ `4-4-2-raute_vs_5-4-1`
- ⬜ `4-4-2-raute_vs_4-1-4-1`

## 3-5-2 · 0 / 9 migriert

- ⬜ `3-5-2_vs_4-3-3`
- ⬜ `3-5-2_vs_4-4-2`
- ⬜ `3-5-2_vs_4-2-3-1`
- ⬜ `3-5-2_vs_4-4-2-raute`
- ⬜ `3-5-2_vs_3-5-2`
- ⬜ `3-5-2_vs_3-4-3`
- ⬜ `3-5-2_vs_5-3-2`
- ⬜ `3-5-2_vs_5-4-1`
- ⬜ `3-5-2_vs_4-1-4-1`

## 3-4-3 · 0 / 9 migriert

- ⬜ `3-4-3_vs_4-3-3`
- ⬜ `3-4-3_vs_4-2-3-1`
- ⬜ `3-4-3_vs_4-4-2`
- ⬜ `3-4-3_vs_4-4-2-raute`
- ⬜ `3-4-3_vs_3-5-2`
- ⬜ `3-4-3_vs_3-4-3`
- ⬜ `3-4-3_vs_5-3-2`
- ⬜ `3-4-3_vs_5-4-1`
- ⬜ `3-4-3_vs_4-1-4-1`

## 5-3-2 · 0 / 9 migriert

- ⬜ `5-3-2_vs_4-2-3-1`
- ⬜ `5-3-2_vs_4-3-3`
- ⬜ `5-3-2_vs_4-4-2`
- ⬜ `5-3-2_vs_4-4-2-raute`
- ⬜ `5-3-2_vs_3-5-2`
- ⬜ `5-3-2_vs_3-4-3`
- ⬜ `5-3-2_vs_5-3-2`
- ⬜ `5-3-2_vs_5-4-1`
- ⬜ `5-3-2_vs_4-1-4-1`

## 5-4-1 · 0 / 9 migriert

- ⬜ `5-4-1_vs_4-3-3`
- ⬜ `5-4-1_vs_4-2-3-1`
- ⬜ `5-4-1_vs_4-4-2`
- ⬜ `5-4-1_vs_4-4-2-raute`
- ⬜ `5-4-1_vs_3-5-2`
- ⬜ `5-4-1_vs_3-4-3`
- ⬜ `5-4-1_vs_5-3-2`
- ⬜ `5-4-1_vs_5-4-1`
- ⬜ `5-4-1_vs_4-1-4-1`

## 4-1-4-1 · 0 / 9 migriert

- ⬜ `4-1-4-1_vs_4-3-3`
- ⬜ `4-1-4-1_vs_4-2-3-1`
- ⬜ `4-1-4-1_vs_4-4-2`
- ⬜ `4-1-4-1_vs_4-4-2-raute`
- ⬜ `4-1-4-1_vs_3-5-2`
- ⬜ `4-1-4-1_vs_3-4-3`
- ⬜ `4-1-4-1_vs_5-3-2`
- ⬜ `4-1-4-1_vs_5-4-1`
- ⬜ `4-1-4-1_vs_4-1-4-1`

---

## Empfohlene Reihenfolge

1. **4-3-3-Reihe abschließen** (noch 6 offen) — Pilot + 2 weitere als
   Qualitäts-Anker und Vergleichbarkeit.
2. **Dann reihenweise:**
   `4-2-3-1` → `4-4-2` → `3-5-2` → `3-4-3` → `4-4-2-raute` → `4-1-4-1` → `5-3-2` → `5-4-1`
3. Nach jedem Batch mir den Output zurückschicken, ich pflege ein und
   aktualisiere diese Datei.

## Kurzfassung zum Copy-Paste in deine externe KI

Hier eine reduzierte Statusliste, die du als zusätzlichen Kontext in
deine KI klatschen kannst, damit sie nicht doppelt migriert:

```
Bereits im 4-Phasen-Schema (NICHT erneut migrieren):
- 4-3-3 vs 4-4-2
- 4-3-3 vs 4-2-3-1
- 4-3-3 vs 4-4-2-raute
- 4-3-3 vs 3-5-2
- 4-3-3 vs 3-4-3
- 4-3-3 vs 5-4-1
- 4-3-3 vs 4-3-3
- 4-3-3 vs 4-1-4-1
- 4-3-3 vs 5-3-2
- 4-2-3-1 vs 4-4-2

Noch zu migrieren: 71 weitere Duelle.
```
