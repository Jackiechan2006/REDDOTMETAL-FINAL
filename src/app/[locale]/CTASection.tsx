"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function CTASection() {
  const t = useTranslations("home.cta")

  return (
    <section className="bg-gradient-to-r from-[#0f172a] via-[#1a1a2e] to-[#0f172a] py-20">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-white sm:text-4xl">{t("title")}</h2>
          <Link href="/quote" className="mt-8 inline-block">
            <Button size="lg" className="bg-red-600 text-[#0f172a] hover:bg-red-500 px-10 font-semibold text-base">
              {t("button")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
