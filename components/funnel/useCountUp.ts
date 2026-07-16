'use client'

import { useEffect, useState } from "react"

type Options = {
  delay?: number
  duration?: number
  enabled?: boolean
}

export default function useCountUp(target: number, { delay = 0, duration = 1000, enabled = true }: Options = {}) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!enabled) return
    let raf = 0
    let start: number | null = null
    const timeout = setTimeout(() => {
      const step = (ts: number) => {
        if (start === null) start = ts
        const p = Math.min((ts - start) / duration, 1)
        const eased = 1 - Math.pow(1 - p, 3)
        setValue(Math.round(eased * target))
        if (p < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }, delay)
    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(raf)
    }
  }, [target, delay, duration, enabled])

  return value
}
