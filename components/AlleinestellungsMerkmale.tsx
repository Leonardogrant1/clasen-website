"use client"
import type { Dictionary } from "@/app/[lang]/dictionaries";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

type Props = {
  dict: Dictionary["alleinstell"];
  locale: string;
};

import treffsicher from "@/public/animations/goals.json"
import offmarket from "@/public/animations/invoice.json"
import heimspiel from "@/public/animations/town.json"
import taxBenefit from "@/public/animations/gift.json"
import excellence from "@/public/animations/crown.json"
import ecoFriendly from "@/public/animations/energy.json"

const lotties = {
  "/animations/goals.json": treffsicher,
  "/animations/invoice.json": offmarket,
  "/animations/town.json": heimspiel,
  "/animations/gift.json": taxBenefit,
  "/animations/crown.json": excellence,
  "/animations/energy.json": ecoFriendly,
}


export default function AlleinestellungsMerkmale({ dict, locale }: Props) {
  const base = locale === "en" ? "/en" : "";
  return (
    <section className="py-16 px-4 md:py-32 md:px-8 bg-background border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 md:mb-20 gap-6">
          <div className="text-center md:text-left">
            <span className="text-accent text-xs uppercase tracking-widest font-semibold block mb-4">
              {dict.sectionLabel}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight wrap-break-words">
              {dict.heading}
            </h2>
          </div>
          <a
            href={`${base}/contact`}
            className="hidden md:inline-flex shrink-0 items-center gap-2 border border-white/20 text-foreground text-xs uppercase tracking-widest px-5 py-3 hover:border-accent hover:text-accent transition-colors duration-200"
          >
            {dict.cta}
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-16">
          {dict.merkmale.map((m, i) => (
            <div key={m.title} className="flex flex-col items-center gap-4">
              <Lottie animationData={lotties[m.animation as keyof typeof lotties]} loop={true} className="w-28 h-28" />

              <p className="text-xs uppercase tracking-[0.2em] text-center font-semibold text-foreground">{m.title}</p>
              <p className="text-muted text-sm leading-relaxed text-center">{m.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
