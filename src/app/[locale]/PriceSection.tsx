"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import AnimatedSection from "@/components/AnimatedSection"
import { useRemoteJson } from "@/lib/useRemoteJson"

type PriceRow = { id: string; metal: string; price: string; condition: string; updated_at?: string }

const defaultPrices: PriceRow[] = []

export default function PriceSection() {
  const t = useTranslations("home.prices")
  const prices = useRemoteJson<PriceRow[]>("/api/prices", defaultPrices, (payload) => {
    const remotePrices = (payload as { prices?: PriceRow[] })?.prices
    return Array.isArray(remotePrices) ? remotePrices : defaultPrices
  })

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
                {prices.map((row, i) => (
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
