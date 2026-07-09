"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
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
  { metal: "Steel / Iron", price: "0.15 – 0.25", condition: "Light scrap" },
  { metal: "Steel (Heavy)", price: "0.25 – 0.35", condition: "Heavy melting" },
  { metal: "Zinc", price: "1.00 – 1.40", condition: "Clean, solids" },
  { metal: "Electric Motors", price: "0.80 – 1.20", condition: "Complete units" },
]

export default function PriceSection() {
  const t = useTranslations("home.prices")

  return (
    <AnimatedSection className="border-t border-white/5 bg-[#0c1222] py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">{t("title")}</h2>
          <p className="mt-4 text-gray-400">{t("subtitle")}</p>
        </div>
        <div className="overflow-hidden rounded-xl border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-6 py-4 font-semibold text-red-400">{t("table.headerMetal")}</th>
                  <th className="px-6 py-4 font-semibold text-red-400">{t("table.headerPrice")}</th>
                  <th className="px-6 py-4 font-semibold text-red-400 hidden sm:table-cell">{t("table.headerCondition")}</th>
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
                    <td className="px-6 py-3 font-medium text-white">{row.metal}</td>
                    <td className="px-6 py-3 text-red-400 font-semibold">S$ {row.price}</td>
                    <td className="px-6 py-3 text-gray-400 hidden sm:table-cell">{row.condition}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-gray-500">{t("note")}</p>
      </div>
    </AnimatedSection>
  )
}
