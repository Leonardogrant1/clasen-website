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
    className="p-2 rounded-full bg-black/40 text-white hover:bg-white/10 hover:border-white/60 hover:scale-110 transition-all duration-200 backdrop-blur-sm cursor-pointer border border-white/30"
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
  // Infinite carousel: prepend last slide, append first slide as clones
  const extended = [objects[objects.length - 1], ...objects, objects[0]];
  const [offset, setOffset] = useState(1);
  const [withTransition, setWithTransition] = useState(true);

  useEffect(() => {
    setWithTransition(false);
    setOffset(1);
  }, [current]);

  const goImgNext = () => { setWithTransition(true); setOffset(o => o + 1); };
  const goImgPrev = () => { setWithTransition(true); setOffset(o => o - 1); };

  const handleTransitionEnd = () => {
    if (offset >= objects.length + 1) {
      setWithTransition(false);
      setOffset(1);
    } else if (offset <= 0) {
      setWithTransition(false);
      setOffset(objects.length);
    }
  };

  const translateClass = animating
    ? direction === "next" ? "-translate-x-4 opacity-0" : "translate-x-4 opacity-0"
    : "translate-x-0 opacity-100";

  return (
    <div className="flex flex-col gap-4">

      {/* Mobile: endless image slider */}
      <div className="md:hidden relative rounded-xl">
        <div className="overflow-hidden rounded-xl">
          <div
            className={withTransition ? "flex transition-transform duration-500 ease-out" : "flex"}
            style={{ transform: `translateX(-${offset * 100}%)` }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extended.map((obj, i) => (
              <div key={i} className="w-full shrink-0 relative h-52 rounded-xl overflow-hidden bg-white/5">
                <Image src={obj.image_path} fill sizes="(max-width: 768px) 100vw, 33vw" alt="Objektbild" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
        {objects.length > 1 && (
          <div className="absolute bottom-3 right-3 z-10 flex gap-2">
            <ChevronButton onClick={goImgPrev} dir="prev" />
            <ChevronButton onClick={goImgNext} dir="next" />
          </div>
        )}
      </div>

      {/* Desktop: 3-image grid with chevrons on sides */}
      <div className="hidden md:flex items-center gap-6">
        <ChevronButton onClick={onPrev} dir="prev" />
        <div className={`flex-1 grid grid-cols-3 gap-12 transition-all duration-500 ease-in-out ${translateClass}`}>
          {objects.map((obj, i) => (
            <div key={i} className="relative h-48 rounded-xl overflow-hidden bg-white/5 border border-white/5 group">
              <Image
                src={obj.image_path}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                alt="Objektbild"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
        <ChevronButton onClick={onNext} dir="next" />
      </div>

      {/* Desktop: dots only */}
      <div className="hidden md:flex items-center justify-center mt-6">
        {dots}
      </div>
    </div>
  );
}
