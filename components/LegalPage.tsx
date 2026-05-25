import React from "react";

type Section = { title: string; content: string };
function renderWithLinks(text: string) {
  const targets: { match: string; href: string }[] = [
    { match: "info@clasen.com", href: "mailto:info@clasen.com" },
    { match: "+49 (0) 89 66 08 55 80", href: "tel:+498966085580" },
  ];

  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  const linkClass =
    "text-white/70 hover:text-accent underline underline-offset-2 transition-colors duration-200";

  while (remaining.length > 0) {
    // finde das früheste vorkommende Target im verbleibenden Text
    let earliest: { index: number; target: typeof targets[0] } | null = null;
    for (const target of targets) {
      const idx = remaining.indexOf(target.match);
      if (idx !== -1 && (earliest === null || idx < earliest.index)) {
        earliest = { index: idx, target };
      }
    }

    if (earliest === null) {
      parts.push(remaining);
      break;
    }

    if (earliest.index > 0) parts.push(remaining.slice(0, earliest.index));
    parts.push(
      <a key={key++} href={earliest.target.href} className={linkClass}>
        {earliest.target.match}
      </a>
    );
    remaining = remaining.slice(earliest.index + earliest.target.match.length);
  }

  return parts;
}

type Props = {
  label: string;
  heading: string;
  sections: Section[];
};

export default function LegalPage({ label, heading, sections }: Props) {
  return (
    <div className="min-h-screen px-6 md:px-12 py-32 md:py-40">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-16 flex flex-col gap-4">
          <span className="text-white/30 text-[11px] uppercase tracking-[0.2em]">{label}</span>
          <h1 className="text-3xl md:text-4xl font-light tracking-wide text-foreground">
            {heading}
          </h1>
        </div>

        {/* Sections */}
        <div className="flex flex-col divide-y divide-white/5">
          {sections.map((section) => (
            <div key={section.title} className="py-10 flex flex-col gap-4">
              <h2 className="text-white/60 text-xs uppercase tracking-[0.15em]">
                {section.title}
              </h2>
              <p className="text-white/40 text-sm leading-relaxed whitespace-pre-line">
                {renderWithLinks(section.content)}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
