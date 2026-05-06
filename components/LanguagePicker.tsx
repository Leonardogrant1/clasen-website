"use client";

import { usePathname, useRouter } from "next/navigation";

export default function LanguagePicker({ locale }: { locale: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (newLocale: string) => {
    if (newLocale === locale) return;
    if (newLocale === "en") {
      const newPath = pathname === "/" ? "/en" : `/en${pathname}`;
      router.push(newPath);
    } else {
      const newPath = pathname.replace(/^\/en/, "") || "/";
      router.push(newPath);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-3 py-1.5 text-xs uppercase tracking-widest select-none">
      <button
        onClick={() => switchLocale("de")}
        className={`transition-colors duration-200 ${
          locale === "de"
            ? "text-[#C9A84C]"
            : "text-foreground/40 hover:text-foreground/70"
        }`}
      >
        DE
      </button>
      <span className="text-white/20">|</span>
      <button
        onClick={() => switchLocale("en")}
        className={`transition-colors duration-200 ${
          locale === "en"
            ? "text-[#C9A84C]"
            : "text-foreground/40 hover:text-foreground/70"
        }`}
      >
        EN
      </button>
    </div>
  );
}
