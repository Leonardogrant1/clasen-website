'use client'

import { useState } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import Image from "next/image"
import Lottie from "lottie-react"
import { useFunnel } from "@/components/funnel/FunnelProvider"
import type { OwnerAnswers } from "@/components/funnel/FunnelProvider"
import SocialProof from "@/components/funnel/SocialProof"
import OwnerResultScreen from "@/components/funnel/OwnerResultScreen"
import FunnelContactForm from "@/components/funnel/FunnelContactForm"
import SqmSlider from "@/components/funnel/SqmSlider"
import { MUNICH_DISTRICTS } from "@/lib/munich-districts"

import home from "@/public/animations/home.json"
import ki from "@/public/animations/ki.json"
import questions from "@/public/animations/questions.json"

const TOTAL_STEPS = 10

const LIFE_PHASES: Array<{ slug: OwnerAnswers["lifePhase"]; label: string; icon: string }> = [
  { slug: "need-more-space", label: "Wir vergrößern uns", icon: "/icons/Mehr.svg" },
  { slug: "need-less-space", label: "Wir wollen uns verkleinern", icon: "/icons/Weniger.svg" },
  { slug: "new-chapter", label: "Ein neues Kapitel beginnt", icon: "/icons/Kapitel.svg" },
  { slug: "settling-down", label: "Wir suchen zusätzliche Wohnsitze", icon: "/icons/Zusätzlich.svg" },
]

const OBJECT_OPTIONS: Array<{ slug: OwnerAnswers["objectType"][number]; label: string; icon: string }> = [
  { slug: "land", label: "Grundstück", icon: "/icons/Property.svg" },
  { slug: "villa", label: "Villa / Einfamilienhaus", icon: "/icons/Villa.svg" },
  { slug: "semi-detached", label: "Doppelhaus - / Villenhälfte", icon: "/icons/Doppelhaus.svg" },
  { slug: "corner-terraced", label: "Reiheneck - / Reihenmittelhaus", icon: "/icons/Reiheneckhaus.svg" },
  { slug: "apartment", label: "Wohnung", icon: "/icons/EW.svg" },
  { slug: "special", label: "Besonderes", icon: "/icons/Besonders.svg" },
]

const SOFT_SKILL_AXES = [
  { left: "Stille & Rückzug", right: "Lebendigkeit & Nähe" },
  { left: "Zu Fuß erreichbar", right: "Mit dem Auto da" },
  { left: "Altbau-Seele", right: "Klarer Neubau" },
  { left: "Nachbarschaft", right: "Privatsphäre" },
  { left: "Grün & Natur", right: "Stadt & Puls" },
]

const OWNER_TYPES: Record<OwnerAnswers["ownerType"], { name: string; tagline: string; description: string; accent: string }> = {
  ankommer: {
    name: "Der Ankommer",
    tagline: '„Ich will endlich irgendwo wirklich zu Hause sein."',
    description: "Geborgenheit vor allem anderen. Ein Ort, der sich sofort richtig anfühlt — ruhig, warm, und wirklich Ihres.",
    accent: "🏡",
  },
  gestalter: {
    name: "Der Gestalter",
    tagline: '„Mein Zuhause soll mich widerspiegeln."',
    description: "Stil, Charakter und Haltung. Sie suchen kein Haus — Sie suchen eine Bühne für Ihren Lebensstil.",
    accent: "🪄",
  },
  vorausdenker: {
    name: "Der Vorausdenker",
    tagline: '„Ich kaufe für heute und für morgen."',
    description: "Familie, Wachstum, die nächste Lebensphase. Klug investiert, nachhaltig gedacht.",
    accent: "🧠",
  },
}

function calcOwnerType(values: number[]): OwnerAnswers["ownerType"] {
  const [stille, auto, neubau, privat, stadt] = values
  // Ankommer: quiet, walkable, community, nature
  const ankommerScore = (4 - stille) + (4 - auto) + (4 - privat) + (4 - stadt)
  // Gestalter: lively, Altbau, urban
  const gestalterScore = stille + (4 - neubau) + stadt
  // Vorausdenker: car, Neubau, privacy
  const vorausdenkerScore = auto + neubau + privat

  const ankommerN = ankommerScore / 16
  const gestalterN = gestalterScore / 12
  const vorausdenkerN = vorausdenkerScore / 12

  if (ankommerN >= gestalterN && ankommerN >= vorausdenkerN) return "ankommer"
  if (gestalterN >= ankommerN && gestalterN >= vorausdenkerN) return "gestalter"
  return "vorausdenker"
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StepHeading({ label, title, subtitle }: { label: string; title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col gap-3 mb-2">
      <p className="text-accent text-lg uppercase tracking-widest font-semibold">{label}</p>
      <h2 className="text-3xl sm:text-4xl font-bold tracking-wide text-foreground leading-snug">{title}</h2>
      {subtitle && <p className="text-accent/70 text-base sm:text-lg">{subtitle}</p>}
    </div>
  )
}

const SLIDER_CLASS =
  "w-full h-6 bg-transparent appearance-none cursor-pointer focus:outline-none " +
  "[&::-webkit-slider-runnable-track]:bg-white/10 [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full " +
  "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 " +
  "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:mt-[-8px] " +
  "[&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-150 " +
  "hover:[&::-webkit-slider-thumb]:scale-110 active:[&::-webkit-slider-thumb]:scale-95 " +
  "[&::-moz-range-track]:bg-white/10 [&::-moz-range-track]:h-2 [&::-moz-range-track]:rounded-full " +
  "[&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full " +
  "[&::-moz-range-thumb]:bg-accent [&::-moz-range-thumb]:border-0 " +
  "[&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:duration-150 " +
  "hover:[&::-moz-range-thumb]:scale-110 active:[&::-moz-range-thumb]:scale-95"

function SoftSkillsStep({ onComplete }: { onComplete: (values: number[]) => void }) {
  const [values, setValues] = useState([2, 2, 2, 2, 2])

  const setValue = (i: number, v: number) =>
    setValues(prev => { const next = [...prev]; next[i] = v; return next })

  return (
    <div className="flex flex-col gap-6">
      <StepHeading
        label="Frage 4 von 5"
        title="Wie wir Menschen, hat jede Immobilie Soft Skills."
        subtitle="Bitte passen Sie die folgenden Schieberegler Ihrer Präferenz nach an."
      />

      <div className="flex flex-col gap-7">
        {SOFT_SKILL_AXES.map((axis, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="flex justify-between gap-4">
              <span className={`text-sm sm:text-base font-medium transition-colors duration-200 ${values[i] < 2 ? "text-accent" : "text-white/35"}`}>
                {axis.left}
              </span>
              <span className={`text-sm sm:text-base font-medium transition-colors duration-200 text-right ${values[i] > 2 ? "text-accent" : "text-white/35"}`}>
                {axis.right}
              </span>
            </div>
            <div className="relative px-2">
              {/* center marker */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-3 bg-white/20 pointer-events-none" />
              <input
                type="range"
                min={0}
                max={4}
                step={1}
                value={values[i]}
                onChange={e => setValue(i, Number(e.target.value))}
                className={SLIDER_CLASS}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => onComplete(values)}
        className="w-full uppercase py-4 rounded-2xl bg-accent text-background font-bold tracking-wide text-base hover:bg-accent/90 transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        Auswertung ansehen →
      </button>
    </div>
  )
}

function OwnerTypeReveal({
  ownerType,
  onContinue,
}: {
  ownerType: OwnerAnswers["ownerType"]
  onContinue: () => void
}) {
  const t = OWNER_TYPES[ownerType]

  return (
    <div className="flex flex-col gap-6" style={{ animation: "fadeSlideIn 0.5s ease both" }}>
      <div className="flex flex-col gap-2" style={{ animation: "fadeInUp 0.4s ease 0.1s both" }}>
        <p className="text-accent text-lg uppercase tracking-widest font-semibold">Ihre Auswertung</p>
        <h2 className="text-3xl sm:text-5xl font-bold tracking-wide text-foreground leading-snug">
          Sie sind…
        </h2>
      </div>

      <div
        className="flex flex-col gap-5 p-7 bg-white/5 border border-accent/30 rounded-3xl"
        style={{ animation: "fadeInUp 0.4s ease 0.25s both" }}
      >
        <span className="text-4xl">{t.accent}</span>
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl sm:text-4xl font-bold text-foreground">{t.name}</h3>
          <p className="text-accent text-base sm:text-xl italic leading-relaxed">{t.tagline}</p>
        </div>
        <p className="text-white/60 text-sm sm:text-lg leading-relaxed">{t.description}</p>
      </div>

      {/* Other types – dimmed */}
      <div
        className="flex flex-col gap-2 opacity-30"
        style={{ animation: "fadeInUp 0.4s ease 0.4s both" }}
      >
        {(Object.entries(OWNER_TYPES) as [OwnerAnswers["ownerType"], typeof OWNER_TYPES[keyof typeof OWNER_TYPES]][])
          .filter(([key]) => key !== ownerType)
          .map(([key, val]) => (
            <div key={key} className="flex items-center gap-3 px-4 py-3 bg-white/3 border border-white/10 rounded-xl">
              <span className="text-xl">{val.accent}</span>
              <span className="text-white/50 text-sm sm:text-base">{val.name}</span>
            </div>
          ))}
      </div>

      <button
        onClick={onContinue}
        className="w-full uppercase py-4 rounded-2xl bg-accent text-background font-bold tracking-wide text-base hover:bg-accent/90 transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        style={{ animation: "fadeInUp 0.4s ease 0.55s both" }}
      >
        Matching-Prozess starten →
      </button>

      <style>{`
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function OwnerFunnel() {
  const { setAnswer, answers } = useFunnel()
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const step = Number(searchParams.get("step") ?? "0")
  const next = () => router.push(`${pathname}?step=${step + 1}`)
  const back = () => router.back()

  const [districtSearch, setDistrictSearch] = useState("")
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([])
  const [selectedObjectTypes, setSelectedObjectTypes] = useState<string[]>([])
  const [selectedSqm, setSelectedSqm] = useState<OwnerAnswers["sqm"]>("80-120")
  const [computedType, setComputedType] = useState<OwnerAnswers["ownerType"]>("ankommer")

  const toggleObjectType = (slug: string) =>
    setSelectedObjectTypes(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    )

  const toggleDistrict = (slug: string) =>
    setSelectedDistricts(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    )

  const filteredDistricts = MUNICH_DISTRICTS.filter(d =>
    d.label.toLowerCase().includes(districtSearch.toLowerCase())
  )

  const screens = [
    // Step 0: Social Proof
    <SocialProof key="social" onContinue={next} />,

    // Step 1: Traumhaus-Finder Teaser
    <div key="teaser" className="flex flex-col gap-8" style={{ animation: "fadeSlideIn 0.5s ease both" }}>
      <div className="flex flex-col gap-3" style={{ animation: "fadeInUp 0.4s ease 0.05s both" }}>
        <p className="text-accent text-lg uppercase tracking-widest font-semibold">Ihr exklusiver Zugang</p>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-wide text-foreground leading-snug">
          Ihr CLASEN Traumwohnungs-&shy;Finder<sup style={{ verticalAlign: "super", fontSize: "0.3em" }}>TM</sup>
        </h2>
        <p className="text-white/60 text-base sm:text-lg leading-relaxed">
          KI-gestütztes Objekt-Matching filtert für Sie exklusive Off-Market-Angebote heraus, die präzise zu Ihren Wünschen passen — und nur diese.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" style={{ animation: "fadeInUp 0.4s ease 0.2s both" }}>
        {[
          { animation: home, label: "Echte Isar-Expertise", sub: "Exklusiver Zugang zu nie inserierten Objekten" },
          { animation: ki, label: "KI-basiertes Matching", sub: <span>Laserscharfe Erfassung Ihrer Wünsche — patentiertes KI-Modell <strong>CLAvis<sup style={{ verticalAlign: "super", fontSize: "0.4em" }}>TM</sup> 3.0</strong></span> },
          { animation: questions, label: "Nur 5 gezielte Fragen", sub: "trennen Sie noch von Ihrem Traumzuhause" },
        ].map((f, i) => (
          <div
            key={f.label}
            className="flex flex-row sm:flex-col items-center px-4 py-4 sm:py-5 bg-white/5 border border-white/10 rounded-2xl sm:text-center gap-4 sm:gap-6"
            style={{ animation: `fadeInUp 0.4s ease ${0.25 + i * 0.1}s both` }}
          >
            <Lottie animationData={f.animation} loop={false} className="w-16 h-16 sm:w-28 sm:h-28 shrink-0" />
            <div className="flex flex-col gap-1 sm:gap-2">
              <p className="text-white font-semibold text-sm sm:text-xl">{f.label}</p>
              <p className="text-white/70 text-xs sm:text-lg">{f.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={next}
        className="w-full py-5 rounded-2xl bg-accent uppercase text-white font-bold tracking-wide text-lg hover:bg-accent/90 active:scale-[0.98] transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent shadow-lg shadow-accent/20"
        style={{ animation: "fadeInUp 0.4s ease 0.55s both" }}
      >
        Traumhaus-Finder starten →
      </button>

      <style>{`
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>,

    // Step 2: Q1 – Lebensabschnitt
    <div key="q1" className="flex flex-col gap-4">
      <StepHeading label="Frage 1 von 5" title="In welcher Lebensphase befinden Sie sich?" subtitle="Bitte wählen Sie was am ehesten auf Sie zutrifft" />
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {LIFE_PHASES.map(p => (
          <button
            key={p.slug}
            onClick={() => { setAnswer("lifePhase", p.slug); next() }}
            className="group flex flex-col items-center gap-3 p-4 bg-white/3 hover:bg-white/8 border border-white/10 hover:border-accent rounded-2xl text-center transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Image src={p.icon} alt={p.label} width={70} height={70} className="w-14 h-14 sm:w-27 sm:h-27 scale-125 shrink-0" />
            <span className="text-white/80 group-hover:text-white font-semibold text-sm sm:text-2xl leading-tight">{p.label}</span>
          </button>
        ))}
      </div>
    </div>,

    // Step 3: Q2 – Objektart
    <div key="q2" className="flex flex-col gap-6">
      <StepHeading label="Frage 2 von 5" title="Welche Objektarten kommen für Sie in Frage?" subtitle="Mehrfachauswahl möglich" />

      {/* Object type selection */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {OBJECT_OPTIONS.map(o => {
          const selected = selectedObjectTypes.includes(o.slug)
          return (
            <button
              key={o.slug}
              onClick={() => toggleObjectType(o.slug)}
              className={`group flex flex-col items-center gap-3 p-4 border rounded-2xl transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${selected
                ? "bg-accent/10 border-accent"
                : "bg-white/3 hover:bg-white/8 border-white/10 hover:border-accent"
                }`}
            >
              <Image src={o.icon} alt={o.label} width={70} height={70} className="w-14 h-14 sm:w-27 sm:h-27 scale-125 shrink-0" />
              <span className={`text-xs sm:text-2xl font-medium text-center leading-tight ${selected ? "text-white" : "text-white/70 group-hover:text-white"}`}>
                {o.label}
              </span>
            </button>
          )
        })}
      </div>

      <button
        onClick={() => {
          setAnswer("objectType", selectedObjectTypes as OwnerAnswers["objectType"])
          next()
        }}
        disabled={selectedObjectTypes.length === 0}
        className="w-full uppercase py-4 rounded-2xl bg-accent text-background font-bold tracking-wide text-base hover:bg-accent/90 transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {selectedObjectTypes.length === 0 ? "Objektart wählen" : `${selectedObjectTypes.length} Auswahl bestätigen →`}
      </button>
    </div>,

    // Step 4: Q3 – Wohnfläche
    <div key="q3" className="flex flex-col gap-6">
      <StepHeading label="Frage 3 von 5" title="Wie groß soll Ihr neues Zuhause sein?" subtitle="Gewünschte Wohnfläche" />

      <div className="pt-4">
        <SqmSlider onComplete={sqm => {
          setSelectedSqm(sqm)
          setAnswer("sqm", sqm)
          next()
        }} />
      </div>
    </div>,

    // Step 5: Q4 – Lage / Stadtteile
    <div key="q4" className="flex flex-col gap-4">
      <StepHeading
        label="Frage 4 von 5"
        title="Welche Lagen kommen für Sie in Frage?"
        subtitle="Auswahl mehrerer Gebiete möglich"
      />
      {/* Selected chips */}
      {selectedDistricts.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedDistricts.map(slug => {
            const label = MUNICH_DISTRICTS.find(d => d.slug === slug)?.label ?? slug
            return (
              <button
                key={slug}
                onClick={() => toggleDistrict(slug)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 border border-accent/40 rounded-full text-accent text-lg font-semibold transition-colors duration-200 hover:bg-accent/20 cursor-pointer"
              >
                {label}
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )
          })}
        </div>
      )}

      <input
        type="text"
        placeholder="Stadtteil suchen…"
        value={districtSearch}
        onChange={e => setDistrictSearch(e.target.value)}
        className="w-full bg-white/3 hover:bg-white/8 border border-white/10 hover:border-accent rounded-2xl text-left text-white/80 hover:text-white font-medium sm:text-xl px-4 py-3 text-sm placeholder:text-white/30 focus:outline-none focus:border-accent/50 transition-colors duration-200"
        autoFocus
      />
      <div className="flex flex-col gap-1.5 max-h-52 overflow-y-auto pr-1">
        {filteredDistricts.map(d => {
          const selected = selectedDistricts.includes(d.slug)
          return (
            <button
              key={d.slug}
              onClick={() => toggleDistrict(d.slug)}
              className={`flex items-center justify-between p-3 sm:p-4 border rounded-xl text-left text-xl transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${selected
                ? "bg-accent/10 border-accent text-white"
                : "bg-white/3 hover:bg-white/8 border-white/10 hover:border-accent text-white/70 hover:text-white"
                }`}
            >
              <span>{d.label}</span>
              {selected && (
                <svg className="w-4 h-4 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          )
        })}
        {filteredDistricts.length === 0 && (
          <p className="text-white/30 text-sm text-center py-4">Kein Stadtteil gefunden.</p>
        )}
      </div>
      <button
        onClick={() => { setAnswer("districts", selectedDistricts); next() }}
        disabled={selectedDistricts.length === 0}
        className="w-full uppercase py-4 rounded-2xl bg-accent text-background font-bold tracking-wide text-base hover:bg-accent/90 transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Gebietsauswahl bestätigen →
      </button>
    </div>,

    // Step 6: Q5 – Soft Skills (Duell-Karten)
    <SoftSkillsStep
      key="q5"
      onComplete={values => {
        const type = calcOwnerType(values)
        setComputedType(type)
        setAnswer("softSkills", values)
        setAnswer("ownerType", type)
        next()
      }}
    />,

    // Step 7: Selbstnutzer-Typ Reveal
    <OwnerTypeReveal
      key="q5"
      ownerType={computedType}
      onContinue={next}
    />,

    // Step 7: Result
    <OwnerResultScreen
      key="result"
      objectType={answers.objectType as OwnerAnswers["objectType"] | undefined}
      districts={answers.districts as string[] | undefined}
      sqm={answers.sqm as OwnerAnswers["sqm"] | undefined}
      ownerType={answers.ownerType as OwnerAnswers["ownerType"] | undefined}
      onCta={next}
    />,

    // Step 8: Contact form
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
      <div className="relative z-10 flex-1 min-w-0 flex flex-col items-center px-4 py-8 sm:py-12 min-h-screen overflow-x-hidden">
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
