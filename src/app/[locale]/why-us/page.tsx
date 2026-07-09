import { getTranslations } from "next-intl/server"
import WhyUsContent from "./WhyUsContent"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "home.whyUs" })
  return {
    title: `${t("title")} | Red Dot Metal`,
    description: t("subtitle"),
  }
}

export default function WhyUsPage() {
  return <WhyUsContent />
}