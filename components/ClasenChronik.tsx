"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Dictionary } from "@/app/[lang]/dictionaries";

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

function EntryContent({ entry, align }: { entry: Entry; align: "left" | "right" }) {
  const isLeft = align === "left";
  return (
    <div className={isLeft ? "text-right" : "text-left"}>
      <span className="text-accent text-xs font-semibold uppercase tracking-widest block mb-1">{entry.year}</span>
      <h3 className="text-foreground font-bold text-lg mb-1">{entry.category}</h3>
      <p className="text-muted italic text-sm mb-3">{entry.subtitle}</p>
      <p className="text-muted text-sm leading-relaxed">{entry.body}</p>
      {entry.milestone && (
        <div className={`mt-4 flex flex-col ${isLeft ? "items-end" : "items-start"}`}>
          <span className="text-accent font-bold text-2xl">{entry.milestone.stat}</span>
          <span className="text-muted text-xs mt-1 max-w-xs leading-relaxed">{entry.milestone.label}</span>
        </div>
      )}
    </div>
  );
}

function MobileRow({ entry }: { entry: Entry }) {
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
        <EntryContent entry={entry} align="right" />
      </div>
    </div>
  );
}

function DesktopRow({ entry, i }: { entry: Entry; i: number }) {
  const ref = useFadeIn();
  return (
    <div
      ref={ref}
      className="grid grid-cols-[1fr_32px_1fr] mb-16 items-start opacity-0 translate-y-6 transition-all duration-700 ease-out"
    >
      <div className="pr-8">
        {i % 2 === 0 && <EntryContent entry={entry} align="left" />}
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
        {i % 2 !== 0 && <EntryContent entry={entry} align="right" />}
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
        <div className="flex flex-col items-baseline gap-2 mb-12 md:mb-20">
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
                <MobileRow key={i} entry={entry} />
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
