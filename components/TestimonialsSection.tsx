"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import TestimonialsCarousel from "./TestimonialsCarousel";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { cn } from "@/utils/cn";

type Props = {
  dict: Dictionary["testimonials"];
};

const imageStyles: Record<string, string> = {
  "Philippe Geissler": "scale-150 object-top",
  "Jens Krautscheid": "scale-130 lg:translate-y-5",
  "Daniel Seglias (CH)": "object-top",
  "Marie Bougeard (FR)": "object-top scale-125 lg:scale-130 lg:translate-y-5",
};

export default function TestimonialsSection({ dict }: Props) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const items = dict.items.filter((item) => item.client_name !== "Jens Krautscheid");

  const goTo = useCallback((index: number, dir: "next" | "prev") => {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setAnimating(false);
    }, 500);
  }, [animating]);

  const slide = items[current];

  const quoteClass = animating
    ? direction === "next" ? "-translate-x-2 opacity-0" : "translate-x-2 opacity-0"
    : "translate-x-0 opacity-100";



  const Dots = ({ className }: { className?: string }) => (
    <div className={cn("flex gap-2", className)}>
      {items.map((_, i) => (
        <button
          key={i}
          onClick={() => goTo(i, i > current ? "next" : "prev")}
          className={`h-px transition-all duration-300 ${i === current ? "w-8 bg-accent" : "w-4 bg-white/20 hover:bg-white/40"}`}
        />
      ))}
    </div>
  );

  const ProfileImages = ({ size }: { size: "sm" | "lg" }) => (
    <div className={cn(
      "relative shrink-0 rounded-[999px] overflow-hidden bg-white/10 border border-white/10",
      size === "sm" ? "w-14 h-20" : "w-32 h-44"
    )}>
      {items.map((item, i) =>
        item.client_image_path ? (
          <Image
            key={i}
            src={item.client_image_path}
            fill
            alt={item.client_name}
            className={cn("object-cover", imageStyles[item.client_name] ?? "", i === current ? "opacity-100" : "opacity-0")}
          />
        ) : null
      )}
    </div>
  );

  return (
    <section id="testimonials" className="py-16 px-4 md:py-32 md:px-8 bg-background border-t border-white/5">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">

        {/* ── MOBILE LAYOUT ── */}
        <div className="flex flex-col md:hidden">
          <div className="text-center  mb-4">
            <span className="text-accent text-sm uppercase tracking-widest font-semibold block mb-4">
              {dict.sectionLabel}
            </span>
            <h2 className="text-2xl font-bold text-foreground leading-tight whitespace-pre-line">
              {dict.heading}
            </h2>
          </div>

          <div className={`flex flex-col gap-4 items-center transition-all mt-5 duration-500 ease-in-out ${quoteClass}`}>
            {/* Person row with testimonial nav chevrons on the sides */}
            <div className="relative flex justify-center items-center w-full">
              <button
                onClick={() => goTo((current - 1 + items.length) % items.length, "prev")}
                className="shrink-0 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors backdrop-blur-sm cursor-pointer border border-white/10"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="flex items-center gap-3 mx-3">
                <ProfileImages size="sm" />
                <div className="w-fit">
                  <p className="text-foreground text-sm font-semibold">{slide.client_name}</p>
                  <p className="text-accent text-xs uppercase tracking-widest mt-1 whitespace-pre-line">{slide.client_type}</p>
                </div>
              </div>

              <button
                onClick={() => goTo((current + 1) % items.length, "next")}
                className="shrink-0 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors backdrop-blur-sm cursor-pointer border border-white/10"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Quote */}
            <p className="text-muted text-sm text-center leading-relaxed whitespace-pre-line">{slide.client_quote}</p>
            <Image src="/quote.png" alt="quote" width={36} height={36} className="opacity-80" />
          </div>

          {/* Dots */}
          <div className="flex mt-2">
            <Dots />
          </div>

          {/* Investment label above carousel */}
          <div className={`transition-all duration-500  mt-5 ease-in-out ${quoteClass}`}>
            <p className="text-foreground font-semibold text-sm">
              {slide.client_name.split(" ")[0]}&apos;s {dict.investmentLabel}:
              <span className="text-accent tracking-widest ml-2">{slide.object_title}</span>
            </p>
          </div>
        </div>

        {/* ── DESKTOP LAYOUT ── */}
        <div className="hidden md:grid grid-cols-[2fr_3fr] gap-12 items-center">
          <div className="text-left">
            <span className="text-accent text-xs uppercase tracking-widest font-semibold block mb-6">
              {dict.sectionLabel}
            </span>
            <h2 className="text-3xl font-bold text-foreground leading-tight whitespace-pre-line">
              {dict.heading}
            </h2>
            <div className={`mt-24 transition-all duration-500 ease-in-out ${quoteClass}`}>
              <p className="text-foreground font-semibold text-base">
                {slide.client_name.split(" ")[0]}&apos;s {dict.investmentLabel}:
              </p>
              <p className="text-accent tracking-widest">{slide.object_title}</p>
            </div>
          </div>

          <div className={`flex flex-row gap-10 items-center transition-all duration-500 ease-in-out ${quoteClass}`}>
            <ProfileImages size="lg" />
            <Image src="/quote.png" alt="quote" className="self-start shrink-0" width={40} height={40} />
            <div className="flex flex-col gap-8">
              <p className="text-muted text-sm leading-relaxed whitespace-pre-line">{slide.client_quote}</p>
              <div className="flex items-center gap-2">
                <p className="text-foreground text-sm font-semibold">{slide.client_name}</p>
                <span className="text-white/20 text-xs">·</span>
                <p className="text-accent text-xs uppercase tracking-widest">{slide.client_type}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── CAROUSEL ── */}
        <TestimonialsCarousel
          objects={slide.objects}
          current={current}
          total={items.length}
          animating={animating}
          direction={direction}
          onGoTo={(i) => goTo(i, i > current ? "next" : "prev")}
          onPrev={() => goTo((current - 1 + items.length) % items.length, "prev")}
          onNext={() => goTo((current + 1) % items.length, "next")}
          dots={<Dots />}
          navButtons={null}
        />
      </div>
    </section>
  );
}
