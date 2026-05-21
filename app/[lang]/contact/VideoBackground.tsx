"use client";

import { useEffect, useRef, useState } from "react";

export default function VideoBackground() {
  const [ended, setEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Force play on mount to bypass any autoPlay/hydration quirks
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        src="/video/contact.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={() => setEnded(true)}
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      {/* Static dark overlay */}
      <div className="absolute inset-0 bg-black/40 z-0" />
      {/* Frosted backdrop — fades in after video ends */}
      <div
        className="absolute inset-0 z-0 transition-opacity bg-black/60 backdrop-blur-md duration-1000"
        style={{ opacity: ended ? 1 : 0 }}
      />
    </>
  );
}
