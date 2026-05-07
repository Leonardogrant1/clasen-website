"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import TestimonialsCarousel from "./TestimonialsCarousel";
import type { Dictionary } from "@/app/[lang]/dictionaries";

type Props = {
  dict: Dictionary["testimonials"];
};

export default function TestimonialsSection({ dict }: Props) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const goTo = useCallback((index: number, dir: "next" | "prev") => {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setAnimating(false);
    }, 500);
  }, [animating]);


  const slide = dict.items[current];

  const quoteClass = animating
    ? direction === "next" ? "-translate-x-2 opacity-0" : "translate-x-2 opacity-0"
    : "translate-x-0 opacity-100";

  return (
    <section className="py-16 px-4 md:py-32 md:px-8 bg-background border-t border-white/5">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <div className="grid md:grid-cols-[2fr_3fr] gap-12 items-center">
          <div className="text-center md:text-left">
            <span className="text-accent text-xs uppercase tracking-widest font-semibold block mb-6">
              {dict.sectionLabel}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight whitespace-pre-line">
              {dict.heading}
            </h2>

            <div className={`mt-24 flex flex-col gap-1 transition-all duration-500 ease-in-out ${quoteClass}`}>
              {/* <p className="text-foreground font-semibold text-base">{slide.object_name}</p> */}
              <div className="flex items-center gap-2">
                <p className="text-foreground font-semibold text-base">{slide.client_name.split(' ')[0]}&apos;s {dict.investmentLabel}:</p>
                <p className="text-accent tracking-widest">{slide.object_title}</p>
              </div>
            </div>
          </div>

          <div className={`flex gap-10 items-center transition-all duration-500 ease-in-out ${quoteClass}`}>
            <div className="relative shrink-0 w-32 h-44 rounded-[999px] overflow-hidden bg-white/10 border border-white/10">
              {slide.client_image_path && (
                <Image src={slide.client_image_path} fill alt={slide.client_name} className="object-cover scale-150 object-top" />
              )}
            </div>

            <Image src="/quote.png" alt="quote" className="self-start" width={60} height={60} />

            <div className="flex flex-col gap-8">
              <p className="text-muted text-sm leading-relaxed">{slide.client_quote}</p>
              <div className="flex items-center gap-2">
                <p className="text-foreground text-sm font-semibold">{slide.client_name}</p>
                <span className="text-white/20 text-xs">·</span>
                <p className="text-accent text-xs uppercase tracking-widest">{slide.client_type}</p>
              </div>
            </div>
          </div>
        </div>

        <TestimonialsCarousel
          objects={slide.objects}
          current={current}
          total={dict.items.length}
          animating={animating}
          direction={direction}
          onGoTo={(i) => goTo(i, i > current ? "next" : "prev")}
          onPrev={() => goTo((current - 1 + dict.items.length) % dict.items.length, "prev")}
          onNext={() => goTo((current + 1) % dict.items.length, "next")}
        />
      </div>
    </section>
  );
}
