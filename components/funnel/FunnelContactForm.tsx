'use client'

import { useState } from "react"
import { useFunnel } from "@/components/funnel/FunnelProvider"
import { trackEvent } from "@/lib/event-tracker"

export default function FunnelContactForm() {
  const { type, answers } = useFunnel()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    trackEvent(
      "funnel_submission",
      { type, answers, contact: { name, email, phone } },
      { metaEventName: "Lead", customData: { contentName: type } }
    )
    // Fire-and-forget — do not await, errors logged server-side
    fetch("/api/close-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, type, answers }),
    }).catch(() => {
      // intentionally silent — CRM outage must not affect UX
    })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 text-center py-8">
        <span className="text-4xl">✦</span>
        <h2 className="text-xl font-bold text-foreground">Vielen Dank.</h2>
        <p className="text-white/50 text-sm leading-relaxed max-w-xs">
          Wir melden uns innerhalb von 24 Stunden persönlich bei Ihnen.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 text-center">
        <p className="text-accent text-xs uppercase tracking-widest font-semibold">
          Letzter Schritt
        </p>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          Ihre Kontaktdaten
        </h2>
        <p className="text-white/40 text-sm">
          Kostenlos & unverbindlich. Diskret. In CLASEN-Qualität.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Vor- und Nachname"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3.5 text-foreground text-sm placeholder:text-white/30 focus:outline-none focus:border-accent/50 transition-colors duration-200"
        />
        <input
          type="email"
          placeholder="E-Mail-Adresse"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3.5 text-foreground text-sm placeholder:text-white/30 focus:outline-none focus:border-accent/50 transition-colors duration-200"
        />
        <input
          type="tel"
          placeholder="Telefonnummer"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3.5 text-foreground text-sm placeholder:text-white/30 focus:outline-none focus:border-accent/50 transition-colors duration-200"
        />
        <button
          type="submit"
          className="w-full mt-2 py-4 rounded-2xl bg-accent text-background font-bold tracking-wide text-base hover:bg-accent/90 transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Kostenlos & unverbindlich anfragen
        </button>
      </form>
    </div>
  )
}
