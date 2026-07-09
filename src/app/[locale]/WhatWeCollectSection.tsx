"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { Package, Recycle, Cpu, Hammer, Zap, Wrench } from "lucide-react"
import AnimatedSection from "@/components/AnimatedSection"

const iconMap: Record<string, React.ReactNode> = {
  Steel: <Hammer className="h-6 w-6" />,
  Iron: <Hammer className="h-6 w-6" />,
  Copper: <Zap className="h-6 w-6" />,
  Aluminium: <Package className="h-6 w-6" />,
  Brass: <Wrench className="h-6 w-6" />,
  "Stainless Steel": <Cpu className="h-6 w-6" />,
  Lead: <Recycle className="h-6 w-6" />,
  Zinc: <Recycle className="h-6 w-6" />,
}

export default function WhatWeCollectSection() {
  const t = useTranslations("home.whatWeCollect")
  const items = t.raw("items") as { name: string; desc: string }[]

  return (
    <AnimatedSection className="border-t border-white/5 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">{t("title")}</h2>
          <p className="mt-4 text-gray-400">{t("subtitle")}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 rounded-xl border border-white/10 bg-[#1e293b] p-4 transition-all hover:border-red-500/50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-600/10 text-red-400">
                {iconMap[item.name] || <Recycle className="h-6 w-6" />}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">{item.name}</h3>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}
