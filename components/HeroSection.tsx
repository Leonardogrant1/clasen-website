"use client";

import StatsBox from "./StatsBox";
import { useState, useEffect } from "react";
import type { Dictionary } from "@/app/[lang]/dictionaries";

type Props = {
  dict: Dictionary["hero"];
  statsDict: Dictionary["stats"];
};

export default function HeroSection({ dict, statsDict }: Props) {
  const [item, setItem] = useState(dict.items[0]);

  useEffect(() => {
    const index = Math.floor(Math.random() * dict.items.length);
    setItem(dict.items[index]);
  }, [dict.items]);

  return (
    <>
      {/* Mobile */}
      <section className="flex flex-col md:hidden bg-background">
        <div className="relative h-[60vh] overflow-hidden">
          <video
            src={item.videoPath}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10" />
        </div>

        <div className="px-4 py-8 text-center">
          <div className="flex items-end justify-center gap-2 mb-3">
            <span className="text-[#C9A84C] text-2xl font-semibold tracking-widest uppercase">01</span>
            <p className="text-[#C9A84C] text-xs uppercase tracking-widest mb-1 font-semibold">{dict.vision}</p>
          </div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground mb-3 whitespace-pre-line">
            {item.title}
          </h1>
          <p className="text-muted leading-relaxed text-sm">{item.subtitle}</p>
        </div>

        <StatsBox dict={statsDict} inline />
      </section>

      {/* Desktop */}
      <section className="hidden md:block relative h-screen overflow-hidden">
        <video
          src={item.videoPath}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />

        <div className="absolute bottom-20 left-8 z-10 max-w-2xl">
          <div className="flex items-end gap-2 align-bottom">
            <span className="text-[#C9A84C] text-3xl font-semibold tracking-widest uppercase z-10">01</span>
            <p className="text-[#C9A84C] text-xs uppercase tracking-widest mb-1 font-semibold">{dict.vision}</p>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight text-foreground mb-4 whitespace-pre-line">
            {item.title}
          </h1>
          <p className="text-muted max-w-md leading-relaxed text-sm">{item.subtitle}</p>
        </div>

        <StatsBox dict={statsDict} />
      </section>
    </>
  );
}
