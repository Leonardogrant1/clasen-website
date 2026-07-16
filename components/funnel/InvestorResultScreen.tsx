'use client'

import { useState } from "react"
import Image from "next/image"
import type { InvestorAnswers } from "@/components/funnel/FunnelProvider"
import FunnelLoader from "@/components/funnel/FunnelLoader"
import useCountUp from "@/components/funnel/useCountUp"
import { getStableCount, getStableImages, getStableScores } from "@/lib/stable-count"

const LABEL_BY_TYPE: Record<string, string> = {
  bestandshalter: "Bestandshalter",
  optimierer: "Optimierer",
  portfoliodenker: "Portfoliodenker",
}

const METRIC_BY_TYPE: Record<string, string> = {
  bestandshalter: "Eine der Liegenschaften ist seit über 12 Jahren vollvermietet.",
  optimierer: "Eines davon weist eine Nettomietrendite von über 5,2 % aus.",
  portfoliodenker: "Eines davon liegt in einem Wachstumskorridor mit überdurchschnittlicher Preisentwicklung.",
}

const TOP_MATCH_DETAIL_BY_TYPE: Record<string, string> = {
  bestandshalter: "Vollvermietet seit 12+ Jahren · ••••••••",
  optimierer: "5,2 % Nettomietrendite · ••••••••",
  portfoliodenker: "Wachstumskorridor · ••••••••",
}

const TOP_MATCH_DETAIL_DEFAULT = "Off-Market · geprüfte Unterlagen · ••••••"

const EQUITY_LABELS: Record<string, string> = {
  "under-50k": "unter 50.000 €",
  "50k-100k": "50.000 – 100.000 €",
  "100k-250k": "100.000 – 250.000 €",
  "over-250k": "über 250.000 €",
}

const PRIORITY_LABELS: Record<string, string> = {
  return: "Rendite",
  "tax-benefit": "Steuervorteil",
  stability: "Wertstabilität",
}

const TEASER_MASKS = ["•••••••••••", "•••••••••", "••••••••••••", "••••••••", "••••••••••", "•••••••••"]

type InvestorResultScreenProps = {
  investorType: InvestorAnswers["investorType"] | undefined
  priorities: InvestorAnswers["priorities"] | undefined
  equity: InvestorAnswers["equity"] | undefined
  onCta: () => void
}

export default function InvestorResultScreen({ investorType, priorities, equity, onCta }: InvestorResultScreenProps) {
  const answersKey = { investorType: investorType ?? null, priorities: priorities ?? null, equity: equity ?? null }
  const count = getStableCount(answersKey, 2, 9)
  const matchScores = getStableScores(answersKey, TEASER_MASKS.length)
  const images = getStableImages(answersKey)
  const typeLabel = investorType ? (LABEL_BY_TYPE[investorType] ?? investorType) : null
  const metric = investorType ? METRIC_BY_TYPE[investorType] : null
  const topMatchDetail = (investorType && TOP_MATCH_DETAIL_BY_TYPE[investorType]) || TOP_MATCH_DETAIL_DEFAULT
  const equityLabel = equity ? (EQUITY_LABELS[equity] ?? equity) : null
  const topPriority = priorities?.[0] ? (PRIORITY_LABELS[priorities[0]] ?? priorities[0]) : null

  const [loading, setLoading] = useState(true)
  const displayCount = useCountUp(count, { delay: 600, duration: 1100, enabled: !loading })

  if (loading) {
    return <FunnelLoader count={count} label="Deal-Kompass" noun="Objekte" onComplete={() => setLoading(false)} />
  }

  return (
    <div className="flex flex-col gap-8" style={{ animation: "fadeSlideIn 0.5s ease both" }}>
      {/* Heading */}
      <div className="flex flex-col gap-3" style={{ animation: "fadeInUp 0.4s ease 0.05s both" }}>
        <p className="text-accent text-lg uppercase tracking-widest font-semibold">Dealkompass</p>
        <h2 className="text-xl sm:text-4xl font-bold text-foreground leading-snug">
          Ihr Dealkompass hat angeschlagen.
        </h2>
        {typeLabel && (
          <p className="text-white/60 text-sm sm:text-base leading-relaxed">
            Als{" "}
            <span className="text-white font-semibold">{typeLabel}</span>
            {equityLabel && (
              <> mit einem Eigenkapital von <span className="text-white font-semibold">{equityLabel}</span></>
            )}
            {topPriority && (
              <> und klarem Fokus auf <span className="text-white font-semibold">{topPriority}</span></>
            )}{" "}
            hat unser patentierter KI Agent <strong className="text-white">CLAvis<sup style={{ verticalAlign: "super", fontSize: "0.4em" }}>TM</sup></strong> insgesamt
            <strong className="text-accent">{" "}
              <span key={displayCount} className="inline-block tabular-nums" style={{ animation: "tickPop 0.25s ease" }}>{displayCount}</span>{" "}
              {displayCount === 1 ? "Objekt" : "Objekte"}
            </strong>{" "}
            aus unserem exklusiven OffMarket-Pool für Sie priorisiert.
          </p>
        )}
        {metric && (
          <p className="text-accent/80 text-sm sm:text-base italic border-l-2 border-accent/30 pl-3" style={{ animation: "fadeInUp 0.4s ease 1.7s both" }}>
            {metric}
          </p>
        )}
        <p className="text-white/50 text-sm sm:text-base leading-relaxed" style={{ animation: "fadeInUp 0.4s ease 1.9s both" }}>
          Off-Market heißt: Diese Objekte sehen Sie auf keinem Portal — und die besten davon sind erfahrungsgemäß zuerst vergeben.
        </p>
      </div>

      {/* Teaser grid — all locked */}
      <div className="grid grid-cols-2 gap-3">
        {(() => {
          const shownPreviews = Math.min(count, 3)
          const hiddenCount = count - shownPreviews
          const showPlusTile = hiddenCount > 0
          const totalTiles = shownPreviews + (showPlusTile ? 1 : 0)
          const teasersToShow = TEASER_MASKS.slice(0, totalTiles)
          return teasersToShow.map((mask, i) => {
            const isPlusTile = showPlusTile && i === teasersToShow.length - 1
            const isTopMatch = i === 0 && !isPlusTile
            return (
              <div
                key={i}
                className={`relative rounded-2xl overflow-hidden flex flex-col select-none pointer-events-none border ${isTopMatch ? "border-accent/40" : "border-white/10"}`}
                style={{ animation: `fadeInUp 0.4s ease-out ${2.0 + i * 0.12}s both` }}
              >
                {/* Blurred image */}
                <div className="relative h-28 sm:h-32 w-full">
                  <Image src={images[i]} alt="" fill className="object-cover blur-md scale-110" />
                  <div className="absolute inset-0 bg-black/40" />
                  {!isPlusTile && (
                    isTopMatch ? (
                      <span
                        className="absolute top-2 left-2 bg-accent text-background text-[11px] font-bold px-2.5 py-1 rounded-full"
                        style={{ animation: "badgePulse 2.4s ease-in-out 2.6s infinite both" }}
                      >
                        {matchScores[i]} % Match
                      </span>
                    ) : (
                      <span className="absolute top-2 left-2 bg-black/50 text-white/80 text-[11px] font-semibold px-2.5 py-1 rounded-full">
                        {matchScores[i]} % Match
                      </span>
                    )
                  )}
                </div>

                {/* Partially revealed info */}
                <div className="flex flex-col gap-0.5 p-3 bg-white/[0.04]">
                  <span className="text-white/60 text-xs font-semibold truncate">
                    {isTopMatch ? <span className="text-accent">Ihr Top-Match</span> : mask}
                  </span>
                  <span className={`truncate ${isTopMatch ? "text-accent/70 text-[10px]" : "text-white/30 text-[10px]"}`}>
                    {isTopMatch ? topMatchDetail : "•".repeat(10)}
                  </span>
                </div>

                {/* Lock overlay */}
                {isPlusTile ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <span className="text-white text-2xl font-bold">+{hiddenCount}</span>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                )}
              </div>
            )
          })
        })()}
      </div>

      <div className="flex flex-col gap-2" style={{ animation: "fadeInUp 0.4s ease 2.5s both" }}>
        <button
          onClick={onCta}
          className="w-full uppercase py-4 rounded-2xl bg-accent text-background font-bold tracking-wide text-base hover:bg-accent/90 transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Meine Objekte freischalten →
        </button>
        <p className="text-white/40 text-xs text-center">100 % kostenlos & unverbindlich</p>
      </div>

      <style>{`
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes tickPop { from { transform: scale(1.35); opacity: 0.5; } to { transform: scale(1); opacity: 1; } }
        @keyframes badgePulse { 0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(201, 168, 76, 0.5); } 50% { transform: scale(1.05); box-shadow: 0 0 12px 2px rgba(201, 168, 76, 0.35); } }
      `}</style>
    </div>
  )
}
