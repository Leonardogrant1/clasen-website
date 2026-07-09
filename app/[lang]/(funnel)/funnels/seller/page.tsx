import { Suspense } from "react"
import { FunnelProvider } from "@/components/funnel/FunnelProvider"
import SellerFunnel from "@/components/funnel/SellerFunnel"

export async function generateStaticParams() {
  return [{ lang: "de" }, { lang: "en" }, { lang: "ru" }, { lang: "zh" }]
}

export default function SellerPage() {
  return (
    <FunnelProvider initialType="seller">
      <Suspense>
        <SellerFunnel />
      </Suspense>
    </FunnelProvider>
  )
}
