import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import LanguagePicker from "@/components/LanguagePicker";
import CookieBanner from "@/components/CookieBanner";
import { getDictionary, hasLocale } from "./dictionaries";

export async function generateStaticParams() {
  return [{ lang: "de" }, { lang: "en" }];
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
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
    </>
  );
}
