import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/app/[lang]/dictionaries";

export default function Footer({ dict, locale }: { dict: Dictionary["footer"]; locale: string }) {
  return (
    <footer className="bg-background border-t border-white/10">
      {/* Main row */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-14 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <p className="text-foreground text-xl md:text-2xl font-light tracking-wide">
          {dict.tagline}
        </p>
        <span className="text-white/40 text-xs tracking-widest whitespace-nowrap">
          © {new Date().getFullYear()} CLASEN Gruppe
        </span>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 px-6 md:px-12 py-6 max-w-7xl mx-auto flex flex-col items-center gap-6 md:flex-row md:justify-between">
        <Image src="/logo/key_white.svg" alt="Clasen" width={80} height={28} />
        <div className="flex flex-col items-center gap-3 md:flex-row md:gap-6">
          <span className="text-white/25 text-xs uppercase tracking-widest">
            © {new Date().getFullYear()} Clasen. {dict.rights}.
          </span>
          <div className="flex items-center gap-6">
            <Link href={`/${locale}/impressum`} className="text-white/25 text-xs uppercase tracking-widest hover:text-white/50 transition-colors duration-200">
              {dict.impressum}
            </Link>
            <Link href={`/${locale}/datenschutz`} className="text-white/25 text-xs uppercase tracking-widest hover:text-white/50 transition-colors duration-200">
              {dict.datenschutz}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
