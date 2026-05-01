# Clasen Immos — Landing Page Design

## Overview

A multi-page real estate landing page for "Clasen Immos" built with Next.js 16 App Router, Tailwind CSS v4, and TypeScript. Goal: dual-purpose — lead generation and prestige/brand presence. SEO is a priority.

## Pages

| Route | Purpose |
|---|---|
| `/` | Home — Hero + editorial sections |
| `/commercial` | Commercial real estate — dummy content |
| `/living` | Residential real estate — dummy content |
| `/clasen` | About Clasen — dummy content |
| `/contact` | Static contact form |

Exact page titles and copy will be refined later by the client.

## Navigation

- Fixed/sticky at top, transparent over hero
- Logo on the left
- Nav links on the right: Home · Commercial · Living · Clasen · Contact
- Active link highlighted with lime-green accent

## Design Tokens (provisional)

These are approximations from the provided screenshots. Final values will be replaced once assets are delivered.

- **Background:** `#0d0d0d`
- **Accent:** `#9aff4e` (lime green)
- **Text primary:** `#ffffff`
- **Text secondary:** `#a1a1a1`
- **Font:** Geist Sans (placeholder — custom font TBD)

## Home Page Sections

1. **HeroSection** — Full-viewport dark section. Large bold heading (e.g. "KRISE?!"), numbered label top-left in accent color, "EXPLORE" hint right side, background real estate image with dark overlay.
2. **ProfileSection** — Editorial layout. "PROFIL" label in accent, large heading "Leidenschaft die ihresgleichen sucht.", stat number left side, oval-clipped architecture photo, body text, CTA button.
3. **[Further sections TBD]** — Client will define additional sections.

## Dummy Pages (Commercial, Living, Clasen)

Each shares the root layout (Nav + Footer). Content: centered placeholder text on dark background. Same visual language as Home.

## Contact Page

Static HTML form with fields:
- Name
- Email
- Phone (optional)
- Message
- Submit button (no backend, UI only)

Nodemailer + Ionos SMTP will be wired up in a future iteration.

## Component Structure

```
app/
├── layout.tsx          — Root layout: Nav + children + Footer
├── page.tsx            — Home
├── commercial/page.tsx — Dummy
├── living/page.tsx     — Dummy
├── clasen/page.tsx     — Dummy
└── contact/page.tsx    — Static form

components/
├── Nav.tsx
├── Footer.tsx
├── HeroSection.tsx
└── ProfileSection.tsx
```

## SEO

Each page exports a `metadata` object from Next.js. Titles and descriptions are placeholder for now. Client will provide final copy.

## Out of Scope (this iteration)

- Email sending (Nodemailer)
- CMS or dynamic content
- Authentication
- Custom fonts / final brand assets
- Real content for Commercial, Living, Clasen pages
