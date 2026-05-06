"use client";

import Link from "next/link";
import { useState } from "react";
import type { Dictionary } from "../dictionaries";

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
          <label className="text-muted text-xs uppercase tracking-widest">{t.emailLabel}</label>
          <input type="email" placeholder={t.emailPlaceholder}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-foreground text-sm placeholder:text-muted/40 focus:outline-none focus:border-accent transition-colors duration-200" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-muted text-xs uppercase tracking-widest">{t.passwordLabel}</label>
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
