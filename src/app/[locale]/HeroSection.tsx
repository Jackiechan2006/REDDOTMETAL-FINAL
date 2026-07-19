"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, MessageCircle, Phone } from "lucide-react"
import { useRemoteJson } from "@/lib/useRemoteJson"

type SiteSettings = { phone: string; whatsapp: string }
type HomepageContent = {
  hero: { title: string; subtitle: string; button_text: string; button_link: string; secondary_button_text: string; secondary_button_link: string }
}

export default function HeroSection() {
  const t = useTranslations("home.hero")

  const settings = useRemoteJson<SiteSettings>("/api/settings", { phone: "", whatsapp: "" }, (payload) => {
    const s = (payload as { settings?: Partial<SiteSettings> })?.settings ?? {}
    return { phone: s.phone ?? "", whatsapp: s.whatsapp ?? "" }
  })

  const homepage = useRemoteJson<HomepageContent>("/api/homepage", {
    hero: { title: t("title"), subtitle: "", button_text: t("ctaPickup"), button_link: "/quote", secondary_button_text: t("ctaServices"), secondary_button_link: "/services" },
  }, (payload) => {
    const p = payload as { content?: HomepageContent | null }
    const h = p?.content?.hero
    if (!h?.title) return { hero: { title: t("title"), subtitle: "", button_text: t("ctaPickup"), button_link: "/quote", secondary_button_text: t("ctaServices"), secondary_button_link: "/services" } }
    return { hero: h }
  })

  const hero = homepage?.hero ?? {
    title: t("title"),
    subtitle: "",
    button_text: t("ctaPickup"),
    button_link: "/quote",
    secondary_button_text: t("ctaServices"),
    secondary_button_link: "/services",
  }

  return (
    <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1a1a2e] to-[#16213e]">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534996858221-380b92700493?w=1920&q=80')] bg-cover bg-center opacity-15" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-[#0f172a]/60" />
      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
        >
          {hero.title}
        </motion.h1>
        {hero.subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mx-auto mt-6 max-w-3xl text-lg text-gray-400"
          >
            {hero.subtitle}
          </motion.p>
        )}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <div className="flex flex-wrap justify-center gap-3">
            <Link href={hero.button_link || "/quote"}>
              <Button size="lg" className="bg-red-600 text-white hover:bg-red-500 px-8 font-semibold text-base">
                {hero.button_text || t("ctaPickup")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href={hero.secondary_button_link || "/services"}>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 font-semibold text-base">
                {hero.secondary_button_text || t("ctaServices")}
              </Button>
            </Link>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-6 flex flex-wrap justify-center gap-3"
        >
          {settings.whatsapp && (
            <a
              href={settings.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-green-500/10 px-5 py-2 text-sm font-medium text-green-400 transition-colors hover:bg-green-500/20"
            >
              <MessageCircle className="h-4 w-4" />
              {t("ctaWhatsApp")}
            </a>
          )}
          {settings.phone && (
            <a
              href={`tel:${settings.phone.replace(/\s+/g, "")}`}
              className="inline-flex items-center gap-2 rounded-full bg-red-600/10 px-5 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-600/20"
            >
              <Phone className="h-4 w-4" />
              {t("ctaCall")}
            </a>
          )}
        </motion.div>
      </div>
    </section>
  )
}
