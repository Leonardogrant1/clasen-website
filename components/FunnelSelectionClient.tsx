'use client'

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { trackEvent } from "@/lib/event-tracker"
import Image from "next/image"

interface FunnelSelectionClientProps {
  title: string
  subtitle: string
  searchLabel: string
  searchTooltip: string
  sellLabel: string
  sellTooltip: string
}

const copy = {
  de: {
    searchTypeTitle: "Ich bin...",
    searchTypeSubtitle: "Bitte wählen Sie Ihre Situation aus.",
    investorLabel: "Kapitalanleger",
    investorDesc: "Auf der Suche nach Objekten für mein Portfolio oder steuerlich optimierten Anlagen.",
    ownerLabel: "Eigennutzer",
    ownerDesc: "Auf der Suche nach einem Eigenheim für mich/mich und meine Familie.",
    back: "← Zurück",
  },
  en: {
    searchTypeTitle: "What kind of property are you looking for?",
    searchTypeSubtitle: "Please select your situation.",
    investorLabel: "As Investor",
    investorDesc: "For rented properties, portfolios, or tax-optimized investments.",
    ownerLabel: "As Owner-Occupier",
    ownerDesc: "For owner-occupied homes, apartments, or private residential properties.",
    back: "← Back",
  },
  ru: {
    searchTypeTitle: "Какую недвижимость вы ищете?",
    searchTypeSubtitle: "Пожалуйста, выберите вашу ситуацию.",
    investorLabel: "Как инвестор",
    investorDesc: "Для сданных в аренду объектов, портфелей или налогово-оптимизированных инвестиций.",
    ownerLabel: "Как собственник",
    ownerDesc: "Для жилья для собственного проживания, квартир или частной жилой недвижимости.",
    back: "← Назад",
  },
  zh: {
    searchTypeTitle: "您在寻找什么类型的房产？",
    searchTypeSubtitle: "请选择您的情况。",
    investorLabel: "作为投资者",
    investorDesc: "适用于出租物业、投资组合或税收优化投资。",
    ownerLabel: "作为自住业主",
    ownerDesc: "适用于自住房屋、公寓或私人住宅物业。",
    back: "← 返回",
  },
} as const

// Resolve language client-side or use fallback
function getLanguageFromPath(): keyof typeof copy {
  if (typeof window === 'undefined') return 'de'
  const path = window.location.pathname
  if (path.startsWith('/en/')) return 'en'
  if (path.startsWith('/ru/')) return 'ru'
  if (path.startsWith('/zh/')) return 'zh'
  return 'de'
}

export default function FunnelSelectionClient({
  title,
  subtitle,
  searchLabel,
  searchTooltip,
  sellLabel,
  sellTooltip,
}: FunnelSelectionClientProps) {
  const router = useRouter()
  const [step, setStep] = useState<'main' | 'search_type'>('main')

  const lang = getLanguageFromPath()
  const t = copy[lang]

  const handleSearchClick = () => {
    trackEvent("funnel_search_selected", { source: "selection_page" })
    setStep('search_type')
  }

  const handleSellClick = () => {
    trackEvent("funnel_sell_selected", { source: "selection_page" })
    router.push(`/${lang}/funnels/seller`)
  }

  const handleSearchTypeSelection = (type: 'investor' | 'owner') => {
    trackEvent("funnel_search_type_selected", { type, source: "selection_page" })
    router.push(`/${lang}/funnels/${type}`)
  }

  if (step === 'search_type') {
    return (
      <div className="flex-1 relative flex flex-col items-center justify-center px-4 py-8 sm:py-16 md:py-24">
        <Image src="/backgrounds/munich.jpeg" alt="" fill className="object-cover object-center opacity-40" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="relative z-10 w-full max-w-2xl flex flex-col gap-10 animate-[scale-in_0.3s_ease-out]">
          <Image src="/logo/key_white.svg" alt="Clasen" width={130} height={44} priority />
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-wide text-foreground">
              {t.searchTypeTitle}
            </h1>
            <p className="text-accent text-2xl leading-relaxed">
              {t.searchTypeSubtitle}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <SelectionRow
              label={t.investorLabel}
              tooltip={t.investorDesc}
              icon={<Image width={48} height={48} className="w-8 h-8 sm:w-12 sm:h-12" alt="Investor" src="/icons/Chart.svg" />}
              onClick={() => handleSearchTypeSelection('investor')}
            />
            <SelectionRow
              label={t.ownerLabel}
              tooltip={t.ownerDesc}
              icon={<Image width={48} height={48} className="w-8 h-8 sm:w-12 sm:h-12" alt="Owner" src="/icons/User.svg" />}
              onClick={() => handleSearchTypeSelection('owner')}
            />
          </div>

          <button
            onClick={() => setStep('main')}
            className="self-start text-white/40 hover:text-accent text-xs sm:text-sm uppercase tracking-wider font-semibold transition-colors duration-200 cursor-pointer"
          >
            {t.back}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 relative flex flex-col items-center justify-center px-4 py-8 sm:py-16 md:py-24">
      <Image src="/backgrounds/munich.jpeg" alt="" fill className="object-cover object-center opacity-40" priority />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
      <div className="relative z-10 w-full max-w-2xl flex flex-col gap-10 animate-[fade-in_0.4s_ease-out]">
        <Image src="/logo/key_white.svg" alt="Clasen" width={130} height={44} priority />
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-wide text-foreground">
            {title}
          </h1>
          <p className="text-accent text-2xl leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <SelectionRow
            label={searchLabel}
            tooltip={searchTooltip}
            icon={<Image width={48} height={48} className="w-8 h-8 sm:w-12 sm:h-12" alt="Verkaufen" src="/icons/Search.svg" />}
            onClick={handleSearchClick}
          />
          <SelectionRow
            label={sellLabel}
            tooltip={sellTooltip}
            icon={<Image width={48} height={48} className="w-8 h-8 sm:w-12 sm:h-12" alt="Verkaufen" src="/icons/Home.svg" />}
            onClick={handleSellClick}
          />
        </div>
      </div>
    </div>
  )
}

function SelectionRow({
  label,
  tooltip,
  icon,
  onClick,
}: {
  label: string
  tooltip: string
  icon: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-6 p-6 sm:p-8 bg-white/6 hover:bg-white/12 border border-white/20 hover:border-accent rounded-2xl text-left transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <span className="shrink-0">
        {icon}
      </span>
      <div className="flex flex-col gap-1.5">
        <span className="text-white text-xl sm:text-2xl font-bold tracking-wide group-hover:text-accent transition-colors duration-300">
          {label}
        </span>
        <span className="text-white/60 text-sm sm:text-base leading-relaxed">
          {tooltip}
        </span>
      </div>
      <span className="ml-auto text-white/30 group-hover:text-accent transition-colors duration-300 text-xl shrink-0">→</span>
    </button>
  )
}

