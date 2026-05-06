# Hero Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing placeholder HeroSection with a full-bleed architecture photo hero matching the Amero-style reference design — large bottom-left headline, stats bar across the bottom, vertical "Explore" hint on the right.

**Architecture:** Single component rewrite (`components/HeroSection.tsx`). Background image via `next/image` with `fill` + `object-cover`. Stats bar absolutely positioned at the bottom. Unsplash placeholder image requires adding `remotePatterns` to `next.config.ts`.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS v4, TypeScript

---

## File Map

| Action | File | Responsibility |
|--------|------|---------------|
| Modify | `next.config.ts` | Allow remote images from `images.unsplash.com` |
| Modify | `components/HeroSection.tsx` | Full hero layout: bg image, headline, stats bar, hints |

---

### Task 1: Allow Unsplash remote images in Next.js config

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Update next.config.ts to add remotePatterns**

Replace the entire content of `next.config.ts` with:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 2: Verify the dev server still starts**

Run: `npm run dev`
Expected: server starts on `http://localhost:3000` with no errors

---

### Task 2: Rewrite HeroSection with full-bleed photo layout

**Files:**
- Modify: `components/HeroSection.tsx`

- [ ] **Step 1: Replace HeroSection with the new implementation**

Replace the entire content of `components/HeroSection.tsx` with:

```tsx
import Image from "next/image";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&q=80";

const stats = [
  { value: "200+", label: "Transaktionen" },
  { value: "65+", label: "Mandanten" },
  { value: "€250M+", label: "Betreutes Volumen" },
];

export default function HeroSection() {
  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background image */}
      <Image
        src={HERO_IMAGE}
        alt="Exklusive Immobilie"
        fill
        priority
        className="object-cover"
      />

      {/* Dark gradient overlay — strong at bottom-left for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />

      {/* Section number — top left */}
      <span className="absolute top-32 left-8 text-accent text-sm font-semibold tracking-widest uppercase z-10">
        01
      </span>

      {/* Vertical Explore hint — right edge */}
      <span className="absolute top-1/2 right-8 -translate-y-1/2 text-muted text-xs tracking-[0.3em] uppercase rotate-90 origin-center z-10">
        Explore
      </span>

      {/* Headline block — bottom left, above stats bar */}
      <div className="absolute bottom-28 left-8 z-10 max-w-2xl">
        <p className="text-accent text-xs uppercase tracking-widest mb-3 font-semibold">
          Unsere Vision
        </p>
        <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight text-foreground mb-4">
          Exklusive Immobilien,{" "}
          <span className="block">Bewährt über Zeit.</span>
        </h1>
        <p className="text-muted max-w-md leading-relaxed text-sm">
          Die elitäre Welt der institutionellen Immobilieninvestoren. Wir sind
          das Bindeglied zwischen anspruchsvollen Mandanten und
          außergewöhnlichen Immobilienchancen.
        </p>
      </div>

      {/* Stats bar — pinned to bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10 flex border-t border-white/10 bg-black/40 backdrop-blur-sm">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`flex-1 px-8 py-5 ${
              i < stats.length - 1 ? "border-r border-white/10" : ""
            }`}
          >
            <p className="text-foreground text-2xl font-bold">{stat.value}</p>
            <p className="text-muted text-xs uppercase tracking-widest mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Open the browser and verify the hero**

Navigate to `http://localhost:3000`.

Check:
- Background photo fills the full viewport
- Dark overlay makes text readable
- `"01"` accent label visible top-left (below nav)
- `"Unsere Vision"` label + large headline bottom-left
- Stats bar at the very bottom with 3 columns
- `"Explore"` vertical text on the right
- Nav: logo left, links right, no sign-up button

- [ ] **Step 3: Check on a narrower viewport (mobile)**

Resize browser to ~375px width. Verify:
- Headline doesn't overflow or clip
- Stats bar columns don't overflow (they can be smaller — no wrapping needed for now)
- No horizontal scroll
