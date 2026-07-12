'use client'

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useFunnel } from "@/components/funnel/FunnelProvider"

export function useFunnelCompletion(contactStep: number) {
  const { type } = useFunnel()
  const router = useRouter()
  const searchParams = useSearchParams()
  const step = Number(searchParams.get("step") ?? "0")
  const homeHref = "/"
  const [submitted, setSubmitted] = useState(false)

  const markSubmitted = () => {
    try { sessionStorage.setItem(`funnel_submitted_${type}`, "1") } catch {}
    setSubmitted(true)
  }

  // Nach dem Absenden der Kontaktdaten führt Zurück-Navigation in einen
  // Funnel-Schritt auf die Landing Page. Ein Neustart bei Schritt 0 (z. B.
  // über den CTA auf der Landing Page) bleibt erlaubt und hebt die Sperre auf.
  useEffect(() => {
    let done = false
    try { done = sessionStorage.getItem(`funnel_submitted_${type}`) === "1" } catch {}
    if (!done) return
    if (submitted && step === contactStep) return
    if (step === 0) {
      try { sessionStorage.removeItem(`funnel_submitted_${type}`) } catch {}
      return
    }
    router.replace(homeHref)
  }, [type, submitted, step, contactStep, homeHref, router])

  const back = () => {
    if (submitted) router.push(homeHref)
    else router.back()
  }

  return { back, markSubmitted, submitted }
}
