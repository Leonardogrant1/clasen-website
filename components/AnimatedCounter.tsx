"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  active: boolean;
}

export default function AnimatedCounter({
  to,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 2000,
  active,
}: Props) {
  const [current, setCurrent] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;

    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(eased * to);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setCurrent(to);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [active, to, duration]);

  const formatted = current.toFixed(decimals);

  return (
    // Phantom text reserves the exact final width — no layout shift
    <span className="relative inline-block tabular-nums">
      <span className="invisible select-none" aria-hidden>
        {prefix}{to.toFixed(decimals)}{suffix}
      </span>
      <span className="absolute inset-0">
        {prefix}{formatted}{suffix}
      </span>
    </span>
  );
}
