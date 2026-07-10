"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import AnimatedCounter from "./AnimatedCounter";

type Props = {
  /** Localized display string, e.g. "Bis 24 Std.", "100 %", "1,5" */
  value: string;
  duration?: number;
};

const NUMBER_RE = /\d+(?:[.,]\d+)?/;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function useReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false
  );
}

export default function CountUpText({ value, duration = 1600 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduced]);

  const match = value.match(NUMBER_RE);
  if (!match || reduced) return <span>{value}</span>;

  const raw = match[0];
  const index = match.index ?? 0;
  const separator = raw.includes(",") ? "," : ".";
  const decimals = /[.,]/.test(raw) ? raw.split(/[.,]/)[1].length : 0;

  return (
    <span ref={ref}>
      <AnimatedCounter
        to={parseFloat(raw.replace(",", "."))}
        prefix={value.slice(0, index)}
        suffix={value.slice(index + raw.length)}
        decimals={decimals}
        separator={separator}
        duration={duration}
        active={active}
      />
    </span>
  );
}
