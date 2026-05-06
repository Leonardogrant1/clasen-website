# Clasen Page — Design Spec

**Date:** 2026-05-03
**Route:** `/clasen`

## Overview

A full brand-story page for Clasen Immos. Three sections flow top to bottom: Hero → Das Warum → Chronik. No animations, no JS dependencies beyond what Next.js already uses. Consistent with the existing site's dark editorial design language (`#0d0d0d` background, `#C9A84C` accent, white foreground).

---

## Section 1: Hero

- Full-viewport height (`min-h-screen`)
- **Background:** Dummy image placeholder — dark `div` with `bg-white/5 border border-white/10` and a subtle gradient, replacing a real photo later
- **Overlay:** `bg-gradient-to-t from-black/80 via-black/40 to-black/10` (same as HeroSection on home)
- **Bottom-left text block:**
  - Accent label: `Die Geschichte hinter der Marke` — `text-accent text-xs uppercase tracking-widest`
  - H1: `Eine Überzeugung. / Kein Umweg.` — bold, `text-5xl md:text-7xl`
  - Subtext: the paragraph copy in `text-muted text-sm`, `max-w-md`
  - CTA: `Die Geschichte lesen` — outlined button, `border border-accent text-accent` rounded-full, scrolls down to Chronik section

---

## Section 2: Das Warum

- `py-32 px-8`, centered container `max-w-3xl mx-auto`
- Accent label: `Das Warum` — `text-accent text-sm uppercase tracking-widest`
- Paragraph: `text-muted text-lg leading-relaxed` — the full "Das Warum" copy
- No extra elements — intentionally quiet contrast to Hero and Chronik

---

## Section 3: Chronik

- `py-32 px-8`, container `max-w-5xl mx-auto`
- **Header row:** Accent label `Chronik` + H2 `Der Weg` + stat badge `10+` in accent
- **Timeline layout:**
  - Centered vertical line (`absolute` positioned, `border-l border-white/10`)
  - Entries alternate left/right (`md:text-right` for left entries, normal for right)
  - Each entry:
    - Year in accent (`text-accent text-sm font-semibold`)
    - Title bold (`text-foreground font-bold text-xl`)
    - Subtitle in italic muted (`text-muted italic text-sm`)
    - Body text in `text-muted text-sm leading-relaxed`
  - **Milestone entries** (those with a stat like `500+`, `329.7 Mio.`) get a small stat badge below the body text — `text-accent font-bold text-lg` + descriptor in `text-muted text-xs`
  - **`Heute` entry** has no year number, replaced with an accent-colored dot marker

---

## Timeline Entries (in order)

1. Sommer 1993 — Ursprung
2. 18. Geburtstag — Erster Versuch
3. 2012 — Erweckung
4. 2015 — Wendepunkt
5. 2016 — Quereinstieg *(milestone: 1 Jahr, Verkaufsrekorde)*
6. 2017 — Erkundung
7. 2018 — Gründung (Maklerunternehmen) *(milestone: 500+ Immobilien, 7-stellig)*
8. 2018 — Gründung (Baufirma)
9. Meilenstein — Projekt (Ensemble)
10. Meilenstein — Baudenkmal *(milestone: 4 Jahre)*
11. 2024 — Vision / Family Office *(milestone: 329.7 Mio.)*
12. Heute — Spezialisierung

---

## Component Structure

```
app/clasen/page.tsx              ← imports three section components
components/ClasenHero.tsx        ← Hero section
components/ClasenWarum.tsx       ← Das Warum section
components/ClasenChronik.tsx     ← Timeline section
```

Timeline data lives as a typed array inside `ClasenChronik.tsx` — no separate data file needed at this scale.

---

## Design Tokens (inherited)

| Token       | Value       |
|-------------|-------------|
| background  | `#0d0d0d`   |
| foreground  | `#ffffff`   |
| accent      | `#C9A84C`   |
| muted       | `#a1a1a1`   |
