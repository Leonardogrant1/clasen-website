import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import ClasenHero from "@/components/ClasenHero";
import ClasenWarum from "@/components/ClasenWarum";
import ClasenChronik from "@/components/ClasenChronik";

export async function generateMetadata({ params }: PageProps<"/[lang]/clasen">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  return { title: dict.meta.clasen.title, description: dict.meta.clasen.description };
}

export default async function ClasenPage({ params }: PageProps<"/[lang]/clasen">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <>
      <ClasenHero dict={dict.clasenHero} />
      <ClasenWarum dict={dict.clasenWarum} />
      <ClasenChronik dict={dict.clasenChronik} />
    </>
  );
}
