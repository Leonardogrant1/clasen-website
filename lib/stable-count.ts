/**
 * Deterministic count + image order based on funnel answers.
 * Same answers → same count/images every time.
 * Cached in localStorage so it persists across sessions.
 */

function djb2(str: string): number {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i)
    hash = hash & hash // keep 32-bit
  }
  return Math.abs(hash)
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr]
  let s = seed
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0x7fffffff
    const j = s % (i + 1)
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

const ALL_FUNNEL_IMAGES = [0, 1, 2, 3, 4, 5].map(i => `/funnel-results/${i}.png`)

export function getStableImages(answers: Record<string, unknown>): string[] {
  const sorted = Object.keys(answers)
    .sort()
    .reduce<Record<string, unknown>>((acc, k) => { acc[k] = answers[k]; return acc }, {})
  const key = JSON.stringify(sorted)
  const hash = djb2(key)
  const storageKey = `funnel_images_${hash}`

  try {
    const cached = localStorage.getItem(storageKey)
    if (cached !== null) return JSON.parse(cached) as string[]
  } catch {}

  const shuffled = seededShuffle(ALL_FUNNEL_IMAGES, hash)

  try {
    localStorage.setItem(storageKey, JSON.stringify(shuffled))
  } catch {}

  return shuffled
}

export function getStableCount(
  answers: Record<string, unknown>,
  min: number,
  max: number
): number {
  const sorted = Object.keys(answers)
    .sort()
    .reduce<Record<string, unknown>>((acc, k) => { acc[k] = answers[k]; return acc }, {})
  const key = JSON.stringify(sorted)
  const hash = djb2(key)
  const storageKey = `funnel_count_${hash}_${min}_${max}`

  try {
    const cached = localStorage.getItem(storageKey)
    if (cached !== null) return Number(cached)
  } catch {}

  const count = min + (hash % (max - min + 1))

  try {
    localStorage.setItem(storageKey, String(count))
  } catch {}

  return count
}
