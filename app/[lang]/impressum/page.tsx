import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import LegalPage from "@/components/LegalPage";

export async function generateMetadata({ params }: PageProps<"/[lang]/impressum">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  return { title: dict.meta.impressum.title, description: dict.meta.impressum.description };
}

export default async function ImpressumPage({ params }: PageProps<"/[lang]/impressum">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return <LegalPage label={dict.impressum.label} heading={dict.impressum.heading} sections={dict.impressum.sections} />;
}
