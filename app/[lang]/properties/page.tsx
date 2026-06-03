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
    <main className="min-h-screen bg-background pt-12 pb-16 px-4 md:pt-34 md:pb-24 md:px-8">
      <div className="w-full lg:max-w-7xl mx-auto flex flex-col gap-3">
        <div className="pt-20 lg:pt-0">
          <div className="flex flex-col w-full gap-10 md:gap-7">
            <div className="text-center lg:text-left" style={{ animation: "fade-up 0.7s ease both" }}>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight whitespace-pre-line">
                {t.heading}
              </h1>
              <span className="text-accent text-xs md:text-base uppercase tracking-widest font-semibold block mt-3">{t.subheading}</span>
            </div>

            <blockquote className="flex flex-col items-center lg:items-start gap-3" style={{ animation: "fade-up 0.7s ease 0.2s both" }}>
              <p className="text-muted text-base md:text-xl leading-relaxed text-center lg:text-left italic">
                „{t.quote.p1}
                {" "} {t.quote.p2}"
              </p>

            </blockquote>

            <div className="flex-col md:flex-row flex items-baseline gap-4 pt-4 md:pt-14 lg:pt-0" style={{ animation: "fade-up 0.7s ease 0.35s both" }}>
              <span className="text-muted text-xs md:text-base uppercase tracking-widest font-semibold block">
                {t.description}
              </span>
            </div>
          </div>
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
