import type { Dictionary } from "@/app/[lang]/dictionaries";

export default function Footer({ dict }: { dict: Dictionary["footer"] }) {
  return (
    <footer className="border-t border-white/10 px-8 py-8 flex items-center justify-between">
      <span className="text-muted text-sm uppercase tracking-widest">
        © {new Date().getFullYear()} Clasen Immos
      </span>
      <span className="text-muted text-sm uppercase tracking-widest">
        {dict.rights}
      </span>
    </footer>
  );
}
