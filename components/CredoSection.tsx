import type { Dictionary } from "@/app/[lang]/dictionaries";

type Props = {
  dict: Dictionary["credo"];
  locale: string;
};

export default function CredoSection({ dict, locale }: Props) {
  const base = locale === "en" ? "/en" : "";
  return (
    <section className="py-16 px-4 md:py-28 md:px-8 bg-background border-t border-white/5">
      <div className="max-w-6xl mx-auto relative">
        <span className="text-accent text-xs uppercase tracking-widest font-semibold block mb-12">
          {dict.sectionLabel}
        </span>

        <div className="flex items-start justify-between gap-12">
          <div>
            <blockquote className="text-3xl md:text-4xl lg:text-5xl font-bold italic text-foreground leading-tight max-w-2xl whitespace-pre-line">
              {dict.quote}
            </blockquote>
            <p className="mt-8 text-accent text-xs uppercase tracking-widest">
              {dict.attribution}
            </p>
          </div>

          <a
            href={`${base}/contact`}
            className="hidden md:inline-flex shrink-0 items-center px-7 py-4 rounded-full border border-white/30 text-foreground text-sm hover:border-accent hover:text-accent transition-colors duration-200 mt-2"
          >
            {dict.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
