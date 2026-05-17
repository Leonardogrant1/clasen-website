"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { cn } from "@/utils/cn";

type Entry = Dictionary["clasenChronik"]["entries"][number];

function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("opacity-100", "translate-y-0");
          el.classList.remove("opacity-0", "translate-y-6");
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

const PARTICLES: { x: number; y: string; size: number; delay: number; dur: number; color: string }[] = [
  { x: 10, y: "12%", size: 3, delay: 0.0, dur: 2.4, color: "rgba(201,168,76,0.95)" },
  { x: 22, y: "30%", size: 2, delay: 0.6, dur: 3.1, color: "rgba(201,168,76,0.75)" },
  { x: 7, y: "52%", size: 4, delay: 1.1, dur: 2.7, color: "rgba(201,168,76,0.85)" },
  { x: 32, y: "68%", size: 2, delay: 0.3, dur: 3.5, color: "rgba(201,168,76,0.65)" },
  { x: 16, y: "82%", size: 3, delay: 1.6, dur: 2.2, color: "rgba(201,168,76,0.90)" },
  { x: 38, y: "22%", size: 2, delay: 0.9, dur: 3.0, color: "rgba(201,168,76,0.60)" },
  { x: 50, y: "45%", size: 2, delay: 0.4, dur: 2.6, color: "rgba(201,168,76,0.50)" },
];

function ComparisonSlider({ alt, imageA, imageB }: { alt: string; imageA: string; imageB: string }) {
  const [pos, setPos] = useState(50);
  const [hintVisible, setHintVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  function handleMove(clientX: number) {
    const el = containerRef.current;
    if (!el) return;
    const { left, width } = el.getBoundingClientRect();
    const pct = Math.min(100, Math.max(0, ((clientX - left) / width) * 100));
    setPos(pct);
    setHintVisible(false);
  }

  return (
    <>
      <div
        className="bg-white p-2 pb-6"
        style={{ boxShadow: "2px 4px 18px rgba(0,0,0,0.45), 0 1px 3px rgba(0,0,0,0.25)" }}
      >
        <div
          ref={containerRef}
          className="relative w-full select-none overflow-hidden cursor-ew-resize"
          onMouseMove={(e) => handleMove(e.clientX)}
          onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        >
          {/* Image B (after) — always visible underneath */}
          <Image
            src={imageB}
            alt={alt}
            width={1200}
            height={800}
            className="w-full h-auto block"
          />
          {/* Image A (before) — clipped from the right */}
          <div
            className="absolute inset-0"
            style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
          >
            <Image
              src={imageA}
              alt={alt}
              width={1200}
              height={800}
              className="w-full h-auto block"
            />
          </div>

          {/* Glowing divider + particles — anchored at pos% */}
          <div
            className="absolute top-0 bottom-0 pointer-events-none"
            style={{ left: `${pos}%` }}
          >
            {/* Glow bleed to the right */}
            <div
              className="absolute top-0 bottom-0"
              style={{
                left: 0,
                width: 72,
                background: "linear-gradient(to right, rgba(201,168,76,0.28), transparent)",
              }}
            />
            {/* The line */}
            <div
              className="absolute top-0 bottom-0 w-px"
              style={{
                left: 0,
                background: "white",
                boxShadow:
                  "0 0 4px 1px rgba(255,255,255,0.9), 0 0 10px 3px rgba(201,168,76,0.9), 0 0 28px 8px rgba(201,168,76,0.45)",
              }}
            />
            {/* Particles */}
            {PARTICLES.map((p, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: p.x,
                  top: p.y,
                  width: p.size,
                  height: p.size,
                  background: p.color,
                  boxShadow: `0 0 8px 3px ${p.color}`,
                  animationName: "cmp-particle",
                  animationDuration: `${p.dur}s`,
                  animationDelay: `${p.delay}s`,
                  animationTimingFunction: "ease-in-out",
                  animationIterationCount: "infinite",
                } as React.CSSProperties}
              />
            ))}
          </div>

          {/* Mobile swipe hint */}
          <div
            className={cn(
              "absolute bottom-2 left-0 right-0 flex items-center justify-center pointer-events-none md:hidden transition-opacity duration-500",
              hintVisible ? "opacity-100" : "opacity-0"
            )}
          >
            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-accent shrink-0" style={{ animationName: "swipe-hint", animationDuration: "1.4s", animationTimingFunction: "ease-in-out", animationIterationCount: "infinite" } as React.CSSProperties}>
                <path d="M9 12H15M9 12L11 10M9 12L11 14M15 12L13 10M15 12L13 14" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-white text-xs font-medium whitespace-nowrap">Zum Vergleichen wischen</span>
            </div>
          </div>

          {/* Handle */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white flex items-center justify-center pointer-events-none"
            style={{
              left: `${pos}%`,
              boxShadow: "0 0 0 2px rgba(201,168,76,0.6), 0 0 16px 4px rgba(201,168,76,0.5), 2px 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M5 8H11M5 8L7 6M5 8L7 10M11 8L9 6M11 8L9 10"
                stroke="#C9A84C"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}

function EntryImage({ src, alt, rotate, index }: { src?: string; alt: string; rotate?: number; index: number }) {
  if (!src) return null;
  const deg = rotate ?? 0;

  if (index === 8) {
    return (
      <div
        className="relative shrink-0 w-full"
        style={{ transform: `rotate(${deg}deg)`, transformOrigin: "center" }}
      >
        <ComparisonSlider alt={alt} imageA="/timeline-images/8a.png" imageB="/timeline-images/8b.png" />
      </div>
    );
  }

  if (index === 9) {
    return (
      <div
        className="relative shrink-0 w-full"
        style={{ transform: `rotate(${deg}deg)`, transformOrigin: "center" }}
      >
        <ComparisonSlider alt={alt} imageA="/timeline-images/9a.png" imageB="/timeline-images/9b.png" />
      </div>
    );
  }

  // Mobile (md:hidden context): strip scale/translate for slider indices
  // handled via EntryContent — no extra wrapper transforms needed

  return (
    <div
      className={cn("relative shrink-0 flex justify-center w-full", index === 6 && "md:scale-139 md:translate-y-20")}
      style={{ transform: `rotate(${deg}deg)`, transformOrigin: "center" }}
    >
      {/* Polaroid frame */}
      <div
        className="bg-white p-2 pb-6"
        style={{
          boxShadow: "2px 4px 18px rgba(0,0,0,0.45), 0 1px 3px rgba(0,0,0,0.25)",
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={800}
          className="w-full h-auto"
        />
      </div>
    </div>
  );
}

function EntryText({ entry, i, className }: { entry: Entry, i: number, className?: string }) {

  const mtForIndex = ["mt-14", "mt-10", "mt-8", "mt-24", "mt-24", "mt-24", "mt-14", "mt-4", "mt-14", "mt-10", "mt-4", "mt-4"]

  return (
    <div className={cn("text-left md:min-h-[400px]", className ?? mtForIndex[i])}>
      <span className="text-accent text-xs font-semibold uppercase tracking-widest block mb-1">{entry.year}</span>
      <h3 className="text-foreground font-bold text-lg mb-1">{entry.category}</h3>
      <p className="text-muted italic text-sm mb-3">{entry.subtitle}</p>
      <p className="text-muted text-sm leading-relaxed">{entry.body}</p>
      {entry.milestone && (
        <div className="mt-4 flex flex-col items-start">
          <span className="text-accent font-bold text-2xl">{entry.milestone.stat}</span>
          <span className="text-muted text-xs mt-1 max-w-xs leading-relaxed">{entry.milestone.label}</span>
        </div>
      )}
    </div>
  );
}

// Mobile only: image first, then text below
const mobileMtForIndex = ["mt-14", "mt-10", "mt-8", "mt-24", "mt-24", "mt-24", "mt-14", "mt-4", "mt-14", "mt-10", "mt-4", "mt-4"];

function EntryContent({ entry, index }: { entry: Entry; index: number }) {
  return (
    <div className="flex flex-col gap-y-8">
      <div className={mobileMtForIndex[index]}>
        <EntryImage src={entry.image_path} alt={entry.category} rotate={index === 8 ? 0 : 2} index={index} />
      </div>
      <EntryText entry={entry} i={index} className="" />
    </div>
  );
}

function MobileRow({ entry, index }: { entry: Entry; index: number }) {
  const ref = useFadeIn();
  return (
    <div
      ref={ref}
      className="grid grid-cols-[24px_1fr] mb-10 items-start opacity-0 translate-y-6 transition-all duration-700 ease-out"
    >
      <div className="flex justify-center pt-1.5">
        {entry.isToday ? (
          <div className="w-3 h-3 rounded-full bg-accent ring-4 ring-accent/20" />
        ) : entry.year === "Meilenstein" || entry.year === "Milestone" ? (
          <div className="w-2.5 h-2.5 rounded-full bg-white/50 ring-2 ring-white/20" />
        ) : (
          <div className="w-2 h-2 rounded-full bg-white/20 ring-2 ring-white/10" />
        )}
      </div>
      <div className="pl-4">
        <EntryContent entry={entry} index={index} />
      </div>
    </div>
  );
}

function DesktopRow({ entry, i }: { entry: Entry; i: number }) {
  const ref = useFadeIn();

  const mtForIndex = ["mt-14", "mt-24", "mt-8", "mt-24", "mt-24", "mt-24", "mt-24", "mt-24", "mt-14", "mt-24", "mt-24", "mt-14"]

  return (
    <div
      ref={ref}
      className={cn("grid grid-cols-[1fr_32px_1fr]  items-start opacity-0 translate-y-6 transition-all duration-700 ease-out", mtForIndex[i])}
    >
      <div className="pr-8">
        {i % 2 === 0 ? <EntryText entry={entry} i={i} /> : <EntryImage src={entry.image_path} alt={entry.category} rotate={-2} index={i} />}
      </div>
      <div className="flex justify-center pt-2">
        {entry.isToday ? (
          <div className="w-4 h-4 rounded-full bg-accent ring-4 ring-accent/20" />
        ) : entry.year === "Meilenstein" || entry.year === "Milestone" ? (
          <div className="w-3 h-3 rounded-full bg-white/50 ring-2 ring-white/20" />
        ) : (
          <div className="w-2.5 h-2.5 rounded-full bg-white/20 ring-2 ring-white/10" />
        )}
      </div>
      <div className="pl-8">
        {i % 2 !== 0 ? <EntryText entry={entry} i={i} /> : <EntryImage src={entry.image_path} alt={entry.category} rotate={2} index={i} />}
      </div>
    </div>
  );
}

export default function ClasenChronik({ dict }: { dict: Dictionary["clasenChronik"] }) {
  return (
    <section id="chronik" className="relative py-16 px-4 md:py-32 md:px-8 overflow-hidden">
      {/* Background image – fixed for parallax effect */}
      <div className="fixed inset-0 -z-10 h-screen w-screen">
        <Image
          src="/backgrounds/munich.jpeg"
          alt=""
          fill
          className="object-cover object-center"
          priority={false}
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <div className="flex flex-col items-center md:items-baseline gap-2 mb-12 md:mb-20 text-center md:text-left">
          <span className="text-accent text-sm uppercase tracking-widest font-semibold">{dict.sectionLabel}</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">{dict.heading}</h2>
        </div>

        {/* Glass box around timeline */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-12">
          <div className="relative">
            {/* Mobile */}
            <div className="md:hidden">
              <div className="absolute left-3 top-0 bottom-0 w-px bg-white/10" />
              {dict.entries.map((entry, i) => (
                <MobileRow key={i} entry={entry} index={i} />
              ))}
            </div>

            {/* Desktop */}
            <div className="hidden md:block">
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2" />
              {dict.entries.map((entry, i) => (
                <DesktopRow key={i} entry={entry} i={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
