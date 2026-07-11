import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import ReferenzGridTemporary from "./ReferenzGridTemporary";
import AppTeaser from "./AppTeaser";
import PropertiesHero from "@/components/PropertiesHero";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  return { title: dict.meta.wohnenUndLeben.title, description: dict.meta.wohnenUndLeben.description };
}

export default async function WohnenUndLebenPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.wohnenUndLeben;
  const app = t.appTeaser;

  return (
    <>
      <PropertiesHero dict={t} navLabel={dict.nav.wohnenUndLeben} locale={lang} />
      <main id="listings" className="min-h-screen bg-background pt-0 pb-10 px-4 md:py-24 md:px-8">
        <div className="w-full lg:max-w-7xl mx-auto flex flex-col gap-3">
          <div className="pt-3 lg:pt-0" style={{ animation: "fade-up 0.7s ease both" }}>
            <span className="text-muted text-xs md:text-base uppercase tracking-widest font-semibold block">
              <span className="md:hidden">{t.descriptionMobile}</span>
              <span className="hidden md:inline">{t.description}</span>
            </span>
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

          <AppTeaser
            label={app.label}
            heading={app.heading}
            subheading={app.subheading}
            description={app.description}
            descriptionMobile={app.descriptionMobile}
            descriptionHighlight={app.descriptionHighlight}
            features={app.features}
            badge={app.badge}
            cta={app.cta}
            infoFlowText={app.infoFlowText}
            infoFlowTextMobile={app.infoFlowTextMobile}
            ownerAppTitle={app.ownerAppTitle}
            platforms={app.platforms}
            altText={app.altText}
            ctaButton={t.ctaButton}
            ctaTextAbove={app.ctaTextAbove}
          />
        </div>
      </main>
    </>
  );
}
