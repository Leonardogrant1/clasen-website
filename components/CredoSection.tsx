import type { Dictionary } from "@/app/[lang]/dictionaries";

type Props = {
  dict: Dictionary["credo"];
  locale: string;
};

export default function CredoSection({ dict, locale }: Props) {
  const base = locale === "en" ? "/en" : "";
  return (
    <section className="py-16 pb-48 px-4 md:py-28 md:px-8 bg-background border-t border-white/5 relative">

      <video
        src="/video/cherry-blossoms.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="object-contain absolute inset-0 h-full w-full"
      />
      <div className="max-w-6xl mx-auto relative">
        <span className="text-accent text-xs uppercase tracking-widest font-semibold block mb-12 text-center md:text-left">
          {dict.sectionLabel}
        </span>

        <div className="flex items-start justify-between gap-12">
          <div className="flex flex-col items-center w-full">
            <blockquote className="text-3xl md:text-3xl lg:text-4xl text-center font-bold italic text-foreground leading-tight max-w-2xl whitespace-pre-line">
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

      <video
        src="/video/sakura.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="object-cover absolute md:right-1/6 md:left-auto bottom-0 w-96 md:w-1/4 h-auto left-0 right-0"
      />

    </section>
  );
}
