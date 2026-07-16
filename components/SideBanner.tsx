'use client'

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { trackEvent } from "@/lib/event-tracker"

const copy = {
  de: {
    title: "IHR ZIEL.",
    question: "Wie dürfen wir Sie begleiten?",
    cta: "Einstieg starten →",
    hint: "Hier können Sie den Einstieg jederzeit wieder öffnen ↓",
    ariaOpen: "Ihr Einstieg öffnen",
    ariaClose: "Schließen",
  },
  en: {
    title: "YOUR GOAL.",
    question: "How may we assist you?",
    cta: "Get started →",
    hint: "Tap here anytime to reopen ↓",
    ariaOpen: "Open your journey",
    ariaClose: "Close",
  },
  ru: {
    title: "ВАША ЦЕЛЬ.",
    question: "Чем мы можем вам помочь?",
    cta: "Начать →",
    hint: "Нажмите здесь, чтобы открыть снова ↓",
    ariaOpen: "Открыть",
    ariaClose: "Закрыть",
  },
  zh: {
    title: "您的目标。",
    question: "我们能为您做些什么？",
    cta: "立即开始 →",
    hint: "随时点按此处重新打开 ↓",
    ariaOpen: "打开入口",
    ariaClose: "关闭",
  },
} as const

type Locale = keyof typeof copy

export default function SideBanner({ locale }: { locale: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const [showBanner, setShowBanner] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [popupOpen, setPopupOpen] = useState(false)
  const [fabVisible, setFabVisible] = useState(false)
  const [hintVisible, setHintVisible] = useState(false)

  const lang = (copy[locale as Locale] ? locale : "de") as Locale
  const t = copy[lang]

  useEffect(() => {
    setMounted(true)
    const stored = sessionStorage.getItem("clasen_side_banner_open")
    if (stored !== null) {
      setShowBanner(stored === "true")
    }

    // Mobile: popup was already auto-shown this session → FAB is visible right away
    if (sessionStorage.getItem("clasen_mobile_popup_shown") !== null) {
      setFabVisible(true)
      return
    }

    // Otherwise auto-open the popup once the user scrolls a bit
    const onScroll = () => {
      if (window.innerWidth >= 768 || window.scrollY < 250) return
      sessionStorage.setItem("clasen_mobile_popup_shown", "true")
      setFabVisible(true)
      setPopupOpen(true)
      window.removeEventListener("scroll", onScroll)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
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

  const handleFabClick = () => {
    setHintVisible(false)
    setPopupOpen((open) => !open)
  }

  const handlePopupClose = () => {
    setPopupOpen(false)
    // Point the user to the FAB so they know how to get back — once per session
    if (sessionStorage.getItem("clasen_fab_hint_shown") === null) {
      sessionStorage.setItem("clasen_fab_hint_shown", "true")
      setHintVisible(true)
      setTimeout(() => setHintVisible(false), 4500)
    }
  }

  const handlePopupCta = () => {
    trackEvent("funnel_selection_opened", {
      source: "mobile_popup",
    })
    router.push(`/${locale}/funnels/selection`)
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
    <>
      {/* Desktop: side banner */}
      <div
        className={`hidden md:flex fixed left-0 py-4 top-[27%] -translate-y-1/2 z-40 items-center bg-accent hover:bg-[#b08f37] text-background border border-accent border-l-0 rounded-r-2xl shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-all duration-300 ease-in-out cursor-pointer ${showBanner ? "translate-x-0" : "-translate-x-[calc(100%-44px)]"}`}
        onClick={handleCtaClick}
      >
        {/* Expanded Text Section */}
        <div className="py-1 pl-5 pr-10 select-none whitespace-pre-wrap">
          <h4 className="text-3xl text-white font-semibold tracking-wide mb-1">{t.title}</h4>
          <p className="text-lg">{t.question}</p>
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

      {/* Mobile: popup dialog */}
      {popupOpen && (
        <div
          className="md:hidden fixed bottom-22 left-4 right-4 z-50 bg-accent text-background rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.45)] p-5"
          style={{ animation: "fabIn 0.35s ease both" }}
        >
          <button
            onClick={handlePopupClose}
            aria-label={t.ariaClose}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-background/60 hover:text-background cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          <h4 className="text-2xl text-white font-semibold tracking-wide mb-1">{t.title}</h4>
          <p className="text-base mb-4">{t.question}</p>
          <button
            onClick={handlePopupCta}
            className="w-full py-3 rounded-xl bg-background text-foreground font-bold text-sm uppercase tracking-wide cursor-pointer"
          >
            {t.cta}
          </button>
        </div>
      )}

      {/* Mobile: hint pointing to the FAB after the popup is closed */}
      {hintVisible && (
        <div
          className="md:hidden fixed bottom-20 left-4 z-40 max-w-[240px] bg-background border border-accent/50 text-foreground text-xs leading-relaxed px-3 py-2.5 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
          style={{ animation: "fabIn 0.35s ease both" }}
        >
          {t.hint}
        </div>
      )}

      {/* Mobile: floating action button */}
      {fabVisible && (
        <button
          onClick={handleFabClick}
          aria-label={t.ariaOpen}
          className="md:hidden fixed bottom-5 left-4 z-40 flex items-center justify-center w-12 h-12 bg-accent text-background rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.35)] cursor-pointer"
          style={{ animation: "fabIn 0.4s ease both" }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
          </svg>
        </button>
      )}

      <style>{`
        @keyframes fabIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </>
  )
}
