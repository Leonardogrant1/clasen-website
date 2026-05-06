# Clasen Immos Landing Page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 5-page Next.js 16 App Router site for Clasen Immos with shared Nav, dark theme, Hero + Profile sections on Home, dummy pages for Commercial/Living/Clasen, and a static contact form.

**Architecture:** App Router with one route per page. Shared Nav and Footer live in the root layout. Design tokens (dark background, lime-green accent) defined in globals.css via Tailwind v4 `@theme`. Components are small and single-purpose.

**Tech Stack:** Next.js 16 (App Router), Tailwind CSS v4, TypeScript, Geist Sans

---

### Task 1: Design tokens in globals.css

**Files:**
- Modify: `app/globals.css`

- [ ] **Replace the contents of `app/globals.css`** with:

```css
@import "tailwindcss";

:root {
  --background: #0d0d0d;
  --foreground: #ffffff;
  --accent: #9aff4e;
  --muted: #a1a1a1;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-accent: var(--accent);
  --color-muted: var(--muted);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

body {
  background: var(--background);
  color: var(--foreground);
}
```

- [ ] **Commit**

```bash
git add app/globals.css
git commit -m "feat: add dark theme design tokens"
```

---

### Task 2: Nav component

**Files:**
- Create: `components/Nav.tsx`

- [ ] **Create `components/Nav.tsx`**:

```tsx
import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/commercial", label: "Commercial" },
  { href: "/living", label: "Living" },
  { href: "/clasen", label: "Clasen" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6">
      <Link href="/" className="text-foreground font-semibold tracking-widest text-sm uppercase">
        Clasen
      </Link>
      <nav className="flex items-center gap-8">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-muted hover:text-accent text-sm uppercase tracking-widest transition-colors duration-200"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
```

- [ ] **Commit**

```bash
git add components/Nav.tsx
git commit -m "feat: add Nav component"
```

---

### Task 3: Footer component

**Files:**
- Create: `components/Footer.tsx`

- [ ] **Create `components/Footer.tsx`**:

```tsx
export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-8 py-8 flex items-center justify-between">
      <span className="text-muted text-sm uppercase tracking-widest">
        © {new Date().getFullYear()} Clasen Immos
      </span>
      <span className="text-muted text-sm uppercase tracking-widest">
        All rights reserved
      </span>
    </footer>
  );
}
```

- [ ] **Commit**

```bash
git add components/Footer.tsx
git commit -m "feat: add Footer component"
```

---

### Task 4: Root layout with Nav + Footer

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Replace `app/layout.tsx`** with:

```tsx
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clasen Immos",
  description: "Professionelle Immobilienlösungen für anspruchsvolle Kunden.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Commit**

```bash
git add app/layout.tsx
git commit -m "feat: wire Nav and Footer into root layout"
```

---

### Task 5: HeroSection component

**Files:**
- Create: `components/HeroSection.tsx`

- [ ] **Create `components/HeroSection.tsx`**:

```tsx
export default function HeroSection() {
  return (
    <section className="relative h-screen flex items-end overflow-hidden bg-background">
      {/* Background image placeholder — replace src with real asset */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-background" />

      {/* Section number */}
      <span className="absolute top-32 left-8 text-accent text-sm font-semibold tracking-widest uppercase">
        01
      </span>

      {/* Explore hint */}
      <span className="absolute top-1/2 right-8 -translate-y-1/2 text-muted text-xs tracking-[0.3em] uppercase rotate-90 origin-center">
        Explore
      </span>

      {/* Headline */}
      <div className="relative z-10 px-8 pb-24 w-full max-w-4xl">
        <p className="text-muted text-sm uppercase tracking-widest mb-4">
          Unsere Vision
        </p>
        <h1 className="text-7xl md:text-9xl font-bold leading-none tracking-tight text-foreground mb-6">
          KRISE?!
        </h1>
        <p className="text-muted max-w-md leading-relaxed">
          Die elitäre Welt der institutionellen Immobilieninvestoren. Wir sind
          das Bindeglied zwischen anspruchsvollen Mandanten und außergewöhnlichen
          Immobilienchancen.
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Commit**

```bash
git add components/HeroSection.tsx
git commit -m "feat: add HeroSection component"
```

---

### Task 6: ProfileSection component

**Files:**
- Create: `components/ProfileSection.tsx`

- [ ] **Create `components/ProfileSection.tsx`**:

```tsx
export default function ProfileSection() {
  return (
    <section className="relative py-32 px-8 bg-background overflow-hidden">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Left: stat + vertical label */}
        <div className="relative flex flex-col justify-center">
          {/* Vertical label */}
          <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 text-muted text-xs tracking-[0.3em] uppercase rotate-180 [writing-mode:vertical-lr] hidden lg:block">
            Aus Leidenschaft. Landesweit.
          </span>

          {/* Oval image placeholder */}
          <div className="w-64 h-80 rounded-[50%] bg-white/5 border border-white/10 overflow-hidden mx-auto">
            <div className="w-full h-full bg-gradient-to-b from-white/5 to-white/10" />
          </div>

          {/* Stat */}
          <div className="mt-8 text-center">
            <span className="text-7xl font-bold text-foreground">329.7</span>
            <span className="text-accent text-sm ml-2 uppercase tracking-widest">Mio.</span>
          </div>
        </div>

        {/* Right: text content */}
        <div className="flex flex-col gap-6">
          <span className="text-accent text-sm uppercase tracking-widest font-semibold">
            Profil
          </span>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight text-foreground">
            Leidenschaft die ihresgleichen sucht.
          </h2>
          <p className="text-muted leading-relaxed">
            Wenn sich Weitblick und Detailverliebtheit nicht nur auf das eigene
            Portfolio beschränken, sondern von einem ganzheitlichen Mandanten-
            und Dienstleistungsverständnis getragen werden, dann such Sie nach
            dem Erfolg, den Sie Ihren Liebsten beschrieben werden.
          </p>
          <p className="text-muted leading-relaxed">
            Diese Leidenschaft und die Stärke, die Ressourcen und das Netzwerk
            der FAR-Gruppe professionell einzusetzen, garantieren Ihnen
            einzigartige Performance und das nötige Maß an Menschlichkeit.
          </p>
          <button className="self-start mt-4 px-8 py-4 border border-accent text-accent text-sm uppercase tracking-widest hover:bg-accent hover:text-background transition-colors duration-200">
            Schlüsselmoment erleben
          </button>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Commit**

```bash
git add components/ProfileSection.tsx
git commit -m "feat: add ProfileSection component"
```

---

### Task 7: Home page

**Files:**
- Modify: `app/page.tsx`

- [ ] **Replace `app/page.tsx`** with:

```tsx
import type { Metadata } from "next";
import HeroSection from "@/components/HeroSection";
import ProfileSection from "@/components/ProfileSection";

export const metadata: Metadata = {
  title: "Clasen Immos — Home",
  description:
    "Die elitäre Welt der institutionellen Immobilieninvestoren. Professionelle Lösungen für anspruchsvolle Mandanten.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProfileSection />
    </>
  );
}
```

- [ ] **Commit**

```bash
git add app/page.tsx
git commit -m "feat: build Home page with Hero and Profile sections"
```

---

### Task 8: Dummy pages (Commercial, Living, Clasen)

**Files:**
- Create: `app/commercial/page.tsx`
- Create: `app/living/page.tsx`
- Create: `app/clasen/page.tsx`

- [ ] **Create `app/commercial/page.tsx`**:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clasen Immos — Commercial",
  description: "Gewerbliche Immobilien — demnächst.",
};

export default function CommercialPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <span className="text-accent text-sm uppercase tracking-widest font-semibold">Commercial</span>
      <h1 className="text-5xl font-bold text-foreground">Demnächst.</h1>
      <p className="text-muted text-sm tracking-widest uppercase">Inhalte folgen</p>
    </div>
  );
}
```

- [ ] **Create `app/living/page.tsx`**:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clasen Immos — Living",
  description: "Wohnimmobilien — demnächst.",
};

export default function LivingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <span className="text-accent text-sm uppercase tracking-widest font-semibold">Living</span>
      <h1 className="text-5xl font-bold text-foreground">Demnächst.</h1>
      <p className="text-muted text-sm tracking-widest uppercase">Inhalte folgen</p>
    </div>
  );
}
```

- [ ] **Create `app/clasen/page.tsx`**:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clasen Immos — Clasen",
  description: "Über Clasen Immos — demnächst.",
};

export default function ClasenPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <span className="text-accent text-sm uppercase tracking-widest font-semibold">Clasen</span>
      <h1 className="text-5xl font-bold text-foreground">Demnächst.</h1>
      <p className="text-muted text-sm tracking-widest uppercase">Inhalte folgen</p>
    </div>
  );
}
```

- [ ] **Commit**

```bash
git add app/commercial/page.tsx app/living/page.tsx app/clasen/page.tsx
git commit -m "feat: add dummy pages for Commercial, Living, Clasen"
```

---

### Task 9: Contact page with static form

**Files:**
- Create: `app/contact/page.tsx`

- [ ] **Create `app/contact/page.tsx`**:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clasen Immos — Kontakt",
  description: "Nehmen Sie Kontakt mit uns auf.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 py-32">
      <div className="w-full max-w-xl">
        <span className="text-accent text-sm uppercase tracking-widest font-semibold">Kontakt</span>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mt-4 mb-12">
          Sprechen wir.
        </h1>
        <form className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-muted text-xs uppercase tracking-widest">Name</label>
            <input
              type="text"
              name="name"
              required
              className="bg-transparent border-b border-white/20 focus:border-accent outline-none py-3 text-foreground transition-colors duration-200"
              placeholder="Max Mustermann"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-muted text-xs uppercase tracking-widest">E-Mail</label>
            <input
              type="email"
              name="email"
              required
              className="bg-transparent border-b border-white/20 focus:border-accent outline-none py-3 text-foreground transition-colors duration-200"
              placeholder="max@beispiel.de"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-muted text-xs uppercase tracking-widest">Telefon (optional)</label>
            <input
              type="tel"
              name="phone"
              className="bg-transparent border-b border-white/20 focus:border-accent outline-none py-3 text-foreground transition-colors duration-200"
              placeholder="+49 000 000000"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-muted text-xs uppercase tracking-widest">Nachricht</label>
            <textarea
              name="message"
              required
              rows={5}
              className="bg-transparent border-b border-white/20 focus:border-accent outline-none py-3 text-foreground transition-colors duration-200 resize-none"
              placeholder="Wie können wir Ihnen helfen?"
            />
          </div>
          <button
            type="submit"
            className="self-start mt-4 px-8 py-4 border border-accent text-accent text-sm uppercase tracking-widest hover:bg-accent hover:text-background transition-colors duration-200"
          >
            Nachricht senden
          </button>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Commit**

```bash
git add app/contact/page.tsx
git commit -m "feat: add static Contact page with form"
```
