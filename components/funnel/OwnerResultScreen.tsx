'use client'

import { useState } from "react"
import Image from "next/image"
import type { OwnerAnswers } from "@/components/funnel/FunnelProvider"
import FunnelLoader from "@/components/funnel/FunnelLoader"
import { getStableCount, getStableImages } from "@/lib/stable-count"

import { MUNICH_DISTRICTS } from "@/lib/munich-districts"

const PROPERTY_META = [
  { name: "Vil** am ***berg", district: "Schw***-West", rooms: "3", sqm: "87", distance: "1.2 km" },
  { name: "Exe***ive ***hausen", district: "Boge***ausen", rooms: "4", sqm: "124", distance: "2.4 km" },
  { name: "Stad***lage ***vorstadt", district: "Maxv***tadt", rooms: "2", sqm: "64", distance: "0.8 km" },
  { name: "Char***tes ***haus", district: "Au-H***ausen", rooms: "5", sqm: "156", distance: "3.1 km" },
  { name: "Rep***entanz ***zentrum", district: "Lei***", rooms: "3", sqm: "95", distance: "1.8 km" },
  { name: "Exk***sives ***eck", district: "Nymph***burg", rooms: "6", sqm: "210", distance: "4.0 km" },
]

const SQM_LABELS: Record<string, string> = {
  "<50": "unter 50 m²",
  "50-80": "50 – 80 m²",
  "80-120": "80 – 120 m²",
  "120-200": "120 – 200 m²",
  "200+": "über 200 m²",
}

const OBJECT_LABELS: Record<string, string> = {
  land: "einem Grundstück",
  villa: "einer Villa",
  "semi-detached": "einer Doppelhaushälfte",
  "corner-terraced": "einem Reihenhaus",
  apartment: "einer Wohnung",
  special: "einem besonderen Objekt",
}

type OwnerResultScreenProps = {
  objectType: OwnerAnswers["objectType"] | undefined
  districts?: string[]
  sqm?: OwnerAnswers["sqm"]
  ownerType?: OwnerAnswers["ownerType"]
  onCta: () => void
}

export default function OwnerResultScreen({ objectType, districts, sqm, ownerType, onCta }: OwnerResultScreenProps) {
  const answersKey = { objectType: objectType ?? null, districts: districts ?? null, rooms: null, sqm: sqm ?? null }
  const count = getStableCount(answersKey, 1, 2)
  const images = getStableImages(answersKey)
  const [loading, setLoading] = useState(true)

  const TYPE_LABELS: Record<NonNullable<typeof ownerType>, string> = {
    ankommer: "Ankommer",
    gestalter: "Gestalter",
    vorausdenker: "Vorausdenker",
  }

  const sqmText = sqm ? SQM_LABELS[sqm] : null
  
  const districtLabels = districts?.map((d) => MUNICH_DISTRICTS.find((m) => m.slug === d)?.label || d).filter(Boolean)
  const districtsText = districtLabels && districtLabels.length > 0
    ? districtLabels.length > 2 ? "München & Umgebung" : districtLabels.join(" und ")
    : null

  const objectTypesList = objectType?.map((t) => OBJECT_LABELS[t] || t).filter(Boolean)
  const objectTypesText = objectTypesList && objectTypesList.length > 0
    ? objectTypesList.length > 2 ? "verschiedenen Immobilien" : objectTypesList.join(" oder ")
    : null

  if (loading) {
    return <FunnelLoader count={count} label="Traumhaus-Finder™️" onComplete={() => setLoading(false)} />
  }

  return (
    <div className="flex flex-col gap-6" style={{ animation: "fadeSlideIn 0.5s ease both" }}>
      {/* Heading */}
      <div className="flex flex-col gap-3">
        <p className="text-accent text-lg uppercase tracking-widest font-semibold">
          Traumhaus-Finder™️
        </p>
        <h2 className="text-xl sm:text-4xl font-bold text-foreground leading-snug">
          Gute Nachrichten: Ihr Zuhause wartet bereits.
        </h2>
        {ownerType ? (
          <p className="text-white/60 text-sm sm:text-base leading-relaxed">
            Als <span className="text-white font-semibold">{TYPE_LABELS[ownerType]}</span>
            {objectTypesText && <> auf der Suche nach <span className="text-white font-semibold">{objectTypesText}</span></>}
            {sqmText && <> mit ca. <span className="text-white font-semibold">{sqmText}</span></>}
            {districtsText && <> in Umgebung <span className="text-white font-semibold">{districtsText}</span></>}
            {" "}hat unser patentierter KI Agent <strong className="text-white">CLAvis<sup style={{ verticalAlign: "super", fontSize: "0.4em" }}>TM</sup> 3.0</strong>{" "}
            {" "}aus unserem OffMarket-Objektpool <span className="text-accent font-bold">{count} {count === 1 ? "Objekt" : "Objekte"}</span> für Sie priorisiert.
          </p>
        ) : (
          <p className="text-white/40 text-lg">
            Wir haben <span className="text-accent font-semibold">{count} Objekte</span> gefunden, die zu Ihnen passen könnten.
          </p>
        )}
        <p className="text-accent/80 text-sm sm:text-base italic border-l-2 border-accent/30 pl-3">
          Eines davon liegt in einer der ruhigsten Straßen des Viertels.
        </p>
      </div>

      {/* Grid */}
      <div className={`grid gap-3 ${count === 1 ? 'grid-cols-1 max-w-sm mx-auto w-full' : 'grid-cols-2'}`}>
        {PROPERTY_META.slice(0, Math.min(count, 4)).map((p, i) => {
          const image = images[i]
          const shownCount = Math.min(count, 4)
          const isLastShown = i === shownCount - 1
          const isCensored = isLastShown || i >= 2
          const showPlus = isLastShown && count > shownCount

          return (
            <div
              key={i}
              className="relative rounded-2xl overflow-hidden border border-white/10 select-none pointer-events-none"
              style={{ animation: `fadeInUp 0.4s ease ${i * 0.08 + 0.1}s both` }}
            >
              {/* Image */}
              <div className={`relative w-full ${count === 1 ? 'h-56 sm:h-64' : 'h-36 sm:h-44'}`}>
                <Image
                  src={image}
                  alt=""
                  fill
                  className={`object-cover scale-110 ${isCensored ? "blur-xl" : "blur-md"}`}
                />
                {isCensored && <div className="absolute inset-0 bg-black/50" />}
              </div>

              {/* Distance — top right */}
              {!isCensored && (
                <div className="absolute top-2.5 right-2.5 text-white font-semibold text-sm bg-black/40 px-2 py-1 rounded-lg backdrop-blur-sm">
                  {p.distance}
                </div>
              )}

              {/* Info box — bottom overlay */}
              {!isCensored && (
                <div className="absolute bottom-0 inset-x-0 px-3 py-2.5 bg-gradient-to-t from-black/70 to-transparent">
                  <span className="block text-white/90 text-xs font-semibold truncate">{p.name}</span>
                  <span className="block text-white/50 text-[10px]">{p.district} · {p.rooms} Zi · {p.sqm} m²</span>
                </div>
              )}

              {/* Lock overlay */}
              <div className={`absolute inset-0 flex items-center justify-center ${isCensored ? "bg-black/30" : "bg-black/10"}`}>
                {showPlus ? (
                  <span className="text-white text-2xl font-bold">+{count - shownCount + 1}</span>
                ) : isCensored ? (
                  <svg className="w-8 h-8 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>

      {/* CTA */}
      <button
        onClick={onCta}
        className="w-full uppercase py-4 rounded-2xl bg-accent text-background font-bold tracking-wide text-base hover:bg-accent/90 transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        style={{ animation: "fadeInUp 0.4s ease 0.45s both" }}
      >
        Objekte freischalten →
      </button>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
