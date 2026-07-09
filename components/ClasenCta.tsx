"use client";

import Image from "next/image";
import CalendlyButton from "./CalendlyButton";

type Props = {
  dict: { heading: string; button: string };
};

export default function ClasenCta({ dict }: Props) {

  return (
    <section className="pt-4 pb-16 px-4 md:pt-8 md:pb-32 md:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl flex flex-col items-center justify-center text-center py-24 md:py-40 px-6">
          <Image
            src="/backgrounds/facade.png"
            alt=""
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover object-[25%_center]"
          />
          <div className="absolute inset-0 bg-black/70" />

          <div className="relative z-10">
            <p className="text-2xl md:text-3xl font-semibold text-white mb-8 max-w-md leading-relaxed">
              {dict.heading}
            </p>
            <CalendlyButton trackSource="clasen_cta">
              {dict.button}
            </CalendlyButton>
          </div>
        </div>
      </div>
    </section>
  );
}
