import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "./dictionaries";
import HeroSection from "@/components/HeroSection";
import ProfileSection from "@/components/ProfileSection";
import AlleinestellungsMerkmale from "@/components/AlleinestellungsMerkmale";
import TestimonialsSection from "@/components/TestimonialsSection";
import CredoSection from "@/components/CredoSection";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  return { title: dict.meta.home.title, description: dict.meta.home.description };
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <>
      <HeroSection dict={dict.hero} statsDict={dict.stats} />
      <ProfileSection dict={dict.profile} locale={lang} />
      <TestimonialsSection dict={dict.testimonials} />
      <AlleinestellungsMerkmale dict={dict.alleinstell} locale={lang} />
      <CredoSection dict={dict.credo} locale={lang} />
    </>
  );
}
