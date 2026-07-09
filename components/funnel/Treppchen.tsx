'use client'

import { useState } from "react"

type TreppchenProps = {
  items: Array<{ slug: string; label: string }>
  onComplete: (ordered: string[]) => void
}

const RANK_COLORS = [
  { bg: "bg-yellow-500/20 border-yellow-500/60", text: "text-yellow-400", badge: "🥇" },
  { bg: "bg-zinc-400/20 border-zinc-400/60", text: "text-zinc-300", badge: "🥈" },
  { bg: "bg-amber-700/20 border-amber-700/60", text: "text-amber-600", badge: "🥉" },
]

export default function Treppchen({ items, onComplete }: TreppchenProps) {
  const [ranked, setRanked] = useState<string[]>([]) // slugs in order

  function handleClick(slug: string) {
    if (ranked.includes(slug)) {
      // deselect: remove this item and everything ranked after it
      setRanked((prev) => prev.slice(0, prev.indexOf(slug)))
    } else if (ranked.length < items.length) {
      setRanked((prev) => [...prev, slug])
    }
  }

  const allRanked = ranked.length === items.length

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        {items.map((item) => {
          const rankIndex = ranked.indexOf(item.slug)
          const isRanked = rankIndex !== -1
          const colors = isRanked ? RANK_COLORS[rankIndex] : null

          return (
            <button
              key={item.slug}
              onClick={() => handleClick(item.slug)}
              className={`group flex items-center gap-4 p-5 sm:p-6 rounded-2xl border transition-all duration-200 cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${isRanked
                ? `${colors!.bg}`
                : "bg-white/6 border-white/20 hover:bg-white/12 hover:border-accent"
                }`}
            >
              <span className="text-5xl w-10 text-center shrink-0">
                {isRanked ? colors!.badge : <span className="text-white/30 text-lg">○</span>}
              </span>
              <span className={`text-base sm:text-xl font-bold tracking-wide transition-colors duration-200 ${isRanked ? colors!.text : "text-white group-hover:text-accent"
                }`}>
                {item.label}
              </span>
              {isRanked && (
                <span className="ml-auto text-lg text-white/30">
                  Platz {rankIndex + 1}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <button
        onClick={() => allRanked && onComplete(ranked)}
        disabled={!allRanked}
        className="mt-2 w-full uppercase py-4 rounded-2xl font-bold tracking-wide text-base transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-30 disabled:cursor-not-allowed bg-accent text-background hover:bg-accent/90 cursor-pointer"
      >
        Weiter →
      </button>
    </div>
  )
}
