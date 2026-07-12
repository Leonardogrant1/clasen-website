'use client'

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useFunnel } from "@/components/funnel/FunnelProvider"
import { trackEvent } from "@/lib/event-tracker"
import { Search } from "lucide-react"

const FIELDS = [
  { key: "name", type: "text", placeholder: "Vor- und Nachname", required: true },
  { key: "email", type: "email", placeholder: "E-Mail-Adresse", required: true },
  { key: "phone", type: "tel", placeholder: "Telefonnummer", required: true },
] as const

export default function FunnelContactForm({ onSubmitted }: { onSubmitted?: () => void }) {
  const { type, answers } = useFunnel()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [consent, setConsent] = useState(false)

  const setters = { name: setName, email: setEmail, phone: setPhone }
  const values = { name, email, phone }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    trackEvent(
      "funnel_submission",
      { type, answers, contact: { name, email, phone } },
      { metaEventName: "Lead", customData: { contentName: type } }
    )
    fetch("/api/close-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, type, answers }),
    }).catch(() => { })
    setSubmitted(true)
    onSubmitted?.()
    // Kein Routing beim Submit — Scroll-Reset daher manuell, damit der
    // Danke-Screen oben beginnt
    window.scrollTo(0, 0)
  }

  if (submitted) {
    return (
      <div
        className="flex flex-col items-center gap-6 text-center py-8"
        style={{ animation: "fadeSlideIn 0.6s ease both" }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Vielen Dank für Ihr Vertrauen!</h2>
        <div className="relative w-full aspect-video overflow-hidden border border-accent/30 shadow-lg">
          <Image
            src="/alex_funnel.png"
            alt="Alex"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl sm:text-3xl font-bold text-foreground">Auf uns können Sie sich stützen.</h2>

          <p className="text-white/50 text-sm sm:text-base leading-relaxed max-w-xs mx-auto">
            Wir melden uns innerhalb der nächsten 24 Stunden bei Ihnen.
          </p>
        </div>
        <div className="flex flex-col gap-2 w-full mt-2">
          {[
            "Persönliche Kontaktaufnahme",
            "Diskreter Umgang mit Ihren Daten",
            "CLASEN-Qualitätsgarantie",
          ].map((item, i) => (
            <div
              key={item}
              className="flex items-center gap-3 px-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl"
              style={{ animation: `fadeInUp 0.4s ease ${i * 0.1 + 0.3}s both` }}
            >
              <svg className="w-4 h-4 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-white/70 text-sm">{item}</span>
            </div>
          ))}
        </div>
        <Link
          href="/"
          className="w-full uppercase py-4 rounded-2xl bg-accent text-background font-bold tracking-wide text-base text-center hover:bg-accent/90 transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          style={{ animation: "fadeInUp 0.4s ease 0.6s both" }}
        >
          Zurück zur Startseite
        </Link>
        <style>{`
          @keyframes fadeSlideIn {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(10px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div
      className="flex flex-col gap-8"
      style={{ animation: "fadeSlideIn 0.5s ease both" }}
    >
      {/* Heading */}
      <div className="flex flex-col gap-1">
        <p className="text-accent text-xl uppercase tracking-widest font-semibold">
          Letzter Schritt
        </p>
        <h2 className="text-2xl sm:text-5xl font-bold text-foreground leading-snug">
          Ihre Kontaktdaten
        </h2>
      </div>



      {/* Form + Trust Box */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch">

        {/* Trust Box */}
        <div
          className="w-full sm:w-1/2 flex flex-col gap-6 bg-white/[0.04] border border-white/10 rounded-2xl p-7"
          style={{ animation: "fadeInUp 0.4s ease 0.3s both" }}
        >

          <div className="flex flex-col gap-4">
            <p className="text-white font-bold text-xl sm:text-2xl leading-snug">
              Diskretion ist unser Standard — auch bei Ihren Daten.
            </p>
            <div className="flex items-center gap-2 text-accent text-sm font-semibold uppercase tracking-widest">
              <Search className="w-4 h-4" />
              Persönlich geprüft
            </div>
            <p className="text-white/50 text-base sm:text-lg leading-relaxed">
              Jede Anfrage wird von uns persönlich geprüft, niemals weitergegeben oder öffentlich angezeigt. Ihre Angaben bleiben, was sie sind: vertraulich.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {["Verschlüsselte Übermittlung", "Nie öffentlich sichtbar", "Ausschließlich zur Kontaktaufnahme"].map((tag) => (
              <span key={tag} className="flex items-center gap-2 text-base text-white font-medium bg-accent/10 border border-accent/25 rounded-full px-4 py-2.5">
                <svg className="w-3.5 h-3.5 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {tag}
              </span>
            ))}
          </div>

        </div>

        {/* Inputs */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full sm:w-1/2 bg-white/[0.04] border border-white/10 rounded-2xl p-7 justify-between">
          {FIELDS.map((f, i) => (
            <div
              key={f.key}
              style={{ animation: `fadeInUp 0.4s ease ${i * 0.08 + 0.2}s both` }}
            >
              <input
                type={f.type}
                placeholder={f.placeholder}
                required={f.required}
                value={values[f.key]}
                onChange={(e) => setters[f.key](e.target.value)}
                className="w-full bg-white/4 border border-white/10 rounded-xl px-4 py-3 sm:px-5 sm:py-4 text-foreground text-base sm:text-lg placeholder:text-white/60 focus:outline-none focus:border-accent/50 focus:bg-white/6 transition-all duration-200"
              />
            </div>
          ))}

          <div className="flex flex-col gap-4">

            <label className="flex items-start gap-3 cursor-pointer group" style={{ animation: "fadeInUp 0.4s ease 0.45s both" }}>
              <div
                onClick={() => setConsent(v => !v)}
                className={`mt-0.5 w-5 h-5 shrink-0 rounded border flex items-center justify-center transition-colors duration-150 ${consent ? "bg-accent border-accent" : "border-white/30 bg-white/5 group-hover:border-white/50"}`}
              >
                {consent && (
                  <svg className="w-3 h-3 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-sm text-white/50 leading-relaxed">
                Ich habe die{" "}
                <a href="/datenschutz" target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2 hover:text-accent/80">
                  Datenschutzerklärung
                </a>{" "}
                gelesen und stimme der Verarbeitung meiner Daten zur persönlichen Kontaktaufnahme zu. Die{" "}
                <a href="/datenschutz" target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2 hover:text-accent/80">
                  AGB
                </a>{" "}
                erkenne ich an.
              </span>
            </label>

            <button
              type="submit"
              disabled={!consent}
              className="w-full uppercase py-4 rounded-2xl bg-accent text-background font-bold tracking-wide text-base transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:bg-accent/90 enabled:active:scale-[0.98] enabled:cursor-pointer"
              style={{ animation: "fadeInUp 0.4s ease 0.5s both" }}
            >
              Matches jetzt einsehen →
            </button>
          </div>
        </form>

      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
