'use client'

import { useEffect, useState } from "react"
import { useFunnel } from "@/components/funnel/FunnelProvider"

const DONE_DELAY = 6400
const TRANSITION_DELAY = 7000

type FunnelLoaderProps = {
  count: number
  label: string
  noun?: string
  onComplete: () => void
}

export default function FunnelLoader({ count, label, noun = "Objekte", onComplete }: FunnelLoaderProps) {
  const { type } = useFunnel()
  const [visibleSteps, setVisibleSteps] = useState<number[]>([])
  const [done, setDone] = useState(false)

  const STEPS = [
    { label: "Analysiere Ihre Angaben…", delay: 0 },
    { label: type === "seller" ? "Durchsuche passende Interessentenprofile…" : "Durchsuche Objektdatenbank…", delay: 1800 },
    { label: "Gleiche Präferenzen ab…", delay: 3600 },
    { label: "Berechne Übereinstimmungen…", delay: 5200 },
  ]

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => {
        setVisibleSteps((prev) => [...prev, i])
      }, step.delay))
    })

    timers.push(setTimeout(() => setDone(true), DONE_DELAY))
    timers.push(setTimeout(() => onComplete(), TRANSITION_DELAY))

    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  return (
    <div className="flex flex-col gap-8 py-4">
      <div className="flex flex-col gap-2">
        <p className="text-accent text-xl uppercase tracking-widest font-semibold">
          {label}
        </p>
        <h2 className="text-2xl sm:text-5xl font-bold text-foreground leading-snug">
          Matching läuft…
        </h2>
      </div>

      <div className="flex flex-col gap-3">
        {STEPS.map((step, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 transition-all duration-500 ${visibleSteps.includes(i) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              }`}
          >
            <span className="shrink-0 w-5 h-5 flex items-center justify-center">
              {visibleSteps.includes(i) ? (
                i < STEPS.length - 1 || done ? (
                  <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="w-4 h-4 rounded-full border-2 border-accent border-t-transparent animate-spin block" />
                )
              ) : (
                <span className="w-2 h-2 rounded-full bg-white/20 block" />
              )}
            </span>
            <span className={`text-base sm:text-2xl transition-colors duration-300 ${visibleSteps.includes(i) ? "text-white/80" : "text-white/20"
              }`}>
              {step.label}
            </span>
          </div>
        ))}

        {done && (
          <div className="flex items-center gap-3 animate-[fadeSlideIn_0.5s_ease_forwards]">
            <span className="shrink-0 w-5 h-5 flex items-center justify-center">
              <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <span className="text-sm sm:text-base text-accent font-semibold">
              {count} passende {noun} gefunden ✦
            </span>
          </div>
        )}
      </div>

      {/* Ambient progress bar */}
      <div className="h-px bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-accent/60 rounded-full transition-all ease-linear"
          style={{
            width: done ? "100%" : `${(visibleSteps.length / STEPS.length) * 85}%`,
            transitionDuration: done ? "600ms" : "1800ms",
          }}
        />
      </div>
    </div>
  )
}
