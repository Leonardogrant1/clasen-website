'use client'

import { useState } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import Image from "next/image"
import { useFunnel } from "@/components/funnel/FunnelProvider"
import type { SellerAnswers } from "@/components/funnel/FunnelProvider"
import SocialProof from "@/components/funnel/SocialProof"
import Treppchen from "@/components/funnel/Treppchen"
import SellerResultScreen from "@/components/funnel/SellerResultScreen"
import FunnelContactForm from "@/components/funnel/FunnelContactForm"
import { MUNICH_DISTRICTS } from "@/lib/munich-districts"

const TOTAL_STEPS = 8

const PHASE_OPTIONS: Array<{ slug: SellerAnswers["phase"]; icon: string; label: string }> = [
  { slug: "preparation", icon: "🧠", label: "Nein (Ihre Immobilie wurde noch Niemandem angeboten)" },
  { slug: "was-on-market", icon: "📣", label: "Ja (Ich habe selbst bereits versucht meine Immobilie zu verkaufen)" },
  { slug: "on-market", icon: "💼", label: "Ja (ich habe es bereits mit einem Makler versucht)" },
]

const PARTNER_OPTIONS: Array<{ slug: SellerAnswers["partnerType"]; icon: string; label: string; desc: string }> = [
  { slug: "experienced", icon: "⚜️", label: "Äußerst Erfahren", desc: "Im Umgang mit potentiellen Kaufinteressenten" },
  { slug: "negotiator", icon: "🗿", label: "Ein harter Verhandler", desc: "Der den besten Preis für mich herausholt" },
  { slug: "communicative", icon: "🫂", label: "Erreichbar & Umsichtig", desc: "Der all meine Fragen souverän beantwortet" },
]

const OBJECT_OPTIONS: Array<{ slug: SellerAnswers["objectType"]; label: string; icon: string }> = [
  { slug: "apartment-building", label: "Mehrfamilienhaus", icon: "/icons/MFH.svg" },
  { slug: "villa", label: "Villa / Einfamilienhaus", icon: "/icons/Villa.svg" },
  { slug: "semi-detached", label: "Doppelhaus - / Villenhälfte", icon: "/icons/Doppelhaus.svg" },
  { slug: "terraced", label: "Reihenmittel - / Reiheneckhaus", icon: "/icons/Reihenhaus.svg" },
  { slug: "apartment", label: "Wohnung", icon: "/icons/EW.svg" },
  { slug: "land", label: "Grundstück", icon: "/icons/Property.svg" },
]

const PRIORITY_ITEMS = [
  { slug: "price", label: "Verkaufspreis" },
  { slug: "speed", label: "Geschwindigkeit" },
  { slug: "communication", label: "Kommunikation & Informationsfluss" },
]

export default function SellerFunnel() {
  const { setAnswer, answers } = useFunnel()
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const step = Number(searchParams.get("step") ?? "0")
  const next = () => router.push(`${pathname}?step=${step + 1}`)
  const back = () => router.back()
  const [districtSearch, setDistrictSearch] = useState("")

  const filteredDistricts = MUNICH_DISTRICTS.filter((d) =>
    d.label.toLowerCase().includes(districtSearch.toLowerCase())
  )

  // Step 0–7
  const screens = [
    // Step 0: Social Proof
    <SocialProof key="social" onContinue={next} />,

    // Step 1: Q1 Priorities (Treppchen)
    <div key="q1" className="flex flex-col gap-4">
      <StepHeading
        label="Frage 1 von 5"
        title="Was ist Ihnen besonders wichtig?"
        subtitle="Sortieren Sie nach Priorität — Platz 1 ist am wichtigsten."
      />
      <Treppchen
        items={PRIORITY_ITEMS}
        onComplete={(ordered) => {
          setAnswer("priorities", ordered as SellerAnswers["priorities"])
          next()
        }}
      />
    </div>,

    // Step 2: Q2 Phase
    <div key="q2" className="flex flex-col gap-4">
      <StepHeading
        label="Frage 2 von 5"
        title="Haben Sie bereits versucht Ihre Immobilie zu verkaufen?"
      />
      <div className="flex flex-col gap-3">
        {PHASE_OPTIONS.map((o) => (
          <button
            key={o.slug}
            onClick={() => { setAnswer("phase", o.slug); next() }}
            className="flex items-center gap-3 p-4 sm:p-5 bg-white/3 hover:bg-white/8 border border-white/10 hover:border-accent rounded-2xl text-left text-white/80 hover:text-white font-medium text-sm sm:text-xl transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <span className="text-xl sm:text-2xl">{o.icon}</span>
            <span>{o.label}</span>
          </button>
        ))}
      </div>
    </div>,

    // Step 3: Q3 Partner type
    <div key="q3" className="flex flex-col gap-4">
      <StepHeading
        label="Frage 3 von 5"
        title="Der für mich ideale Verkaufspartner ist…"
        subtitle="Bitte zutreffendes auswählen"
      />
      <div className="flex flex-col gap-3">
        {PARTNER_OPTIONS.map((o) => (
          <button
            key={o.slug}
            onClick={() => { setAnswer("partnerType", o.slug); next() }}
            className="group flex items-center gap-4 p-4 sm:p-5 bg-white/3 hover:bg-white/8 border border-white/10 hover:border-accent rounded-2xl text-left transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <span className="text-3xl sm:text-4xl">{o.icon}</span>
            <div className="flex flex-col">
              <span className="block text-white/80 group-hover:text-white font-semibold text-sm sm:text-2xl">{o.label}</span>
              <span className="block text-white/40 text-xs sm:text-lg mt-0.5">{o.desc}</span>
            </div>
          </button>
        ))}
      </div>
    </div>,

    // Step 4: Q4 Object type
    <div key="q4" className="flex flex-col gap-4">
      <StepHeading
        label="Frage 4 von 5"
        title="Um welche Objekt-Art handelt es sich?"
        subtitle="Bitte zutreffendes auswählen"
      />
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {OBJECT_OPTIONS.map((o) => (
          <button
            key={o.slug}
            onClick={() => { setAnswer("objectType", o.slug); next() }}
            className="group flex flex-col items-center gap-3 p-4 bg-white/3 hover:bg-white/8 border border-white/10 hover:border-accent rounded-2xl transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Image src={o.icon} alt={o.label} width={64} height={64} className="w-14 h-14 sm:w-20 sm:h-20 shrink-0" />
            <span className="text-white/70 group-hover:text-white text-xs sm:text-2xl font-medium text-center leading-tight">{o.label}</span>
          </button>
        ))}
      </div>
    </div>,

    // Step 5: Q5 District
    <div key="q5" className="flex flex-col gap-4">
      <StepHeading
        label="Frage 5 von 5"
        title="In welchem Stadtteil befindet sich die Immobilie?"
        subtitle="Alle Stadtteile in München."
      />
      <input
        type="text"
        placeholder="Stadtteil suchen…"
        value={districtSearch}
        onChange={(e) => setDistrictSearch(e.target.value)}
        className="w-full bg-white/3 hover:bg-white/8 border border-white/10 hover:border-accent rounded-2xl text-left text-white/80 hover:text-white font-medium sm:text-xl px-4 py-3  text-sm placeholder:text-white/30 focus:outline-none focus:border-accent/50 transition-colors duration-200"
        autoFocus
      />
      <div className="flex flex-col gap-1.5 max-h-56 overflow-y-auto pr-1">
        {filteredDistricts.map((d) => (
          <button
            key={d.slug}
            onClick={() => { setAnswer("district", d.slug); next() }}
            className="p-3 sm:p-4 bg-white/3 hover:bg-white/8 border border-white/10 hover:border-accent rounded-xl text-left text-white/70 hover:text-white text-xl transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {d.label}
          </button>
        ))}
        {filteredDistricts.length === 0 && (
          <p className="text-white/30 text-lg text-center py-4">Kein Stadtteil gefunden.</p>
        )}
      </div>
    </div>,

    // Step 6: Käuferradar result
    <SellerResultScreen
      key="result"
      objectType={answers.objectType as SellerAnswers["objectType"] | undefined}
      district={answers.district as string | undefined}
      phase={answers.phase as SellerAnswers["phase"] | undefined}
      partnerType={answers.partnerType as SellerAnswers["partnerType"] | undefined}
      onCta={next}
    />,

    // Step 7: Contact form
    <FunnelContactForm key="contact" />,
  ]

  return (
    <>
      {/* Fixed background – stays in place while content scrolls */}
      <div className="fixed inset-0 z-0">
        <Image src="/backgrounds/munich.jpeg" alt="" fill className="object-cover object-center opacity-40" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
      </div>

      {/* Scrollable content layer */}
      <div className="relative z-10 flex-1 min-w-0 flex flex-col items-center px-4 py-8 sm:py-12 min-h-screen">
        <div className="w-full max-w-xl md:max-w-4xl flex flex-col gap-6 my-auto">
          <div className="flex items-center justify-between">
            <Image src="/logo/key_white.svg" alt="Clasen" width={100} height={34} priority />
            <button
              onClick={back}
              className="text-white/30 hover:text-white text-sm transition-colors duration-200 cursor-pointer"
            >
              ← Zurück
            </button>
          </div>

          <div>{screens[step]}</div>

          {step > 0 && (
            <div className="h-px bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-500"
                style={{ width: `${(step / (TOTAL_STEPS - 1)) * 100}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function StepHeading({
  label,
  title,
  subtitle,
}: {
  label: string
  title: string
  subtitle?: string
}) {
  return (
    <div className="flex flex-col gap-3 mb-2">
      <p className="text-accent text-lg uppercase tracking-widest font-semibold">{label}</p>
      <h2 className="text-3xl sm:text-4xl font-bold tracking-wide text-foreground leading-snug">{title}</h2>
      {subtitle && <p className="text-accent/70 text-base sm:text-lg">{subtitle}</p>}
    </div>
  )
}
