# Funnel Selection Page — Design Spec

**Date:** 2026-06-23

---

## Overview

Add a fullscreen funnel entry point at `/[lang]/funnels/selection` where users choose between searching for a property or selling one. The SideBanner navigates to this page instead of opening the Calendly dialog.

---

## Routing & File Structure

```
app/[lang]/funnels/
  selection/
    layout.tsx     — standalone layout (logo only, no Nav/Footer)
    page.tsx       — selection page
```

The existing `[lang]/layout.tsx` is NOT changed. The funnel route uses its own layout scoped under `app/[lang]/funnels/selection/layout.tsx`, which renders only a small centered logo and no Nav or Footer.

---

## SideBanner Change

- The CTA click in `SideBanner.tsx` navigates to `/${locale}/funnels/selection` using Next.js `<Link>` or `router.push`
- The collapse/expand toggle behavior remains unchanged
- The Calendly `openDialog()` call is removed from the CTA path

---

## Selection Page Layout

- **Fullscreen split:** two equal halves — left/right on desktop, top/bottom on mobile
- **Left half:** "Immobilie suchen" (search for a property)
  - House icon (SVG or Lucide)
  - Label text (from dictionary)
  - Tooltip on hover with short description
- **Right half:** "Immobilie verkaufen" (sell a property)
  - Key/tag icon (SVG or Lucide)
  - Label text (from dictionary)
  - Tooltip on hover with short description
- **Logo:** small, centered at the top of the page (above or overlapping the split)
- **Hover effect:** subtle background darkening/lightening using existing Tailwind color tokens (`accent`, `bg-background`, `text-foreground`)
- **After selection:** `console.log` placeholder — funnel routes to be defined in a future iteration

---

## Internationalization

New `funnels.selection` key added to all four dictionary files (`de.json`, `en.json`, `ru.json`, `zh.json`):

```json
"funnels": {
  "selection": {
    "title": "Wie können wir Ihnen helfen?",
    "search": {
      "label": "Immobilie suchen",
      "tooltip": "Finden Sie Ihr Traumobjekt aus unserem exklusiven Portfolio"
    },
    "sell": {
      "label": "Immobilie verkaufen",
      "tooltip": "Wir begleiten Sie diskret und professionell beim Verkauf"
    }
  }
}
```

The `page.tsx` receives `lang` from route params and loads the dictionary server-side via `getDictionary(lang)`, consistent with all other pages in the project.

---

## Out of Scope

- The downstream funnel pages (`/funnels/kaufen`, `/funnels/verkaufen`, etc.) — to be designed separately
- Any form or booking flow on the selection page itself
- Analytics/tracking on the selection (can be added later)
