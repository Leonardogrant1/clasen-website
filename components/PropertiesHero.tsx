import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/app/[lang]/(main)/dictionaries";
import VideoHero from "./VideoHero";

type Props = {
  dict: Dictionary["wohnenUndLeben"];
  navLabel: string;
  locale: string;
};

export default function PropertiesHero({ dict, navLabel, locale }: Props) {
  return (
    <section className="relative h-[65vh] md:h-[80vh] min-h-[400px] md:min-h-[600px] overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/backgrounds/home.jpeg"
          alt=""
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          className="object-cover object-center"
        />
        <VideoHero
          src="/video/wohnen_leben.mp4"
          loop={false}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/45 to-black/15" />

      <div className="absolute bottom-8 md:bottom-16 left-4 md:left-8 z-10 max-w-2xl pr-4 md:pr-0" style={{ animation: "fade-up 0.8s ease both" }}>
        <p className="text-accent text-xs uppercase tracking-widest font-semibold mb-4">
          {navLabel}
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight tracking-tight text-foreground mb-6 whitespace-pre-line">
          {dict.heading}
        </h1>

        {/* Desktop Quote */}
        <p className="hidden md:block text-muted max-w-lg leading-relaxed text-sm md:text-xl mb-8 italic">
          „{dict.quote.p1} {dict.quote.p2}“
        </p>

        {/* Mobile Quote */}
        <p className="block md:hidden text-muted max-w-md leading-relaxed text-lg mb-8 italic">
          „{dict.quote.mobile}“
        </p>

        <Link
          href={`/${locale}/funnels/selection`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-accent text-accent text-sm md:text-xl uppercase tracking-widest hover:bg-accent hover:text-background transition-colors duration-200"
        >
          {dict.viewOffers || "Aktuelle Angebote"}
        </Link>
      </div>
    </section>
  );
}
