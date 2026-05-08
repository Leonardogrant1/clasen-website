import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import LegalPage from "@/components/LegalPage";

export async function generateMetadata({ params }: PageProps<"/[lang]/datenschutz">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  return { title: dict.meta.datenschutz.title, description: dict.meta.datenschutz.description };
}

export default async function DatenschutzPage({ params }: PageProps<"/[lang]/datenschutz">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return <LegalPage label={dict.datenschutz.label} heading={dict.datenschutz.heading} sections={dict.datenschutz.sections} />;
}
