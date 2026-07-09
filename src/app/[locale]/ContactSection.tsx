"use client"

import { useTranslations } from "next-intl"
import AnimatedSection from "@/components/AnimatedSection"
import ContactForm from "@/components/ContactForm"

export default function ContactSection() {
  const t = useTranslations("home.contact")

  return (
    <AnimatedSection className="border-t border-white/5 py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">{t("title")}</h2>
          <p className="mt-4 text-gray-400">{t("subtitle")}</p>
        </div>
        <ContactForm />
      </div>
    </AnimatedSection>
  )
}
