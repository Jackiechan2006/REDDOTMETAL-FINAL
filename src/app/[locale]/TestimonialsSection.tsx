"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { Star, User } from "lucide-react"
import AnimatedSection from "@/components/AnimatedSection"

export default function TestimonialsSection() {
  const t = useTranslations("home.testimonials")
  const items = t.raw("items") as { name: string; role: string; yearsAgo: string; text: string; rating: number }[]

  return (
    <AnimatedSection className="border-t border-white/5 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">{t("title")}</h2>
          <p className="mt-4 text-gray-400">{t("subtitle")}</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col rounded-xl border border-white/10 bg-[#1e293b] p-6 transition-all hover:border-red-500/20"
            >
              <div className="mb-3 flex gap-1">
                {Array.from({ length: item.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-red-500 text-red-400" />
                ))}
              </div>
              <p className="mb-5 flex-1 text-sm leading-relaxed text-gray-300 italic">"{item.text}"</p>
              <div className="flex items-center gap-3 border-t border-white/5 pt-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-600/10 text-red-400">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.role} · {item.yearsAgo}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}
