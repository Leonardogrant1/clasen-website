import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import ClasenHero from "@/components/ClasenHero";
import ClasenWarum from "@/components/ClasenWarum";
import ClasenChronik from "@/components/ClasenChronik";
import HashScrollHandler from "@/components/HashScrollHandler";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  return { title: dict.meta.clasen.title, description: dict.meta.clasen.description };
}

export default async function ClasenPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <>
      <HashScrollHandler />
      <ClasenHero dict={dict.clasenHero} />
      <ClasenWarum dict={dict.clasenWarum} />
      <ClasenChronik dict={dict.clasenChronik} cta={dict.clasenCta} />
    </>
  );
}
