import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";

export async function generateMetadata({ params }: PageProps<"/[lang]/commercial">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  return { title: dict.meta.commercial.title, description: dict.meta.commercial.description };
}

export default async function CommercialPage({ params }: PageProps<"/[lang]/commercial">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.commercial;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <span className="text-accent text-sm uppercase tracking-widest font-semibold">{t.label}</span>
      <h1 className="text-5xl font-bold text-foreground">{t.heading}</h1>
      <p className="text-muted text-sm tracking-widest uppercase">{t.subheading}</p>
    </div>
  );
}
