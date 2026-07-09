"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { Truck, Scale, Building2, Recycle, MapPin } from "lucide-react"
import AnimatedSection from "@/components/AnimatedSection"

const iconMap: Record<string, React.ReactNode> = {
  "Scrap Collection": <Truck className="h-8 w-8" />,
  "Metal Trading": <Scale className="h-8 w-8" />,
  "Industrial Pickup": <Building2 className="h-8 w-8" />,
  "Recycling": <Recycle className="h-8 w-8" />,
  "On-Site Pickup": <MapPin className="h-8 w-8" />,
  // Malay
  "Pengumpulan Buruk": <Truck className="h-8 w-8" />,
  "Perdagangan Logam": <Scale className="h-8 w-8" />,
  "Pengambilan Industri": <Building2 className="h-8 w-8" />,
  "Kitar Semula": <Recycle className="h-8 w-8" />,
  "Pengambilan Di Tapak": <MapPin className="h-8 w-8" />,
  // Chinese
  "废料收集": <Truck className="h-8 w-8" />,
  "金属贸易": <Scale className="h-8 w-8" />,
  "工业取件": <Building2 className="h-8 w-8" />,
  "回收利用": <Recycle className="h-8 w-8" />,
  "现场取件": <MapPin className="h-8 w-8" />,
  // Tamil
  "ஸ்கிராப் சேகரிப்பு": <Truck className="h-8 w-8" />,
  "உலோக வர்த்தகம்": <Scale className="h-8 w-8" />,
  "தொழில்துறை பிக்கப்": <Building2 className="h-8 w-8" />,
  "மறுசுழற்சி": <Recycle className="h-8 w-8" />,
  "இடத்தில் பிக்கப்": <MapPin className="h-8 w-8" />,
  // Bengali
  "স্ক্র্যাপ সংগ্রহ": <Truck className="h-8 w-8" />,
  "ধাতু ব্যবসা": <Scale className="h-8 w-8" />,
  "শিল্প পিকআপ": <Building2 className="h-8 w-8" />,
  "পুনর্ব্যবহার": <Recycle className="h-8 w-8" />,
  "সাইটে পিকআপ": <MapPin className="h-8 w-8" />,
}

export default function ServicesSection() {
  const t = useTranslations("home.services")
  const items = t.raw("items") as { title: string; desc: string }[]

  return (
    <AnimatedSection className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">{t("title")}</h2>
          <p className="mt-4 text-gray-400">{t("subtitle")}</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group rounded-xl border border-white/10 bg-[#1e293b] p-6 transition-all hover:border-red-500/50 hover:shadow-lg hover:shadow-red-600/5"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-red-600/10 text-red-400 transition-colors group-hover:bg-red-600/20">
                {iconMap[item.title] || <Truck className="h-8 w-8" />}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">{item.title}</h3>
              <p className="text-sm leading-relaxed text-gray-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}
