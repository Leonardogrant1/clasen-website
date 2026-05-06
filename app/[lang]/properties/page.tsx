import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import ReferenzGrid from "./ReferenzGrid";

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
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 md:mb-16 flex items-end justify-between">
          <div>
            <span className="text-accent text-xs uppercase tracking-widest font-semibold block mb-4">
              {t.sectionLabel}
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight whitespace-pre-line">
              {t.heading}
            </h1>
            <p className="text-muted/60 text-xs uppercase tracking-widest mt-4">{t.subheading}</p>
          </div>
          <p className="hidden md:block text-muted text-sm max-w-xs text-right leading-relaxed">
            {t.description}
          </p>
        </div>

        <ReferenzGrid
          viewProperty={t.viewProperty}
          notConnected={t.notConnected}
          connectButton={t.connectButton}
          noListings={t.noListings}
        />
      </div>
    </main>
  );
}
