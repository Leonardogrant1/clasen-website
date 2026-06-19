import type { Dictionary } from "@/app/[lang]/dictionaries";

export default function ClasenWarum({ dict }: { dict: Dictionary["clasenWarum"] }) {
  return (
    <section className="pb-10 px-4 md:py-32 md:px-8 bg-background">
      <div className="max-w-3xl mx-auto text-center md:text-left">
        <span className="text-accent text-sm uppercase tracking-widest font-semibold block mb-6">
          {dict.sectionLabel}
        </span>
        <p className="text-muted text-lg leading-relaxed whitespace-pre-line">{dict.body}</p>
      </div>
    </section>
  );
}
