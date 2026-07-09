import { getTranslations } from "next-intl/server";
import PricesContent from "./PricesContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "prices" });
  return { title: t("title"), description: t("description") };
}

export default function PricesPage() {
  return <PricesContent />;
}
