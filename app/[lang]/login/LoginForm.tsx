"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Dictionary } from "../dictionaries";

function InfoTooltip({ children, showDsgvo = false }: { children: React.ReactNode; showDsgvo?: boolean }) {
  const [visible, setVisible] = useState(false);
  return (
    <span className="relative inline-flex items-center ml-1.5">
      <button
        type="button"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        onClick={() => setVisible((v) => !v)}
        className="w-3.5 h-3.5 rounded-full border border-white/30 text-white/30 flex items-center justify-center text-[9px] leading-none hover:border-accent/60 hover:text-accent/60 transition-colors duration-150 focus:outline-none"
        aria-label="Info"
      >
        i
      </button>
      {visible && (
        <span className="absolute bottom-full left-0 mb-2 w-64 max-w-[calc(100vw-3rem)] bg-[#1a1a1a] border border-white/10 rounded-lg px-3 pt-2 pb-2.5 text-white/70 text-xs leading-relaxed shadow-xl pointer-events-none z-50 whitespace-normal normal-case tracking-normal font-normal flex flex-col gap-2">
          {children}
          {showDsgvo && (
            <Image src="/dsgvo.png" alt="DSGVO" width={80} height={28} className="opacity-50 h-5 w-auto object-contain object-left" />
          )}
          <span className="absolute top-full left-1 border-4 border-transparent border-t-[#1a1a1a]" />
        </span>
      )}
    </span>
  );
}

type Props = {
  t: Dictionary["login"];
  base: string;
};

export default function LoginForm({ t, base }: Props) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
      >
        <div className="flex flex-col gap-1.5">
          <label className="text-muted text-xs uppercase tracking-widest flex items-center">
            {t.emailLabel}
            <InfoTooltip showDsgvo>Sie finden Ihre persönliche CFO-Kennung in Ihrem Willkommensbrief, beziehungsweise in Ihrer Onboarding-Email.</InfoTooltip>
          </label>
          <input type="email" placeholder={t.emailPlaceholder}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-foreground text-sm placeholder:text-muted/40 focus:outline-none focus:border-accent transition-colors duration-200" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-muted text-xs uppercase tracking-widest flex items-center">
            {t.passwordLabel}
            <InfoTooltip>
              <span>Geben Sie hier Ihr zugesandtes Einmalpasswort für Ihren Erstlogin oder Ihr beim 1. Login bereits festgelegtes persönliches Passwort ein.</span>
              <span className="text-white/90 font-semibold">CLASEN Mitarbeiter oder Systemadministratoren werden Sie NIEMALS nach Ihrem persönlichen Passwort fragen.</span>
              <span>Sollten Sie Ihr bereits festgelegtes Passwort vergessen haben, wenden Sie sich bitte an{" "}
                <span className="text-accent">support@clasen.com</span>
              </span>
            </InfoTooltip>
          </label>
          <input type="password" placeholder="••••••••"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-foreground text-sm placeholder:text-muted/40 focus:outline-none focus:border-accent transition-colors duration-200" />
        </div>

        {submitted && (
          <p className="text-sm text-red-400 text-center -mb-1">Kein Konto gefunden.</p>
        )}

        <button type="submit"
          className="mt-2 w-full py-3 rounded-full bg-white text-black text-sm uppercase tracking-widest font-semibold hover:bg-white/90 transition-colors duration-200">
          {t.submit}
        </button>
      </form>

      <p className="text-muted/50 text-xs text-center mt-6">
        {t.noAccess}{" "}
        <Link href={`${base}/contact`} className="text-accent hover:underline">
          {t.contactLink}
        </Link>
      </p>
    </>
  );
}
