'use client'

import { useState } from "react"
import Image from "next/image"
import type { InvestorAnswers } from "@/components/funnel/FunnelProvider"
import FunnelLoader from "@/components/funnel/FunnelLoader"
import { getStableCount, getStableImages } from "@/lib/stable-count"

const LABEL_BY_TYPE: Record<string, string> = {
  bestandshalter: "Bestandshalter",
  optimierer: "Optimierer",
  portfoliodenker: "Portfoliodenker",
}

const METRIC_BY_TYPE: Record<string, string> = {
  bestandshalter: "Eine der Liegenschaften ist seit über 12 Jahren vollvermietet.",
  optimierer: "Eines davon weist eine Nettomietrendite von über 4,8 % aus.",
  portfoliodenker: "Eines davon liegt in einem Wachstumskorridor mit überdurchschnittlicher Preisentwicklung.",
}

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

const TEASER_META = [
  { district: "Schwabing-West", address: "••••••straße ••", distance: "1.2 km" },
  { district: "Bogenhausen", address: "••••••allee ••", distance: "2.4 km" },
  { district: "Maxvorstadt", address: "••••••gasse •", distance: "0.8 km" },
  { district: "Au-Haidhausen", address: "••••••platz •", distance: "3.1 km" },
  { district: "Neuhausen", address: "••••••weg ••", distance: "2.0 km" },
  { district: "Lehel", address: "••••••ring •", distance: "1.5 km" },
]

type InvestorResultScreenProps = {
  investorType: InvestorAnswers["investorType"] | undefined
  priorities: InvestorAnswers["priorities"] | undefined
  equity: InvestorAnswers["equity"] | undefined
  onCta: () => void
}

export default function InvestorResultScreen({ investorType, priorities, equity, onCta }: InvestorResultScreenProps) {
  const answersKey = { investorType: investorType ?? null, priorities: priorities ?? null, equity: equity ?? null }
  const count = getStableCount(answersKey, 2, 9)
  const images = getStableImages(answersKey)
  const typeLabel = investorType ? (LABEL_BY_TYPE[investorType] ?? investorType) : null
  const metric = investorType ? METRIC_BY_TYPE[investorType] : null
  const equityLabel = equity ? (EQUITY_LABELS[equity] ?? equity) : null
  const topPriority = priorities?.[0] ? (PRIORITY_LABELS[priorities[0]] ?? priorities[0]) : null

  const [loading, setLoading] = useState(true)

  if (loading) {
    return <FunnelLoader count={count} label="Deal-Kompass" noun="Objekte" onComplete={() => setLoading(false)} />
  }

  return (
    <div className="flex flex-col gap-8" style={{ animation: "fadeSlideIn 0.5s ease both" }}>
      {/* Heading */}
      <div className="flex flex-col gap-3" style={{ animation: "fadeInUp 0.4s ease 0.05s both" }}>
        <p className="text-accent text-lg uppercase tracking-widest font-semibold">Dealkompass</p>
        <h2 className="text-xl sm:text-4xl font-bold text-foreground leading-snug">
          Ihr Dealkompass ist bereit.
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
            hat unser patentierter KI Agent <strong className="text-white">CLAvis<sup style={{ verticalAlign: "super", fontSize: "0.4em" }}>TM</sup> 3.0</strong>
            aus unserem OffMarket-Objektpool{" "}
            <span className="text-accent font-bold">{count} {count === 1 ? "Objekt" : "Objekte"}</span>{" "}
            für Sie priorisiert.
          </p>
        )}
        {metric && (
          <p className="text-accent/80 text-sm sm:text-base italic border-l-2 border-accent/30 pl-3">
            {metric}
          </p>
        )}
      </div>

      {/* Teaser grid — all locked */}
      <div className="grid grid-cols-2 gap-3" style={{ animation: "fadeInUp 0.4s ease 0.2s both" }}>
        {(() => {
          const shownPreviews = Math.min(count, 3)
          const hiddenCount = count - shownPreviews
          const showPlusTile = hiddenCount > 0
          const totalTiles = shownPreviews + (showPlusTile ? 1 : 0)
          const teasersToShow = TEASER_META.slice(0, totalTiles)
          return teasersToShow.map((t, i) => {
            const isPlusTile = showPlusTile && i === teasersToShow.length - 1
            return (
              <div
                key={i}
                className="relative rounded-2xl overflow-hidden border border-white/10 flex flex-col select-none pointer-events-none"
                style={{ animation: `fadeInUp 0.4s ease-out ${i * 0.08}s both` }}
              >
                {/* Blurred image */}
                <div className="relative h-28 sm:h-32 w-full">
                  <Image src={images[i]} alt="" fill className="object-cover blur-md scale-110" />
                  <div className="absolute inset-0 bg-black/40" />
                  <span className="absolute top-2 right-2 text-white/70 text-[10px] font-medium bg-black/40 px-1.5 py-0.5 rounded-full">
                    {t.distance}
                  </span>
                </div>

                {/* Partially revealed info */}
                <div className="flex flex-col gap-0.5 p-3 bg-white/[0.04]">
                  <span className="text-white/60 text-xs font-semibold">
                    {t.district.slice(0, 2)}{"•".repeat(Math.max(t.district.length - 2, 4))}
                  </span>
                  <span className="text-white/30 text-[10px]">
                    {"•".repeat(10)}
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

      <button
        onClick={onCta}
        className="w-full uppercase py-4 rounded-2xl bg-accent text-background font-bold tracking-wide text-base hover:bg-accent/90 transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        style={{ animation: "fadeInUp 0.4s ease 0.35s both" }}
      >
        Objekte freischalten →
      </button>

      <style>{`
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}
