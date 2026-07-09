"use client";

import type { Dictionary } from "@/app/[lang]/(main)/dictionaries";
import CalendlyButton from "./CalendlyButton";
import CherryBlossoms from "./CherryBlossoms";
import { useEffect, useRef } from "react";

function SakuraVideo({ className }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;

    const tryPlay = () => video.play().catch(() => { });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (video.readyState >= 2) {
            tryPlay();
          } else {
            video.addEventListener("canplay", tryPlay, { once: true });
          }
        } else {
          video.pause();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src="/video/sakura.mp4"
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      className={className}
    />
  );
}

type Props = {
  dict: Dictionary["credo"];
  locale: string;
};

export default function CredoSection({ dict, locale }: Props) {
  const base = locale === "en" ? "/en" : "";
  return (
    <section className="py-16 pb-20 px-4 md:py-28 md:px-8 bg-background border-t border-white/5 relative overflow-hidden">

      <CherryBlossoms />


      <div className="flex flex-col md:flex-row justify-center align-center gap-6 md:gap-10">

        <div className="max-w-6xl relative">
          <span className="text-accent text-sm md:text-base uppercase tracking-widest font-semibold block mb-12 text-center md:text-left">
            {dict.sectionLabel}
          </span>

          <div className="flex items-start justify-between gap-12">
            <div className="flex flex-col items-center w-full">
              <blockquote className="text-xl text-center md:text-start font-medium italic text-foreground leading-tight max-w-2xl whitespace-pre-line">
                {dict.quote}
              </blockquote>
              <p className="mt-4 md:mt-8 text-accent text-xs uppercase tracking-widest">
                {dict.attribution}
              </p>
            </div>
          </div>


        </div>

        <SakuraVideo className="object-cover w-40 md:w-72 aspect-5/4 self-center" />
      </div>

      <div className="flex flex-col items-center justify-center gap-4 mt-15 md:mt-20">



        <CalendlyButton trackSource="credo_section">
          Schlüsselmoment erleben
        </CalendlyButton>
      </div>

    </section>
  );
}
