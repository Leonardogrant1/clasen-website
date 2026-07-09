# Funnels Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build shared funnel infrastructure (FunnelProvider, Treppchen, SocialProof, ContactForm) and the complete Seller funnel at `/[lang]/funnels/seller`, then wire up the preselection page to navigate to it.

**Architecture:** React Context (`FunnelProvider`) scoped to funnel routes stores `type + answers` as English slugs. `SellerFunnel.tsx` is a client-side step machine (8 steps) that renders the appropriate screen per step and accumulates answers into context. All funnel components live in `components/funnel/`.

**Tech Stack:** Next.js App Router, React Context, Tailwind CSS, TypeScript — no new dependencies.

## Global Constraints

- No new npm dependencies — only what's already in the project
- All stored answer values must be English slugs (e.g. `"speed"`, `"villa"`, `"schwabing-west"`)
- Display labels stay in German in the UI
- `'use client'` on all interactive components
- Do NOT commit — user manages git
- TypeScript must compile without errors (`npx tsc --noEmit`)
- Follow existing component patterns: Tailwind classes, `bg-background`, `text-foreground`, `accent` color token
- Working directory: `/Users/leonardogranetto/Projects/clasen-immos`

---

## File Map

| Action | Path | Responsibility |
|--------|------|---------------|
| Create | `lib/munich-districts.ts` | Static list of Munich districts as `{slug, label}` |
| Create | `components/funnel/FunnelProvider.tsx` | React Context: type + answers + setAnswer |
| Create | `components/funnel/Treppchen.tsx` | Click-to-rank 1-3 reusable component |
| Create | `components/funnel/SocialProof.tsx` | Mocked social proof screen with 3 testimonials |
| Create | `components/funnel/SellerResultScreen.tsx` | Käuferradar: blurred profile cards + CTA |
| Create | `components/funnel/FunnelContactForm.tsx` | Name / E-Mail / Telefon form |
| Create | `components/funnel/SellerFunnel.tsx` | 8-step machine wiring all above components |
| Create | `app/[lang]/(funnel)/funnels/seller/page.tsx` | Server component entry point for seller route |
| Modify | `components/FunnelSelectionClient.tsx` | Replace Calendly calls with router.push to funnel routes |

---

### Task 1: Munich districts data + FunnelProvider

**Files:**
- Create: `lib/munich-districts.ts`
- Create: `components/funnel/FunnelProvider.tsx`

**Interfaces:**
- Produces:
  - `MUNICH_DISTRICTS: Array<{ slug: string; label: string }>` from `lib/munich-districts.ts`
  - `FunnelProvider` (React component, wraps children)
  - `useFunnel(): FunnelContextValue` hook
  - Types: `FunnelType`, `SellerAnswers`, `FunnelContextValue`

- [ ] **Step 1: Create `lib/munich-districts.ts`**

```ts
export const MUNICH_DISTRICTS = [
  { slug: "altstadt-lehel", label: "Altstadt-Lehel" },
  { slug: "maxvorstadt", label: "Maxvorstadt" },
  { slug: "schwabing-west", label: "Schwabing-West" },
  { slug: "schwabing-freimann", label: "Schwabing-Freimann" },
  { slug: "bogenhausen", label: "Bogenhausen" },
  { slug: "au-haidhausen", label: "Au-Haidhausen" },
  { slug: "sendling", label: "Sendling" },
  { slug: "sendling-westpark", label: "Sendling-Westpark" },
  { slug: "schwanthalerhoehe", label: "Schwanthalerhöhe" },
  { slug: "neuhausen-nymphenburg", label: "Neuhausen-Nymphenburg" },
  { slug: "moosach", label: "Moosach" },
  { slug: "milbertshofen", label: "Milbertshofen-Am Hart" },
  { slug: "berg-am-laim", label: "Berg am Laim" },
  { slug: "trudering-riem", label: "Trudering-Riem" },
  { slug: "ramersdorf-perlach", label: "Ramersdorf-Perlach" },
  { slug: "obergiesing", label: "Obergiesing-Fasangarten" },
  { slug: "untergiesing", label: "Untergiesing-Harlaching" },
  { slug: "thalkirchen", label: "Thalkirchen-Obersendling" },
  { slug: "hadern", label: "Hadern" },
  { slug: "pasing-obermenzing", label: "Pasing-Obermenzing" },
  { slug: "aubing-lochhausen", label: "Aubing-Lochhausen-Langwied" },
  { slug: "allach-untermenzing", label: "Allach-Untermenzing" },
  { slug: "feldmoching-hasenbergl", label: "Feldmoching-Hasenbergl" },
  { slug: "laim", label: "Laim" },
  { slug: "ludwigsvorstadt-isarvorstadt", label: "Ludwigsvorstadt-Isarvorstadt" },
] as const
```

- [ ] **Step 2: Create `components/funnel/FunnelProvider.tsx`**

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

// Phase 2 will extend this union
export type FunnelAnswers = Partial<SellerAnswers>

type FunnelContextValue = {
  type: FunnelType
  answers: FunnelAnswers
  setAnswer: <K extends keyof SellerAnswers>(key: K, value: SellerAnswers[K]) => void
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

  function setAnswer<K extends keyof SellerAnswers>(key: K, value: SellerAnswers[K]) {
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

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd /Users/leonardogranetto/Projects/clasen-immos && npx tsc --noEmit 2>&1 | head -20
```
Expected: no errors.

---

### Task 2: Treppchen component

**Files:**
- Create: `components/funnel/Treppchen.tsx`

**Interfaces:**
- Consumes: nothing from earlier tasks
- Produces:
  ```ts
  // props
  type TreppchenProps = {
    items: Array<{ slug: string; label: string }>
    onComplete: (ordered: string[]) => void  // slugs in rank order [1st, 2nd, 3rd]
  }
  export default function Treppchen(props: TreppchenProps): JSX.Element
  ```

- [ ] **Step 1: Create `components/funnel/Treppchen.tsx`**

```tsx
'use client'

import { useState } from "react"

type TreppchenProps = {
  items: Array<{ slug: string; label: string }>
  onComplete: (ordered: string[]) => void
}

const RANK_COLORS = [
  { bg: "bg-yellow-500/20 border-yellow-500/60", text: "text-yellow-400", badge: "🥇" },
  { bg: "bg-zinc-400/20 border-zinc-400/60",   text: "text-zinc-300",   badge: "🥈" },
  { bg: "bg-amber-700/20 border-amber-700/60", text: "text-amber-600",  badge: "🥉" },
]

export default function Treppchen({ items, onComplete }: TreppchenProps) {
  const [ranked, setRanked] = useState<string[]>([]) // slugs in order

  function handleClick(slug: string) {
    if (ranked.includes(slug)) {
      // deselect: remove this item and everything ranked after it
      setRanked((prev) => prev.slice(0, prev.indexOf(slug)))
    } else if (ranked.length < items.length) {
      setRanked((prev) => [...prev, slug])
    }
  }

  const allRanked = ranked.length === items.length

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        {items.map((item) => {
          const rankIndex = ranked.indexOf(item.slug)
          const isRanked = rankIndex !== -1
          const colors = isRanked ? RANK_COLORS[rankIndex] : null

          return (
            <button
              key={item.slug}
              onClick={() => handleClick(item.slug)}
              className={`group flex items-center gap-4 p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                isRanked
                  ? `${colors!.bg}`
                  : "bg-white/[0.03] border-white/10 hover:bg-white/[0.07] hover:border-white/20"
              }`}
            >
              <span className="text-2xl w-8 text-center shrink-0">
                {isRanked ? colors!.badge : <span className="text-white/20 text-lg">○</span>}
              </span>
              <span className={`text-base sm:text-lg font-semibold tracking-wide transition-colors duration-200 ${
                isRanked ? colors!.text : "text-white/70 group-hover:text-white"
              }`}>
                {item.label}
              </span>
              {isRanked && (
                <span className="ml-auto text-xs text-white/30">
                  Platz {rankIndex + 1}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <button
        onClick={() => allRanked && onComplete(ranked)}
        disabled={!allRanked}
        className="mt-2 w-full py-3.5 rounded-2xl font-semibold tracking-wide transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-30 disabled:cursor-not-allowed bg-accent text-background hover:bg-accent/90 cursor-pointer"
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

### Task 3: SocialProof component

**Files:**
- Create: `components/funnel/SocialProof.tsx`

**Interfaces:**
- Produces:
  ```ts
  type SocialProofProps = { onContinue: () => void }
  export default function SocialProof(props: SocialProofProps): JSX.Element
  ```

- [ ] **Step 1: Create `components/funnel/SocialProof.tsx`**

```tsx
'use client'

const TESTIMONIALS = [
  {
    name: "Michael R.",
    location: "Bogenhausen",
    text: "Clasen hat unsere Immobilie in nur 3 Wochen vermittelt – diskret, professionell, zum Bestpreis.",
    initials: "MR",
  },
  {
    name: "Sabine K.",
    location: "Schwabing",
    text: "Die Beratung war von Anfang an auf Augenhöhe. Wir haben uns zu keinem Zeitpunkt unter Druck gesetzt gefühlt.",
    initials: "SK",
  },
  {
    name: "Thomas & Anna B.",
    location: "Maxvorstadt",
    text: "Das Netzwerk von Clasen ist beeindruckend. Unser Käufer kam aus dem Bestandskundenkreis – kein öffentliches Inserat nötig.",
    initials: "TB",
  },
]

type SocialProofProps = {
  onContinue: () => void
}

export default function SocialProof({ onContinue }: SocialProofProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 text-center">
        <p className="text-accent text-xs uppercase tracking-widest font-semibold">
          Das sagen unsere Mandanten
        </p>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          Über 200 erfolgreiche Vermittlungen in München.
        </h2>
      </div>

      <div className="flex flex-col gap-3">
        {TESTIMONIALS.map((t) => (
          <div
            key={t.initials}
            className="flex items-start gap-4 p-4 sm:p-5 bg-white/[0.03] border border-white/10 rounded-2xl"
          >
            <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-accent text-sm font-bold shrink-0">
              {t.initials}
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-white/80 text-sm leading-relaxed italic">„{t.text}"</p>
              <p className="text-white/30 text-xs">
                {t.name} · {t.location}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onContinue}
        className="w-full py-3.5 rounded-2xl bg-accent text-background font-semibold tracking-wide hover:bg-accent/90 transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        Jetzt starten →
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

### Task 4: SellerResultScreen (Käuferradar)

**Files:**
- Create: `components/funnel/SellerResultScreen.tsx`

**Interfaces:**
- Consumes: `SellerAnswers` type from `components/funnel/FunnelProvider.tsx`
- Produces:
  ```ts
  type SellerResultScreenProps = {
    objectType: SellerAnswers["objectType"] | undefined
    onCta: () => void
  }
  export default function SellerResultScreen(props: SellerResultScreenProps): JSX.Element
  ```

- [ ] **Step 1: Create `components/funnel/SellerResultScreen.tsx`**

```tsx
'use client'

import type { SellerAnswers } from "@/components/funnel/FunnelProvider"

const BUYER_COUNT: Record<SellerAnswers["objectType"], number> = {
  "apartment": 124,
  "villa": 38,
  "semi-detached": 67,
  "terraced": 89,
  "corner-terraced": 54,
  "apartment-building": 23,
  "land": 41,
}

const BLURRED_PROFILES = [
  { initials: "H.M.", detail: "Budget: ••••••", location: "Schwabing" },
  { initials: "K.F.", detail: "Budget: ••••••", location: "Bogenhausen" },
  { initials: "A.S.", detail: "Budget: ••••••", location: "Maxvorstadt" },
  { initials: "P.W.", detail: "Budget: ••••••", location: "Au-Haidhausen" },
  { initials: "M.L.", detail: "Budget: ••••••", location: "Neuhausen" },
]

type SellerResultScreenProps = {
  objectType: SellerAnswers["objectType"] | undefined
  onCta: () => void
}

export default function SellerResultScreen({ objectType, onCta }: SellerResultScreenProps) {
  const count = objectType ? BUYER_COUNT[objectType] : 47

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 text-center">
        <p className="text-accent text-xs uppercase tracking-widest font-semibold">
          Käuferradar™
        </p>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-snug">
          <span className="text-accent">{count} Interessenten</span> suchen aktuell
          eine Immobilie wie Ihre.
        </h2>
        <p className="text-white/40 text-sm">
          Unser System hat passende Käufer in unserem Netzwerk identifiziert.
        </p>
      </div>

      <div className="flex flex-col gap-2 relative">
        {BLURRED_PROFILES.map((p) => (
          <div
            key={p.initials}
            className="flex items-center gap-4 p-4 bg-white/[0.04] border border-white/10 rounded-xl select-none pointer-events-none"
          >
            <div className="w-9 h-9 rounded-full bg-accent/20 border border-accent/20 flex items-center justify-center text-accent text-xs font-bold shrink-0 blur-sm">
              {p.initials}
            </div>
            <div className="flex flex-col gap-0.5 blur-sm">
              <span className="text-white/70 text-sm font-medium">{p.detail}</span>
              <span className="text-white/30 text-xs">{p.location}</span>
            </div>
            <div className="ml-auto blur-sm">
              <span className="text-xs text-accent/70 font-semibold">Verifiziert ✓</span>
            </div>
          </div>
        ))}
        {/* lock overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-background via-background/60 to-transparent rounded-xl pointer-events-none" />
      </div>

      <button
        onClick={onCta}
        className="w-full py-4 rounded-2xl bg-accent text-background font-bold tracking-wide text-base hover:bg-accent/90 transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        Käufer jetzt sehen →
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

### Task 5: FunnelContactForm

**Files:**
- Create: `components/funnel/FunnelContactForm.tsx`

**Interfaces:**
- Consumes: `useFunnel()` from `components/funnel/FunnelProvider.tsx`
- Produces:
  ```ts
  export default function FunnelContactForm(): JSX.Element
  // no props — reads full funnel state from context and logs on submit
  ```

- [ ] **Step 1: Create `components/funnel/FunnelContactForm.tsx`**

```tsx
'use client'

import { useState } from "react"
import { useFunnel } from "@/components/funnel/FunnelProvider"

export default function FunnelContactForm() {
  const { type, answers } = useFunnel()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    console.log("funnel_submission", {
      type,
      answers,
      contact: { name, email, phone },
    })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 text-center py-8">
        <span className="text-4xl">✦</span>
        <h2 className="text-xl font-bold text-foreground">Vielen Dank.</h2>
        <p className="text-white/50 text-sm leading-relaxed max-w-xs">
          Wir melden uns innerhalb von 24 Stunden persönlich bei Ihnen.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 text-center">
        <p className="text-accent text-xs uppercase tracking-widest font-semibold">
          Letzter Schritt
        </p>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          Ihre Kontaktdaten
        </h2>
        <p className="text-white/40 text-sm">
          Kostenlos & unverbindlich. Diskret. In CLASEN-Qualität.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Vor- und Nachname"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3.5 text-foreground text-sm placeholder:text-white/30 focus:outline-none focus:border-accent/50 transition-colors duration-200"
        />
        <input
          type="email"
          placeholder="E-Mail-Adresse"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3.5 text-foreground text-sm placeholder:text-white/30 focus:outline-none focus:border-accent/50 transition-colors duration-200"
        />
        <input
          type="tel"
          placeholder="Telefonnummer"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3.5 text-foreground text-sm placeholder:text-white/30 focus:outline-none focus:border-accent/50 transition-colors duration-200"
        />
        <button
          type="submit"
          className="w-full mt-2 py-4 rounded-2xl bg-accent text-background font-bold tracking-wide text-base hover:bg-accent/90 transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Kostenlos & unverbindlich anfragen
        </button>
      </form>
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

### Task 6: SellerFunnel step machine

**Files:**
- Create: `components/funnel/SellerFunnel.tsx`

**Interfaces:**
- Consumes:
  - `useFunnel()` → `{ answers, setAnswer }` from `FunnelProvider`
  - `SocialProof` from `./SocialProof`
  - `Treppchen` from `./Treppchen`
  - `SellerResultScreen` from `./SellerResultScreen`
  - `FunnelContactForm` from `./FunnelContactForm`
  - `MUNICH_DISTRICTS` from `@/lib/munich-districts`
  - `SellerAnswers` type from `./FunnelProvider`
- Produces:
  ```ts
  export default function SellerFunnel(): JSX.Element
  ```

- [ ] **Step 1: Create `components/funnel/SellerFunnel.tsx`**

```tsx
'use client'

import { useState } from "react"
import { useFunnel } from "@/components/funnel/FunnelProvider"
import type { SellerAnswers } from "@/components/funnel/FunnelProvider"
import SocialProof from "@/components/funnel/SocialProof"
import Treppchen from "@/components/funnel/Treppchen"
import SellerResultScreen from "@/components/funnel/SellerResultScreen"
import FunnelContactForm from "@/components/funnel/FunnelContactForm"
import { MUNICH_DISTRICTS } from "@/lib/munich-districts"

const TOTAL_STEPS = 8

const PHASE_OPTIONS: Array<{ slug: SellerAnswers["phase"]; label: string }> = [
  { slug: "preparation", label: "Vorbereitungsphase (Noch nicht auf dem Markt)" },
  { slug: "was-on-market", label: "War bereits auf dem Markt" },
  { slug: "on-market", label: "Ist aktuell auf dem Markt" },
]

const PARTNER_OPTIONS: Array<{ slug: SellerAnswers["partnerType"]; label: string; desc: string }> = [
  { slug: "experienced", label: "Äußerst erfahren", desc: "Im Umgang mit potentiellen Kaufinteressenten" },
  { slug: "negotiator", label: "Ein harter Verhandler", desc: "Der den besten Preis für mich herausholt" },
  { slug: "communicative", label: "Erreichbar & einfühlsam", desc: "Der all unsere Fragen souverän beantwortet" },
]

const OBJECT_OPTIONS: Array<{ slug: SellerAnswers["objectType"]; label: string; icon: string }> = [
  { slug: "apartment-building", label: "Mehrfamilienhaus", icon: "🏢" },
  { slug: "villa", label: "Villa / Einfamilienhaus", icon: "🏡" },
  { slug: "semi-detached", label: "Doppelhaus- / Villenhälfte", icon: "🏘️" },
  { slug: "terraced", label: "Reihenhaus", icon: "🏠" },
  { slug: "corner-terraced", label: "Reiheneckhaus", icon: "🏠" },
  { slug: "apartment", label: "Wohnung", icon: "🪟" },
  { slug: "land", label: "Baugrundstück", icon: "🌿" },
]

const PRIORITY_ITEMS = [
  { slug: "speed", label: "Geschwindigkeit" },
  { slug: "price", label: "Preis" },
  { slug: "communication", label: "Kommunikation & Informationsfluss" },
]

export default function SellerFunnel() {
  const { setAnswer, answers } = useFunnel()
  const [step, setStep] = useState(0)
  const [districtSearch, setDistrictSearch] = useState("")

  const next = () => setStep((s) => s + 1)

  const filteredDistricts = MUNICH_DISTRICTS.filter((d) =>
    d.label.toLowerCase().includes(districtSearch.toLowerCase())
  )

  // Step 0–7
  const screens = [
    // Step 0: Social Proof
    <SocialProof key="social" onContinue={next} />,

    // Step 1: Q1 Priorities (Treppchen)
    <div key="q1" className="flex flex-col gap-4">
      <StepHeading
        label="Frage 1 von 5"
        title="Was ist Ihnen besonders wichtig?"
        subtitle="Sortieren Sie nach Priorität — Platz 1 ist am wichtigsten."
      />
      <Treppchen
        items={PRIORITY_ITEMS}
        onComplete={(ordered) => {
          setAnswer("priorities", ordered as SellerAnswers["priorities"])
          next()
        }}
      />
    </div>,

    // Step 2: Q2 Phase
    <div key="q2" className="flex flex-col gap-4">
      <StepHeading
        label="Frage 2 von 5"
        title="In welcher Phase des Verkaufs befinden Sie sich?"
      />
      <div className="flex flex-col gap-3">
        {PHASE_OPTIONS.map((o) => (
          <button
            key={o.slug}
            onClick={() => { setAnswer("phase", o.slug); next() }}
            className="p-4 sm:p-5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-accent rounded-2xl text-left text-white/80 hover:text-white font-medium text-sm sm:text-base transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>,

    // Step 3: Q3 Partner type
    <div key="q3" className="flex flex-col gap-4">
      <StepHeading
        label="Frage 3 von 5"
        title="Der für mich ideale Verkaufspartner ist…"
      />
      <div className="flex flex-col gap-3">
        {PARTNER_OPTIONS.map((o) => (
          <button
            key={o.slug}
            onClick={() => { setAnswer("partnerType", o.slug); next() }}
            className="group p-4 sm:p-5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-accent rounded-2xl text-left transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <span className="block text-white/80 group-hover:text-white font-semibold text-sm sm:text-base">{o.label}</span>
            <span className="block text-white/40 text-xs sm:text-sm mt-0.5">{o.desc}</span>
          </button>
        ))}
      </div>
    </div>,

    // Step 4: Q4 Object type
    <div key="q4" className="flex flex-col gap-4">
      <StepHeading
        label="Frage 4 von 5"
        title="Um welche Objekt-Art handelt es sich?"
      />
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
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

    // Step 5: Q5 District
    <div key="q5" className="flex flex-col gap-4">
      <StepHeading
        label="Frage 5 von 5"
        title="In welchem Stadtteil befindet sich die Immobilie?"
        subtitle="Alle Stadtteile in München."
      />
      <input
        type="text"
        placeholder="Stadtteil suchen…"
        value={districtSearch}
        onChange={(e) => setDistrictSearch(e.target.value)}
        className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-foreground text-sm placeholder:text-white/30 focus:outline-none focus:border-accent/50 transition-colors duration-200"
        autoFocus
      />
      <div className="flex flex-col gap-1.5 max-h-56 overflow-y-auto pr-1">
        {filteredDistricts.map((d) => (
          <button
            key={d.slug}
            onClick={() => { setAnswer("district", d.slug); next() }}
            className="p-3 sm:p-4 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-accent rounded-xl text-left text-white/70 hover:text-white text-sm transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {d.label}
          </button>
        ))}
        {filteredDistricts.length === 0 && (
          <p className="text-white/30 text-sm text-center py-4">Kein Stadtteil gefunden.</p>
        )}
      </div>
    </div>,

    // Step 6: Käuferradar result
    <SellerResultScreen
      key="result"
      objectType={answers.objectType as SellerAnswers["objectType"] | undefined}
      onCta={next}
    />,

    // Step 7: Contact form
    <FunnelContactForm key="contact" />,
  ]

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12">
      {/* Progress bar */}
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

      {/* Step card */}
      <div className="w-full max-w-xl bg-white/[0.02] border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-md shadow-2xl">
        {screens[step]}
      </div>
    </div>
  )
}

function StepHeading({
  label,
  title,
  subtitle,
}: {
  label: string
  title: string
  subtitle?: string
}) {
  return (
    <div className="flex flex-col gap-1.5 text-center mb-2">
      <p className="text-accent text-xs uppercase tracking-widest font-semibold">{label}</p>
      <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-snug">{title}</h2>
      {subtitle && <p className="text-white/40 text-sm">{subtitle}</p>}
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd /Users/leonardogranetto/Projects/clasen-immos && npx tsc --noEmit 2>&1 | head -30
```
Expected: no errors.

---

### Task 7: Seller page + preselection update

**Files:**
- Create: `app/[lang]/(funnel)/funnels/seller/page.tsx`
- Modify: `components/FunnelSelectionClient.tsx`

**Interfaces:**
- Consumes:
  - `FunnelProvider` from `@/components/funnel/FunnelProvider`
  - `SellerFunnel` from `@/components/funnel/SellerFunnel`
  - `useRouter` (already in FunnelSelectionClient)

- [ ] **Step 1: Create `app/[lang]/(funnel)/funnels/seller/page.tsx`**

```tsx
import { FunnelProvider } from "@/components/funnel/FunnelProvider"
import SellerFunnel from "@/components/funnel/SellerFunnel"

export async function generateStaticParams() {
  return [{ lang: "de" }, { lang: "en" }, { lang: "ru" }, { lang: "zh" }]
}

export default function SellerPage() {
  return (
    <FunnelProvider initialType="seller">
      <SellerFunnel />
    </FunnelProvider>
  )
}
```

- [ ] **Step 2: Update `components/FunnelSelectionClient.tsx` — replace Calendly calls with router.push**

In `FunnelSelectionClient.tsx`, find `handleSellClick` and `handleSearchTypeSelection` and replace their bodies:

```tsx
const handleSellClick = () => {
  trackEvent("funnel_sell_selected", { source: "selection_page" })
  router.push(`/${lang}/funnels/seller`)
}

const handleSearchTypeSelection = (type: 'investor' | 'owner') => {
  const route = type === 'investor' ? 'investor' : 'owner'
  trackEvent("funnel_search_type_selected", { type, source: "selection_page" })
  // Phase 2 routes — navigate when built; for now log
  console.log(`navigate to /${lang}/funnels/${route}`)
}
```

Also remove `useCalendlyDialog` import and its usage (`const { openDialog } = useCalendlyDialog()`) since it's no longer needed.

- [ ] **Step 3: Final TypeScript check**

```bash
cd /Users/leonardogranetto/Projects/clasen-immos && npx tsc --noEmit 2>&1 | head -30
```
Expected: no errors.

- [ ] **Step 4: Manual smoke test**

Start dev server:
```bash
npm run dev
```

1. Go to `http://localhost:3000/de` — SideBanner visible on left
2. Click SideBanner text → navigates to `/de/funnels/selection`
3. Click "Immobilie verkaufen" → navigates to `/de/funnels/seller`
4. Seller funnel loads with social proof screen, progress bar shows Step 1 of 8
5. Click "Jetzt starten →" → advances to Treppchen (Q1)
6. Click all 3 items in order → "Weiter" button appears → click → Q2
7. Complete all 5 questions → Käuferradar result screen with blurred cards
8. Click "Käufer jetzt sehen →" → contact form
9. Fill in name/email/phone → submit → success message + `console.log` in devtools

---

## Self-Review

**Spec coverage:**
- ✅ FunnelProvider with `type`, `answers`, `setAnswer` → Task 1
- ✅ English slugs for all stored values → Task 1 types, Task 6 options
- ✅ Treppchen click-to-rank with deselect → Task 2
- ✅ Social proof mocked (3 testimonials) → Task 3
- ✅ Käuferradar with blurred profiles + buyer count by objectType → Task 4
- ✅ Contact form (name/email/phone) with console.log on submit → Task 5
- ✅ 8-step seller flow in correct order → Task 6
- ✅ Progress bar → Task 6
- ✅ Munich districts searchable dropdown → Task 6
- ✅ Seller page at `/[lang]/funnels/seller` → Task 7
- ✅ Preselection "Verkaufen" → `/funnels/seller` → Task 7
- ✅ Preselection investor/owner → console.log placeholder → Task 7
- ✅ No new npm dependencies → confirmed throughout
- ✅ Calendly removed from FunnelSelectionClient → Task 7

**Placeholder scan:** `console.log` in contact form submit and investor/owner navigation are intentional placeholders per spec. No unintentional TODOs.

**Type consistency:**
- `SellerAnswers["priorities"]` used in Task 6 matches definition in Task 1
- `SellerAnswers["objectType"]` passed to `SellerResultScreen` in Task 6 matches Task 4 prop type
- `useFunnel()` returns `{ type, answers, setAnswer }` — consumed identically in Tasks 5 and 6
