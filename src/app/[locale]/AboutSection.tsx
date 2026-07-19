"use client"

import { motion } from "framer-motion"
import AnimatedSection from "@/components/AnimatedSection"
import { useRemoteJson } from "@/lib/useRemoteJson"

type HomepageContent = {
  about: { title: string; description: string; image_url: string }
}

export default function AboutSection() {
  const content = useRemoteJson<HomepageContent>("/api/homepage", { about: { title: "", description: "", image_url: "" } }, (payload) => {
    const p = payload as { content?: HomepageContent | null }
    return p?.content ?? { about: { title: "", description: "", image_url: "" } }
  })

  if (!content.about.title && !content.about.description) return null

  return (
    <AnimatedSection className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {content.about.title && (
              <h2 className="text-3xl font-bold text-white sm:text-4xl">{content.about.title}</h2>
            )}
            {content.about.description && (
              <p className="mt-6 text-lg leading-relaxed text-gray-400">{content.about.description}</p>
            )}
          </motion.div>
          {content.about.image_url && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="overflow-hidden rounded-2xl border border-white/10"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={content.about.image_url}
                alt={content.about.title || "About Red Dot Metal"}
                className="h-full w-full object-cover"
              />
            </motion.div>
          )}
        </div>
      </div>
    </AnimatedSection>
  )
}
