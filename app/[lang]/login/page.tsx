import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import LoginForm from "./LoginForm";

export async function generateMetadata({ params }: PageProps<"/[lang]/login">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  return { title: dict.meta.login.title, description: dict.meta.login.description };
}

export default async function LoginPage({ params }: PageProps<"/[lang]/login">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.login;
  const base = lang === "en" ? "/en" : "";

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12">
      <Image src="/logo/logo_text.svg" alt="Clasen Logo" width={650} height={200} className="h-auto w-full max-w-xs sm:max-w-sm md:max-w-xl object-contain mb-4 md:mb-6" />

      <div className="w-full max-w-sm">
        <p className="text-muted text-sm md:text-md text-center mb-6 md:mb-8">{t.subheading}</p>

        <LoginForm t={t} base={base} />
      </div>
    </div>
  );
}
