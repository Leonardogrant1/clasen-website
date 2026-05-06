import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import VideoBackground from "./VideoBackground";

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
          <div className="relative z-10 p-6 md:p-0">
            <span className="text-accent text-xs uppercase tracking-widest font-semibold">{t.sectionLabel}</span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-foreground mt-4 leading-tight">
              {t.heading}
            </h1>
            <p className="text-muted mt-6 leading-relaxed max-w-sm">{t.body}</p>

            <div className="mt-12 flex flex-col gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted mb-1">{t.emailLabel}</p>
                <p className="text-foreground text-sm">kontakt@clasen-immos.de</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted mb-1">{t.phoneLabel}</p>
                <p className="text-foreground text-sm">+49 40 000 000 00</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
          <form className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-muted text-xs uppercase tracking-widest">{t.nameLabel}</label>
              <input type="text" name="name" required placeholder={t.namePlaceholder}
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-foreground text-sm placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors duration-200" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-muted text-xs uppercase tracking-widest">{t.emailFieldLabel}</label>
              <input type="email" name="email" required placeholder={t.emailPlaceholder}
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-foreground text-sm placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors duration-200" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-muted text-xs uppercase tracking-widest">{t.phoneFieldLabel}</label>
              <input type="tel" name="phone" placeholder={t.phonePlaceholder}
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-foreground text-sm placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors duration-200" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-muted text-xs uppercase tracking-widest">{t.messageLabel}</label>
              <textarea name="message" required rows={5} placeholder={t.messagePlaceholder}
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-foreground text-sm placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors duration-200 resize-none" />
            </div>

            <button type="submit"
              className="mt-2 w-full py-3 rounded-full bg-white text-black text-sm uppercase tracking-widest font-semibold hover:bg-white/90 transition-colors duration-200">
              {t.submit}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
