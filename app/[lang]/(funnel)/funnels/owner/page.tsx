import { FunnelProvider } from "@/components/funnel/FunnelProvider"
import OwnerFunnel from "@/components/funnel/OwnerFunnel"

export async function generateStaticParams() {
  return [{ lang: "de" }, { lang: "en" }, { lang: "ru" }, { lang: "zh" }]
}

export default function OwnerPage() {
  return (
    <FunnelProvider initialType="owner">
      <OwnerFunnel />
    </FunnelProvider>
  )
}
