"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { MessageCircle, Phone } from "lucide-react"
import AnimatedSection from "@/components/AnimatedSection"

const defaultPrices = [
  { metal: "Copper (Bright)", price: "8.50 – 9.20", condition: "Clean, uncoated" },
  { metal: "Copper (Mixed)", price: "6.80 – 7.50", condition: "Insulated, mixed grades" },
  { metal: "Aluminium (Extrusions)", price: "1.80 – 2.20", condition: "Clean, dry" },
  { metal: "Aluminium (Mixed)", price: "1.20 – 1.60", condition: "With contaminants" },
  { metal: "Stainless Steel 304", price: "1.50 – 1.90", condition: "Clean, solids" },
  { metal: "Stainless Steel 316", price: "2.00 – 2.50", condition: "Clean, solids" },
  { metal: "Brass", price: "4.50 – 5.20", condition: "Clean, solids" },
  { metal: "Lead", price: "1.80 – 2.30", condition: "Clean, solids" },
  { metal: "Steel / Iron (Light)", price: "0.15 – 0.25", condition: "Light scrap" },
  { metal: "Steel (Heavy)", price: "0.25 – 0.35", condition: "Heavy melting" },
  { metal: "Zinc", price: "1.00 – 1.40", condition: "Clean, solids" },
  { metal: "Electric Motors", price: "0.80 – 1.20", condition: "Complete units" },
  { metal: "Copper Wire (Insulated)", price: "3.50 – 4.50", condition: "PVC insulated" },
  { metal: "Aluminium Cans", price: "0.60 – 0.90", condition: "Compressed, clean" },
]

export default function PricesContent() {
  const t = useTranslations("prices")

  return (
    <>
      <section className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1a1a2e] to-[#16213e]" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white sm:text-5xl"
          >
            {t("hero.title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-gray-400"
          >
            {t("hero.subtitle")}
          </motion.p>
        </div>
      </section>

      <AnimatedSection className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-xl border border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="px-6 py-4 font-semibold text-red-400">{t("table.headerMetal")}</th>
                    <th className="px-6 py-4 font-semibold text-red-400">{t("table.headerPrice")}</th>
                    <th className="px-6 py-4 font-semibold text-red-400">{t("table.headerCondition")}</th>
                  </tr>
                </thead>
                <tbody>
                  {defaultPrices.map((row, i) => (
                    <motion.tr
                      key={row.metal}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-white/5 transition-colors hover:bg-white/5"
                    >
                      <td className="px-6 py-3.5 font-medium text-white">{row.metal}</td>
                      <td className="px-6 py-3.5 text-red-400 font-semibold whitespace-nowrap">S$ {row.price}</td>
                      <td className="px-6 py-3.5 text-gray-400">{row.condition}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-6 text-center text-sm text-gray-500">{t("note")}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/6588673343"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-400"
            >
              <MessageCircle className="h-4 w-4" />
              {t("ctaWhatsApp")}
            </a>
            <a
              href="tel:+6588673343"
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-[#0f172a] transition-colors hover:bg-red-500"
            >
              <Phone className="h-4 w-4" />
              {t("ctaCall")}
            </a>
          </div>
        </div>
      </AnimatedSection>
    </>
  )
}
