"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { Clock, Sparkles, BadgeCheck, Banknote, ShieldCheck, Map } from "lucide-react"
import AnimatedSection from "@/components/AnimatedSection"

const featureIcons = [Clock, Sparkles, Banknote, BadgeCheck, ShieldCheck, Map]

export default function WhyUsSection() {
  const t = useTranslations("home.whyUs")
  const features = t.raw("features") as { title: string; desc: string }[]

  return (
    <AnimatedSection className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">{t("title")}</h2>
          <p className="mt-4 text-gray-400">{t("subtitle")}</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = featureIcons[i] || Sparkles
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-xl border border-white/10 bg-[#1e293b] p-6 text-center transition-all hover:border-red-500/50"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-600/10 text-red-400">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </AnimatedSection>
  )
}
