"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import WhatWeCollectSection from "../WhatWeCollectSection"

export default function WhatWeCollectContent() {
  const t = useTranslations("home.whatWeCollect")

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
            {t("title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-gray-400"
          >
            {t("subtitle")}
          </motion.p>
        </div>
      </section>

      <WhatWeCollectSection />
    </>
  )
}