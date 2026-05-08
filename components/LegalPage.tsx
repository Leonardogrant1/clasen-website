type Section = { title: string; content: string };

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
                {section.content}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
