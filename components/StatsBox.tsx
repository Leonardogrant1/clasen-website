"use client";

import { useEffect, useRef, useState } from "react";
import AnimatedCounter from "./AnimatedCounter";
import type { Dictionary } from "@/app/[lang]/dictionaries";

const REF_DATE = new Date("2026-05-03T00:00:00Z");
const REF_VALUE = 687;

function getInvestmentCount(): number {
  const now = new Date();
  const daysSinceRef = Math.floor(
    (now.getTime() - REF_DATE.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysSinceRef < 0) return REF_VALUE;
  const completedCycles = Math.floor(daysSinceRef / 30);
  const dayInCycle = daysSinceRef % 30;
  return REF_VALUE + completedCycles * 3 + (dayInCycle >= 10 ? 1 : 0);
}

type Props = {
  dict: Dictionary["stats"];
  inline?: boolean;
};

export default function StatsBox({ dict, inline = false }: Props) {
  const [visible, setVisible] = useState(false);
  const [counting, setCounting] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const investmentCount = getInvestmentCount();

  const stats = [
    {
      prefix: "",
      value: investmentCount,
      suffix: "",
      decimals: 0,
      label: [dict.investments.line1, dict.investments.line2],
    },
    {
      prefix: dict.transactions.prefix,
      value: 2.44,
      suffix: "",
      decimals: 2,
      label: [dict.transactions.line1, dict.transactions.line2],
    },
    {
      prefix: "",
      value: 95,
      suffix: dict.recommendations.suffix,
      decimals: 0,
      label: [dict.recommendations.line1, dict.recommendations.line2],
    },
  ];

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={boxRef}
      onTransitionEnd={() => { if (visible) setCounting(true); }}
      className={
        inline
          ? `flex flex-col w-full border-t border-white/10 transition-all duration-700 ease-out ${visible ? "opacity-100" : "opacity-0"}`
          : `hidden md:flex absolute bottom-8 right-8 z-10 flex-row border border-white/20 bg-white/10 backdrop-blur-md rounded-xl overflow-hidden transition-all duration-700 ease-out ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`
      }
    >
      {stats.map((stat, i) => (
        <div
          key={i}
          className={`flex items-center gap-4 ${inline ? "px-4 py-4 justify-center" : "px-8 py-5"} ${i < stats.length - 1 ? (inline ? "border-b border-white/10" : "border-r border-white/20") : ""}`}
        >
          <p className={`text-foreground font-bold whitespace-nowrap ${inline ? "text-xl" : "text-3xl"}`}>
            <AnimatedCounter
              to={stat.value}
              prefix={stat.prefix}
              suffix={stat.suffix}
              decimals={stat.decimals}
              active={counting}
            />
          </p>
          <p className="text-muted text-xs uppercase tracking-widest leading-snug">
            {stat.label[0]}<br />{stat.label[1]}
          </p>
        </div>
      ))}
    </div>
  );
}
