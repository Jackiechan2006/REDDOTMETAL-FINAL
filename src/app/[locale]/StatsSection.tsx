"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { useCountUp } from "@/lib/useCountUp"

const stats = [
  { key: "years", value: 20, suffix: "+" },
  { key: "tons", value: 50000, suffix: "+" },
  { key: "clients", value: 20, suffix: "" },
  { key: "pickups", value: 90, suffix: "%" },
]

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
          {stats.map((stat) => (
            <StatItem key={stat.key} value={stat.value} suffix={stat.suffix} label={t(stat.key)} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
