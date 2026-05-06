import type { Dictionary } from "@/app/[lang]/dictionaries";

type Props = {
  dict: Dictionary["alleinstell"];
  locale: string;
};

const icons = [
  <svg key="treffsicher" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12"><circle cx="24" cy="24" r="20" /><circle cx="24" cy="24" r="12" /><circle cx="24" cy="24" r="4" /><line x1="24" y1="4" x2="24" y2="10" /><line x1="24" y1="38" x2="24" y2="44" /><line x1="4" y1="24" x2="10" y2="24" /><line x1="38" y1="24" x2="44" y2="24" /></svg>,
  <svg key="offmarket" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12"><rect x="10" y="6" width="28" height="36" rx="2" /><line x1="17" y1="16" x2="31" y2="16" /><line x1="17" y1="22" x2="31" y2="22" /><line x1="17" y1="28" x2="25" y2="28" /><path d="M24 10 L28 6 L32 10" strokeLinejoin="round" /></svg>,
  <svg key="heimspiel" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12"><rect x="6" y="22" width="10" height="20" /><rect x="20" y="14" width="8" height="28" /><rect x="32" y="18" width="10" height="24" /><line x1="4" y1="42" x2="44" y2="42" /><line x1="10" y1="22" x2="10" y2="16" /><line x1="10" y1="16" x2="16" y2="16" /></svg>,
  <svg key="steuer" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12"><rect x="10" y="18" width="28" height="24" rx="2" /><path d="M16 18 C16 10 32 10 32 18" /><line x1="24" y1="26" x2="24" y2="34" /><line x1="20" y1="30" x2="28" y2="30" /></svg>,
  <svg key="exzellenz" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12"><path d="M14 20 C14 12 34 12 34 20 L30 28 H18 Z" /><rect x="16" y="28" width="16" height="4" rx="1" /><rect x="18" y="32" width="12" height="4" rx="1" /><line x1="24" y1="12" x2="24" y2="8" /><line x1="14" y1="16" x2="10" y2="13" /><line x1="34" y1="16" x2="38" y2="13" /></svg>,
  <svg key="eco" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12"><path d="M24 40 C24 40 10 30 10 20 C10 13 16 8 24 8 C32 8 38 13 38 20 C38 30 24 40 24 40Z" /><path d="M24 8 C24 8 18 16 18 24" /><path d="M24 8 C24 8 30 16 30 24" /><line x1="24" y1="40" x2="24" y2="44" /><line x1="18" y1="44" x2="30" y2="44" /></svg>,
];

export default function AlleinestellungsMerkmale({ dict, locale }: Props) {
  const base = locale === "en" ? "/en" : "";
  return (
    <section className="py-16 px-4 md:py-32 md:px-8 bg-background border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-12 md:mb-20">
          <div>
            <span className="text-accent text-xs uppercase tracking-widest font-semibold block mb-4">
              {dict.sectionLabel}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight wrap-break-words">
              {dict.heading}
            </h2>
          </div>
          <a
            href={`${base}/contact`}
            className="hidden md:inline-flex items-center gap-2 border border-white/20 text-foreground text-xs uppercase tracking-widest px-5 py-3 hover:border-accent hover:text-accent transition-colors duration-200"
          >
            {dict.cta}
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-16">
          {dict.merkmale.map((m, i) => (
            <div key={m.title} className="flex flex-col gap-4">
              <div className="text-accent">{icons[i]}</div>
              <p className="text-xs uppercase tracking-[0.2em] font-semibold text-foreground">{m.title}</p>
              <p className="text-muted text-sm leading-relaxed">{m.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
