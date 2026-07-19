"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { MessageCircle } from "lucide-react"
import QuoteForm from "@/components/QuoteForm"
import { useRemoteJson } from "@/lib/useRemoteJson"

type SiteSettings = {
  whatsapp: string
}

export default function QuoteContent() {
  const t = useTranslations("quote")
  const settings = useRemoteJson<SiteSettings>("/api/settings", { whatsapp: "" }, (payload) => {
    const s = (payload as { settings?: Partial<SiteSettings> })?.settings ?? {}
    return { whatsapp: s.whatsapp ?? "" }
  })

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

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 rounded-xl border border-green-500/20 bg-green-500/5 p-6 text-center"
          >
            <h3 className="text-lg font-bold text-green-400">{t("quickQuote.title")}</h3>
            <p className="mt-1 text-sm text-gray-400">{t("quickQuote.desc")}</p>
            <a
              href={settings.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-green-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-400"
            >
              <MessageCircle className="h-4 w-4" />
              {t("quickQuote.button")}
            </a>
          </motion.div>

          <QuoteForm />
        </div>
      </section>
    </>
  )
}
