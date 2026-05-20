"use client";

import Image from "next/image";
import { useCalendlyDialog } from "@/components/CalendlyDialogProvider";
import CircularText from "./CircularText";
import Link from "next/link";
import type { Dictionary } from "@/app/[lang]/dictionaries";

type Props = {
  dict: Dictionary["profile"];
  locale: string;
};

export default function ProfileSection({ dict, locale }: Props) {
  const base = locale === "en" ? "/en" : "";
  const { openDialog } = useCalendlyDialog();

  return (
    <section className="relative py-16 px-4 md:py-32 md:px-8 bg-background overflow-hidden">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
        <div className="relative flex flex-col justify-center items-center">
          <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-10 text-muted text-xs tracking-[0.3em] uppercase hidden lg:block [writing-mode:vertical-lr] rotate-180">
            {dict.verticalLabel}
          </span>

          <div className="relative">
            <div className="w-56 h-[360px] md:w-72 md:h-[540px] lg:w-96 lg:h-[780px] rounded-[999px] relative overflow-hidden z-20">
              <Image
                src="/backgrounds/facade.png"
                alt="Facade"
                fill
                className="w-full h-full object-cover object-[25%_center]"
              />
            </div>
            <div className="absolute bottom-[62%] -right-12 md:-right-16 lg:-right-20 w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 z-10">
              <Link href={`${base}/clasen`}>
                <CircularText text={dict.circularText} />
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 items-center md:items-start text-center md:text-left">
          <span className="text-accent text-sm uppercase tracking-widest font-semibold">
            {dict.sectionLabel}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-foreground">
            {dict.heading}
          </h2>
          <p className="text-muted leading-relaxed">{dict.body1}</p>
          <p className="text-muted leading-relaxed">{dict.body2}</p>
          <p className="text-muted leading-relaxed">{dict.credo}</p>
          <p className="text-muted leading-relaxed">{dict.tagline}</p>

          <div className="flex flex-col items-center md:items-start">
            <div className="w-40 aspect-4/2 relative">
              <Image alt="signature" fill src="/signature.png" className="object-contain" />
            </div>
            <span className="text-sm text-muted tracking-widest uppercase mt-1">
              {dict.role}
            </span>
          </div>
          <button onClick={openDialog} className="self-center md:self-start mt-4 px-6 py-2.5 md:px-8 md:py-4 border border-accent text-accent text-sm uppercase tracking-widest hover:bg-accent hover:text-background transition-colors duration-200 cursor-pointer">
            {dict.cta}
          </button>
        </div>
      </div>
    </section>
  );
}
