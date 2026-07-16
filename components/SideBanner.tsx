'use client'

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { trackEvent } from "@/lib/event-tracker"

const copy = {
  de: {
    text: "Ihr Einstieg",
  },
  en: {
    text: "Looking for a property / \nWant to sell a property?",
  },
  ru: {
    text: "Ищете недвижимость / \nХотите продать недвижимость?",
  },
  zh: {
    text: "您在寻找房产 / \n想出售房产吗？",
  },
} as const

type Locale = keyof typeof copy

export default function SideBanner({ locale }: { locale: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const [showBanner, setShowBanner] = useState(true)
  const [mounted, setMounted] = useState(false)

  const lang = (copy[locale as Locale] ? locale : "de") as Locale
  const t = copy[lang]

  useEffect(() => {
    setMounted(true)
    const stored = sessionStorage.getItem("clasen_side_banner_open")
    if (stored !== null) {
      setShowBanner(stored === "true")
    }
  }, [])

  const handleCtaClick = () => {
    if (showBanner) {
      trackEvent("funnel_selection_opened", {
        source: "side_banner",
      })
      router.push(`/${locale}/funnels/selection`)
    } else {
      toggleBanner()
    }
  }

  const toggleBanner = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    const nextState = !showBanner
    setShowBanner(nextState)
    sessionStorage.setItem("clasen_side_banner_open", String(nextState))
  }

  const hiddenPaths = ["/datenschutz", "/impressum", "/baumanagement"]
  const isHidden = hiddenPaths.some((p) => pathname.endsWith(p))

  if (!mounted || isHidden) return null

  return (
    <div
      className="fixed left-0 py-4 top-[27%] -translate-y-1/2 z-40 flex items-center bg-accent hover:bg-[#b08f37] text-background border border-accent border-l-0 rounded-r-2xl shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-all duration-300 ease-in-out cursor-pointer"
      style={{
        transform: showBanner ? "translateX(0)" : "translateX(calc(-100% + 44px))",
      }}
      onClick={handleCtaClick}
    >
      {/* Expanded Text Section */}
      <div className="py-1 pl-5 pr-10 select-none whitespace-pre-wrap">
        <h4 className="text-xs md:text-3xl text-white font-semibold tracking-wide mb-1">IHR ZIEL.</h4>
        <p className="text-lg">Wie dürfen wir Sie begleiten?</p>
      </div>

      {/* Vertical divider visible when open */}
      {showBanner && (
        <div className="h-6 w-px bg-background/20 shrink-0" />
      )}

      {/* Collapse / Expand Toggle Tab */}
      <button
        onClick={toggleBanner}
        aria-label={showBanner ? "Collapse banner" : "Expand banner"}
        className="w-11 h-11 flex items-center justify-center text-background/60 hover:text-background transition-colors duration-200 cursor-pointer shrink-0"
      >
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${showBanner ? "" : "rotate-180"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
    </div>
  )
}
