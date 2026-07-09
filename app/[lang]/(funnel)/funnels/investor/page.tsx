import { Suspense } from "react"
import { FunnelProvider } from "@/components/funnel/FunnelProvider"
import InvestorFunnel from "@/components/funnel/InvestorFunnel"

export async function generateStaticParams() {
  return [{ lang: "de" }, { lang: "en" }, { lang: "ru" }, { lang: "zh" }]
}

export default function InvestorPage() {
  return (
    <FunnelProvider initialType="investor">
      <Suspense>
        <InvestorFunnel />
      </Suspense>
    </FunnelProvider>
  )
}
