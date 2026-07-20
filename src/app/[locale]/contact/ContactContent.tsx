"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react"
import AnimatedSection from "@/components/AnimatedSection"
import ContactForm from "@/components/ContactForm"
import ContactInstructions from "@/components/ContactInstructions"
import { useRemoteJson } from "@/lib/useRemoteJson"

type SiteSettings = {
  phone: string
  whatsapp: string
  email: string
  address: string
  google_maps_url: string
  business_hours: string
}

export default function ContactContent() {
  const t = useTranslations("contact")
  const settings = useRemoteJson<SiteSettings>("/api/settings", {
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    google_maps_url: "",
    business_hours: "",
  }, (payload) => {
    const s = (payload as { settings?: Partial<SiteSettings> })?.settings ?? {}
    return {
      phone: s.phone ?? "",
      whatsapp: s.whatsapp ?? "",
      email: s.email ?? "",
      address: s.address ?? "",
      google_maps_url: s.google_maps_url ?? "",
      business_hours: s.business_hours ?? "",
    }
  })

  const contactDetails = [
    { icon: Phone, label: "Phone", value: settings.phone, href: `tel:${settings.phone.replace(/\s+/g, "")}` },
    { icon: MessageCircle, label: "WhatsApp", value: settings.whatsapp, href: settings.whatsapp },
    { icon: Mail, label: "Email", value: settings.email, href: `mailto:${settings.email}` },
    { icon: MapPin, label: "Address", value: settings.address, href: settings.google_maps_url },
    { icon: Clock, label: "Hours", value: settings.business_hours },
  ]

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
          <div className="grid gap-12 lg:grid-cols-5">
            <div className="lg:col-span-3 space-y-8">
              <ContactInstructions />
              <div className="rounded-xl border border-white/10 bg-[#1e293b] p-6">
                <h3 className="mb-4 text-lg font-bold text-white">Send us a Message</h3>
                <ContactForm />
              </div>
            </div>
            <div className="lg:col-span-2 space-y-6">
              {contactDetails.map((detail) => {
                const Icon = detail.icon
                const content = (
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-600/10 text-red-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-400">{detail.label}</p>
                      <p className="text-sm text-white whitespace-pre-line">{detail.value}</p>
                    </div>
                  </div>
                )
                if (detail.href) {
                  return (
                    <a key={detail.label} href={detail.href} target={detail.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="block rounded-xl border border-white/10 bg-[#1e293b] p-4 transition-colors hover:border-red-500/50">
                      {content}
                    </a>
                  )
                }
                return (
                  <div key={detail.label} className="rounded-xl border border-white/10 bg-[#1e293b] p-4">
                    {content}
                  </div>
                )
              })}
              <div className="overflow-hidden rounded-xl border border-white/10">
                <iframe
                  src="https://www.google.com/maps/embed/v1/place?q=Blk+236+%2305-141+Bukit+Batok+East+Ave+5+Singapore+650236&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"
                  width="100%"
                  height="220"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Red Dot Metal Location"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                />
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </>
  )
}
