# Mobile Nav — Full-Screen Overlay Design

## Overview

Make `Nav.tsx` mobile-responsive by adding a hamburger menu on small screens that opens a full-screen dark overlay with centered nav links.

## Breakpoints

- `md` and above: existing desktop layout (logo left, glass pill center, white CTA right)
- below `md`: logo left, hamburger icon right — glass pill and Contact CTA hidden

## Nav Bar (mobile)

- Logo (`Clasen`) — unchanged, left
- Glass pill (`Home · Commercial · Living · Clasen`) — `hidden md:flex`
- Contact CTA — `hidden md:flex`
- Hamburger button — `flex md:hidden`, top-right, white 3-line icon

## Overlay

- `fixed inset-0 z-[100]`
- Background: `bg-background/95 backdrop-blur-md`
- Fade animation: `opacity-0 → opacity-100`, `transition-opacity duration-300`
- X close button: top-right, same position as hamburger
- Nav links: vertically + horizontally centered, stacked, `text-4xl font-bold`, white, `hover:text-accent` transition
- Contact: solid white CTA button (`bg-white text-black rounded-full px-8 py-3`) below the links, `mt-8`

## State

- Single `isOpen: boolean` state in `Nav.tsx`
- `Nav.tsx` becomes `"use client"`
- No additional components needed

## Files

- Modify: `components/Nav.tsx` — add `"use client"`, `useState`, hamburger button, overlay JSX
