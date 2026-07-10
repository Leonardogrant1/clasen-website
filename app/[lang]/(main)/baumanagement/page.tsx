import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import TippgeberForm from "@/components/TippgeberForm";
import Reveal from "@/components/Reveal";
import CountUpText from "@/components/CountUpText";
import LottieIcon from "@/components/LottieIcon";

const WHY_STEP_ICONS = ["contact", "handshake", "money"] as const;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  return { title: dict.meta.baumanagement.title, description: dict.meta.baumanagement.description };
}

export default async function BaumanagementPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.baumanagement;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden px-4 md:px-8 pt-36 md:pt-48 pb-16 md:pb-24">
        <div className="absolute inset-0">
          <Image
            src="/backgrounds/munich.jpeg"
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background" />
        </div>

        <div className="relative max-w-5xl mx-auto">
          <Reveal>
            <span className="text-accent text-xs md:text-sm uppercase tracking-widest font-semibold">{t.hero.sectionLabel}</span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight text-foreground mt-4 mb-6 max-w-4xl whitespace-pre-line">
              {t.hero.headingPre}
              <span className="text-accent">{t.hero.headingEm}</span>
              {t.hero.headingPost}
            </h1>
            <p className="text-muted max-w-xl leading-relaxed mb-10 md:text-lg whitespace-pre-line">{t.hero.body}</p>
          </Reveal>

          <div className="flex flex-wrap gap-4">
            <a
              href="#kontakt"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-background text-sm uppercase tracking-widest font-semibold hover:bg-accent/85 transition-colors duration-200"
            >
              {t.hero.ctaPrimary}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 7h10M8 3l4 4-4 4" />
              </svg>
            </a>
            <a
              href="#provision"
              className="inline-flex items-center px-6 py-3 rounded-full border border-white/15 text-foreground text-sm uppercase tracking-widest hover:border-accent hover:text-accent transition-colors duration-200"
            >
              {t.hero.ctaSecondary}
            </a>
          </div>

          <div className="flex flex-wrap gap-10 md:gap-16 mt-14 pt-9 border-t border-white/10">
            {t.hero.stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 120}>
                <div className="text-accent text-2xl md:text-3xl font-bold tracking-tight">
                  <CountUpText value={s.num} />
                </div>
                <div className="text-muted text-xs md:text-base mt-1 max-w-[18ch] leading-relaxed">{s.label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Warum + Prozess */}
      <section className="px-4 md:px-8 py-20 md:py-28 bg-white/2 border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <Reveal className="max-w-2xl mb-14">
            <span className="text-accent text-xs md:text-sm uppercase tracking-widest font-semibold">{t.why.sectionLabel}</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mt-4 leading-tight">
              {t.why.heading}
            </h2>
            <p className="text-muted mt-6 leading-relaxed md:text-lg">{t.why.body}</p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {t.why.steps.map((step, i) => (
              <Reveal key={step.n} delay={i * 120}>
                <div className="h-full flex flex-col bg-white/5 border border-white/10 rounded-2xl p-8 items-center text-center">
                  {WHY_STEP_ICONS[i] && <LottieIcon name={WHY_STEP_ICONS[i]} className="w-20 h-20 md:w-24 md:h-24 -ml-2 mb-4" />}
                  <div className="text-accent/70 text-xs md:text-sm uppercase tracking-widest font-semibold">{step.n}</div>
                  <h3 className="text-foreground text-xl font-semibold mt-4 mb-3">{step.title}</h3>
                  <p className="text-muted text-sm md:text-lg leading-relaxed">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Provisionsmodell */}
      <section id="provision" className="px-4 md:px-8 py-20 md:py-28 scroll-mt-24">
        <div className="max-w-5xl mx-auto">
          <Reveal className="max-w-2xl mb-14">
            <span className="text-accent text-xs md:text-sm uppercase tracking-widest font-semibold">{t.commission.sectionLabel}</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mt-4 leading-tight whitespace-pre-line">
              {t.commission.heading}
            </h2>
            <p className="text-muted mt-6 leading-relaxed md:text-lg">{t.commission.body}</p>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            {t.commission.cards.map((card, i) => (
              <Reveal key={card.cat} delay={i * 120}>
                <div className="h-full flex flex-col bg-white/5 border border-white/10 rounded-2xl p-8">
                  <span className="text-muted text-xs md:text-base uppercase tracking-widest">{card.cat}</span>
                  <div className="text-accent text-4xl font-bold tracking-tight mt-3">
                    <CountUpText value={card.amount} /> <span className="text-muted text-sm md:text-lg font-normal tracking-normal">{card.unit}</span>
                  </div>
                  <p className="text-muted text-sm md:text-lg leading-relaxed mt-4">{card.body}</p>
                  <div className="text-accent/60 text-xs md:text-base mt-auto pt-5 border-t border-white/10">{card.note}</div>
                </div>
              </Reveal>
            ))}
          </div>

          <p className="text-muted text-sm md:text-lg leading-relaxed mt-8 pl-4 border-l-2 border-accent/40 max-w-xl">
            {t.commission.footnote}
          </p>
        </div>
      </section>

      {/* Voraussetzungen */}
      <section className="px-4 md:px-8 py-20 md:py-28 bg-white/2 border-y border-white/5">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-start">
          <div>
            <Reveal>
              <span className="text-accent text-xs md:text-sm uppercase tracking-widest font-semibold">{t.eligibility.sectionLabel}</span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mt-4 mb-8 leading-tight">
                {t.eligibility.heading}
              </h2>
            </Reveal>
            <ul className="flex flex-col gap-4">
              {t.eligibility.items.map((item, i) => (
                <li key={item}>
                  <Reveal delay={i * 80} className="flex gap-3.5 text-muted text-sm md:text-lg leading-relaxed">
                    <span className="shrink-0 w-2 h-2 mt-1.5 md:mt-2.5 rounded-full bg-accent" />
                    {item}
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
          <Reveal delay={200}>
            <blockquote className="md:mt-24 pl-6 border-l-2 border-accent">
              <p className="text-foreground text-xl md:text-3xl italic leading-relaxed">{t.eligibility.quote}</p>
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* Kontakt / Formular */}
      <section id="kontakt" className="px-4 md:px-8 py-20 md:py-28 scroll-mt-24">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-start">
          <Reveal>
            <span className="text-accent text-xs md:text-sm uppercase tracking-widest font-semibold">{t.form.sectionLabel}</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mt-4 leading-tight">
              {t.form.heading}
            </h2>
            <p className="text-muted mt-6 leading-relaxed max-w-sm md:text-lg">{t.form.body}</p>

            <div className="mt-14 flex flex-col gap-4">
              <div>
                <p className="text-xs md:text-base uppercase tracking-widest text-muted mb-1">{t.form.emailLabel}</p>
                <a href="mailto:info@clasen.com" className="text-foreground text-sm md:text-lg hover:text-accent transition-colors duration-200">info@clasen.com</a>
              </div>
              <div>
                <p className="text-xs md:text-base uppercase tracking-widest text-muted mb-1">{t.form.phoneLabel}</p>
                <a href="tel:+498966085580" className="text-foreground text-sm md:text-lg hover:text-accent transition-colors duration-200">+49 (0) 89 66 08 55 80</a>
              </div>
            </div>
          </Reveal>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
            <TippgeberForm dict={t.form} />
          </div>
        </div>
      </section>
    </>
  );
}
