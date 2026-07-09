'use client'

import { useState } from "react"

type MoodValues = {
  moodLocation: number
  moodStyle: number
  moodSize: number
}

type MoodSlidersProps = {
  onComplete: (values: MoodValues) => void
}

const AXES = [
  { key: "moodLocation" as const, left: "Ruhige Lage", right: "Urbanes Zentrum" },
  { key: "moodStyle"    as const, left: "Altbau-Charme", right: "Klarer Neubau" },
  { key: "moodSize"     as const, left: "Kompakt & fein", right: "Großzügig & weitläufig" },
]

export default function MoodSliders({ onComplete }: MoodSlidersProps) {
  const [values, setValues] = useState<MoodValues>({
    moodLocation: 50,
    moodStyle: 50,
    moodSize: 50,
  })

  function handleChange(key: keyof MoodValues, value: number) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-5">
        {AXES.map((axis) => (
          <div key={axis.key} className="flex flex-col gap-2">
            <div className="flex justify-between text-xs text-white/50">
              <span>{axis.left}</span>
              <span>{axis.right}</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={values[axis.key]}
              onChange={(e) => handleChange(axis.key, Number(e.target.value))}
              className="w-full h-6 bg-transparent appearance-none cursor-pointer focus:outline-none [&::-webkit-slider-runnable-track]:bg-white/10 [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:mt-[-8px] [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-150 hover:[&::-webkit-slider-thumb]:scale-110 active:[&::-webkit-slider-thumb]:scale-95 [&::-moz-range-track]:bg-white/10 [&::-moz-range-track]:h-2 [&::-moz-range-track]:rounded-full [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-accent [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:duration-150 hover:[&::-moz-range-thumb]:scale-110 active:[&::-moz-range-thumb]:scale-95"
            />
            {/* Position indicator */}
            <div className="flex justify-center">
              <span className="text-accent text-xs font-medium">
                {values[axis.key] < 35
                  ? axis.left
                  : values[axis.key] > 65
                  ? axis.right
                  : "Ausgewogen"}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => onComplete(values)}
        className="w-full uppercase py-3.5 rounded-2xl bg-accent text-background font-semibold tracking-wide hover:bg-accent/90 transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        Weiter →
      </button>
    </div>
  )
}
