'use client'

import Image from "next/image"
import { useFunnel } from "@/components/funnel/FunnelProvider"

const TESTIMONIALS = [
  {
    name: "Philippe Geissler",
    type: "Jurist / Master (LMU)",
    text: "...das Team konnte mich durch strukturierte Vorgehensweise und exzellente Marktkenntnisse überzeugen und erfolgreich fürs Alter absichern...",
    image: "/testimonials/phillip_geissler/profile.png",
  },
  {
    name: "Jens Krautscheid",
    type: "Apotheker / Speaker / Unternehmer",
    text: "...anfänglich gefielen uns Marke und Konzept. Inzwischen bin ich menschlich überzeugt. Das Konzept ist steuerlich zu Ende gedacht.",
    image: "/testimonials/jens_krautscheid/profile.jpeg",
  },
  {
    name: "Marie Bougeard",
    type: "Bildende Künstlerin",
    text: "...war ich bereits im ersten gemeinsamen Gespräch besonders überzeugt von der offenen Kommunikation und ehrlichen Beratung.",
    image: "/testimonials/marie_bougeard/profile.png",
  },
  {
    name: "Daniel Seglias",
    type: "Bildungsberater / Finanzcoach",
    text: "...entscheidend für mich war die Möglichkeit, im Rahmen einer Immobilientour persönlich Einblick in den Aufwertungsprozess nehmen zu können...",
    image: "/testimonials/daniel_seglias/profile.jpeg",
  },
]

const COLLAGE_IMAGES = [
  "/social-proof/1.png",
  "/social-proof/2.png",
  "/social-proof/3.png",
  "/social-proof/4.png",
]

type SocialProofProps = {
  onContinue: () => void
}

export default function SocialProof({ onContinue }: SocialProofProps) {
  const { type } = useFunnel()

  let noun = "Mandanten"
  if (type === "investor") noun = "Investoren"
  if (type === "owner") noun = "Käufer"
  if (type === "seller") noun = "Verkäufer"

  return (
    <div className="flex flex-col gap-6 sm:gap-8 pb-4" style={{ animation: "fadeSlideIn 0.5s ease both" }}>

      {/* Heading */}
      <div className="flex flex-col gap-4" style={{ animation: "fadeInUp 0.4s ease 0.05s both" }}>
        <p className="text-accent text-lg uppercase tracking-widest font-semibold">
          Ihr Schlüsselmoment
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-wide text-foreground leading-tight">
          Hunderte glückliche {noun} in München.
        </h2>
      </div>

      {/* Photo collage – 2×2 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {COLLAGE_IMAGES.map((src, i) => (
          <div
            key={i}
            className="relative aspect-square rounded-xl overflow-hidden bg-white/5"
            style={{ animation: `fadeInUp 0.4s ease ${i * 0.08 + 0.1}s both` }}
          >
            <Image
              src={src}
              alt=""
              fill
              className="object-cover object-center"
              sizes="(max-width: 640px) 100vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        ))}
      </div>

      {/* Call To Action 1 */}
      <button
        onClick={onContinue}
        className="w-full py-5 rounded-2xl bg-accent uppercase text-white font-bold tracking-wide text-lg hover:bg-accent/90 active:scale-[0.98] transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent shadow-lg shadow-accent/20"
        style={{ animation: "fadeInUp 0.4s ease 0.65s both" }}
      >
        {type === "seller" ? "Weiter →" : "Objekte anzeigen →"}
      </button>

      {/* Testimonial endless slider */}
      <div className="w-full overflow-hidden" style={{ animation: "fadeInUp 0.4s ease 0.35s both" }}>
        <p className="text-accent text-lg uppercase tracking-widest font-semibold mb-4">
          Das sagen unsere {noun}
        </p>
        <div className="flex gap-3 w-max" style={{ animation: "marquee 24s linear infinite" }}>
          {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
            <div
              key={i}
              className="flex flex-col gap-4 bg-white/[0.04] border border-white/10 rounded-2xl p-4 w-56 sm:w-72 shrink-0"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/20 shrink-0">
                  <Image src={t.image} alt={t.name} fill className="object-cover object-top" sizes="40px" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{t.name}</p>
                  <p className="text-accent text-xs mt-0.5">{t.type}</p>
                </div>
              </div>
              <p className="text-white/70 text-sm leading-relaxed italic">„{t.text}"</p>
            </div>
          ))}
        </div>
      </div>



      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
