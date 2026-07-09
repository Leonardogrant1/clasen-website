'use client'

import { createContext, useContext, useEffect, useState } from "react"

export type FunnelType = "seller" | "investor" | "owner"

export type SellerAnswers = {
  priorities: Array<"speed" | "price" | "communication">
  phase: "preparation" | "was-on-market" | "on-market"
  partnerType: "experienced" | "negotiator" | "communicative"
  objectType: "apartment-building" | "villa" | "semi-detached" | "terraced" | "apartment" | "land"
  district: string
}

export type InvestorAnswers = {
  investorType: "bestandshalter" | "optimierer" | "portfoliodenker"
  priorities: Array<"return" | "tax-benefit" | "stability">
  equity: "under-50k" | "50k-100k" | "100k-250k" | "over-250k"
}

export type OwnerAnswers = {
  lifePhase: "need-more-space" | "need-less-space" | "settling-down" | "new-chapter"
  objectType: Array<"apartment" | "special" | "semi-detached" | "corner-terraced" | "villa" | "land">
  districts: string[]
  sqm: "<50" | "50-80" | "80-120" | "120-200" | "200+"
  softSkills: number[]
  ownerType: "ankommer" | "gestalter" | "vorausdenker"
}

export type FunnelAnswers = Partial<SellerAnswers> & Partial<InvestorAnswers> & Partial<OwnerAnswers>

type FunnelContextValue = {
  type: FunnelType
  answers: FunnelAnswers
  setAnswer: (key: string, value: unknown) => void
}

const FunnelContext = createContext<FunnelContextValue | null>(null)

export function FunnelProvider({
  initialType,
  children,
}: {
  initialType: FunnelType
  children: React.ReactNode
}) {
  const [answers, setAnswers] = useState<FunnelAnswers>({})

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(`funnel_answers_${initialType}`)
      if (stored) setAnswers(JSON.parse(stored))
    } catch {}
  }, [initialType])

  function setAnswer(key: string, value: unknown) {
    setAnswers((prev) => {
      const next = { ...prev, [key]: value }
      try { sessionStorage.setItem(`funnel_answers_${initialType}`, JSON.stringify(next)) } catch {}
      return next
    })
  }

  return (
    <FunnelContext.Provider value={{ type: initialType, answers, setAnswer }}>
      {children}
    </FunnelContext.Provider>
  )
}

export function useFunnel(): FunnelContextValue {
  const ctx = useContext(FunnelContext)
  if (!ctx) throw new Error("useFunnel must be used inside FunnelProvider")
  return ctx
}
