import { notFound } from "next/navigation"
import { getDictionary, hasLocale } from "@/app/[lang]/(main)/dictionaries"
import FunnelSelectionClient from "@/components/FunnelSelectionClient"

export async function generateStaticParams() {
  return [{ lang: "de" }, { lang: "en" }, { lang: "ru" }, { lang: "zh" }]
}

const titleMap: Record<string, string> = {
  de: "Wie dürfen wir Sie begleiten?",
  en: "How can we help you?",
  ru: "Чем мы можем вам помочь?",
  zh: "我们如何为您服务？",
}

const subtitleMap: Record<string, string> = {
  de: "Bitte wählen Sie Ihr Anliegen aus.",
  en: "Please select the appropriate option.",
  ru: "Пожалуйста, выберите подходящий вариант.",
  zh: "请选择合适您的选项。",
}

export default async function FunnelSelectionPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const dict = await getDictionary(lang)

  // Safe accessor checking if dictionary has expected keys
  const selectionDict = dict.funnels?.selection || {
    search: { label: "Immobilie suchen", tooltip: "Finden Sie Ihr Traumobjekt" },
    sell: { label: "Immobilie verkaufen", tooltip: "Wir begleiten Sie diskret" }
  }

  const title = (dict.funnels?.selection as any)?.title || titleMap[lang] || titleMap.de
  const subtitle = subtitleMap[lang] || subtitleMap.de

  return (
    <FunnelSelectionClient
      title={title}
      subtitle={subtitle}
      searchLabel={selectionDict.search.label}
      searchTooltip={selectionDict.search.tooltip}
      sellLabel={selectionDict.sell.label}
      sellTooltip={selectionDict.sell.tooltip}
    />
  )
}
