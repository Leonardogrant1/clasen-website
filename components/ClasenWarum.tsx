import type { Dictionary } from "@/app/[lang]/(main)/dictionaries";
import Image from "next/image";

export default function ClasenWarum({ dict }: { dict: Dictionary["clasenWarum"] }) {
  return (
    <section className="pb-10 px-4 md:py-32 md:px-8 bg-background">

      {/* TODO: Echtes Bild einfügen — src ersetzen */}
      <div className="md:px-8 md:py-8">
        <div className="relative w-full aspect-16/10 md:max-w-3xl md:mx-auto bg-white/5">
          <Image
            src="/alex.png"
            alt="Placeholder"
            fill
            sizes="(max-width: 768px) 100vw, 1024px"
            className="object-cover object-center "
          />

        </div>
      </div>

      <div className="max-w-3xl mx-auto text-center md:text-left">
        <span className="text-accent text-sm md:text-xl uppercase tracking-widest font-semibold block my-6">
          {dict.sectionLabel}
        </span>
        <p className="text-muted text-lg leading-relaxed whitespace-pre-line">{dict.body}</p>
      </div>
    </section>
  );
}
