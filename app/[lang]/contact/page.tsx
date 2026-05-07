import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import VideoBackground from "./VideoBackground";
import ContactForm from "@/components/ContactForm";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  return { title: dict.meta.contact.title, description: dict.meta.contact.description };
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.contact;

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-20 md:px-8 md:py-32 overflow-hidden">
      <div className="hidden md:block">
        <VideoBackground />
      </div>

      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-10 md:gap-16 items-start">
        <div className="relative overflow-hidden rounded-2xl md:rounded-none">
          <div className="md:hidden">
            <VideoBackground />
          </div>
          <div className="relative z-10 p-6 md:p-0 text-center md:text-left">
            <span className="text-accent text-xs uppercase tracking-widest font-semibold">{t.sectionLabel}</span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-foreground mt-4 leading-tight">
              {t.heading}
            </h1>
            <p className="text-muted mt-6 leading-relaxed max-w-sm mx-auto md:mx-0">{t.body}</p>

            <div className="mt-16 flex flex-col gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted mb-1">{t.emailLabel}</p>
                <p className="text-foreground text-sm">info@clasen.com</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted mb-1">{t.phoneLabel}</p>
                <p className="text-foreground text-sm">+49 (0) 89 66 08 55 80</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 mt-14">
          <ContactForm dict={t} />
        </div>
      </div>
    </div>
  );
}
