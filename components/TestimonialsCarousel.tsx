"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
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
  dots: React.ReactNode;
  navButtons: React.ReactNode;
};

const ChevronButton = ({ onClick, dir }: { onClick: () => void; dir: "prev" | "next" }) => (
  <button
    onClick={onClick}
    className="p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors backdrop-blur-sm cursor-pointer"
  >
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      {dir === "prev"
        ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      }
    </svg>
  </button>
);

export default function TestimonialsCarousel({
  objects,
  current,
  animating,
  direction,
  onPrev,
  onNext,
  dots,
}: Props) {
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    setImgIdx(0);
  }, [current]);

  const translateClass = animating
    ? direction === "next" ? "-translate-x-4 opacity-0" : "translate-x-4 opacity-0"
    : "translate-x-0 opacity-100";

  return (
    <div className="flex flex-col gap-4">

      {/* Mobile: single image slider */}
      <div className="md:hidden relative rounded-xl">
        {/* overflow-hidden only on the strip, not the parent, so chevrons aren't clipped */}
        <div className="overflow-hidden rounded-xl">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${imgIdx * 100}%)` }}
          >
            {objects.map((obj, i) => (
              <div key={i} className="w-full shrink-0 relative h-52 rounded-xl overflow-hidden bg-white/5">
                <Image src={obj.image_path} fill sizes="(max-width: 768px) 100vw, 33vw" alt="Objektbild" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
        {objects.length > 1 && (
          <div className="absolute bottom-3 right-3 z-10 flex gap-2">
            <ChevronButton onClick={() => setImgIdx(i => Math.max(0, i - 1))} dir="prev" />
            <ChevronButton onClick={() => setImgIdx(i => Math.min(objects.length - 1, i + 1))} dir="next" />
          </div>
        )}
      </div>

      {/* Desktop: 3-image grid — testimonial nav chevrons sit on the last image */}
      <div className={`hidden md:grid grid-cols-3 gap-12 transition-all duration-500 ease-in-out ${translateClass}`}>
        {objects.map((obj, i) => (
          <div key={i} className="relative h-48 rounded-xl overflow-hidden bg-white/5 border border-white/5 group">
            <Image
              src={obj.image_path}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              alt="Objektbild"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {i === objects.length - 1 && (
              <div className="absolute bottom-3 right-3 z-10 flex gap-2">
                <ChevronButton onClick={onPrev} dir="prev" />
                <ChevronButton onClick={onNext} dir="next" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop: dots only (chevrons moved into image) */}
      <div className="hidden md:flex items-center">
        {dots}
      </div>
    </div>
  );
}
