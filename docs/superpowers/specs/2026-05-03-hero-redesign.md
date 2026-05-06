# Hero Section Redesign — Clasen Immos

## Overview

Redesign the existing `HeroSection` component to match the reference design (Amero-style landing hero). Full-bleed architecture photo with dark overlay, large bottom-left headline, stats bar across the bottom, and vertical "Explore" hint on the right. Nav already matches (logo left, links right, no sign-up button) — no Nav changes needed.

## Reference

User-provided screenshot: clean, minimal dark hero with a moody architecture photo, headline bottom-left, stats row at the bottom.

## HeroSection Layout

### Background
- Full-viewport `<section>` with `position: relative; overflow: hidden`
- Placeholder image via `next/image` with `fill` + `objectFit: cover`
- Dark gradient overlay: `from-black/60 via-black/30 to-transparent` (bottom-to-top or left-to-right) to keep headline readable

### Content (bottom-left)
- Small uppercase label: `"Unsere Vision"` in accent color (`#9aff4e`), `tracking-widest`
- Large bold headline (2 lines): `"Exklusive Immobilien, Bewährt über Zeit."` — `text-5xl md:text-7xl`, `font-bold`, white
- Short body text below headline: existing description copy, `text-muted`, `max-w-md`

### Stats Bar (bottom, full width)
- Pinned to bottom of hero section via absolute positioning
- Three stat blocks separated by a thin vertical divider:
  - `200+` — Abgeschlossene Transaktionen
  - `65+` — Zufriedene Mandanten
  - `€250M+` — Betreutes Volumen
- Background: `bg-black/40` with `backdrop-blur-sm`, thin top border in muted color
- Stat number: large white bold text; label: small muted uppercase

### Vertical Explore Hint
- Right edge, vertically centered
- `"Explore"` rotated 90°, `text-muted`, `text-xs`, `tracking-[0.3em]`, `uppercase`
- Already exists in current code — keep as-is

### Section Number
- Top-left `"01"` in accent color — keep as-is

## Nav

No changes. Already correct:
- Logo (`Clasen`) on the left
- Nav links on the right: Home · Commercial · Living · Clasen · Contact
- No sign-up button

## Placeholder Image

Use Unsplash source URL for a moody architecture/real estate image during development. Will be swapped for client-provided asset later.

## Files Affected

- `components/HeroSection.tsx` — full rewrite of the section body

## Out of Scope

- Nav changes
- ProfileSection or other page sections
- Real image assets (client-provided later)
- Mobile-specific nav (hamburger menu)
