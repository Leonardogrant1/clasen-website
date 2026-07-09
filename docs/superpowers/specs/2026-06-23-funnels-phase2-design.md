# Funnels Phase 2 — Investor + Owner Funnels

**Date:** 2026-06-23

---

## Overview

Add the Investor (`/[lang]/funnels/investor`) and Owner (`/[lang]/funnels/owner`) funnels on the same infrastructure built in Phase 1. Wire up the preselection page so all three options navigate correctly.

---

## Routing

```
app/[lang]/(funnel)/funnels/
  selection/     ← existing
  seller/        ← existing (Phase 1)
  investor/
    page.tsx
  owner/
    page.tsx
```

Both pages use the existing `funnels/layout.tsx` (logo, min-h-screen, bg-background).

---

## Answer Types (extend FunnelProvider)

```ts
type InvestorAnswers = {
  priorities: Array<"return" | "tax-benefit" | "security">  // ordered 1-3
  equity: "under-100k" | "100k-250k" | "250k-500k" | "500k-1m" | "over-1m"
  objectType: "apartment-building" | "commercial" | "apartment" | "new-build"
}

type OwnerAnswers = {
  lifePhase: "becoming-couple" | "growing-family" | "settling-down" | "ready-for-more" | "new-chapter"
  homePriorities: Array<"retreat" | "representation" | "family-space">  // ordered 1-3
  moodLocation: number   // 0-100: ruhige Lage → urbanes Zentrum
  moodStyle: number      // 0-100: Altbau-Charme → Klarer Neubau
  moodSize: number       // 0-100: Kompakt & fein → Großzügig & weitläufig
}

// FunnelAnswers union expands to:
type FunnelAnswers = Partial<SellerAnswers> & Partial<InvestorAnswers> & Partial<OwnerAnswers>
```

---

## New Files

```
components/funnel/
  EigenkapitalSlider.tsx   ← discrete 5-step slider for investor equity Q
  MoodSliders.tsx          ← 3 continuous range sliders for owner Q3
  InvestorFunnel.tsx       ← 6-step machine
  InvestorResultScreen.tsx ← Renditekompass™️ result screen
  OwnerFunnel.tsx          ← 6-step machine
  OwnerResultScreen.tsx    ← Traumwohnungs-Finder™️ result screen

app/[lang]/(funnel)/funnels/
  investor/page.tsx
  owner/page.tsx
```

Modify:
- `components/funnel/FunnelProvider.tsx` — add `InvestorAnswers`, `OwnerAnswers`, expand `FunnelAnswers`
- `components/FunnelSelectionClient.tsx` — replace `console.log` with `router.push` for investor/owner

---

## Investor Funnel — 6 Steps

| Step | Screen | UI |
|------|--------|-----|
| 0 | Social Proof | reuse `SocialProof` component |
| 1 | Q1: Prioritäten | Treppchen (Rendite · Steuervorteil · Sicherheit) |
| 2 | Q2: Eigenkapital | `EigenkapitalSlider` — 5 discrete tiers |
| 3 | Q3: Objektart | 4 icon cards (click → auto-advance) |
| 4 | Renditekompass™️ | Result screen with mocked match count + CTA |
| 5 | Kontaktformular | reuse `FunnelContactForm` |

### EigenkapitalSlider

5 discrete steps displayed as a styled range input + label:
```
Tiers: under-100k | 100k-250k | 250k-500k | 500k-1m | over-1m
Labels: bis €100k | €100k – €250k | €250k – €500k | €500k – €1 Mio. | €1 Mio.+
```
User drags or taps to select tier. "Weiter" button to confirm.

### Q3 Objektart Cards (Investor)
```
apartment-building → Mehrfamilienhaus  🏢
commercial         → Gewerbe           🏪
apartment          → Eigentumswohnung  🏠
new-build          → Neubau / Projekt  🏗️
```

### InvestorResultScreen
- Label: "Renditekompass™️"
- Headline: `"Ihr persönliches Anlageprofil ist bereit."` + mocked object count (varies by objectType)
- 4 blurred "object cards" (not profile cards — show blurred price/yield info)
- CTA: `"Profil freischalten →"`

---

## Owner Funnel — 6 Steps

| Step | Screen | UI |
|------|--------|-----|
| 0 | Social Proof | reuse `SocialProof` |
| 1 | Q1: Lebensphase | 5 large cards with emoji + label (click → auto-advance) |
| 2 | Q2: Zuhause-Gefühl | Treppchen (Rückzugsort · Repräsentanz · Familienraum) |
| 3 | Q3: Mood-Slider | `MoodSliders` — 3 range inputs with labels |
| 4 | Traumwohnungs-Finder™️ | Result screen + CTA |
| 5 | Kontaktformular | reuse `FunnelContactForm` |

### Q1 Lebensphase Cards
```
becoming-couple  → "Wir werden zu zweit"      👫
growing-family   → "Wir werden mehr"           🍼
settling-down    → "Wir wollen ankommen"       🏡
ready-for-more   → "Wir sind bereit für mehr"  📈
new-chapter      → "Ein neues Kapitel beginnt" 🌅
```
Large emoji cards, click auto-advances. Single column on mobile, wrapped on larger screens.

### MoodSliders (3 axes)

Three HTML `<input type="range">` inputs, each 0–100, with pole labels at each end:

| Axis key | Left label (0) | Right label (100) |
|----------|---------------|------------------|
| `moodLocation` | Ruhige Lage | Urbanes Zentrum |
| `moodStyle` | Altbau-Charme | Klarer Neubau |
| `moodSize` | Kompakt & fein | Großzügig & weitläufig |

All three default to 50. "Weiter" button to confirm.

### OwnerResultScreen
- Label: "Traumwohnungs-Finder™️"
- Headline: `"Ihr Zuhause wartet bereits."` + mocked match count
- 4 blurred property cards
- CTA: `"Meine Matches anzeigen →"`

---

## Preselection Update

`FunnelSelectionClient.tsx` `handleSearchTypeSelection`:
- `type === 'investor'` → `router.push(`/${lang}/funnels/investor`)`
- `type === 'owner'` → `router.push(`/${lang}/funnels/owner`)`

---

## Out of Scope

- Real backend/API for form submission (Phase 3)
- i18n of funnel copy (Phase 3)
- Back-navigation within steps
