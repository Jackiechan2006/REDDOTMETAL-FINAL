import { getTranslations } from "next-intl/server";
import TestimonialsContent from "./TestimonialsContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "testimonials" });
  return { title: t("title"), description: t("description") };
}

export default function TestimonialsPage() {
  return <TestimonialsContent />;
}
