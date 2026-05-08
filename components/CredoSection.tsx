import type { Dictionary } from "@/app/[lang]/dictionaries";
import CherryBlossoms from "./CherryBlossoms";

type Props = {
  dict: Dictionary["credo"];
  locale: string;
};

export default function CredoSection({ dict, locale }: Props) {
  const base = locale === "en" ? "/en" : "";
  return (
    <section className="py-16 pb-48 px-4 md:py-28 md:px-8 bg-background border-t border-white/5 relative overflow-hidden">



      <CherryBlossoms />


      <div className="flex flex-col md:flex-row justify-center align-center gap-10">

        <div className="max-w-6xl relative">
          <span className="text-accent text-xs uppercase tracking-widest font-semibold block mb-12 text-center md:text-left">
            {dict.sectionLabel}
          </span>

          <div className="flex items-start justify-between gap-12">
            <div className="flex flex-col items-center w-full">
              <blockquote className="text-3xl md:text-3xl lg:text-2xl text-center md:text-start font-semibold italic text-foreground leading-tight max-w-2xl whitespace-pre-line">
                {dict.quote}
              </blockquote>
              <p className="mt-8 text-accent text-xs uppercase tracking-widest">
                {dict.attribution}
              </p>
            </div>
          </div>
        </div>

        <video
          src="/video/sakura.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="object-cover w-72 md:w-80 h-64 self-center"
        />
      </div>

    </section>
  );
}
