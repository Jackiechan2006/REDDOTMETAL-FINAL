import { getTranslations } from "next-intl/server";
import ServicesContent from "./ServicesContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services" });
  return { title: t("title"), description: t("description") };
}

export default function ServicesPage() {
  return <ServicesContent />;
}
