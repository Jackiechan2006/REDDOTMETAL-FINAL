"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { FileText, Calendar, Weight, DollarSign } from "lucide-react"
import AnimatedSection from "@/components/AnimatedSection"

const stepIcons = [FileText, Calendar, Weight, DollarSign]

export default function HowItWorksSection() {
  const t = useTranslations("home.howItWorks")
  const steps = t.raw("steps") as { title: string; desc: string }[]

  return (
    <AnimatedSection className="bg-[#0c1222] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">{t("title")}</h2>
          <p className="mt-4 text-gray-400">{t("subtitle")}</p>
        </div>
        <div className="relative grid gap-8 md:grid-cols-4">
          {steps.map((step, i) => {
            const Icon = stepIcons[i]
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative text-center"
              >
                {i < steps.length - 1 && (
                  <div className="absolute left-[60%] top-8 hidden h-0.5 w-[80%] bg-gradient-to-r from-red-600/50 to-transparent md:block" />
                )}
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-600/10 text-red-400">
                  <Icon className="h-7 w-7" />
                </div>
                <div className="mb-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-[#0f172a]">
                  {i + 1}
                </div>
                <h3 className="mt-2 text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-1 text-sm text-gray-400">{step.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </AnimatedSection>
  )
}
