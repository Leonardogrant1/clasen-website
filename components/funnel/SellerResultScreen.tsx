'use client'

import { useState } from "react"
import type { SellerAnswers } from "@/components/funnel/FunnelProvider"
import { getStableCount } from "@/lib/stable-count"
import FunnelLoader from "@/components/funnel/FunnelLoader"
import Image from "next/image"

const ALL_BLURRED_PROFILES = [
  { name: "H**** M*******", detail: "Gesuchtes Budget: ••••••", location: "Schwabing", image: "/testimonials/phillip_geissler/profile.png" },
  { name: "K**** F*********", detail: "Gesuchtes Budget: ••••••", location: "Bogenhausen", image: "/testimonials/jens_krautscheid/profile.jpeg" },
  { name: "A*** S******", detail: "Gesuchtes Budget: ••••••", location: "Maxvorstadt", image: "/testimonials/marie_bougeard/profile.png" },
  { name: "P****** W*******", detail: "Gesuchtes Budget: ••••••", location: "Au-Haidhausen", image: "/testimonials/daniel_seglias/profile.jpeg" },
  { name: "M****** L***", detail: "Gesuchtes Budget: ••••••", location: "Neuhausen", image: "/social-proof/1.png" },
  { name: "S***** B******", detail: "Gesuchtes Budget: ••••••", location: "Lehel", image: "/social-proof/2.png" },
  { name: "T***** M********", detail: "Gesuchtes Budget: ••••••", location: "Glockenbachviertel", image: "/social-proof/3.png" },
  { name: "C******* H***", detail: "Gesuchtes Budget: ••••••", location: "Nymphenburg", image: "/social-proof/4.png" },
  { name: "J******* B*****", detail: "Gesuchtes Budget: ••••••", location: "Sendling", image: "/testimonials/phillip_geissler/profile.png" },
  { name: "D***** F******", detail: "Gesuchtes Budget: ••••••", location: "Haidhausen", image: "/testimonials/jens_krautscheid/profile.jpeg" },
  { name: "K********* M****", detail: "Gesuchtes Budget: ••••••", location: "Giesing", image: "/testimonials/marie_bougeard/profile.png" },
  { name: "H****** V**", detail: "Gesuchtes Budget: ••••••", location: "Thalkirchen", image: "/testimonials/daniel_seglias/profile.jpeg" },
  { name: "R**** T*******", detail: "Gesuchtes Budget: ••••••", location: "Solln", image: "/social-proof/1.png" },
  { name: "E**** G*******", detail: "Gesuchtes Budget: ••••••", location: "Pasing", image: "/social-proof/2.png" },
  { name: "N***** P****", detail: "Gesuchtes Budget: ••••••", location: "Obermenzing", image: "/social-proof/3.png" },
  { name: "V******* C****", detail: "Gesuchtes Budget: ••••••", location: "Harlaching", image: "/social-proof/4.png" },
  { name: "B****** S*******", detail: "Gesuchtes Budget: ••••••", location: "Bogenhausen", image: "/testimonials/phillip_geissler/profile.png" },
  { name: "M******* R****", detail: "Gesuchtes Budget: ••••••", location: "Schwabing-West", image: "/testimonials/jens_krautscheid/profile.jpeg" },
  { name: "A******** L******", detail: "Gesuchtes Budget: ••••••", location: "Schwanthalerhöhe", image: "/testimonials/marie_bougeard/profile.png" },
  { name: "G***** W******", detail: "Gesuchtes Budget: ••••••", location: "Laim", image: "/testimonials/daniel_seglias/profile.jpeg" },
]

type SellerResultScreenProps = {
  objectType: SellerAnswers["objectType"] | undefined
  district?: string
  phase?: SellerAnswers["phase"]
  partnerType?: SellerAnswers["partnerType"]
  onCta: () => void
}

export default function SellerResultScreen({ objectType, district, phase, partnerType, onCta }: SellerResultScreenProps) {
  const count = getStableCount(
    { objectType: objectType ?? null, district: district ?? null, phase: phase ?? null, partnerType: partnerType ?? null },
    50, 190
  )

  const [loading, setLoading] = useState(true)

  if (loading) {
    return <FunnelLoader count={count} label="CLASEN KÄUFERRADAR™" noun="Interessenten" onComplete={() => setLoading(false)} />
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 text-center">
        <p className="text-accent text-lg uppercase tracking-widest font-semibold">
          CLASEN KÄUFERRADAR™
        </p>
        <h2 className="text-xl sm:text-4xl font-bold text-foreground leading-snug">
          <span className="text-accent">{count} aktive Profile</span> suchen
          eine Immobilie wie Ihre.
        </h2>
        <p className="text-white/40 text-lg">
          Unser KI-Agent <strong>CLAvis<sup style={{ verticalAlign: "super", fontSize: "0.4em" }}>TM</sup> 3.0</strong> hat passende Kaufinteressenten aus unserem Netzwerk identifiziert.
        </p>
      </div>

      <div className="flex flex-col gap-2 relative">
        {ALL_BLURRED_PROFILES.slice(count % 15, (count % 15) + 5).map((p, i) => {
          const isVerified = i < 3 + (count % 2) || i === 4
          return (
            <div
              key={p.name}
              className="flex items-center gap-4 p-4 bg-white/[0.04] border border-white/10 rounded-xl select-none pointer-events-none"
            >
              <div className="relative w-10 h-10 rounded-full border border-white/10 overflow-hidden shrink-0" style={{ filter: "blur(3px)" }}>
                <Image src={p.image} alt="" fill className="object-cover" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-white/90 text-sm font-semibold flex items-center gap-1">
                  {p.name}
                  {isVerified && (
                    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="#3897f0"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.41 14.41L6.7 12.53l1.41-1.41 2.47 2.47 5.82-5.82 1.41 1.41-7.22 7.23z"/></svg>
                  )}
                </span>
                <span className="text-white/50 text-xs">{p.location}</span>
              </div>
              <div className="ml-auto">
                {isVerified ? (
                  <span className="text-xs text-green-500 font-semibold">Verifiziert ✓</span>
                ) : (
                  <span className="text-xs text-yellow-500 font-semibold">In Verifizierung</span>
                )}
              </div>
            </div>
          )
        })}
        {/* lock overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent rounded-xl pointer-events-none" />
        {/* remaining count indicator */}
        <div className="absolute bottom-0 inset-x-0 flex items-center justify-center pb-2 pointer-events-none">
          <span className="text-white/50 text-sm font-medium">+ {count - 5} weitere Interessenten</span>
        </div>
      </div>

      <button
        onClick={onCta}
        className="w-full uppercase py-4 rounded-2xl bg-accent text-background font-bold tracking-wide text-base hover:bg-accent/90 transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        Profile jetzt ansehen →
      </button>
    </div>
  )
}
