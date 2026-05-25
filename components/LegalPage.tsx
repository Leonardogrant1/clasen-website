import React from "react";

type Section = { title: string; content: string };
function renderWithLinks(text: string) {
  const emailPattern = "[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}";
  // Telefon: muss mit +, 00 oder (0) bzw. 0 beginnen und mind. 8 Ziffern enthalten
  const phonePattern = "(?:\\+|00)?\\s?(?:\\(0\\)|0)[\\d\\s()\\-/]{7,}\\d";
  const pattern = new RegExp(`(${emailPattern})|(${phonePattern})`, "g");

  const parts: React.ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const value = match[0].trim();
    if (match[1]) {
      parts.push(<a key={key++} href={`mailto:${value}`} className="text-white/70 hover:text-accent underline underline-offset-2 transition-colors duration-200">{value}</a>);
    } else {
      const tel = value.replace(/[\s()\-/]/g, "");
      parts.push(<a key={key++} href={`tel:${tel}`} className="text-white/70 hover:text-accent underline underline-offset-2 transition-colors duration-200">{value}</a>);
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
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
