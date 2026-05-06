import type { Metadata } from "next";
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
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
            <svg width="24" height="28" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <mask id="login-keyhole-mask">
                  <rect x="0" y="8" width="18" height="12" rx="2.5" fill="white" />
                  <circle cx="9" cy="13" r="2.2" fill="black" />
                  <rect x="7.7" y="13" width="2.6" height="3.2" rx="0.6" fill="black" />
                </mask>
              </defs>
              <path d="M4 9V6a5 5 0 0 1 10 0v3" stroke="white" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" />
              <rect x="0" y="8" width="18" height="12" rx="2.5" fill="white" fillOpacity="0.7" mask="url(#login-keyhole-mask)" />
            </svg>
          </div>
        </div>

        <h1 className="text-foreground text-2xl font-bold tracking-tight text-center mb-1">{t.heading}</h1>
        <p className="text-muted text-sm text-center mb-8">{t.subheading}</p>

        <LoginForm t={t} base={base} />
      </div>
    </div>
  );
}
