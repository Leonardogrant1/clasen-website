import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getDictionary, hasLocale } from "../dictionaries";
import ReferenzGridTemporary from "./ReferenzGridTemporary";

export async function generateMetadata({ params }: PageProps<"/[lang]/properties">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  return { title: dict.meta.wohnenUndLeben.title, description: dict.meta.wohnenUndLeben.description };
}

export default async function WohnenUndLebenPage({ params }: PageProps<"/[lang]/properties">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.wohnenUndLeben;

  return (
    <main className="min-h-screen bg-background pt-24 pb-16 px-4 md:pt-36 md:pb-24 md:px-8">
      <div className="w-full lg:max-w-7xl mx-auto flex flex-col gap-3">
        <div className="flex 2  justify-between pt-20 lg:pt-0">
          <div className="flex flex-col w-full lg:w-1/2 gap-10 md:gap-18 lg:gap-29">
            <div className="text-center lg:text-left" style={{ animation: "fade-up 0.7s ease both" }}>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight whitespace-pre-line">
                {t.heading}
              </h1>
              <p className="text-muted text-xs uppercase tracking-widest mt-4">{t.subheading}</p>
            </div>

            <blockquote className="lg:hidden flex flex-col items-center gap-3 max-w-xl shrink-0 lg:self-end self-center" style={{ animation: "fade-up 0.7s ease 0.2s both" }}>
              <p className="text-muted text-xs leading-relaxed text-center italic">
                „{t.quote.p1}
              </p>
              <p className="text-muted text-xs leading-relaxed text-center italic">
                {t.quote.p2}"
              </p>
              <div className="flex flex-col items-center">
                <span className="text-accent text-xs uppercase tracking-widest font-semibold block">
                  Alexander Clasen
                </span>
                <div className="w-30 aspect-video relative">
                  <Image alt="signature" fill src="/signature.png" className="object-contain scale-[1.3]" />
                </div>
              </div>
            </blockquote>

            <div className="flex-col md:flex-row flex items-baseline gap-4 pt-14 lg:pt-0" style={{ animation: "fade-up 0.7s ease 0.35s both" }}>
              <span className="text-accent text-xs uppercase tracking-widest font-semibold block">
                {t.sectionLabel}
              </span>
              <p className="hidden lg:block text-muted text-sm text-right leading-relaxed md:whitespace-nowrap">
                {t.description}
              </p>
            </div>
          </div>

          <blockquote className="hidden lg:flex flex-col items-end max-w-xl shrink-0 self-end mr-43" style={{ animation: "fade-up 0.7s ease 0.15s both" }}>
            <p className="text-muted text-sm leading-relaxed text-right italic">
              „{t.quote.p1}
            </p>
            <p className="text-muted text-sm leading-relaxed text-right italic mt-4">
              {t.quote.p2}"
            </p>

            <div className="flex items-center gap-3">

              <span className="text-accent mt-2 text-[0.625rem] uppercase tracking-widest font-semibold block">
                Alexander Clasen
              </span>
              <div className="w-26 aspect-4/2 relative">
                <Image alt="signature" fill src="/signature.png" className="object-contain" />
              </div>
            </div>

          </blockquote>
        </div>

        <ReferenzGridTemporary
          viewProperty={t.viewProperty}
          notConnected={t.notConnected}
          connectButton={t.connectButton}
          noListings={t.noListings}
          ctaHeading={t.ctaHeading}
          ctaButton={t.ctaButton}
          labelOrt={t.labelOrt}
          labelTyp={t.labelTyp}
          labelFlaeche={t.labelFlaeche}
          listingsData={t.listings}
        />
      </div>
    </main>
  );
}
