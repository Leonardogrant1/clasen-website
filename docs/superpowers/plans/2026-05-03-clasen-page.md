# Clasen Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the full `/clasen` brand-story page with Hero, Das Warum, and Chronik (vertical alternating timeline) sections.

**Architecture:** Three focused components (`ClasenHero`, `ClasenWarum`, `ClasenChronik`) composed in `app/clasen/page.tsx`. Timeline data is a typed array inside `ClasenChronik.tsx`. No external dependencies — pure Tailwind v4 + React.

**Tech Stack:** Next.js App Router, Tailwind CSS v4, TypeScript

> **Note on testing:** This is static presentational UI with no business logic. There are no meaningful unit tests to write. Verification is done by running `npm run dev` and checking the page in the browser after each task.

---

## File Map

| Action | Path | Responsibility |
|--------|------|---------------|
| Create | `components/ClasenHero.tsx` | Full-viewport hero, dummy image placeholder, CTA |
| Create | `components/ClasenWarum.tsx` | Das Warum text block |
| Create | `components/ClasenChronik.tsx` | Typed timeline data + alternating vertical timeline |
| Modify | `app/clasen/page.tsx` | Wire up the three components, update metadata |

---

## Task 1: ClasenHero component

**Files:**
- Create: `components/ClasenHero.tsx`

- [ ] **Step 1: Create the component**

`components/ClasenHero.tsx`:
```tsx
export default function ClasenHero() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Dummy image placeholder — replace with <Image> when photo is ready */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/3 border border-white/10" />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />

      {/* Text block — bottom left */}
      <div className="absolute bottom-20 left-8 z-10 max-w-2xl">
        <p className="text-accent text-xs uppercase tracking-widest font-semibold mb-4">
          Die Geschichte hinter der Marke
        </p>
        <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight text-foreground mb-6">
          Eine Überzeugung.<br />Kein Umweg.
        </h1>
        <p className="text-muted max-w-md leading-relaxed text-sm mb-8">
          Vom 18-jährigen, dem die Bank die erste Finanzierung verweigerte, zum Family Office,
          dem Unternehmer ihr Vermögen anvertrauen. Was dazwischen liegt, ist keine Karriere —
          es ist ein Credo.
        </p>
        <a
          href="#chronik"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-accent text-accent text-sm uppercase tracking-widest hover:bg-accent hover:text-background transition-colors duration-200"
        >
          Die Geschichte lesen
        </a>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify dev server**

Run: `npm run dev`
Open: `http://localhost:3000/clasen`
Expected: dark full-viewport section, text block bottom-left, gold CTA button, no console errors.

- [ ] **Step 3: Commit**

```bash
git add components/ClasenHero.tsx
git commit -m "feat: add ClasenHero component with dummy image placeholder"
```

---

## Task 2: ClasenWarum component

**Files:**
- Create: `components/ClasenWarum.tsx`

- [ ] **Step 1: Create the component**

`components/ClasenWarum.tsx`:
```tsx
export default function ClasenWarum() {
  return (
    <section className="py-32 px-8 bg-background">
      <div className="max-w-3xl mx-auto">
        <span className="text-accent text-sm uppercase tracking-widest font-semibold block mb-6">
          Das Warum
        </span>
        <p className="text-muted text-lg leading-relaxed">
          Die Assetklasse, die mich durch alle persönlichen Krisen und jede finanzielle
          Fehlentscheidung getragen hat — zugänglich machen für alle, die sie verdienen.
          Nicht nur für Institutionelle. Nicht nur für Erben. Für jeden, der bereit ist,
          sein Kapital arbeiten zu lassen.
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wire into page temporarily to verify**

Temporarily add to `app/clasen/page.tsx`:
```tsx
import ClasenWarum from "@/components/ClasenWarum";
// add <ClasenWarum /> after existing content
```

Open: `http://localhost:3000/clasen`
Expected: gold label "DAS WARUM", paragraph in muted gray below it.

- [ ] **Step 3: Commit**

```bash
git add components/ClasenWarum.tsx
git commit -m "feat: add ClasenWarum component"
```

---

## Task 3: ClasenChronik component

**Files:**
- Create: `components/ClasenChronik.tsx`

- [ ] **Step 1: Create the component with full timeline data**

`components/ClasenChronik.tsx`:
```tsx
type Milestone = {
  stat: string;
  label: string;
};

type TimelineEntry = {
  year: string;
  category: string;
  subtitle: string;
  body: string;
  milestone?: Milestone;
  isToday?: boolean;
};

const entries: TimelineEntry[] = [
  {
    year: "Sommer 1993",
    category: "Ursprung",
    subtitle: "München. Der Anfang von allem.",
    body: "Alexander Christian Clasen wird im Sommer 1993 in München geboren — in der Stadt, die später zum Zentrum seiner Arbeit und seiner Leidenschaft werden wird. Dass der Immobilienmarkt dieser Stadt einmal sein Spielfeld sein würde, ahnte damals noch niemand. Er selbst wahrscheinlich auch nicht.",
  },
  {
    year: "18. Geburtstag",
    category: "Erster Versuch",
    subtitle: "Die Absage, die alles in Gang setzte.",
    body: "Am Tag seines 18. Geburtstags stellt Alexander seine erste Immobilienfinanzierungsanfrage. Die Antwort der Bank: Ablehnung. Kein Eigenkapital, kein Einkommen, keine Chance. Für die meisten wäre das das Ende des Gedankens. Für ihn war es der Beginn einer Obsession.",
  },
  {
    year: "2012",
    category: "Erweckung",
    subtitle: "»Rich Dad Poor Dad« und die Erkenntnis.",
    body: "Nach dem Abitur öffnet ein Buch und ein Blick in die Welt gut situierter Freunde eine völlig neue Perspektive: passives Einkommen durch Immobilien. Alexander taucht tief in die Fachliteratur ein. Jura- und Psychologiestudium beginnen zwar — rücken aber zunehmend in den Hintergrund. Die echte Ausbildung findet in Büchern, Bilanzen und Grundbuchauszügen statt.",
  },
  {
    year: "2015",
    category: "Wendepunkt",
    subtitle: "Der Abbruch, gegen den Rat aller.",
    body: "Kurz vor dem Abschluss bricht Alexander sein kostspieliges Psychologiestudium ab. Nicht aus Gleichgültigkeit — sondern aus Klarheit. Er erkennt, welches Potential ein eigener Immobilienbestand auf den angestrebten frühzeitigen Ruhestand haben kann. Alle raten ab. Er macht es trotzdem. Diese Entscheidung, konsequent gegen den Strom zu schwimmen, wird zum Leitmotiv seiner gesamten Laufbahn.",
  },
  {
    year: "2016",
    category: "Quereinstieg",
    subtitle: "100 Jahre Geschichte. In einem Jahr überholt.",
    body: "Als Quereinsteiger tritt Alexander in eines der renommiertesten Maklerhäuser Münchens ein — über ein Jahrhundert Firmengeschichte, gewachsene Strukturen, eingespielte Rekorde. Ein Jahr später sind mehrere davon gebrochen: teuerste vermittelte Wohnung, größter Vermietungsauftrag — Bestmarken, die jahrzehntelang Bestand hatten. Die Erkenntnis: Der Münchener Maklermarkt ist eingestaubt. Und bereit für eine Revolution.",
    milestone: {
      stat: "1",
      label: "Jahr · Mehrere Verkaufsrekorde aus über 100 Jahren Firmengeschichte gebrochen",
    },
  },
  {
    year: "2017",
    category: "Erkundung",
    subtitle: "Die andere Seite. Schweizer Präzision.",
    body: "Vor dem geplanten und bereits feststehenden Schritt in die Selbstständigkeit folgt ein bewusster Abstecher: ein modernes Schweizer Franchise-System. Konträr zu allem, was er bisher kannte. Andere Prozesse, andere Haltung, andere Maßstäbe. Alexander saugt beides auf — und weiß danach noch genauer, wie sein eigenes Unternehmen aussehen wird. Und wie nicht.",
  },
  {
    year: "2018",
    category: "Gründung",
    subtitle: "Das erste eigene Unternehmen. Mit einem klaren Auftrag.",
    body: "Gründung des ersten eigenen Maklerunternehmens — mit einer ungewöhnlichen Strategie: Der Fokus liegt ausschließlich auf Verkäufern, die mit der Maklerzunft bereits abgeschlossen hatten. Menschen, die überzeugt waren, keinen Makler zu brauchen. Oft genug lagen sie falsch. Über 500 Immobilien werden in der Folge vermittelt. Das Ergebnis im ersten Jahr: siebenstelliger Umsatz — und die Bestätigung, dass ein anderer Weg möglich ist.",
    milestone: {
      stat: "500+",
      label: "Vermittelte Immobilien · 7-stelliger Umsatz im Gründungsjahr",
    },
  },
  {
    year: "2018",
    category: "Gründung",
    subtitle: "Die eigene Baufirma. Weil echte Unabhängigkeit keine Kompromisse kennt.",
    body: "Noch im selben Gründungsjahr folgt der nächste konsequente Schritt: die Gründung eines eigenen Bauunternehmens. Der Grund ist so simpel wie strategisch — wer seinen Mandanten „alles aus einer Hand" verspricht, darf nicht auf dem Weg dorthin von Fremdfirmen abhängig sein. Qualität, Timing und Kostenkontrolle bleiben so vollständig in eigener Hand. Für die Mandanten bedeutet das: ein Ansprechpartner, eine Verantwortung, ein Ergebnis — vom ersten Beratungsgespräch bis zur fertigen Immobilie.",
  },
  {
    year: "Meilenstein",
    category: "Projekt",
    subtitle: "Ein Ensemble. Vollständig in eigener Hand.",
    body: "Ein langjähriger Stammkunde vertraut CLASEN mit dem Erwerb eines kompletten Mehrfamilienhausensembles in solider Münchener Lage. Was folgt, ist ein Auftrag in voller Bandbreite: Objektakquisition, wirtschaftliche Planung, Förderungsmanagement, Kernsanierung, Projektentwicklung, Innenausbau, Vermietung und laufende Objektbetreuung — alles aus einer Hand. Ein Beweis dafür, was echte Partnerschaft bedeutet.",
  },
  {
    year: "Meilenstein",
    category: "Baudenkmal",
    subtitle: "München, Theresienwiese. Vier Jahre. Ein Denkmal.",
    body: "Eine Münchener Erbengemeinschaft vertraut CLASEN mit einem der anspruchsvollsten Aufträge der Unternehmensgeschichte: die aufwendige, vierjährige Kernsanierung eines bekannten Baudenkmals nahe der Theresienwiese. Denkmalschutz, Erbrecht, Sanierungskomplexität, Münchener Behördenlandschaft. Das Projekt steht für das, was CLASEN ausmacht: Diskretion, Ausdauer und die Fähigkeit, auch dort Ergebnisse zu liefern, wo andere scheitern.",
    milestone: {
      stat: "4",
      label: "Jahre Projektlaufzeit · Baudenkmal · Theresienwiese München",
    },
  },
  {
    year: "2024",
    category: "Vision",
    subtitle: "CLASEN Family Office. Der nächste Schlüssel.",
    body: "Aus dem Maklerhaus wird ein Family Office. Der Schritt ist konsequent — nicht Neuerfindung, sondern Vollendung. 329,7 Mio. € anvertraute Kundenwerte. 687 vermittelte Investments. 97 % Weiterempfehlung. Das Fundament steht. Was folgt, ist die nächste Stufe: maßgeschneiderte Kapitalanlagen, Steuersparmodelle und Off-Market-Zugang für alle, die ihr Kapital arbeiten lassen wollen — zu Konditionen, die sonst nur Institutionelle kennen.",
    milestone: {
      stat: "329.7",
      label: "Mio. € anvertraute Kundenwerte · 97 % Weiterempfehlung",
    },
  },
  {
    year: "Heute",
    category: "Spezialisierung",
    subtitle: "Steuern sparen als Königsdisziplin.",
    body: "Mit wachsendem Mandantenstamm wächst auch die Erkenntnis: Die größte Stellschraube im Vermögensaufbau ist nicht die Rendite — es ist die Steuerlast. CLASEN spezialisiert sich konsequent auf maßgeschneiderte Steuersparmodelle für Topverdiener, Unternehmer und anspruchsvolle Kapitalanleger. In enger Zusammenarbeit mit führenden Kanzleien entstehen rechtssichere Konzepte, die die gesamte Steuerlast der Mandanten strukturell und nachhaltig reduzieren — nicht als Trick, sondern als Architektur. Wer einmal verstanden hat, wie viel Kapital hier jährlich verloren geht, denkt Investitionen nie wieder gleich.",
    isToday: true,
  },
];

function EntryContent({
  entry,
  align,
}: {
  entry: TimelineEntry;
  align: "left" | "right";
}) {
  const isLeft = align === "left";
  return (
    <div className={isLeft ? "text-right" : "text-left"}>
      <span className="text-accent text-xs font-semibold uppercase tracking-widest block mb-1">
        {entry.year}
      </span>
      <h3 className="text-foreground font-bold text-lg mb-1">{entry.category}</h3>
      <p className="text-muted italic text-sm mb-3">{entry.subtitle}</p>
      <p className="text-muted text-sm leading-relaxed">{entry.body}</p>
      {entry.milestone && (
        <div className={`mt-4 flex flex-col ${isLeft ? "items-end" : "items-start"}`}>
          <span className="text-accent font-bold text-2xl">{entry.milestone.stat}</span>
          <span className="text-muted text-xs mt-1 max-w-xs leading-relaxed">
            {entry.milestone.label}
          </span>
        </div>
      )}
    </div>
  );
}

export default function ClasenChronik() {
  return (
    <section id="chronik" className="py-32 px-8 bg-background">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-baseline gap-4 mb-20">
          <span className="text-accent text-sm uppercase tracking-widest font-semibold">
            Chronik
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">Der Weg</h2>
          <span className="text-accent font-bold text-2xl ml-2">10+</span>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2" />

          {entries.map((entry, i) => (
            <div
              key={i}
              className="grid grid-cols-[1fr_32px_1fr] mb-16 items-start"
            >
              {/* Left slot — even entries */}
              <div className="pr-8">
                {i % 2 === 0 && <EntryContent entry={entry} align="left" />}
              </div>

              {/* Center dot */}
              <div className="flex justify-center pt-2">
                {entry.isToday ? (
                  <div className="w-4 h-4 rounded-full bg-accent ring-4 ring-accent/20" />
                ) : entry.year === "Meilenstein" ? (
                  <div className="w-3 h-3 rounded-full bg-white/50 ring-2 ring-white/20" />
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20 ring-2 ring-white/10" />
                )}
              </div>

              {/* Right slot — odd entries */}
              <div className="pl-8">
                {i % 2 !== 0 && <EntryContent entry={entry} align="right" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify in browser**

Open: `http://localhost:3000/clasen` (after wiring up in Task 4 or temporarily importing here)
Expected:
- "Chronik / Der Weg / 10+" header row
- 12 entries alternating left/right of center line
- Milestone entries (2016, 2018 Gründung, Baudenkmal, 2024) show stat badge below body text
- "Heute" entry has a gold glowing dot
- Center line visible running full height

- [ ] **Step 3: Commit**

```bash
git add components/ClasenChronik.tsx
git commit -m "feat: add ClasenChronik alternating timeline with full copy"
```

---

## Task 4: Wire up app/clasen/page.tsx

**Files:**
- Modify: `app/clasen/page.tsx`

- [ ] **Step 1: Replace placeholder page with full composition**

`app/clasen/page.tsx`:
```tsx
import type { Metadata } from "next";
import ClasenHero from "@/components/ClasenHero";
import ClasenWarum from "@/components/ClasenWarum";
import ClasenChronik from "@/components/ClasenChronik";

export const metadata: Metadata = {
  title: "Clasen Immos — Die Geschichte",
  description:
    "Vom 18-jährigen, dem die Bank die erste Finanzierung verweigerte, zum Family Office. Die Geschichte hinter der Marke.",
};

export default function ClasenPage() {
  return (
    <>
      <ClasenHero />
      <ClasenWarum />
      <ClasenChronik />
    </>
  );
}
```

- [ ] **Step 2: Full page verification**

Open: `http://localhost:3000/clasen`
Expected:
1. Hero fills viewport — dark gradient, text bottom-left, gold CTA
2. Scrolling reveals "Das Warum" section — clean, centered, quiet
3. Chronik section loads — header row, full 12-entry timeline, alternating sides
4. "Die Geschichte lesen" CTA scrolls to `#chronik`
5. No TypeScript errors (`npm run build` passes cleanly)

- [ ] **Step 3: Run build check**

```bash
npm run build
```
Expected: `✓ Compiled successfully` with no type errors.

- [ ] **Step 4: Commit**

```bash
git add app/clasen/page.tsx
git commit -m "feat: build Clasen brand-story page — hero, warum, chronik"
```
