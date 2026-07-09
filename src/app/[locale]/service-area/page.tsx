import { getTranslations } from "next-intl/server";
import ServiceAreaContent from "./ServiceAreaContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "serviceArea" });
  return { title: t("title"), description: t("description") };
}

export default function ServiceAreaPage() {
  return <ServiceAreaContent />;
}
