"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Truck, Scale, Building2, Recycle, Hammer, Cpu, ArrowRight } from "lucide-react"
import AnimatedSection from "@/components/AnimatedSection"

const iconMap: Record<string, React.ReactNode> = {
  "Scrap Collection": <Truck className="h-8 w-8" />,
  "Metal Trading": <Scale className="h-8 w-8" />,
  "Industrial Pickup": <Building2 className="h-8 w-8" />,
  Recycling: <Recycle className="h-8 w-8" />,
  "Ferrous Metals": <Hammer className="h-8 w-8" />,
  "Non-Ferrous Metals": <Cpu className="h-8 w-8" />,
}

export default function ServicesContent() {
  const t = useTranslations("services")
  const items = t.raw("items") as { title: string; desc: string; process: string }[]
  const processSteps = t.raw("process.steps") as { title: string; desc: string }[]

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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8">
            {items.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-white/10 bg-[#1e293b] p-8"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-red-600/10 text-red-400">
                    {iconMap[item.title] || <Truck className="h-8 w-8" />}
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-white">{item.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                    <div className="rounded-lg bg-white/5 p-4">
                      <p className="text-sm font-medium text-red-400">Process:</p>
                      <p className="text-sm text-gray-400">{item.process}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="bg-[#0c1222] py-16" delay={0.2}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-bold text-white">{t("process.title")}</h2>
          <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {processSteps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-[#0f172a]">
                  {i + 1}
                </div>
                <h4 className="font-semibold text-white">{step.title}</h4>
                <p className="mt-1 text-xs text-gray-400">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-16" delay={0.3}>
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold text-white">{t("cta.title")}</h2>
          <Link href="/quote">
            <Button size="lg" className="bg-red-600 text-[#0f172a] hover:bg-red-500 font-semibold text-base">
              {t("cta.button")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </AnimatedSection>
    </>
  )
}
