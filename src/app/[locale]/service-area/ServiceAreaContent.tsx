"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { MapPin, MessageCircle, Phone } from "lucide-react"
import AnimatedSection from "@/components/AnimatedSection"
import { useRemoteJson } from "@/lib/useRemoteJson"

type SiteSettings = {
  phone: string
  whatsapp: string
}

export default function ServiceAreaContent() {
  const t = useTranslations("serviceArea")
  const settings = useRemoteJson<SiteSettings>("/api/settings", {
    phone: "+65 8867 3343",
    whatsapp: "https://wa.me/6588673343",
  }, (payload) => {
    const siteSettings = (payload as { settings?: Partial<SiteSettings> })?.settings ?? {}
    return {
      phone: siteSettings.phone ?? "+65 8867 3343",
      whatsapp: siteSettings.whatsapp ?? "https://wa.me/6588673343",
    }
  })

  return (
    <>
      <section className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1a1a2e] to-[#16213e]" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold text-white sm:text-5xl">
            {t("hero.title")}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-4 text-lg text-gray-400">
            {t("hero.subtitle")}
          </motion.p>
        </div>
      </section>

      <AnimatedSection className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-xl border border-white/10 bg-[#1e293b] p-8"
          >
            <div className="flex items-start gap-4">
              <MapPin className="mt-1 h-6 w-6 shrink-0 text-red-400" />
              <p className="text-base leading-relaxed text-gray-300">{t("coverage")}</p>
            </div>
          </motion.div>

          <div className="mt-8 rounded-xl border border-white/10 bg-[#1e293b] p-6">
            <p className="text-sm text-gray-300">{t("industrialEstates")}</p>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a href={settings.whatsapp} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-400">
              <MessageCircle className="h-4 w-4" />
              WhatsApp Us
            </a>
            <a href={`tel:${settings.phone.replace(/\s+/g, "")}`}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-500">
              <Phone className="h-4 w-4" />
              Call Now
            </a>
          </div>
        </div>
      </AnimatedSection>
    </>
  )
}
