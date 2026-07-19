"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import { Star, User, MessageSquare, Send, X } from "lucide-react"
import AnimatedSection from "@/components/AnimatedSection"
import { useRemoteJson } from "@/lib/useRemoteJson"

const FEATURED_TESTIMONIALS = [
  { id: "featured-1", name: "James Tan", company: "Lion City Recycling", text: "Red Dot Metals has been our go-to partner for scrap metal recycling for over three years. Their pricing is transparent, pickup is always on time, and the team is incredibly professional.", rating: 5 },
  { id: "featured-2", name: "Sarah Lim", company: "GreenSteel Construction", text: "We switched to Red Dot Metals after years of inconsistent service elsewhere. The difference was immediate — fair prices, fast response, and a team that actually cares about the environment.", rating: 5 },
  { id: "featured-3", name: "Ahmed Ibrahim", company: "Ibrahim Engineering", text: "Outstanding service from start to finish. They handled a large industrial scrap pickup for us seamlessly. The admin team kept us informed throughout the entire process.", rating: 5 },
  { id: "featured-4", name: "David Chen", company: "Apex Demolition", text: "Reliable, honest, and efficient. Red Dot Metals consistently offers the best scrap metal rates in Singapore. Their online quote system makes everything so much easier.", rating: 5 },
  { id: "featured-5", name: "Priya Nair", company: "Pacific Builders", text: "We have been working with Red Dot Metals for all our construction scrap needs. Their professionalism and commitment to sustainable recycling practices truly set them apart.", rating: 5 },
  { id: "featured-6", name: "Michael Wong", company: "StarShip Industries", text: "From copper wiring to aluminium extrusions, Red Dot Metals handles everything with care and precision. Their pickup scheduling system is incredibly convenient for our operations.", rating: 5 },
]

type TestimonialRow = {
  id: string
  name: string
  company?: string
  text: string
  rating: number
  featured?: boolean
  pinned?: boolean
  sort_order?: number
}

type TestimonialSummary = {
  totalReviews: number
  averageRating: number
}

export default function TestimonialsContent() {
  const t = useTranslations("home.testimonials")
  const [refreshToken, setRefreshToken] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [name, setName] = useState("")
  const [company, setCompany] = useState("")
  const [rating, setRating] = useState(5)
  const [feedback, setFeedback] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const payload = useRemoteJson<{ testimonials?: TestimonialRow[]; summary?: TestimonialSummary }>(
    `/api/testimonials?refresh=${refreshToken}`,
    { testimonials: [], summary: { totalReviews: 0, averageRating: 0 } },
    (response) => {
      const testimonials = (response as { testimonials?: TestimonialRow[] })?.testimonials
      const summary = (response as { summary?: TestimonialSummary })?.summary
      return {
        testimonials: Array.isArray(testimonials) ? testimonials : [],
        summary: summary ?? { totalReviews: 0, averageRating: 0 },
      }
    }
  )

  const dbTestimonials = payload.testimonials ?? []
  const allTestimonials = [...FEATURED_TESTIMONIALS, ...dbTestimonials]
  const totalReviews = FEATURED_TESTIMONIALS.length + (payload.summary?.totalReviews ?? 0)
  const averageRating = allTestimonials.length > 0
    ? Math.round((allTestimonials.reduce((sum, item) => sum + item.rating, 0) / allTestimonials.length) * 10) / 10
    : 5

  const resetForm = () => {
    setName("")
    setCompany("")
    setRating(5)
    setFeedback("")
    setSubmitted(false)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, company, rating, text: feedback }),
      })
      if (!response.ok) throw new Error("Failed")
      setSubmitted(true)
      setRefreshToken((c) => c + 1)
    } catch {
      setSubmitted(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1f2937]" />
        <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_20%_20%,rgba(220,38,38,0.22),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.08),transparent_24%),radial-gradient(circle_at_50%_100%,rgba(220,38,38,0.18),transparent_28%)]" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold text-white sm:text-5xl">
            {t("title")}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-4 text-lg text-gray-400">
            {t("subtitle")}
          </motion.p>
        </div>
      </section>

      <AnimatedSection className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-[#1e293b] p-5">
              <p className="text-sm text-gray-400">Total reviews</p>
              <p className="mt-2 text-3xl font-bold text-white">{totalReviews}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#1e293b] p-5">
              <p className="text-sm text-gray-400">Average rating</p>
              <div className="mt-2 flex items-end gap-3">
                <p className="text-3xl font-bold text-white">{averageRating.toFixed(1)}</p>
                <div className="flex gap-1 pb-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className={`h-4 w-4 ${index < Math.round(averageRating) ? "fill-red-500 text-red-400" : "text-white/15"}`} />
                  ))}
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#1e293b] p-5 flex items-center">
              <button
                onClick={() => { resetForm(); setShowModal(true) }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-500"
              >
                <MessageSquare className="h-4 w-4" /> Leave Feedback
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#111827] p-6 shadow-2xl shadow-black/20">
            <div className="mb-5">
              <h2 className="text-2xl font-bold text-white">What our clients say</h2>
              <p className="mt-1 text-sm text-gray-400">Trusted by businesses across Singapore.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {allTestimonials.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 6) * 0.08 }}
                  className="flex flex-col rounded-xl border border-white/10 bg-[#1e293b] p-6 transition-all hover:border-red-500/20"
                >
                  <div className="mb-3 flex gap-1">
                    {Array.from({ length: item.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-red-500 text-red-400" />
                    ))}
                  </div>
                  <p className="mb-5 flex-1 text-sm leading-relaxed text-gray-300 italic">&ldquo;{item.text}&rdquo;</p>
                  <div className="flex items-center gap-3 border-t border-white/5 pt-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-600/10 text-red-400">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.company || "Verified Customer"}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#111827] p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Leave Feedback</h2>
                  <p className="mt-1 text-sm text-gray-400">Your review will appear after admin approval.</p>
                </div>
                <button onClick={() => setShowModal(false)} className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {submitted ? (
                <div className="py-10 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-green-400">
                    <Send className="h-7 w-7" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Thank you!</h3>
                  <p className="mt-2 text-sm text-gray-400">Your feedback has been submitted and is pending admin approval.</p>
                  <button
                    onClick={() => { resetForm(); setShowModal(false) }}
                    className="mt-6 rounded-lg bg-white/10 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/20"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="modal-name" className="text-sm font-medium text-gray-200">Name</label>
                    <input id="modal-name" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-white/10 bg-[#0f172a] px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-red-500" placeholder="Your name" required />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="modal-company" className="text-sm font-medium text-gray-200">Company</label>
                    <input id="modal-company" value={company} onChange={(e) => setCompany(e.target.value)} className="w-full rounded-lg border border-white/10 bg-[#0f172a] px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-red-500" placeholder="Company or organization" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-200">Rating</label>
                    <div className="flex gap-2">
                      {Array.from({ length: 5 }).map((_, index) => {
                        const value = index + 1
                        const active = value <= rating
                        return (
                          <button key={value} type="button" onClick={() => setRating(value)}
                            className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${active ? "border-red-500 bg-red-500/10 text-red-400" : "border-white/10 bg-[#0f172a] text-white/40 hover:border-white/20 hover:text-white"}`}
                            aria-label={`${value} star rating`}
                          >
                            <Star className={`h-4 w-4 ${active ? "fill-red-500" : ""}`} />
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="modal-feedback" className="text-sm font-medium text-gray-200">Feedback</label>
                    <textarea id="modal-feedback" value={feedback} onChange={(e) => setFeedback(e.target.value)}
                      className="min-h-28 w-full resize-none rounded-lg border border-white/10 bg-[#0f172a] px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-red-500"
                      placeholder="Tell us about your experience" required
                    />
                  </div>

                  <button type="submit" disabled={submitting}
                    className="w-full rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-500 disabled:opacity-60"
                  >
                    {submitting ? "Submitting…" : "Submit Feedback"}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
