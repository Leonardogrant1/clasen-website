"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useCalendlyDialog } from "@/components/CalendlyDialogProvider";

type AppTeaserProps = {
  label: string;
  heading: string;
  subheading: string;
  description: string;
  descriptionHighlight?: string;
  features: string[];
  badge: string;
  cta: string;
  infoFlowText?: string;
  infoFlowTextMobile?: string;
  descriptionMobile?: string;
  ownerAppTitle?: string;
  platforms?: string;
  altText?: string;
  ctaButton?: string;
  ctaTextAbove?: string;
};

export default function AppTeaser({
  label,
  heading,
  subheading,
  description,
  descriptionHighlight,
  features,
  badge,
  cta,
  infoFlowText = "Zeitgemäße Vermarktung erfordert kontinuierlichen Informationsfluss.",
  infoFlowTextMobile = "Vermarktung erfordert Informationsfluss.",
  descriptionMobile = "Mit der CLASEN Eigentümer-App jederzeit vollen Einblick: Vermarktungsfortschritt, Besichtigungstermine, Preisverhandlungen und Live-Updates. | Direkt auf Ihrem Smartphone.",
  ownerAppTitle = "Ihre Eigentümer-App",
  platforms = "iOS & Android",
  altText = "Clasen Eigentümer App",
  ctaButton = "Schlüsselmoment erleben",
  ctaTextAbove = "Ihr Vermarktungserfolg auf dem nächsten Level.",
}: AppTeaserProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const { openDialog } = useCalendlyDialog();

  // Split subheading using standard colon (:) or full-width Chinese colon (：)
  const subParts = subheading.split(/:|：/);
  const subTitle = subParts[0] || "";
  const subDetail = subParts.slice(1).join(":").trim();
  const hasSubDetail = subParts.length > 1;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="mt-15  md:mt-20"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: "opacity 0.8s ease, transform 0.8s ease",
      }}
    >
      {/* ── Heading outside the card, styled like "Wohnen & Leben" ── */}
      <div className="text-center lg:text-left mb-5">
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight whitespace-pre-line">
          {heading}
        </h2>
        <span className="text-accent text-xs md:text-base uppercase tracking-widest font-semibold hidden lg:block mt-3">
          {infoFlowText}
        </span>
        <span className="text-accent text-xs md:text-base uppercase tracking-widest font-semibold block lg:hidden mt-3">
          {infoFlowTextMobile}
        </span>
      </div>

      {/* ── Card ── */}
      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/3">
        {/* Subtle gradient glows */}
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)",
          }}
        />

        {/* ── Top description bar ── */}
        <div className="relative z-10 w-full border-b border-white/10 bg-white/5 px-8 py-2 md:px-12 md:py-8">
          <div className="max-w-3xl mx-auto text-center">

            <p className="text-white text-lg md:text-3xl tracking-widest font-semibold block mb-1 md:mb-3">
              {ownerAppTitle}
            </p>

            <p className="text-white/80 text-sm md:text-base xl:text-xl leading-relaxed hidden lg:block whitespace-pre-line">
              {description}
            </p>
            <p className="text-white/80 text-sm md:text-base xl:text-xl leading-relaxed block lg:hidden whitespace-pre-line">
              {descriptionMobile}
            </p>

          </div>
        </div>

        {/* ── Mobile layout ── */}
        <div className="relative z-10 flex flex-col items-center md:p-12 lg:hidden">


          {/* Image */}
          <div className="relative w-[145%] aspect-4/3">
            <Image
              src="/clasen_app_image.png"
              alt={altText}
              fill
              className="object-cover"
            />
          </div>


          {/* Makler 2.0 badge */}
          <div className="flex flex-col items-center gap-1 -translate-y-10 px-6">
            <span className="text-white text-xl md:text-2xl uppercase tracking-widest font-bold text-center">
              {subTitle}
            </span>
            {hasSubDetail && (
              <span className="text-white/60 text-[10px] md:text-xs uppercase tracking-widest font-semibold text-center">
                {subDetail}
              </span>
            )}
          </div>

          {/* Features – bigger */}
          <ul className="flex flex-col gap-4 w-full px-8 mb-2">
            {features.map((feature, i) => (
              <li
                key={i}
                className="flex items-center gap-4 text-white/90 text-lg md:text-xl font-bold"
              >
                <div className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
                  <svg
                    className="w-4 h-4 text-accent"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                {feature}
              </li>
            ))}
          </ul>

          {/* Right column – Store badges */}
          <div className="flex  justify-center items-end gap-4 mt-8 mb-8">
            <Image
              src="/appstore.png"
              alt="App Store"
              width={150}
              height={50}
              className="object-contain"
            />
            <Image
              src="/playstore.png"
              alt="Google Play Store"
              width={150}
              height={50}
              className="object-contain"
            />
          </div>




        </div>

        {/* ── Desktop layout: image centered, text around it ── */}
        <div className="relative z-10 hidden lg:block py-16 px-26 min-h-[740px]">
          {/* Absolutely centered image */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-11/12 aspect-video">
            <Image
              src="/clasen_app_image.png"
              alt={altText}
              fill
            />
          </div>

          {/* Two-column text layout around the image */}
          <div className="flex justify-between gap-8">
            {/* Left column – USPs */}
            <div className="flex flex-col justify-center gap-6 max-w-[340px] xl:max-w-[380px] pt-16">
              <ul className="flex flex-col gap-10">
                {features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-4 text-white/90 text-lg xl:text-2xl font-bold whitespace-pre-line"
                  >
                    <div className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
                      <svg
                        className="w-4 h-4 text-accent"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right column – Store badges */}
            <div className="flex flex-col justify-center items-end gap-4 pt-16">
              <Image
                src="/appstore.png"
                alt="App Store"
                width={200}
                height={50}
                className="object-contain"
              />
              <Image
                src="/playstore.png"
                alt="Google Play Store"
                width={200}
                height={50}
                className="object-contain"
              />
            </div>
          </div>

          {/* Makler 2.0 badge – centered at bottom */}
          <div className="absolute bottom-12 left-0 right-0 z-30 flex flex-col items-center gap-2 px-6">
            <span className="text-white text-2xl xl:text-4xl uppercase tracking-widest font-bold text-center">
              {subTitle}
            </span>
            {hasSubDetail && (
              <span className="text-white/60 text-xs xl:text-xl uppercase tracking-widest font-semibold text-center">
                {subDetail}
              </span>
            )}
          </div>
        </div>

      </section>

      <div className="flex flex-col items-center justify-center gap-4 mt-12 md:mt-16">
        <p className="text-white text-lg whitespace-pre-line uppercase tracking-widest font-semibold text-center opacity-90">
          {ctaTextAbove}
        </p>
        <button
          onClick={openDialog}
          className="px-6 py-2.5 md:px-8 md:py-4 border border-accent bg-accent text-background text-sm uppercase tracking-widest hover:bg-transparent hover:text-accent transition-colors duration-200 cursor-pointer"
        >
          {ctaButton}
        </button>
      </div>
    </div>
  );
}
