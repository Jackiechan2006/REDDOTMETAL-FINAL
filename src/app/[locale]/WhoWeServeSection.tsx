"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { Building2, Factory, Ship, Car, Store, Landmark } from "lucide-react"
import AnimatedSection from "@/components/AnimatedSection"

const sectorIcons = [Building2, Factory, Ship, Car, Store, Landmark]

export default function WhoWeServeSection() {
  const t = useTranslations("home.whoWeServe")
  const items = t.raw("items") as { sector: string; desc: string }[]

  return (
    <AnimatedSection className="border-t border-white/5 bg-[#0c1222] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">{t("title")}</h2>
          <p className="mt-4 text-gray-400">{t("subtitle")}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => {
            const Icon = sectorIcons[i]
            return (
              <motion.div
                key={item.sector}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-3 rounded-xl border border-white/10 bg-[#1e293b] p-5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-600/10 text-red-400">
                  {Icon && <Icon className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">{item.sector}</h3>
                  <p className="mt-1 text-xs text-gray-400">{item.desc}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </AnimatedSection>
  )
}
