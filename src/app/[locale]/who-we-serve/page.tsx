import { getTranslations } from "next-intl/server"
import WhoWeServeContent from "./WhoWeServeContent"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "home.whoWeServe" })
  return {
    title: `${t("title")} | Red Dot Metal`,
    description: t("subtitle"),
  }
}

export default function WhoWeServePage() {
  return <WhoWeServeContent />
}