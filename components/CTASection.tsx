"use client";

import Link from "next/link";
import VideoHero from "./VideoHero";

type Props = {
  dict: {
    sectionLabel: string;
    heading: string;
    description: string;
    cta: string;
  };
  locale: string;
  videoSrc: string;
  targetPath: string;
};

export default function CTASection({ dict, locale, videoSrc, targetPath }: Props) {
  return (
    <section className="relative h-[50vh] min-h-[400px] overflow-hidden flex items-center justify-center text-center px-4">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <VideoHero
          src={videoSrc}
          loop={true}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px]" />
      </div>

      {/* Content */}
      <div
        className="relative z-10 max-w-3xl flex flex-col items-center gap-6"
        style={{ animation: "fade-up 0.8s ease both" }}
      >
        <span className="text-accent text-sm md:text-base uppercase tracking-widest font-semibold">
          {dict.sectionLabel}
        </span>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight whitespace-break-spaces text-foreground">
          {dict.heading}
        </h2>

        <p className="text-muted leading-relaxed text-sm sm:text-base md:text-lg max-w-xl">
          {dict.description}
        </p>

        <Link
          href={`/${locale}${targetPath}`}
          className="mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-full border border-accent text-accent text-sm md:text-base uppercase tracking-widest hover:bg-accent hover:text-background transition-colors duration-200"
        >
          {dict.cta}
        </Link>
      </div>
    </section>
  );
}
