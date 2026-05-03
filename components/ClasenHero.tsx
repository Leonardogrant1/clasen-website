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
