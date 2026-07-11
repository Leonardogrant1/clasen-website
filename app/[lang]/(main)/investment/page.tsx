import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import HeroSection from "@/components/HeroSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import AlleinestellungsMerkmale from "@/components/AlleinestellungsMerkmale";
import CredoSection from "@/components/CredoSection";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  return { title: dict.meta.investment.title, description: dict.meta.investment.description };
}

export default async function InvestmentPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <>
      <HeroSection dict={dict.hero} statsDict={dict.stats} forceItemIndex={1} />
      <TestimonialsSection dict={dict.testimonials} />
      <AlleinestellungsMerkmale dict={dict.alleinstell} locale={lang} />
      <CredoSection dict={dict.credo} locale={lang} />
    </>
  );
}
