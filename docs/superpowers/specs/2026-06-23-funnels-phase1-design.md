# Funnels Phase 1 — Shared Infrastructure + Seller Funnel

**Date:** 2026-06-23

---

## Overview

Build the shared funnel infrastructure (FunnelProvider, reusable components) and the complete Seller funnel at `/[lang]/funnels/seller`. This is Phase 1 of a 3-funnel system. Phase 2 will add Investor and Owner funnels on the same foundation.

---

## Routing

```
app/[lang]/(funnel)/funnels/
  selection/          ← already built
  seller/
    page.tsx          ← Seller Funnel entry point
```

The seller page is wrapped in the existing `(funnel)` route group — standalone layout (logo only, no Nav/Footer).

---

## File Structure

```
components/funnel/
  FunnelProvider.tsx     ← React Context: type + answers
  SocialProof.tsx        ← mocked social proof screen
  Treppchen.tsx          ← click-to-rank 1-3 shared component
  FunnelContactForm.tsx  ← Name / Email / Phone form
  SellerFunnel.tsx       ← step machine for seller (8 steps)
  SellerResultScreen.tsx ← "Käuferradar" with blurred cards

app/[lang]/(funnel)/funnels/seller/
  page.tsx               ← server component, renders SellerFunnel
```

---

## FunnelProvider

React Context, scoped to the funnel route. Does NOT wrap the whole app.

```ts
type SellerAnswers = {
  priorities: Array<"speed" | "price" | "communication">  // ordered 1-3
  phase: "preparation" | "was-on-market" | "on-market"
  partnerType: "experienced" | "negotiator" | "communicative"
  objectType: "apartment-building" | "villa" | "semi-detached" | "terraced" | "corner-terraced" | "apartment" | "land"
  district: string  // English slug, e.g. "schwabing", "maxvorstadt"
}

type FunnelState = {
  type: "seller" | "investor" | "owner"
  answers: Partial<SellerAnswers>
  setAnswer: (key: keyof SellerAnswers, value: unknown) => void
}
```

FunnelProvider is a `'use client'` component wrapping `SellerFunnel`. The `page.tsx` server component sets `type: "seller"` as initial state via a prop.

---

## Seller Funnel — 8 Steps

Step state is local to `SellerFunnel.tsx`. Linear progression, no back navigation except on the Treppchen step.

| Step | Screen | UI Pattern |
|------|--------|-----------|
| 1 | Social Proof | 3 mocked testimonial cards + "Weiter" button |
| 2 | Q1: Prioritäten | Treppchen: click-to-rank (Geschwindigkeit · Preis · Kommunikation) |
| 3 | Q2: Verkaufsphase | 3 selectable cards, click → auto-advance |
| 4 | Q3: Idealpartner | 3 selectable cards, click → auto-advance |
| 5 | Q4: Objekt-Art | 7 cards in grid, click → auto-advance |
| 6 | Q5: Stadtteil | Searchable dropdown (Munich districts) |
| 7 | Käuferradar | Blurred profile cards + CTA button |
| 8 | Kontaktformular | Name · E-Mail · Telefon + submit |

Progress bar at top: shows current step out of 8.

Q2–Q5: single click auto-advances to next step (no separate "Weiter" button).
Q1 (Treppchen): requires 3 clicks to rank, then shows "Weiter" button.
Q6 (Stadtteil): requires selection from dropdown, then "Weiter" button.

---

## Treppchen Component

Shared component, reusable for Investor Q1 and Owner Q2 in Phase 2.

```ts
type TreppченProps = {
  items: Array<{ slug: string; label: string }>
  onComplete: (ordered: string[]) => void  // slugs in rank order [1st, 2nd, 3rd]
}
```

UI: Three items displayed as clickable cards. First click = rank 1 (gold), second click = rank 2 (silver), third click = rank 3 (bronze). Clicking a ranked item deselects it and resets from that position. "Weiter" button appears once all 3 are ranked.

---

## Munich Districts

Static list in `lib/munich-districts.ts`:

```ts
export const MUNICH_DISTRICTS = [
  { slug: "altstadt-lehel", label: "Altstadt-Lehel" },
  { slug: "maxvorstadt", label: "Maxvorstadt" },
  { slug: "schwabing-west", label: "Schwabing-West" },
  { slug: "schwabing-freimann", label: "Schwabing-Freimann" },
  { slug: "bogenhausen", label: "Bogenhausen" },
  { slug: "haidhausen", label: "Haidhausen (Au-Haidhausen)" },
  { slug: "giesing", label: "Obergiesing-Fasangarten" },
  { slug: "sendling", label: "Sendling" },
  { slug: "sendling-westpark", label: "Sendling-Westpark" },
  { slug: "neuhausen-nymphenburg", label: "Neuhausen-Nymphenburg" },
  { slug: "milbertshofen", label: "Milbertshofen-Am Hart" },
  { slug: "maxvorstadt", label: "Maxvorstadt" },
  { slug: "ludwigsvorstadt-isarvorstadt", label: "Ludwigsvorstadt-Isarvorstadt" },
  { slug: "pasing-obermenzing", label: "Pasing-Obermenzing" },
  { slug: "laim", label: "Laim" },
  { slug: "hadern", label: "Hadern" },
  { slug: "ramersdorf-perlach", label: "Ramersdorf-Perlach" },
  { slug: "trudering-riem", label: "Trudering-Riem" },
  { slug: "moosach", label: "Moosach" },
  { slug: "feldmoching-hasenbergl", label: "Feldmoching-Hasenbergl" },
  { slug: "allach-untermenzing", label: "Allach-Untermenzing" },
  { slug: "aubing-lochhausen", label: "Aubing-Lochhausen-Langwied" },
  { slug: "thalkirchen", label: "Thalkirchen-Obersendling" },
  { slug: "schwabing", label: "Schwabing" },
  { slug: "maximilianeum", label: "Maximilianeum" },
]
```

Searchable via text filter on label. Stored as slug.

---

## Käuferradar Result Screen

- Headline (mocked): `"47 Interessenten suchen aktuell eine Immobilie wie Ihre"` — number varies by `objectType` (hardcoded map, no real data)
- 5 blurred profile cards: avatar placeholder + 2 lines of blurred text (`blur-sm`, `select-none`)
- CTA button: `"Käufer jetzt sehen"` → advances to Step 8 (contact form)

Number map by objectType:
```ts
const BUYER_COUNT: Record<string, number> = {
  "apartment": 124,
  "villa": 38,
  "semi-detached": 67,
  "terraced": 89,
  "corner-terraced": 54,
  "apartment-building": 23,
  "land": 41,
}
```

---

## Contact Form

Fields: Vorname · E-Mail · Telefonnummer (all required).

On submit:
```ts
console.log("funnel_submission", {
  type: "seller",
  answers: { /* full SellerAnswers */ },
  contact: { name, email, phone }
})
```

No real API call yet. Submit button text: `"Kostenlos & unverbindlich anfragen"`.

---

## Preselection Update

`FunnelSelectionClient.tsx` currently calls `openDialog()` for sell and search paths. These are replaced with:
- "Verkaufen" → `router.push(`/${locale}/funnels/seller`)`
- "Suchen → Kapitalanleger" → `router.push(`/${locale}/funnels/investor`)` (placeholder, Phase 2)
- "Suchen → Eigennutzer" → `router.push(`/${locale}/funnels/owner`)` (placeholder, Phase 2)

---

## Out of Scope (Phase 2)

- Investor funnel (`/funnels/investor`): Treppchen Q1, Eigenkapital-Slider Q2, Objektart-Cards Q3, Renditekompass™️ result
- Owner funnel (`/funnels/owner`): Lebensphase image-cards Q1, Treppchen Q2, Mood-Slider Q3, Traumwohnungs-Finder™️ result
- Real form submission / API
- Back-navigation within steps
