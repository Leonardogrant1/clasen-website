import type { Dictionary } from "@/app/[lang]/dictionaries";

export default function ClasenHero({ dict }: { dict: Dictionary["clasenHero"] }) {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/backgrounds/chess.png')" }} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />

      <div className="absolute bottom-20 left-4 md:left-8 z-10 max-w-2xl pr-4 md:pr-0">
        <p className="text-accent text-xs uppercase tracking-widest font-semibold mb-4">
          {dict.sectionLabel}
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight tracking-tight text-foreground mb-6 whitespace-pre-line">
          {dict.heading}
        </h1>
        <p className="text-muted max-w-md leading-relaxed text-sm mb-8">{dict.body}</p>
        <a
          href="#chronik"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-accent text-accent text-sm uppercase tracking-widest hover:bg-accent hover:text-background transition-colors duration-200"
        >
          {dict.cta}
        </a>
      </div>
    </section>
  );
}
