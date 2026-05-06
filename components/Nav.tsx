"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import posthog from "posthog-js";

type Props = {
  dict: Dictionary["nav"];
  locale: string;
};

type LoginPhase = "idle" | "flying" | "arrived";

export default function Nav({ dict, locale }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [loginPhase, setLoginPhase] = useState<LoginPhase>("idle");
  const [flyRect, setFlyRect] = useState<{ from: DOMRect; targetLeft: number; targetTop: number } | null>(null);
  const [keyMoved, setKeyMoved] = useState(false);

  const logoRef = useRef<HTMLDivElement>(null);
  const lockRef = useRef<HTMLDivElement>(null);
  const keyTargetRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const router = useRouter();

  const base = locale === "en" ? "/en" : "";

  const mainLinks = [
    { href: `${base}/`, label: dict.kapital },
    { href: `${base}/properties`, label: dict.wohnenUndLeben },
    { href: `${base}/clasen`, label: dict.clasen },
    { href: `${base}/contact`, label: dict.contact },
  ];

  const handleLoginClick = () => {
    if (loginPhase !== "idle") return;

    posthog.capture("login_initiated", { source: "desktop_nav" });

    const logoEl = logoRef.current;
    const lockEl = lockRef.current;
    if (!logoEl || !lockEl) { router.push(`${base}/login`); return; }

    const from = logoEl.getBoundingClientRect();
    const to = (keyTargetRef.current ?? lockEl).getBoundingClientRect();

    const keyholeCenterX = to.left + to.width * 0.5;
    const keyholeCenterY = to.top + to.height * 0.55;
    const targetLeft = keyholeCenterX - from.width / 2 - 72;
    const targetTop = keyholeCenterY - from.height / 2 - 10;

    setFlyRect({ from, targetLeft, targetTop });
    setLoginPhase("flying");

    requestAnimationFrame(() => {
      requestAnimationFrame(() => setKeyMoved(true));
    });

    setTimeout(() => setLoginPhase("arrived"), 1000);
    setTimeout(() => router.push(`${base}/login`), 1600);
  };

  useEffect(() => {
    if (loginPhase !== "idle") {
      setLoginPhase("idle");
      setFlyRect(null);
      setKeyMoved(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const isAnimating = loginPhase !== "idle";

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 grid grid-cols-3 items-start px-6 py-6 md:px-20 md:py-12">

        <div
          ref={logoRef}
          className={`transition-opacity duration-300 ${isAnimating ? "opacity-0" : "opacity-100"}`}
        >
          <Link href={`${base}/`} className="inline-block">
            <Image src="/logo/key_white.svg" alt="Clasen" width={100} height={34} className="md:w-[150px] md:h-[50px]" />
          </Link>
        </div>

        <nav className="hidden md:flex items-center justify-center">
          <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-2 py-1.5">
            {mainLinks.map((link) => {
              const active = pathname === link.href || (link.href === `${base}/` && pathname === base);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-1.5 rounded-full text-sm uppercase tracking-widest whitespace-nowrap transition-colors duration-200
                    ${active
                      ? "bg-white/20 text-foreground"
                      : "text-foreground/60 hover:text-foreground hover:bg-white/10"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="hidden md:flex justify-end items-center">
          <div ref={lockRef} className="relative h-12 w-48">
            <button
              onClick={handleLoginClick}
              className={`absolute inset-0 rounded-full bg-white text-black text-sm uppercase font-semibold transition-opacity duration-300 cursor-pointer
                ${isAnimating ? "opacity-0 pointer-events-none" : "opacity-100 hover:bg-white/90"}`}
            >
              {dict.login}
            </button>

            <div
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300
                ${isAnimating ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            >
              <div ref={keyTargetRef} className="relative w-7 h-full translate-y-4">
                <Image src="/lock.png" fill alt="Lock" className="object-contain" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex md:hidden justify-end col-start-3">
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Menü öffnen"
            className="flex flex-col gap-1.5 p-2"
          >
            <span className="block w-6 h-0.5 bg-foreground" />
            <span className="block w-6 h-0.5 bg-foreground" />
            <span className="block w-6 h-0.5 bg-foreground" />
          </button>
        </div>
      </header>

      {flyRect && (
        <div
          className="fixed pointer-events-none"
          style={{
            zIndex: 200,
            left: keyMoved ? flyRect.targetLeft : flyRect.from.left,
            top: keyMoved ? flyRect.targetTop : flyRect.from.top,
            width: flyRect.from.width,
            height: flyRect.from.height,
            transition: "left 0.7s cubic-bezier(0.4,0,0.2,1), top 0.7s cubic-bezier(0.4,0,0.2,1), opacity 0.3s",
            opacity: loginPhase === "arrived" ? 0 : 1,
          }}
        >
          <Image src="/logo/key_white.svg" fill alt="" className="object-contain" />
        </div>
      )}

      <div
        className={`fixed inset-0 z-200 bg-background/95 backdrop-blur-md flex flex-col items-center justify-center
          transition-opacity duration-300
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <button
          onClick={() => setIsOpen(false)}
          aria-label="Menü schließen"
          className="absolute top-6 right-8 p-2 text-foreground"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <nav className="flex flex-col items-center gap-8">
          {mainLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-2xl font-bold uppercase tracking-widest transition-colors duration-200
                  ${active ? "text-accent" : "text-foreground hover:text-accent"}`}
              >
                {link.label}
              </Link>
            );
          })}

          <Link
            href={`${base}/login`}
            onClick={() => { setIsOpen(false); posthog.capture("login_initiated", { source: "mobile_nav" }); }}
            className="mt-10 px-8 py-3 rounded-full bg-white text-black text-sm uppercase tracking-widest font-semibold hover:bg-white/90 transition-colors duration-200"
          >
            {dict.login}
          </Link>
        </nav>
      </div>
    </>
  );
}
