import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "./dictionaries";
import HeroSection from "@/components/HeroSection";
import ProfileSection from "@/components/ProfileSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";

export const dynamic = "force-dynamic";


export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  return { title: dict.meta.home.title, description: dict.meta.home.description };
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <>
      <HeroSection dict={dict.hero} statsDict={dict.stats} forceItemIndex={0} />
      <TestimonialsSection dict={dict.testimonials} />
      <ProfileSection dict={dict.profile} locale={lang} />
      <CTASection
        dict={dict.investmentCTA}
        locale={lang}
        videoSrc="/video/hero1.mp4"
        targetPath="/investment"
      />
      <CTASection
        dict={dict.livingCTA}
        locale={lang}
        videoSrc="/video/wohnen_leben.mp4"
        targetPath="/properties"
      />
    </>
  );
}
