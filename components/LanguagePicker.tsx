"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import DE from "country-flag-icons/react/1x1/DE";
import GB from "country-flag-icons/react/1x1/GB";
import RU from "country-flag-icons/react/1x1/RU";
import CN from "country-flag-icons/react/1x1/CN";

const LOCALES = [
  { code: "de", label: "DE", Flag: DE },
  { code: "en", label: "EN", Flag: GB },
  { code: "ru", label: "RU", Flag: RU },
  { code: "zh", label: "ZH", Flag: CN },
] as const;

const ALL_LOCALES = ["de", "en", "ru", "zh"];

export default function LanguagePicker({ locale }: { locale: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const switchLocale = (newLocale: string) => {
    if (newLocale === locale) { setOpen(false); return; }
    // Strip current locale prefix to get the bare path
    let path = pathname;
    for (const loc of ALL_LOCALES) {
      if (path.startsWith(`/${loc}`)) {
        path = path.slice(`/${loc}`.length) || "/";
        break;
      }
    }
    router.push(`/${newLocale}${path === "/" ? "" : path}`);
    setOpen(false);
  };

  const active = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];
  const others = LOCALES.filter((l) => l.code !== locale);

  return (
    <div ref={ref} className="fixed bottom-6 md:bottom-10 right-6 md:right-10 z-50 flex flex-col items-end gap-2">
      {/* Dropdown options */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${open
          ? "grid-rows-[1fr] opacity-100 translate-y-0 pointer-events-auto"
          : "grid-rows-[0fr] opacity-0 translate-y-2 pointer-events-none"
          }`}
      >
        <div className="overflow-hidden flex flex-col gap-1.5 pb-1.5">
          {others.map(({ code, label, Flag }) => (
            <button
              key={code}
              onClick={() => switchLocale(code)}
              className="flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full pl-1.5 pr-3 py-1.5 text-xs uppercase tracking-widest text-foreground/70 hover:text-foreground hover:bg-white/15 transition-colors duration-150 cursor-pointer"
            >
              <Flag className="w-5 h-5 rounded-full object-cover" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Active language button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full pl-1.5 pr-3 py-1.5 text-xs uppercase tracking-widest text-accent cursor-pointer hover:bg-white/15 transition-colors duration-150"
      >
        <active.Flag className="w-5 h-5 rounded-full object-cover" />
        {active.label}
      </button>
    </div>
  );
}
