'use client'

import { useRef } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import Image from "next/image"
import { Lock, Sparkles, Target } from "lucide-react"
import { useFunnel } from "@/components/funnel/FunnelProvider"
import type { InvestorAnswers } from "@/components/funnel/FunnelProvider"
import SocialProof from "@/components/funnel/SocialProof"
import Treppchen from "@/components/funnel/Treppchen"
import EigenkapitalSlider from "@/components/funnel/EigenkapitalSlider"
import InvestorResultScreen from "@/components/funnel/InvestorResultScreen"
import FunnelContactForm from "@/components/funnel/FunnelContactForm"
import { useFunnelCompletion } from "@/components/funnel/useFunnelCompletion"
import Lottie, { type LottieRefCurrentProps } from "lottie-react"


import bestandshalter from "@/public/animations/bestandshalter.json"
import optimierer from "@/public/animations/optimierer.json"
import portfoliodenker from "@/public/animations/portfolio.json"
import offMarket from "@/public/animations/off-market.json"
import questions from "@/public/animations/questions.json"
import ki from "@/public/animations/ki.json"


const TOTAL_STEPS = 7


const PRIORITY_ITEMS = [
  { slug: "return", label: "Rendite" },
  { slug: "tax-benefit", label: "Steuervorteil" },
  { slug: "stability", label: "Wertstabilität" },
]

const INVESTOR_TYPES: Array<{
  slug: InvestorAnswers["investorType"]
  name: string
  quote: string
  animation: object
}> = [
    {
      slug: "bestandshalter",
      name: "Der Bestandshalter",
      quote: '„Ich kaufe einmal und halte langfristig. Sicherheit vor Schnelligkeit."',
      animation: bestandshalter,
    },
    {
      slug: "optimierer",
      name: "Der Optimierer",
      quote: '„Ich will das Maximum aus meinem Kapital herausholen \n– clever und steuereffizient."',
      animation: optimierer,
    },
    {
      slug: "portfoliodenker",
      name: "Der Portfoliodenker",
      quote: '„Immobilien sind ein Baustein von mehreren. Ich denke in Gesamtstrategien."',
      animation: portfoliodenker,
    },
  ]



function InvestorTypeCard({
  slug, name, quote, animation, style, onClick,
}: {
  slug: string
  name: string
  quote: string
  animation: object
  style?: React.CSSProperties
  onClick: () => void
}) {
  const lottieRef = useRef<any>(null)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => lottieRef.current?.goToAndPlay(0, true)}
      onMouseLeave={() => lottieRef.current?.goToAndStop(0, true)}
      className="group flex flex-row sm:flex-col items-center gap-4 sm:gap-3 p-3 sm:p-5 bg-white/3 hover:bg-white/8 border border-white/10 hover:border-accent rounded-2xl text-left sm:text-center transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      style={style}
    >
      <Lottie lottieRef={lottieRef} animationData={animation} autoplay={true} loop={false} className="w-16 h-16 sm:w-28 sm:h-28 shrink-0" />
      <div className="flex flex-col gap-1 sm:gap-2">
        <span className="text-white font-bold text-lg sm:text-2xl group-hover:text-accent transition-colors duration-200 leading-snug">
          {name}
        </span>
        <span className="text-white/70 text-base sm:text-lg leading-relaxed italic whitespace-pre-wrap">
          {quote}
        </span>
      </div>
    </button>
  )
}

function TeaserFeatureCard({
  animation, label, sub, style,
}: {
  animation: object
  label: string
  sub: React.ReactNode
  style?: React.CSSProperties
}) {
  const lottieRef = useRef<LottieRefCurrentProps | null>(null)

  return (
    <div
      onClick={() => lottieRef.current?.goToAndPlay(0, true)}
      className="flex flex-row sm:flex-col items-center px-4 py-4 sm:py-5 bg-white/5 border border-white/10 rounded-2xl sm:text-center gap-4 sm:gap-6 cursor-pointer"
      style={style}
    >
      <Lottie lottieRef={lottieRef} animationData={animation} loop={false} className="w-16 h-16 sm:w-28 sm:h-28 shrink-0" />
      <div className="flex flex-col gap-1 sm:gap-2">
        <p className="text-white font-semibold text-xl">{label}</p>
        <p className="text-white/70 text-base sm:text-lg">{sub}</p>
      </div>
    </div>
  )
}

function StepHeading({ label, title, subtitle }: { label: string; title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col gap-3 mb-2">
      <p className="text-accent text-lg uppercase tracking-widest font-semibold">{label}</p>
      <h2 className="text-3xl sm:text-4xl font-bold tracking-wide text-foreground leading-snug">{title}</h2>
      {subtitle && <p className="text-accent/70 text-base sm:text-lg">{subtitle}</p>}
    </div>
  )
}

export default function InvestorFunnel() {
  const { setAnswer, answers } = useFunnel()
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const step = Number(searchParams.get("step") ?? "0")
  const next = () => router.push(`${pathname}?step=${step + 1}`)
  const { back, markSubmitted, submitted } = useFunnelCompletion(TOTAL_STEPS - 1)

  const investorType = answers.investorType as InvestorAnswers["investorType"] | undefined

  const screens = [
    // Step 0: Social Proof
    <SocialProof key="social" onContinue={next} />,

    // Step 1: Dealkompass Teaser
    <div key="teaser" className="flex flex-col gap-8" style={{ animation: "fadeSlideIn 0.5s ease both" }}>
      <div className="flex flex-col gap-3" style={{ animation: "fadeInUp 0.4s ease 0.05s both" }}>
        <p className="text-accent text-lg uppercase tracking-widest font-semibold">Ihr exklusiver Zugang</p>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-wide text-foreground leading-snug">
          CLASEN Deal-&shy;Kompass<sup style={{ verticalAlign: "super", fontSize: "0.3em" }}>TM</sup>
        </h2>
        <p className="text-white/60 text-base sm:text-lg leading-relaxed">
          KI-gestütztes Objekt-Matching filtert für Sie exklusive Off-Market
          Angebote heraus, die präzise zu Ihrem Investitionsprofil passen — und nur diese.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" style={{ animation: "fadeInUp 0.4s ease 0.2s both" }}>
        {[
          { animation: offMarket, label: "Off-Market Portfolio", sub: "Garantiert nie gelistete Premium-Assets" },
          { animation: ki, label: "KI basiertes Matching", sub: <span>Laserscharfe Erfassung Ihres Bedarfs - patentiertes Model <strong>CLAvis<sup style={{ verticalAlign: "super", fontSize: "0.4em" }}>TM</sup> 3.0</strong></span> },
          { animation: questions, label: "Nur 3 gezielte Fragen", sub: "trennen Sie von Ihrem Investment" },
        ].map((f, i) => (
          <TeaserFeatureCard
            key={f.label}
            animation={f.animation}
            label={f.label}
            sub={f.sub}
            style={{ animation: `fadeInUp 0.4s ease ${0.25 + i * 0.1}s both` }}
          />
        ))}
      </div>

      <button
        onClick={next}
        className="w-full py-5 rounded-2xl bg-accent uppercase text-white font-bold tracking-wide text-lg hover:bg-accent/90 active:scale-[0.98] transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent shadow-lg shadow-accent/20"
        style={{ animation: "fadeInUp 0.4s ease 0.55s both" }}
      >
        Dealkompass starten →
      </button>

      <style>{`
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>,

    // Step 2: Q1 Priorities (Treppchen)
    <div key="q1" className="flex flex-col gap-4">
      <StepHeading
        label="Frage 1 von 3"
        title="Was ist Ihnen besonders wichtig?"
        subtitle="Bitte gewichten Sie nach Ihrer Priorität — Platz 1 ist am wichtigsten."
      />
      <Treppchen
        items={PRIORITY_ITEMS}
        onComplete={(ordered) => {
          setAnswer("priorities", ordered)
          next()
        }}
      />
    </div>,

    // Step 3: Q2 Eigenkapital
    <div key="q2" className="flex flex-col gap-4">
      <StepHeading
        label="Frage 2 von 3"
        title="Ihr geplanter Eigenkapitaleinsatz?"
        subtitle="Bitte wählen Sie den entsprechenden Bereich aus."
      />
      <EigenkapitalSlider
        onComplete={(equity) => {
          setAnswer("equity", equity)
          next()
        }}
      />
    </div>,

    // Step 4: Q3 Investor Type
    <div key="type" className="flex flex-col gap-6" style={{ animation: "fadeSlideIn 0.5s ease both" }}>
      <div style={{ animation: "fadeInUp 0.4s ease 0.05s both" }}>
        <p className="text-accent text-lg uppercase tracking-widest font-semibold mb-3">Frage 3 von 3</p>
        <div className="flex flex-col gap-3 mb-2">

          <h2 className="text-3xl sm:text-4xl font-bold tracking-wide text-foreground leading-snug">
            Welcher Investorentyp sind Sie?
          </h2>
          <p className="text-accent/70 text-base sm:text-lg">
            Bitte wählen Sie den Archetyp, der am besten zu Ihnen passt.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {INVESTOR_TYPES.map((t, i) => (
          <InvestorTypeCard
            key={t.slug}
            slug={t.slug}
            name={t.name}
            quote={t.quote}
            animation={t.animation}
            style={{ animation: `fadeInUp 0.4s ease ${0.15 + i * 0.1}s both` }}
            onClick={() => { setAnswer("investorType", t.slug); next() }}
          />
        ))}
      </div>
      <style>{`
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>,

    // Step 5: Dealkompass result
    <InvestorResultScreen
      key="result"
      investorType={investorType}
      priorities={answers.priorities as InvestorAnswers["priorities"] | undefined}
      equity={answers.equity as InvestorAnswers["equity"] | undefined}
      onCta={next}
    />,

    // Step 6: Contact form
    <FunnelContactForm key="contact" onSubmitted={markSubmitted} />,
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
        <div className="w-full max-w-xl md:max-w-4xl flex flex-col my-auto">
          <div className="flex items-center justify-between mb-8 sm:mb-15">
            <Image src="/logo/key_white.svg" alt="Clasen" width={100} height={34} priority />
            {!submitted && (
              <button
                onClick={back}
                className="text-white/30 hover:text-white text-sm transition-colors duration-200 cursor-pointer"
              >
                ← Zurück
              </button>
            )}
          </div>

          <div>{screens[step]}</div>

          {step > 0 && (
            <div className="h-px bg-white/10 rounded-full overflow-hidden mt-8">
              <div
                className="h-full bg-accent rounded-full transition-all duration-500"
                style={{ width: `${Math.max(25, (step / (TOTAL_STEPS - 1)) * 100)}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
