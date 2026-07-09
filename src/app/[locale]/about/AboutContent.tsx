"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { Shield, Heart, Leaf, Award } from "lucide-react"
import AnimatedSection from "@/components/AnimatedSection"

const valueIcons = [Shield, Heart, Leaf]

const badges = [
  "NEA Licensed",
  "ISO 14001",
  "WSH Council",
  "SCRA Member",
  "BizSafe 3",
]

export default function AboutContent() {
  const t = useTranslations("about")
  const values = t.raw("values") as { title: string; desc: string }[]

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

      <AnimatedSection className="py-16" id="what-we-collect">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="text-lg leading-relaxed text-gray-300">{t("overview")}</p>
        </div>
      </AnimatedSection>

      <AnimatedSection className="bg-[#0c1222] py-16" delay={0.1} id="who-we-serve">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-[#1e293b] p-8">
              <h3 className="mb-4 text-xl font-bold text-red-400">Our Mission</h3>
              <p className="text-gray-300 leading-relaxed">{t("mission")}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-[#1e293b] p-8">
              <h3 className="mb-4 text-xl font-bold text-red-400">Our Vision</h3>
              <p className="text-gray-300 leading-relaxed">{t("vision")}</p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-16" delay={0.2} id="why-us">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-bold text-white">Our Values</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {values.map((v, i) => {
              const Icon = valueIcons[i]
              return (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-xl border border-white/10 bg-[#1e293b] p-6 text-center"
                >
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-600/10 text-red-400">
                    {Icon && <Icon className="h-6 w-6" />}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white">{v.title}</h3>
                  <p className="text-sm text-gray-400">{v.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="bg-[#0c1222] py-16" delay={0.3}>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="mb-6 text-3xl font-bold text-white">Our Team</h2>
          <p className="text-gray-300 leading-relaxed">{t("team")}</p>
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-16" delay={0.4}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center text-2xl font-bold text-white">Accreditations & Memberships</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {badges.map((badge) => (
              <div
                key={badge}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-[#1e293b] px-5 py-2 text-sm font-medium text-gray-300"
              >
                <Award className="h-4 w-4 text-red-400" />
                {badge}
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </>
  )
}
