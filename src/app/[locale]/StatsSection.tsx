"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { useCountUp } from "@/lib/useCountUp"
import { useRemoteJson } from "@/lib/useRemoteJson"

type Stat = { value: number; suffix: string; label: string; sort_order: number }
type HomepageContent = { stats: Stat[] }

function StatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const count = useCountUp(value)
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-red-400 sm:text-4xl">
        {count}{suffix}
      </div>
      <div className="mt-1 text-sm text-gray-400">{label}</div>
    </div>
  )
}

export default function StatsSection() {
  const t = useTranslations("home.stats")

  const fallbackStats: Stat[] = [
    { value: 20, suffix: "+", label: t("years"), sort_order: 1 },
    { value: 50000, suffix: "+", label: t("tons"), sort_order: 2 },
    { value: 20, suffix: "", label: t("clients"), sort_order: 3 },
    { value: 90, suffix: "%", label: t("pickups"), sort_order: 4 },
  ]

  const homepage = useRemoteJson<HomepageContent>("/api/homepage", { stats: fallbackStats }, (payload) => {
    const p = payload as { content?: HomepageContent | null }
    const stats = p?.content?.stats
    return { stats: Array.isArray(stats) && stats.length > 0 ? stats : fallbackStats }
  })

  const stats = homepage?.stats ?? fallbackStats

  return (
    <section className="border-y border-white/5 bg-[#0c1222]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 gap-8 md:grid-cols-4"
        >
          {stats.map((stat, i) => (
            <StatItem key={i} value={stat.value} suffix={stat.suffix} label={stat.label} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
