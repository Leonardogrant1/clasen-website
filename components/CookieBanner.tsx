"use client";

import { useEffect, useState } from "react";
import posthog from "posthog-js";

const STORAGE_KEY = "clasen_cookie_consent";

const copy = {
  de: {
    text: "Wir nutzen Cookies für anonyme Nutzungsanalysen, um diese Website zu verbessern.",
    accept: "Akzeptieren",
    decline: "Ablehnen",
  },
  en: {
    text: "We use cookies for anonymous usage analytics to improve this website.",
    accept: "Accept",
    decline: "Decline",
  },
} as const;

export default function CookieBanner({ locale }: { locale: "de" | "en" }) {
  const [visible, setVisible] = useState(false);
  const t = copy[locale] ?? copy.de;

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "accepted") {
      posthog.opt_in_capturing();
    } else if (!stored) {
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    posthog.opt_in_capturing();
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
        <div className="w-full max-w-md border border-white/10 bg-background p-8 flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <span className="text-white/30 text-[11px] uppercase tracking-[0.2em]">Cookies</span>
            <p className="text-white/70 text-sm leading-relaxed">
              {t.text}
            </p>
          </div>
          <div className="flex items-center justify-end gap-4">
            <button
              onClick={decline}
              className="text-white/30 text-xs uppercase tracking-widest hover:text-white/60 transition-colors duration-200"
            >
              {t.decline}
            </button>
            <button
              onClick={accept}
              className="px-5 py-2.5 border border-white/20 text-white/70 text-xs uppercase tracking-widest hover:border-white/50 hover:text-white transition-colors duration-200"
            >
              {t.accept}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
