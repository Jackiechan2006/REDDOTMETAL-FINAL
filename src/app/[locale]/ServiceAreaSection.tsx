"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import AnimatedSection from "@/components/AnimatedSection"

export default function ServiceAreaSection() {
  const t = useTranslations("home.serviceArea")
  return (
    <AnimatedSection className="border-t border-white/5 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">{t("title")}</h2>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center text-lg leading-relaxed text-gray-300"
        >
          {t("coverage")}
        </motion.p>
      </div>
    </AnimatedSection>
  )
}
