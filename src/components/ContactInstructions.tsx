"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { MessageCircle, Phone } from "lucide-react"

const contactDetails = [
  { icon: Phone, label: "Phone", valueKey: "details.phone", href: "tel:+6567891234" },
  { icon: MessageCircle, label: "WhatsApp", valueKey: "details.whatsapp", href: "https://wa.me/6567891234" },
]

const instructionIcons = [
  "📸",
  "💬",
  "🚛",
]

export default function ContactInstructions() {
  const t = useTranslations("contact")
  const steps = t.raw("instructions.steps") as { number: number; title: string; desc: string }[]

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-white/10 bg-[#1e293b] p-6">
        <h3 className="mb-4 text-lg font-bold text-white">{t("quickActions.title")}</h3>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://wa.me/6567891234"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg bg-green-500/10 px-4 py-2.5 text-sm font-medium text-green-400 transition-colors hover:bg-green-500/20"
          >
            <MessageCircle className="h-4 w-4" />
            {t("quickActions.whatsapp")}
          </a>
          <a
            href="tel:+6567891234"
            className="flex items-center gap-2 rounded-lg bg-red-600/10 px-4 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-600/20"
          >
            <Phone className="h-4 w-4" />
            {t("quickActions.call")}
          </a>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-lg font-bold text-white">{t("instructions.title")}</h3>
        <p className="mb-6 text-sm text-gray-400">{t("instructions.subtitle")}</p>
        <div className="space-y-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-4 rounded-xl border border-white/10 bg-[#1e293b] p-5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-600/10 text-lg">
                {instructionIcons[i]}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-[#0f172a]">
                    {step.number}
                  </span>
                  <h4 className="font-semibold text-white text-sm">{step.title}</h4>
                </div>
                <p className="mt-1 text-sm text-gray-400">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
