# Funnels Phase 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Investor and Owner funnels at `/[lang]/funnels/investor` and `/[lang]/funnels/owner`, reusing the Phase 1 infrastructure (FunnelProvider, Treppchen, SocialProof, FunnelContactForm), and wire up the preselection page.

**Architecture:** Extend FunnelProvider with two new answer types. Add two new UI components (EigenkapitalSlider, MoodSliders), two result screens, and two 6-step funnel machines following the exact same pattern as SellerFunnel. Pages are thin server components wrapping the client machines.

**Tech Stack:** Next.js App Router, React Context, Tailwind CSS, TypeScript — no new dependencies.

## Global Constraints

- No new npm dependencies
- All stored answer values must be English slugs
- `'use client'` on all interactive components
- Do NOT commit — user manages git
- TypeScript must compile: `npx tsc --noEmit`
- Working directory: `/Users/leonardogranetto/Projects/clasen-immos`
- Follow existing patterns from Phase 1 (same card styles, progress bar, accent tokens)

---

## File Map

| Action | Path | Responsibility |
|--------|------|---------------|
| Modify | `components/funnel/FunnelProvider.tsx` | Add `InvestorAnswers`, `OwnerAnswers`, expand `FunnelAnswers` |
| Create | `components/funnel/EigenkapitalSlider.tsx` | Discrete 5-step equity slider for Investor Q2 |
| Create | `components/funnel/MoodSliders.tsx` | 3 continuous range sliders for Owner Q3 |
| Create | `components/funnel/InvestorResultScreen.tsx` | Dealkompass™️ result screen |
| Create | `components/funnel/OwnerResultScreen.tsx` | Traumwohnungs-Finder™️ result screen |
| Create | `components/funnel/InvestorFunnel.tsx` | 6-step investor wizard |
| Create | `components/funnel/OwnerFunnel.tsx` | 6-step owner wizard |
| Create | `app/[lang]/(funnel)/funnels/investor/page.tsx` | Investor route entry point |
| Create | `app/[lang]/(funnel)/funnels/owner/page.tsx` | Owner route entry point |
| Modify | `components/FunnelSelectionClient.tsx` | Wire investor/owner `console.log` → `router.push` |

---

### Task 1: Extend FunnelProvider with Investor + Owner answer types

**Files:**
- Modify: `components/funnel/FunnelProvider.tsx`

**Interfaces:**
- Produces:
  ```ts
  export type InvestorAnswers = {
    priorities: Array<"return" | "tax-benefit" | "security">
    equity: "under-100k" | "100k-250k" | "250k-500k" | "500k-1m" | "over-1m"
    objectType: "apartment-building" | "commercial" | "apartment" | "new-build"
  }
  export type OwnerAnswers = {
    lifePhase: "becoming-couple" | "growing-family" | "settling-down" | "ready-for-more" | "new-chapter"
    homePriorities: Array<"retreat" | "representation" | "family-space">
    moodLocation: number
    moodStyle: number
    moodSize: number
  }
  // FunnelAnswers expands to include all three
  ```

- [ ] **Step 1: Read the current FunnelProvider**

Read `/Users/leonardogranetto/Projects/clasen-immos/components/funnel/FunnelProvider.tsx` to understand the current shape before editing.

- [ ] **Step 2: Add new types and expand FunnelAnswers**

Replace the existing `FunnelAnswers` type and add the two new answer types. The full updated file:

```tsx
'use client'

import { createContext, useContext, useState } from "react"

export type FunnelType = "seller" | "investor" | "owner"

export type SellerAnswers = {
  priorities: Array<"speed" | "price" | "communication">
  phase: "preparation" | "was-on-market" | "on-market"
  partnerType: "experienced" | "negotiator" | "communicative"
  objectType: "apartment-building" | "villa" | "semi-detached" | "terraced" | "corner-terraced" | "apartment" | "land"
  district: string
}

export type InvestorAnswers = {
  priorities: Array<"return" | "tax-benefit" | "security">
  equity: "under-100k" | "100k-250k" | "250k-500k" | "500k-1m" | "over-1m"
  objectType: "apartment-building" | "commercial" | "apartment" | "new-build"
}

export type OwnerAnswers = {
  lifePhase: "becoming-couple" | "growing-family" | "settling-down" | "ready-for-more" | "new-chapter"
  homePriorities: Array<"retreat" | "representation" | "family-space">
  moodLocation: number
  moodStyle: number
  moodSize: number
}

export type FunnelAnswers = Partial<SellerAnswers> & Partial<InvestorAnswers> & Partial<OwnerAnswers>

type FunnelContextValue = {
  type: FunnelType
  answers: FunnelAnswers
  setAnswer: (key: string, value: unknown) => void
}

const FunnelContext = createContext<FunnelContextValue | null>(null)

export function FunnelProvider({
  initialType,
  children,
}: {
  initialType: FunnelType
  children: React.ReactNode
}) {
  const [answers, setAnswers] = useState<FunnelAnswers>({})

  function setAnswer(key: string, value: unknown) {
    setAnswers((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <FunnelContext.Provider value={{ type: initialType, answers, setAnswer }}>
      {children}
    </FunnelContext.Provider>
  )
}

export function useFunnel(): FunnelContextValue {
  const ctx = useContext(FunnelContext)
  if (!ctx) throw new Error("useFunnel must be used inside FunnelProvider")
  return ctx
}
```

Note: `setAnswer` signature changes from a generic typed version to `(key: string, value: unknown)` to accommodate all three answer types without union complexity. This is intentional.

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd /Users/leonardogranetto/Projects/clasen-immos && npx tsc --noEmit 2>&1 | head -20
```
Expected: no new errors (pre-existing errors from other files are acceptable as long as no new ones appear in `FunnelProvider.tsx` or files that import it).

---

### Task 2: EigenkapitalSlider component

**Files:**
- Create: `components/funnel/EigenkapitalSlider.tsx`

**Interfaces:**
- Produces:
  ```ts
  type EigenkapitalSliderProps = {
    onComplete: (equity: "under-100k" | "100k-250k" | "250k-500k" | "500k-1m" | "over-1m") => void
  }
  export default function EigenkapitalSlider(props: EigenkapitalSliderProps): JSX.Element
  ```

- [ ] **Step 1: Create `components/funnel/EigenkapitalSlider.tsx`**

```tsx
'use client'

import { useState } from "react"

type EquitySlug = "under-100k" | "100k-250k" | "250k-500k" | "500k-1m" | "over-1m"

const TIERS: Array<{ slug: EquitySlug; label: string }> = [
  { slug: "under-100k",  label: "bis €100.000" },
  { slug: "100k-250k",   label: "€100.000 – €250.000" },
  { slug: "250k-500k",   label: "€250.000 – €500.000" },
  { slug: "500k-1m",     label: "€500.000 – €1.000.000" },
  { slug: "over-1m",     label: "€1.000.000+" },
]

type EigenkapitalSliderProps = {
  onComplete: (equity: EquitySlug) => void
}

export default function EigenkapitalSlider({ onComplete }: EigenkapitalSliderProps) {
  const [index, setIndex] = useState(2) // default middle tier

  const selected = TIERS[index]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        {/* Selected label */}
        <div className="text-center">
          <span className="text-accent text-2xl sm:text-3xl font-bold tracking-wide">
            {selected.label}
          </span>
        </div>

        {/* Range slider */}
        <div className="px-2">
          <input
            type="range"
            min={0}
            max={TIERS.length - 1}
            step={1}
            value={index}
            onChange={(e) => setIndex(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer bg-white/10 accent-[var(--color-accent)]"
          />
          <div className="flex justify-between mt-2">
            {TIERS.map((t, i) => (
              <span
                key={t.slug}
                className={`text-xs transition-colors duration-200 ${
                  i === index ? "text-accent font-semibold" : "text-white/30"
                }`}
              >
                {i === 0 ? "min" : i === TIERS.length - 1 ? "max" : ""}
              </span>
            ))}
          </div>
        </div>

        {/* Tier dots */}
        <div className="flex justify-between px-1">
          {TIERS.map((t, i) => (
            <button
              key={t.slug}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full transition-all duration-200 focus:outline-none ${
                i === index
                  ? "bg-accent scale-125"
                  : i < index
                  ? "bg-accent/40"
                  : "bg-white/20"
              }`}
              aria-label={t.label}
            />
          ))}
        </div>
      </div>

      <button
        onClick={() => onComplete(selected.slug)}
        className="w-full py-3.5 rounded-2xl bg-accent text-background font-semibold tracking-wide hover:bg-accent/90 transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        Weiter →
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd /Users/leonardogranetto/Projects/clasen-immos && npx tsc --noEmit 2>&1 | head -20
```
Expected: no errors.

---

### Task 3: MoodSliders component

**Files:**
- Create: `components/funnel/MoodSliders.tsx`

**Interfaces:**
- Produces:
  ```ts
  type MoodValues = { moodLocation: number; moodStyle: number; moodSize: number }
  type MoodSlidersProps = { onComplete: (values: MoodValues) => void }
  export default function MoodSliders(props: MoodSlidersProps): JSX.Element
  ```

- [ ] **Step 1: Create `components/funnel/MoodSliders.tsx`**

```tsx
'use client'

import { useState } from "react"

type MoodValues = {
  moodLocation: number
  moodStyle: number
  moodSize: number
}

type MoodSlidersProps = {
  onComplete: (values: MoodValues) => void
}

const AXES = [
  { key: "moodLocation" as const, left: "Ruhige Lage", right: "Urbanes Zentrum" },
  { key: "moodStyle"    as const, left: "Altbau-Charme", right: "Klarer Neubau" },
  { key: "moodSize"     as const, left: "Kompakt & fein", right: "Großzügig & weitläufig" },
]

export default function MoodSliders({ onComplete }: MoodSlidersProps) {
  const [values, setValues] = useState<MoodValues>({
    moodLocation: 50,
    moodStyle: 50,
    moodSize: 50,
  })

  function handleChange(key: keyof MoodValues, value: number) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-5">
        {AXES.map((axis) => (
          <div key={axis.key} className="flex flex-col gap-2">
            <div className="flex justify-between text-xs text-white/50">
              <span>{axis.left}</span>
              <span>{axis.right}</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={values[axis.key]}
              onChange={(e) => handleChange(axis.key, Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer bg-white/10 accent-[var(--color-accent)]"
            />
            {/* Position indicator */}
            <div className="flex justify-center">
              <span className="text-accent text-xs font-medium">
                {values[axis.key] < 35
                  ? axis.left
                  : values[axis.key] > 65
                  ? axis.right
                  : "Ausgewogen"}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => onComplete(values)}
        className="w-full py-3.5 rounded-2xl bg-accent text-background font-semibold tracking-wide hover:bg-accent/90 transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        Weiter →
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd /Users/leonardogranetto/Projects/clasen-immos && npx tsc --noEmit 2>&1 | head -20
```
Expected: no errors.

---

### Task 4: InvestorResultScreen + OwnerResultScreen

**Files:**
- Create: `components/funnel/InvestorResultScreen.tsx`
- Create: `components/funnel/OwnerResultScreen.tsx`

**Interfaces:**
- Produces:
  ```ts
  // InvestorResultScreen
  type InvestorResultScreenProps = {
    objectType: InvestorAnswers["objectType"] | undefined
    onCta: () => void
  }
  export default function InvestorResultScreen(props: InvestorResultScreenProps): JSX.Element

  // OwnerResultScreen
  type OwnerResultScreenProps = {
    lifePhase: OwnerAnswers["lifePhase"] | undefined
    onCta: () => void
  }
  export default function OwnerResultScreen(props: OwnerResultScreenProps): JSX.Element
  ```

- [ ] **Step 1: Create `components/funnel/InvestorResultScreen.tsx`**

```tsx
'use client'

import type { InvestorAnswers } from "@/components/funnel/FunnelProvider"

const OBJECT_COUNT: Record<InvestorAnswers["objectType"], number> = {
  "apartment-building": 8,
  "commercial": 5,
  "apartment": 31,
  "new-build": 12,
}

const BLURRED_OBJECTS = [
  { label: "••••••••••••", sub: "Rendite: •,•%  ·  ████████", tag: "Geprüft ✓" },
  { label: "••••••••",     sub: "Rendite: •,•%  ·  ████████", tag: "Neu ✦" },
  { label: "••••••••••",   sub: "Rendite: •,•%  ·  ████████", tag: "Geprüft ✓" },
  { label: "••••••••••••", sub: "Rendite: •,•%  ·  ████████", tag: "Exklusiv" },
]

type InvestorResultScreenProps = {
  objectType: InvestorAnswers["objectType"] | undefined
  onCta: () => void
}

export default function InvestorResultScreen({ objectType, onCta }: InvestorResultScreenProps) {
  const count = objectType ? OBJECT_COUNT[objectType] : 14

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 text-center">
        <p className="text-accent text-xs uppercase tracking-widest font-semibold">
          Dealkompass™️
        </p>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-snug">
          Ihr persönliches Anlageprofil ist bereit.
        </h2>
        <p className="text-white/40 text-sm">
          Unsere KI hat <span className="text-accent font-semibold">{count} passende Objekte</span> für Ihr Profil identifiziert.
        </p>
      </div>

      <div className="flex flex-col gap-2 relative">
        {BLURRED_OBJECTS.map((o, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 bg-white/[0.04] border border-white/10 rounded-xl select-none pointer-events-none"
          >
            <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 shrink-0 blur-sm" />
            <div className="flex flex-col gap-0.5 blur-sm flex-1">
              <span className="text-white/70 text-sm font-medium">{o.label}</span>
              <span className="text-white/30 text-xs">{o.sub}</span>
            </div>
            <span className="text-xs text-accent/70 font-semibold blur-sm shrink-0">{o.tag}</span>
          </div>
        ))}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-background via-background/60 to-transparent rounded-xl pointer-events-none" />
      </div>

      <button
        onClick={onCta}
        className="w-full py-4 rounded-2xl bg-accent text-background font-bold tracking-wide text-base hover:bg-accent/90 transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        Profil freischalten →
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Create `components/funnel/OwnerResultScreen.tsx`**

```tsx
'use client'

import type { OwnerAnswers } from "@/components/funnel/FunnelProvider"

const MATCH_COUNT: Record<OwnerAnswers["lifePhase"], number> = {
  "becoming-couple": 19,
  "growing-family": 23,
  "settling-down": 31,
  "ready-for-more": 14,
  "new-chapter": 27,
}

const BLURRED_PROPERTIES = [
  { label: "••••••••••••", sub: "████ · •• Zi · ••• m²", tag: "Passt zu Ihnen ✦" },
  { label: "••••••••",     sub: "████ · •• Zi · ••• m²", tag: "Neu ✦" },
  { label: "••••••••••",   sub: "████ · •• Zi · ••• m²", tag: "Passt zu Ihnen ✦" },
  { label: "••••••••••••", sub: "████ · •• Zi · ••• m²", tag: "Exklusiv" },
]

type OwnerResultScreenProps = {
  lifePhase: OwnerAnswers["lifePhase"] | undefined
  onCta: () => void
}

export default function OwnerResultScreen({ lifePhase, onCta }: OwnerResultScreenProps) {
  const count = lifePhase ? MATCH_COUNT[lifePhase] : 22

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 text-center">
        <p className="text-accent text-xs uppercase tracking-widest font-semibold">
          Traumwohnungs-Finder™️
        </p>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-snug">
          Ihr Zuhause wartet bereits.
        </h2>
        <p className="text-white/40 text-sm">
          Unsere KI hat <span className="text-accent font-semibold">{count} Objekte</span> gefunden, die sich nach Ihnen anfühlen könnten.
        </p>
      </div>

      <div className="flex flex-col gap-2 relative">
        {BLURRED_PROPERTIES.map((p, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 bg-white/[0.04] border border-white/10 rounded-xl select-none pointer-events-none"
          >
            <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 shrink-0 blur-sm" />
            <div className="flex flex-col gap-0.5 blur-sm flex-1">
              <span className="text-white/70 text-sm font-medium">{p.label}</span>
              <span className="text-white/30 text-xs">{p.sub}</span>
            </div>
            <span className="text-xs text-accent/70 font-semibold blur-sm shrink-0">{p.tag}</span>
          </div>
        ))}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-background via-background/60 to-transparent rounded-xl pointer-events-none" />
      </div>

      <button
        onClick={onCta}
        className="w-full py-4 rounded-2xl bg-accent text-background font-bold tracking-wide text-base hover:bg-accent/90 transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        Meine Matches anzeigen →
      </button>
    </div>
  )
}
```

- [ ] **Step 3: Verify TypeScript**

```bash
cd /Users/leonardogranetto/Projects/clasen-immos && npx tsc --noEmit 2>&1 | head -20
```
Expected: no errors.

---

### Task 5: InvestorFunnel step machine

**Files:**
- Create: `components/funnel/InvestorFunnel.tsx`

**Interfaces:**
- Consumes:
  - `useFunnel()` from `@/components/funnel/FunnelProvider`
  - `InvestorAnswers` type from `@/components/funnel/FunnelProvider`
  - `SocialProof` from `@/components/funnel/SocialProof`
  - `Treppchen` from `@/components/funnel/Treppchen`
  - `EigenkapitalSlider` from `@/components/funnel/EigenkapitalSlider`
  - `InvestorResultScreen` from `@/components/funnel/InvestorResultScreen`
  - `FunnelContactForm` from `@/components/funnel/FunnelContactForm`
- Produces: `export default function InvestorFunnel(): JSX.Element`

- [ ] **Step 1: Create `components/funnel/InvestorFunnel.tsx`**

```tsx
'use client'

import { useState } from "react"
import { useFunnel } from "@/components/funnel/FunnelProvider"
import type { InvestorAnswers } from "@/components/funnel/FunnelProvider"
import SocialProof from "@/components/funnel/SocialProof"
import Treppchen from "@/components/funnel/Treppchen"
import EigenkapitalSlider from "@/components/funnel/EigenkapitalSlider"
import InvestorResultScreen from "@/components/funnel/InvestorResultScreen"
import FunnelContactForm from "@/components/funnel/FunnelContactForm"

const TOTAL_STEPS = 6

const PRIORITY_ITEMS = [
  { slug: "return",      label: "Rendite" },
  { slug: "tax-benefit", label: "Steuervorteil" },
  { slug: "security",    label: "Sicherheit" },
]

const OBJECT_OPTIONS: Array<{ slug: InvestorAnswers["objectType"]; label: string; icon: string }> = [
  { slug: "apartment-building", label: "Mehrfamilienhaus",    icon: "🏢" },
  { slug: "commercial",         label: "Gewerbe",             icon: "🏪" },
  { slug: "apartment",          label: "Eigentumswohnung",    icon: "🏠" },
  { slug: "new-build",          label: "Neubau / Projekt",    icon: "🏗️" },
]

function StepHeading({ label, title, subtitle }: { label: string; title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col gap-1.5 text-center mb-2">
      <p className="text-accent text-xs uppercase tracking-widest font-semibold">{label}</p>
      <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-snug">{title}</h2>
      {subtitle && <p className="text-white/40 text-sm">{subtitle}</p>}
    </div>
  )
}

export default function InvestorFunnel() {
  const { setAnswer, answers } = useFunnel()
  const [step, setStep] = useState(0)
  const next = () => setStep((s) => s + 1)

  const screens = [
    // Step 0: Social Proof
    <SocialProof key="social" onContinue={next} />,

    // Step 1: Q1 Priorities (Treppchen)
    <div key="q1" className="flex flex-col gap-4">
      <StepHeading
        label="Frage 1 von 3"
        title="Was ist Ihnen bei einer Kapitalanlage am wichtigsten?"
        subtitle="Sortieren Sie nach Priorität — Platz 1 ist am wichtigsten."
      />
      <Treppchen
        items={PRIORITY_ITEMS}
        onComplete={(ordered) => {
          setAnswer("priorities", ordered)
          next()
        }}
      />
    </div>,

    // Step 2: Q2 Eigenkapital
    <div key="q2" className="flex flex-col gap-4">
      <StepHeading
        label="Frage 2 von 3"
        title="Wie viel Eigenkapital möchten Sie einsetzen?"
        subtitle="Wählen Sie Ihren Bereich."
      />
      <EigenkapitalSlider
        onComplete={(equity) => {
          setAnswer("equity", equity)
          next()
        }}
      />
    </div>,

    // Step 3: Q3 Objektart
    <div key="q3" className="flex flex-col gap-4">
      <StepHeading
        label="Frage 3 von 3"
        title="Welche Objektart interessiert Sie?"
      />
      <div className="grid grid-cols-2 gap-3">
        {OBJECT_OPTIONS.map((o) => (
          <button
            key={o.slug}
            onClick={() => { setAnswer("objectType", o.slug); next() }}
            className="group flex flex-col items-center gap-2 p-4 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-accent rounded-2xl transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <span className="text-2xl">{o.icon}</span>
            <span className="text-white/70 group-hover:text-white text-xs sm:text-sm font-medium text-center leading-tight">{o.label}</span>
          </button>
        ))}
      </div>
    </div>,

    // Step 4: Dealkompass result
    <InvestorResultScreen
      key="result"
      objectType={answers.objectType as InvestorAnswers["objectType"] | undefined}
      onCta={next}
    />,

    // Step 5: Contact form
    <FunnelContactForm key="contact" />,
  ]

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-xl mb-6">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-white/30 text-xs">
            {step < TOTAL_STEPS - 1 ? `Schritt ${step + 1} von ${TOTAL_STEPS}` : "Letzter Schritt"}
          </span>
          <span className="text-white/30 text-xs">
            {Math.round(((step + 1) / TOTAL_STEPS) * 100)}%
          </span>
        </div>
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-500"
            style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>
      <div className="w-full max-w-xl bg-white/[0.02] border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-md shadow-2xl">
        {screens[step]}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd /Users/leonardogranetto/Projects/clasen-immos && npx tsc --noEmit 2>&1 | head -20
```
Expected: no errors.

---

### Task 6: OwnerFunnel step machine

**Files:**
- Create: `components/funnel/OwnerFunnel.tsx`

**Interfaces:**
- Consumes:
  - `useFunnel()`, `OwnerAnswers` from `@/components/funnel/FunnelProvider`
  - `SocialProof` from `@/components/funnel/SocialProof`
  - `Treppchen` from `@/components/funnel/Treppchen`
  - `MoodSliders` from `@/components/funnel/MoodSliders`
  - `OwnerResultScreen` from `@/components/funnel/OwnerResultScreen`
  - `FunnelContactForm` from `@/components/funnel/FunnelContactForm`
- Produces: `export default function OwnerFunnel(): JSX.Element`

- [ ] **Step 1: Create `components/funnel/OwnerFunnel.tsx`**

```tsx
'use client'

import { useState } from "react"
import { useFunnel } from "@/components/funnel/FunnelProvider"
import type { OwnerAnswers } from "@/components/funnel/FunnelProvider"
import SocialProof from "@/components/funnel/SocialProof"
import Treppchen from "@/components/funnel/Treppchen"
import MoodSliders from "@/components/funnel/MoodSliders"
import OwnerResultScreen from "@/components/funnel/OwnerResultScreen"
import FunnelContactForm from "@/components/funnel/FunnelContactForm"

const TOTAL_STEPS = 6

const LIFE_PHASES: Array<{ slug: OwnerAnswers["lifePhase"]; label: string; icon: string }> = [
  { slug: "becoming-couple",  label: "Wir werden zu zweit",          icon: "👫" },
  { slug: "growing-family",   label: "Wir werden mehr",              icon: "🍼" },
  { slug: "settling-down",    label: "Wir wollen ankommen",          icon: "🏡" },
  { slug: "ready-for-more",   label: "Wir sind bereit für mehr",     icon: "📈" },
  { slug: "new-chapter",      label: "Ein neues Kapitel beginnt",    icon: "🌅" },
]

const HOME_PRIORITY_ITEMS = [
  { slug: "retreat",        label: "Rückzugsort" },
  { slug: "representation", label: "Repräsentanz" },
  { slug: "family-space",   label: "Familienraum" },
]

function StepHeading({ label, title, subtitle }: { label: string; title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col gap-1.5 text-center mb-2">
      <p className="text-accent text-xs uppercase tracking-widest font-semibold">{label}</p>
      <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-snug">{title}</h2>
      {subtitle && <p className="text-white/40 text-sm">{subtitle}</p>}
    </div>
  )
}

export default function OwnerFunnel() {
  const { setAnswer, answers } = useFunnel()
  const [step, setStep] = useState(0)
  const next = () => setStep((s) => s + 1)

  const screens = [
    // Step 0: Social Proof
    <SocialProof key="social" onContinue={next} />,

    // Step 1: Q1 Lebensphase
    <div key="q1" className="flex flex-col gap-4">
      <StepHeading
        label="Frage 1 von 3"
        title="In welchem Lebensmoment befinden Sie sich gerade?"
      />
      <div className="flex flex-col gap-2">
        {LIFE_PHASES.map((p) => (
          <button
            key={p.slug}
            onClick={() => { setAnswer("lifePhase", p.slug); next() }}
            className="group flex items-center gap-4 p-4 sm:p-5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-accent rounded-2xl text-left transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <span className="text-2xl shrink-0">{p.icon}</span>
            <span className="text-white/80 group-hover:text-white font-semibold text-sm sm:text-base">{p.label}</span>
          </button>
        ))}
      </div>
    </div>,

    // Step 2: Q2 Zuhause-Gefühl (Treppchen)
    <div key="q2" className="flex flex-col gap-4">
      <StepHeading
        label="Frage 2 von 3"
        title="Was muss Ihr neues Zuhause vor allem sein?"
        subtitle="Sortieren Sie nach Priorität — Platz 1 ist am wichtigsten."
      />
      <Treppchen
        items={HOME_PRIORITY_ITEMS}
        onComplete={(ordered) => {
          setAnswer("homePriorities", ordered)
          next()
        }}
      />
    </div>,

    // Step 3: Q3 Mood Sliders
    <div key="q3" className="flex flex-col gap-4">
      <StepHeading
        label="Frage 3 von 3"
        title="Wie sieht Ihr ideales Zuhause aus?"
        subtitle="Verschieben Sie die Regler nach Ihrem Gefühl."
      />
      <MoodSliders
        onComplete={(values) => {
          setAnswer("moodLocation", values.moodLocation)
          setAnswer("moodStyle", values.moodStyle)
          setAnswer("moodSize", values.moodSize)
          next()
        }}
      />
    </div>,

    // Step 4: Traumwohnungs-Finder result
    <OwnerResultScreen
      key="result"
      lifePhase={answers.lifePhase as OwnerAnswers["lifePhase"] | undefined}
      onCta={next}
    />,

    // Step 5: Contact form
    <FunnelContactForm key="contact" />,
  ]

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-xl mb-6">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-white/30 text-xs">
            {step < TOTAL_STEPS - 1 ? `Schritt ${step + 1} von ${TOTAL_STEPS}` : "Letzter Schritt"}
          </span>
          <span className="text-white/30 text-xs">
            {Math.round(((step + 1) / TOTAL_STEPS) * 100)}%
          </span>
        </div>
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-500"
            style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>
      <div className="w-full max-w-xl bg-white/[0.02] border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-md shadow-2xl">
        {screens[step]}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd /Users/leonardogranetto/Projects/clasen-immos && npx tsc --noEmit 2>&1 | head -20
```
Expected: no errors.

---

### Task 7: Pages + preselection wiring

**Files:**
- Create: `app/[lang]/(funnel)/funnels/investor/page.tsx`
- Create: `app/[lang]/(funnel)/funnels/owner/page.tsx`
- Modify: `components/FunnelSelectionClient.tsx`

**Interfaces:**
- Consumes: `FunnelProvider`, `InvestorFunnel`, `OwnerFunnel`

- [ ] **Step 1: Create investor page**

```tsx
import { FunnelProvider } from "@/components/funnel/FunnelProvider"
import InvestorFunnel from "@/components/funnel/InvestorFunnel"

export async function generateStaticParams() {
  return [{ lang: "de" }, { lang: "en" }, { lang: "ru" }, { lang: "zh" }]
}

export default function InvestorPage() {
  return (
    <FunnelProvider initialType="investor">
      <InvestorFunnel />
    </FunnelProvider>
  )
}
```

- [ ] **Step 2: Create owner page**

```tsx
import { FunnelProvider } from "@/components/funnel/FunnelProvider"
import OwnerFunnel from "@/components/funnel/OwnerFunnel"

export async function generateStaticParams() {
  return [{ lang: "de" }, { lang: "en" }, { lang: "ru" }, { lang: "zh" }]
}

export default function OwnerPage() {
  return (
    <FunnelProvider initialType="owner">
      <OwnerFunnel />
    </FunnelProvider>
  )
}
```

- [ ] **Step 3: Update FunnelSelectionClient — replace console.log with router.push**

In `components/FunnelSelectionClient.tsx`, find `handleSearchTypeSelection` and replace its body:

```tsx
const handleSearchTypeSelection = (type: 'investor' | 'owner') => {
  trackEvent("funnel_search_type_selected", { type, source: "selection_page" })
  router.push(`/${lang}/funnels/${type}`)
}
```

- [ ] **Step 4: Final TypeScript check**

```bash
cd /Users/leonardogranetto/Projects/clasen-immos && npx tsc --noEmit 2>&1 | head -30
```
Expected: 0 errors.

- [ ] **Step 5: Manual smoke test**

Start dev server: `npm run dev`

1. `/de/funnels/selection` → click "Immobilie suchen" → click "Als Kapitalanleger" → navigates to `/de/funnels/investor`
2. Investor funnel: Social Proof → Treppchen (3 items) → Eigenkapital Slider → Objektart Cards → Renditekompass result → Contact form
3. Back to selection → click "Als Eigennutzer" → navigates to `/de/funnels/owner`
4. Owner funnel: Social Proof → Lebensphase cards → Treppchen → Mood Sliders → Traumwohnungs-Finder result → Contact form
5. Submit contact form on either → check browser console for `trackEvent("funnel_submission", ...)`

---

## Self-Review

**Spec coverage:**
- ✅ FunnelProvider extended with InvestorAnswers + OwnerAnswers → Task 1
- ✅ EigenkapitalSlider (5 discrete equity tiers, Weiter button) → Task 2
- ✅ MoodSliders (3 axes, 0-100, Weiter button) → Task 3
- ✅ InvestorResultScreen: Renditekompass™️, count by objectType, blurred cards → Task 4
- ✅ OwnerResultScreen: Traumwohnungs-Finder™️, count by lifePhase, blurred cards → Task 4
- ✅ InvestorFunnel 6 steps in correct order → Task 5
- ✅ OwnerFunnel 6 steps in correct order → Task 6
- ✅ English slugs for all answers → Tasks 1, 5, 6
- ✅ Treppchen reused for both Investor Q1 and Owner Q2 → Tasks 5, 6
- ✅ SocialProof reused in both funnels → Tasks 5, 6
- ✅ FunnelContactForm reused in both funnels → Tasks 5, 6
- ✅ investor/owner pages → Task 7
- ✅ Preselection wired up → Task 7

**Placeholder scan:** None. All code is complete.

**Type consistency:**
- `InvestorAnswers["objectType"]` used in Task 4 (InvestorResultScreen prop) and Task 5 (cast in InvestorFunnel) — matches Task 1 definition
- `OwnerAnswers["lifePhase"]` used in Task 4 (OwnerResultScreen prop) and Task 6 (cast in OwnerFunnel) — matches Task 1 definition
- `setAnswer(key: string, value: unknown)` — all calls in Tasks 5 and 6 use string keys matching SellerAnswers/InvestorAnswers/OwnerAnswers field names
