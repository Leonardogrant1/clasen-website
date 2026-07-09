# Funnel Selection Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a fullscreen `/[lang]/funnels/selection` page where users choose between searching or selling a property, and update SideBanner to navigate there instead of opening the Calendly dialog.

**Architecture:** A new standalone route under `app/[lang]/funnels/selection/` with its own layout (logo only, no Nav/Footer). Dictionary keys are added to all four locale files. SideBanner's CTA is changed from `openDialog()` to `router.push`.

**Tech Stack:** Next.js App Router, Tailwind CSS, TypeScript, next/image, next/navigation

## Global Constraints

- Follow existing page patterns: `async` server component, `params` destructured via `await params`, `getDictionary` + `hasLocale` guards
- Logo asset: `/logo/key_white.svg` (white version for dark background)
- Background color token: `bg-background` (`#0d0d0d`)
- Accent color token: `bg-accent` / `text-accent`
- All four locales must have dictionary entries: `de`, `en`, `ru`, `zh`
- No Nav, no Footer on the selection page
- After selection: `console.log` placeholder only — no routing yet
- No new dependencies — use only what's already in the project

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Modify | `dictionaries/de.json` | Add `funnels.selection` copy (German) |
| Modify | `dictionaries/en.json` | Add `funnels.selection` copy (English) |
| Modify | `dictionaries/ru.json` | Add `funnels.selection` copy (Russian) |
| Modify | `dictionaries/zh.json` | Add `funnels.selection` copy (Chinese) |
| Create | `app/[lang]/funnels/selection/layout.tsx` | Standalone layout: logo only |
| Create | `app/[lang]/funnels/selection/page.tsx` | Fullscreen split selection UI |
| Modify | `components/SideBanner.tsx` | CTA navigates to `/[lang]/funnels/selection` |

---

### Task 1: Add dictionary entries for all four locales

**Files:**
- Modify: `dictionaries/de.json`
- Modify: `dictionaries/en.json`
- Modify: `dictionaries/ru.json`
- Modify: `dictionaries/zh.json`

**Interfaces:**
- Produces: `dict.funnels.selection.title`, `dict.funnels.selection.search.label`, `dict.funnels.selection.search.tooltip`, `dict.funnels.selection.sell.label`, `dict.funnels.selection.sell.tooltip` — used by Task 2

- [ ] **Step 1: Add German copy to `dictionaries/de.json`**

Open `dictionaries/de.json`. Before the final closing `}`, add (after the last top-level key, maintaining valid JSON — add a comma after the previous entry):

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

- [ ] **Step 2: Add English copy to `dictionaries/en.json`**

```json
"funnels": {
  "selection": {
    "title": "How can we help you?",
    "search": {
      "label": "Search for a property",
      "tooltip": "Find your dream property from our exclusive portfolio"
    },
    "sell": {
      "label": "Sell a property",
      "tooltip": "We guide you discreetly and professionally through your sale"
    }
  }
}
```

- [ ] **Step 3: Add Russian copy to `dictionaries/ru.json`**

```json
"funnels": {
  "selection": {
    "title": "Чем мы можем вам помочь?",
    "search": {
      "label": "Найти недвижимость",
      "tooltip": "Найдите недвижимость своей мечты в нашем эксклюзивном портфеле"
    },
    "sell": {
      "label": "Продать недвижимость",
      "tooltip": "Мы сопроводим вас дискретно и профессионально при продаже"
    }
  }
}
```

- [ ] **Step 4: Add Chinese copy to `dictionaries/zh.json`**

```json
"funnels": {
  "selection": {
    "title": "我们如何为您服务？",
    "search": {
      "label": "寻找房产",
      "tooltip": "从我们的专属投资组合中找到您的理想房产"
    },
    "sell": {
      "label": "出售房产",
      "tooltip": "我们将谨慎、专业地陪伴您完成销售"
    }
  }
}
```

- [ ] **Step 5: Verify JSON validity**

Run:
```bash
node -e "require('./dictionaries/de.json'); require('./dictionaries/en.json'); require('./dictionaries/ru.json'); require('./dictionaries/zh.json'); console.log('all valid')"
```
Expected output: `all valid`

---

### Task 2: Create standalone layout for funnel route

**Files:**
- Create: `app/[lang]/funnels/selection/layout.tsx`

**Interfaces:**
- Consumes: Next.js `LayoutProps` type (already available globally in the project via `types/`)
- Produces: A layout that renders children inside a fullscreen dark container with the Clasen logo centered at the top — no Nav, no Footer

- [ ] **Step 1: Create `app/[lang]/funnels/selection/layout.tsx`**

```tsx
import Image from "next/image"

export default async function FunnelSelectionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex justify-center pt-8 pb-4 shrink-0">
        <Image
          src="/logo/key_white.svg"
          alt="Clasen"
          width={120}
          height={40}
          priority
        />
      </header>
      <div className="flex-1 flex">{children}</div>
    </div>
  )
}
```

- [ ] **Step 2: Verify the file was created**

Run:
```bash
node -e "require('fs').existsSync('app/[lang]/funnels/selection/layout.tsx') && console.log('exists')"
```

Or simply check that the file is present at `app/[lang]/funnels/selection/layout.tsx`.

---

### Task 3: Create the selection page

**Files:**
- Create: `app/[lang]/funnels/selection/page.tsx`

**Interfaces:**
- Consumes: `getDictionary(lang)` → `dict.funnels.selection` (defined in Task 1)
- Consumes: `hasLocale`, `notFound` (same pattern as other pages)
- Produces: Fullscreen two-half selection UI

- [ ] **Step 1: Create `app/[lang]/funnels/selection/page.tsx`**

```tsx
import { notFound } from "next/navigation"
import { getDictionary, hasLocale } from "../../dictionaries"

export default async function FunnelSelectionPage({
  params,
}: PageProps<"/[lang]/funnels/selection">) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const dict = await getDictionary(lang)
  const t = dict.funnels.selection

  return (
    <div className="flex-1 flex flex-col md:flex-row">
      {/* Search half */}
      <SelectionCard
        label={t.search.label}
        tooltip={t.search.tooltip}
        icon={<HouseIcon />}
        onClick={() => console.log("search selected")}
      />

      {/* Divider */}
      <div className="w-px bg-white/10 hidden md:block" />
      <div className="h-px bg-white/10 md:hidden" />

      {/* Sell half */}
      <SelectionCard
        label={t.sell.label}
        tooltip={t.sell.tooltip}
        icon={<KeyIcon />}
        onClick={() => console.log("sell selected")}
      />
    </div>
  )
}

function SelectionCard({
  label,
  tooltip,
  icon,
  onClick,
}: {
  label: string
  tooltip: string
  icon: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      title={tooltip}
      className="group relative flex-1 flex flex-col items-center justify-center gap-6 px-8 py-16 md:py-0 cursor-pointer transition-colors duration-300 hover:bg-accent/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <span className="text-white/70 group-hover:text-accent transition-colors duration-300">
        {icon}
      </span>
      <span className="text-white text-2xl md:text-3xl font-semibold tracking-wide group-hover:text-accent transition-colors duration-300">
        {label}
      </span>
      {/* Tooltip visible on hover via title attr on mobile; custom tooltip on desktop */}
      <span className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-sm text-center max-w-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden md:block">
        {tooltip}
      </span>
    </button>
  )
}

function HouseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  )
}

function KeyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="7.5" cy="15.5" r="5.5" />
      <path d="M21 2l-9.6 9.6" />
      <path d="M15.5 7.5l3 3" />
    </svg>
  )
}
```

- [ ] **Step 2: Check TypeScript compiles**

Run:
```bash
npx tsc --noEmit
```
Expected: no errors related to the new files. Fix any type errors before proceeding (most likely: `PageProps` generic string needs to match the actual route — if it errors, replace `PageProps<"/[lang]/funnels/selection">` with `{ params: Promise<{ lang: string }> }`).

---

### Task 4: Update SideBanner to navigate to the funnel page

**Files:**
- Modify: `components/SideBanner.tsx`

**Interfaces:**
- Consumes: `locale` prop (already available on `SideBanner`)
- The Calendly `openDialog` import and call are removed from the CTA path

- [ ] **Step 1: Add `useRouter` import and remove Calendly dependency**

In `components/SideBanner.tsx`, replace:

```tsx
import { useState, useEffect } from "react"
import { useCalendlyDialog } from "@/components/CalendlyDialogProvider"
import { trackEvent } from "@/lib/event-tracker"
```

with:

```tsx
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { trackEvent } from "@/lib/event-tracker"
```

- [ ] **Step 2: Replace `useCalendlyDialog` with `useRouter` inside the component**

Remove the line:
```tsx
const { openDialog } = useCalendlyDialog()
```

Add in its place:
```tsx
const router = useRouter()
```

- [ ] **Step 3: Update `handleCtaClick` to navigate**

Replace the entire `handleCtaClick` function:

```tsx
const handleCtaClick = () => {
  if (showBanner) {
    trackEvent("funnel_selection_opened", {
      source: "side_banner",
    })
    router.push(`/${locale}/funnels/selection`)
  } else {
    toggleBanner()
  }
}
```

- [ ] **Step 4: Check TypeScript compiles**

Run:
```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 5: Start dev server and manually verify**

Run:
```bash
npm run dev
```

Open `http://localhost:3000/de` in a browser. The SideBanner should be visible on the left. Click the text area (not the arrow) — the browser should navigate to `/de/funnels/selection`. The selection page should show two fullscreen halves with icons and labels. Clicking the arrow should still collapse/expand the banner.

---

## Self-Review

**Spec coverage:**
- ✅ SideBanner navigates to `/[lang]/funnels/selection` → Task 4
- ✅ Standalone layout with logo, no Nav/Footer → Task 2
- ✅ Fullscreen split, two halves, desktop left/right, mobile top/bottom → Task 3
- ✅ Icon + label + tooltip per card → Task 3
- ✅ Hover effects → Task 3 (`group-hover:bg-accent/10`, `group-hover:text-accent`)
- ✅ i18n for all 4 locales → Task 1
- ✅ After selection: `console.log` placeholder → Task 3
- ✅ Logo: `/logo/key_white.svg` → Task 2

**Placeholder scan:** No TBD/TODO. The `console.log` placeholder is intentional per spec.

**Type consistency:** `dict.funnels.selection.search.label` / `.tooltip` / `dict.funnels.selection.sell.label` / `.tooltip` used consistently across Tasks 1 and 3.
