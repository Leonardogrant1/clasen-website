import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Seite offline - CLASEN",
  description: "Diese Website ist vorübergehend offline.",
};

export default function OfflinePage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/backgrounds/chess.png"
          alt="Clasen Chess Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/95 to-background" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-xl px-6 py-12 text-center flex flex-col items-center">
        {/* Logo */}
        <div className="mb-10 opacity-0 animate-[fade-in_1s_ease-out_forwards]">
          <Image
            src="/logo/logo_complete.svg"
            alt="CLASEN Family Office Logo"
            width={240}
            height={90}
            className="h-auto w-auto max-w-[220px]"
            priority
          />
        </div>

        {/* Brand Accent Line */}
        <div className="w-16 h-px bg-accent mb-8 opacity-0 animate-[scale-in_0.8s_ease-out_0.2s_forwards]" />

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold tracking-wider text-foreground mb-6 uppercase">
          Seite offline
        </h1>

        {/* Description Text */}
        <p className="text-muted leading-relaxed text-base md:text-lg mb-10 max-w-md">
          Unsere Website ist vorübergehend offline. Wir sind bald wieder für Sie da und bitten um Ihr Verständnis.
        </p>

      </div>
    </div>
  );
}
