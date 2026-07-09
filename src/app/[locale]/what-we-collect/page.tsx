import { getTranslations } from "next-intl/server"
import WhatWeCollectContent from "./WhatWeCollectContent"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "home.whatWeCollect" })
  return {
    title: `${t("title")} | Red Dot Metal`,
    description: t("subtitle"),
  }
}

export default function WhatWeCollectPage() {
  return <WhatWeCollectContent />
}