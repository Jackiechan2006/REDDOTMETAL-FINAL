"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { Star, User, ShieldCheck, MessageSquare, Send } from "lucide-react"
import AnimatedSection from "@/components/AnimatedSection"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useRemoteJson } from "@/lib/useRemoteJson"

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
  const toast = useToast()
  const fallbackItems = t.raw("items") as { name: string; role: string; yearsAgo: string; text: string; rating: number }[]
  const fallbackPayload = {
    testimonials: fallbackItems.map((item, index) => ({
      id: String(index + 1),
      name: item.name,
      company: item.role,
      text: item.text,
      rating: item.rating,
      featured: index < 3,
      pinned: index === 0,
      sort_order: index,
    })),
    summary: {
      totalReviews: fallbackItems.length,
      averageRating: 5,
    } satisfies TestimonialSummary,
  }

  const [refreshToken, setRefreshToken] = useState(0)
  const [name, setName] = useState("")
  const [company, setCompany] = useState("")
  const [rating, setRating] = useState(5)
  const [feedback, setFeedback] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const payload = useRemoteJson<{ testimonials?: TestimonialRow[]; summary?: TestimonialSummary }>(
    `/api/testimonials?refresh=${refreshToken}`,
    fallbackPayload,
    (response) => {
      const testimonials = (response as { testimonials?: TestimonialRow[] })?.testimonials
      const summary = (response as { summary?: TestimonialSummary })?.summary
      return {
        testimonials: Array.isArray(testimonials) && testimonials.length > 0 ? testimonials : fallbackPayload.testimonials,
        summary: summary ?? fallbackPayload.summary,
      }
    }
  )

  const items = payload.testimonials ?? fallbackPayload.testimonials
  const summary = payload.summary ?? fallbackPayload.summary

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          company,
          rating,
          text: feedback,
        }),
      })

      if (!response.ok) throw new Error("Failed to submit feedback")

      toast.toast({
        title: "Feedback received",
        description: "Thank you. Your review is now pending admin approval.",
        variant: "success",
      })

      setName("")
      setCompany("")
      setRating(5)
      setFeedback("")
      setRefreshToken((current) => current + 1)
    } catch {
      toast.toast({
        title: "Submission failed",
        description: "Please try again in a moment.",
        variant: "error",
      })
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
          <div className="mb-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-[#1e293b] p-5">
              <p className="text-sm text-gray-400">Total reviews</p>
              <p className="mt-2 text-3xl font-bold text-white">{summary.totalReviews}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#1e293b] p-5">
              <p className="text-sm text-gray-400">Average rating</p>
              <div className="mt-2 flex items-end gap-3">
                <p className="text-3xl font-bold text-white">{summary.averageRating.toFixed(1)}</p>
                <div className="flex gap-1 pb-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className={`h-4 w-4 ${index < Math.round(summary.averageRating) ? "fill-red-500 text-red-400" : "text-white/15"}`} />
                  ))}
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#1e293b] p-5">
              <p className="text-sm text-gray-400">Approval flow</p>
              <p className="mt-2 flex items-center gap-2 text-sm text-gray-200"><ShieldCheck className="h-4 w-4 text-red-400" /> Pending reviews stay hidden until approved.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#1e293b] p-5">
              <p className="text-sm text-gray-400">Customer feedback</p>
              <p className="mt-2 flex items-center gap-2 text-sm text-gray-200"><MessageSquare className="h-4 w-4 text-red-400" /> Share your experience with the team.</p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
            <div className="rounded-3xl border border-white/10 bg-[#111827] p-6 shadow-2xl shadow-black/20">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">Featured approved reviews</h2>
                  <p className="mt-1 text-sm text-gray-400">Only approved testimonials are shown publicly.</p>
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex flex-col rounded-xl border border-white/10 bg-[#1e293b] p-6 transition-all hover:border-red-500/20"
                  >
                    {(item.featured || item.pinned) && (
                      <div className="mb-4 flex flex-wrap gap-2">
                        {item.featured && <span className="rounded-full bg-red-500/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-red-300">Featured</span>}
                        {item.pinned && <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-gray-200">Pinned</span>}
                      </div>
                    )}
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
                        <p className="text-xs text-gray-500">{item.company ?? "Customer"}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#111827] p-6 shadow-2xl shadow-black/20">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white">Leave feedback</h2>
                <p className="mt-1 text-sm text-gray-400">Your review will appear after admin approval.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-200">Name</Label>
                  <Input id="name" value={name} onChange={(event) => setName(event.target.value)} className="border-white/10 bg-[#0f172a] text-white" placeholder="Your name" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company" className="text-gray-200">Company</Label>
                  <Input id="company" value={company} onChange={(event) => setCompany(event.target.value)} className="border-white/10 bg-[#0f172a] text-white" placeholder="Company or organization" />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-200">Rating</Label>
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 5 }).map((_, index) => {
                      const value = index + 1
                      const active = value <= rating

                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setRating(value)}
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
                  <Label htmlFor="feedback" className="text-gray-200">Feedback</Label>
                  <Textarea
                    id="feedback"
                    value={feedback}
                    onChange={(event) => setFeedback(event.target.value)}
                    className="min-h-32 border-white/10 bg-[#0f172a] text-white"
                    placeholder="Tell us about your experience"
                    required
                  />
                </div>

                <Button type="submit" disabled={submitting} className="w-full bg-red-600 text-white hover:bg-red-500">
                  {submitting ? "Submitting…" : <><Send className="mr-2 h-4 w-4" /> Submit feedback</>}
                </Button>
              </form>
            </div>
          </div>

        </div>
      </AnimatedSection>
    </>
  )
}
