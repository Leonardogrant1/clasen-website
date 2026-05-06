"use client";

import { useEffect, useRef, useState } from "react";

export default function CircularText({ text }: { text: string }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="w-full h-full transition-opacity duration-700 ease-out"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <div
        className="w-full h-full"
        style={{
          animation: "spin-slow 12s linear infinite",
          transformOrigin: "center center",
        }}
      >
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <defs>
            <path
              id="circle-path"
              d="M 60,60 m -50,0 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0"
            />
          </defs>
          <text
            fontSize="11"
            fill="white"
            letterSpacing="4.5"
            fontFamily="inherit"
            style={{ textTransform: "uppercase" }}
          >
            <textPath href="#circle-path">{text}</textPath>
          </text>
        </svg>
      </div>
    </div>
  );
}
