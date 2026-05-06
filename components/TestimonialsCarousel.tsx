"use client";

import Image from "next/image";
import type { TestimonialObject } from "@/constants";

type Props = {
  objects: TestimonialObject[];
  current: number;
  total: number;
  animating: boolean;
  direction: "next" | "prev";
  onGoTo: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
};

export default function TestimonialsCarousel({
  objects,
  current,
  total,
  animating,
  direction,
  onGoTo,
  onPrev,
  onNext,
}: Props) {
  const translateClass = animating
    ? direction === "next"
      ? "-translate-x-4 opacity-0"
      : "translate-x-4 opacity-0"
    : "translate-x-0 opacity-100";

  return (
    <div className="flex flex-col gap-6">
      {/* Image grid */}
      <div className="overflow-hidden">
        <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 transition-all duration-500 ease-in-out ${translateClass}`}>
          {objects.map((obj, i) => (
            <div key={i} className="relative h-72 rounded-xl overflow-hidden bg-white/5 border border-white/5 group">
              {obj.image_path ? (
                <>
                  <Image
                    src={obj.image_path}
                    fill
                    alt={obj.label}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                  <p className="absolute bottom-4 left-4 text-white/70 text-xs uppercase tracking-widest">
                    {obj.label}
                  </p>
                </>
              ) : (
                <>
                  <div className="absolute inset-0 bg-linear-to-br from-white/5 to-white/10" />
                  <p className="absolute bottom-4 left-4 text-white/30 text-xs uppercase tracking-widest">
                    {obj.label}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              onClick={() => onGoTo(i)}
              className={`h-px transition-all duration-300 ${i === current ? "w-8 bg-accent" : "w-4 bg-white/20 hover:bg-white/40"
                }`}
            />
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onPrev}
            className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-accent hover:text-accent transition-colors duration-200"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 2L4 7l5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={onNext}
            className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-accent hover:text-accent transition-colors duration-200"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 2l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
