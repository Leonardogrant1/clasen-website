'use client'

import { useState } from "react"

type EquitySlug = "under-50k" | "50k-100k" | "100k-250k" | "over-250k"

const TIERS: Array<{ slug: EquitySlug; label: string }> = [
  { slug: "under-50k", label: "unter 50.000€" },
  { slug: "50k-100k", label: "50.000 – 100.000€" },
  { slug: "100k-250k", label: "100.000 – 250.000€" },
  { slug: "over-250k", label: "über 250.000€" },
]

type EigenkapitalSliderProps = {
  onComplete: (equity: EquitySlug) => void
}

export default function EigenkapitalSlider({ onComplete }: EigenkapitalSliderProps) {
  const [index, setIndex] = useState(1) // default middle tier

  const selected = TIERS[index]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        {/* Selected label */}
        <div className="text-center">
          <span className="text-accent text-2xl sm:text-3xl font-bold tracking-wide">
            {selected.label}
          </span>
        </div>

        {/* Range slider */}
        <div className="px-2">
          <input
            type="range"
            min={0}
            max={TIERS.length - 1}
            step={1}
            value={index}
            onChange={(e) => setIndex(Number(e.target.value))}
            className="w-full h-6 bg-transparent appearance-none cursor-pointer focus:outline-none [&::-webkit-slider-runnable-track]:bg-white/10 [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:mt-[-8px] [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-150 hover:[&::-webkit-slider-thumb]:scale-110 active:[&::-webkit-slider-thumb]:scale-95 [&::-moz-range-track]:bg-white/10 [&::-moz-range-track]:h-2 [&::-moz-range-track]:rounded-full [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-accent [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:duration-150 hover:[&::-moz-range-thumb]:scale-110 active:[&::-moz-range-thumb]:scale-95"
          />
          <div className="flex justify-between mt-2">
            {TIERS.map((t, i) => (
              <span
                key={t.slug}
                className={`text-xs transition-colors duration-200 ${i === index ? "text-accent font-semibold" : "text-white/30"
                  }`}
              >
                {i === 0 ? "min" : i === TIERS.length - 1 ? "max" : ""}
              </span>
            ))}
          </div>
        </div>

        {/* Tier dots */}
        <div className="flex justify-between px-1">
          {TIERS.map((t, i) => (
            <button
              key={t.slug}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full transition-all duration-200 focus:outline-none ${i === index
                ? "bg-accent scale-125"
                : i < index
                  ? "bg-accent/40"
                  : "bg-white/20"
                }`}
              aria-label={t.label}
            />
          ))}
        </div>
      </div>

      <button
        onClick={() => onComplete(selected.slug)}
        className="w-full uppercase py-4 rounded-2xl bg-accent text-background font-bold tracking-wide text-base hover:bg-accent/90 transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        Weiter →
      </button>
    </div>
  )
}
