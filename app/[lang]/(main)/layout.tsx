import React from "react";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import LanguagePicker from "@/components/LanguagePicker";
import CookieBanner from "@/components/CookieBanner";
import SideBanner from "@/components/SideBanner";
import { getDictionary, hasLocale } from "./dictionaries";

import { Metadata } from "next";

export async function generateStaticParams() {
  return [{ lang: "de" }, { lang: "en" }, { lang: "ru" }, { lang: "zh" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  const titles: Record<string, string> = {
    de: "CLASEN - Ihr Schlüssel zum Erfolg.",
    en: "CLASEN - Your Key to Success.",
    ru: "CLASEN - Ваш ключ к успеху.",
    zh: "CLASEN - 成功的关键。",
  };

  const descriptions: Record<string, string> = {
    de: "Wo Makler an ihre Grenzen kommen, fangen wir erst an. CLASEN Family Office – eigener Bestand, Steueroptimierung, Baumanagement. Ihr Schlüssel zum Erfolg.",
    en: "Where brokers reach their limits, we are just getting started. CLASEN Family Office – proprietary portfolio, tax optimization, construction management. Your key to success.",
    ru: "Там, где брокеры достигают своих пределов, мы только начинаем. Семейный офис CLASEN – собственный портфель, налоговая оптимизация, управление строительством. Ваш ключ к успеху.",
    zh: "当经纪人达到极限时，我们才刚刚开始。CLASEN 家族办公室——自有投资组合、税务优化、建筑管理。您成功的关键。",
  };

  return {
    title: titles[lang] || titles.de,
    description: descriptions[lang] || descriptions.de,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <>
      <Nav dict={dict.nav} locale={lang} />
      <main className="flex-1">{children}</main>
      <Footer dict={dict.footer} locale={lang} />
      <LanguagePicker locale={lang} />
      <CookieBanner locale={lang} />
      <SideBanner locale={lang} />
    </>
  );
}
