"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import {
  Save,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  LayoutDashboard,
  Image as ImageIcon,
  Sparkles,
  BarChart3,
  Megaphone,
  CheckCircle2,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type HeroContent = {
  title: string; subtitle: string; button_text: string; button_link: string
  secondary_button_text: string; secondary_button_link: string
}
type AboutContent = { title: string; description: string; image_url: string }
type Feature = { title: string; desc: string }
type WhyUsContent = { title: string; description: string; features: Feature[] }
type Stat = { value: number; suffix: string; label: string; sort_order: number }
type CtaContent = { title: string; description: string; button_text: string; button_link: string }
type HomepageContent = {
  hero: HeroContent; about: AboutContent; whyUs: WhyUsContent; stats: Stat[]; cta: CtaContent
}

const fallbackContent: HomepageContent = {
  hero: {
    title: "Singapore's Reliable Scrap Metal Recycling & Trading",
    subtitle: "",
    button_text: "Request Pickup",
    button_link: "/quote",
    secondary_button_text: "Our Services",
    secondary_button_link: "/services",
  },
  about: {
    title: "About Red Dot Metal",
    description: "Red Dot Metal is a Singapore-based B2B scrap metal recycling and trading company dedicated to providing reliable, transparent, and environmentally responsible metal waste management solutions.",
    image_url: "",
  },
  whyUs: {
    title: "Why Choose Red Dot Metal",
    description: "We make scrap metal recycling easy, transparent, and profitable",
    features: [
      { title: "Same-Day Service", desc: "We respond within hours and pick up on the same day." },
      { title: "Free Pickup", desc: "No hidden fees. We collect your scrap metal at no cost." },
      { title: "Immediate Payment", desc: "Get paid immediately via PayNow, bank transfer, or cash." },
      { title: "Transparent Pricing", desc: "Real-time market rates with clear weight and price breakdown." },
      { title: "Licensed & Certified", desc: "Fully licensed by NEA. Compliant with all regulations." },
      { title: "We Cover All Areas", desc: "Serving all of Singapore — East, West, North, South, Central." },
    ],
  },
  stats: [
    { value: 20, suffix: "+", label: "Years Experience", sort_order: 1 },
    { value: 50000, suffix: "+", label: "Tons Collected", sort_order: 2 },
    { value: 20, suffix: "", label: "Clients Served", sort_order: 3 },
    { value: 90, suffix: "%", label: "Same-Day Pickup", sort_order: 4 },
  ],
  cta: {
    title: "Ready to turn your scrap into cash?",
    description: "",
    button_text: "Schedule a Pickup Today",
    button_link: "/quote",
  },
}

/* ------------------------------------------------------------------ */
/*  Section definitions                                                */
/* ------------------------------------------------------------------ */

interface SectionDef {
  id: keyof HomepageContent
  title: string
  description: string
  icon: LucideIcon
}

const sectionDefs: SectionDef[] = [
  { id: "hero", title: "Hero Section", description: "Main banner with headline and call-to-action buttons", icon: LayoutDashboard },
  { id: "about", title: "About Section", description: "Company introduction and overview", icon: ImageIcon },
  { id: "whyUs", title: "Why Choose Us", description: "Key differentiators and feature cards", icon: Sparkles },
  { id: "stats", title: "Statistics", description: "Key metrics and achievements", icon: BarChart3 },
  { id: "cta", title: "CTA Section", description: "Call-to-action banner and buttons", icon: Megaphone },
]

/* ------------------------------------------------------------------ */
/*  Auto-expanding textarea                                            */
/* ------------------------------------------------------------------ */

function AutoTextarea({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  const ref = useRef<HTMLTextAreaElement>(null)

  const resize = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = el.scrollHeight + "px"
  }, [])

  useEffect(() => { resize() }, [value, resize])

  return (
    <textarea
      ref={ref}
      value={value}
      onInput={(e) => onChange((e.target as HTMLTextAreaElement).value)}
      placeholder={placeholder}
      rows={1}
      className="w-full resize-none overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-sm leading-relaxed text-white outline-none transition-colors placeholder:text-gray-600 focus:border-red-500/40 focus:bg-white/[0.05]"
    />
  )
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function HomepageManager() {
  const [content, setContent] = useState<HomepageContent>(fallbackContent)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const hasChanges = useRef(false)
  const [showUnsaved, setShowUnsaved] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await fetch("/api/homepage?admin=1", { cache: "no-store" })
        const payload = await res.json() as { content?: HomepageContent | null }
        if (payload.content) setContent(payload.content)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const markChanged = useCallback(() => {
    hasChanges.current = true
    setShowUnsaved(true)
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setMessage("")
    try {
      const res = await fetch("/api/homepage", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      })
      if (!res.ok) throw new Error("Failed to save")
      hasChanges.current = false
      setShowUnsaved(false)
      setMessage("Homepage content saved successfully.")
    } catch {
      setMessage("Failed to save homepage content.")
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    setContent(fallbackContent)
    hasChanges.current = false
    setShowUnsaved(false)
    setMessage("Reset to defaults.")
  }

  const setHero = <K extends keyof HeroContent>(key: K, val: HeroContent[K]) => {
    setContent((p) => ({ ...p, hero: { ...p.hero, [key]: val } }))
    markChanged()
  }
  const setAbout = <K extends keyof AboutContent>(key: K, val: AboutContent[K]) => {
    setContent((p) => ({ ...p, about: { ...p.about, [key]: val } }))
    markChanged()
  }
  const setWhyUs = <K extends keyof Omit<WhyUsContent, "features">>(key: K, val: WhyUsContent[K]) => {
    setContent((p) => ({ ...p, whyUs: { ...p.whyUs, [key]: val } }))
    markChanged()
  }
  const setCta = <K extends keyof CtaContent>(key: K, val: CtaContent[K]) => {
    setContent((p) => ({ ...p, cta: { ...p.cta, [key]: val } }))
    markChanged()
  }

  const updateFeature = (i: number, key: keyof Feature, val: string) => {
    setContent((p) => ({
      ...p,
      whyUs: {
        ...p.whyUs,
        features: p.whyUs.features.map((f, idx) => (idx === i ? { ...f, [key]: val } : f)),
      },
    }))
    markChanged()
  }
  const addFeature = () => {
    setContent((p) => ({
      ...p,
      whyUs: { ...p.whyUs, features: [...p.whyUs.features, { title: "", desc: "" }] },
    }))
    markChanged()
  }
  const removeFeature = (i: number) => {
    setContent((p) => ({
      ...p,
      whyUs: { ...p.whyUs, features: p.whyUs.features.filter((_, idx) => idx !== i) },
    }))
    markChanged()
  }

  const updateStat = (i: number, key: keyof Stat, val: string | number) => {
    setContent((p) => ({
      ...p,
      stats: p.stats.map((s, idx) => (idx === i ? { ...s, [key]: val } : s)),
    }))
    markChanged()
  }
  const addStat = () => {
    setContent((p) => ({
      ...p,
      stats: [...p.stats, { value: 0, suffix: "", label: "", sort_order: p.stats.length + 1 }],
    }))
    markChanged()
  }
  const removeStat = (i: number) => {
    setContent((p) => ({
      ...p,
      stats: p.stats.filter((_, idx) => idx !== i),
    }))
    markChanged()
  }

  return (
    <div className="min-h-[70vh] pb-28">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/10">
            <LayoutDashboard className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Homepage Manager</h2>
            <p className="mt-0.5 text-sm text-gray-400">
              Control your homepage content, statistics, and call-to-action sections
            </p>
          </div>
        </div>
      </div>

      {message && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-3 text-sm text-green-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {message}
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-gray-400">Loading homepage content...</div>
      ) : (
        <div className="space-y-8">
          {/* ── Hero Section ── */}
          <SectionCard {...sectionDefs[0]}>
            <Field label="Hero Title">
              <input value={content.hero.title} onChange={(e) => setHero("title", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Hero Subtitle">
              <AutoTextarea value={content.hero.subtitle} onChange={(v) => setHero("subtitle", v)} placeholder="Optional subtitle text" />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Primary Button Text">
                <input value={content.hero.button_text} onChange={(e) => setHero("button_text", e.target.value)} className={inputCls} />
              </Field>
              <Field label="Primary Button Link">
                <input value={content.hero.button_link} onChange={(e) => setHero("button_link", e.target.value)} className={inputCls} placeholder="/quote" />
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Secondary Button Text">
                <input value={content.hero.secondary_button_text} onChange={(e) => setHero("secondary_button_text", e.target.value)} className={inputCls} />
              </Field>
              <Field label="Secondary Button Link">
                <input value={content.hero.secondary_button_link} onChange={(e) => setHero("secondary_button_link", e.target.value)} className={inputCls} placeholder="/services" />
              </Field>
            </div>
          </SectionCard>

          {/* ── About Section ── */}
          <SectionCard {...sectionDefs[1]}>
            <Field label="Section Title">
              <input value={content.about.title} onChange={(e) => setAbout("title", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Description">
              <AutoTextarea value={content.about.description} onChange={(v) => setAbout("description", v)} placeholder="Company description" />
            </Field>
            <Field label="Image URL">
              <input value={content.about.image_url} onChange={(e) => setAbout("image_url", e.target.value)} className={inputCls} placeholder="https://..." />
            </Field>
            {content.about.image_url && (
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-500">Image Preview</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={content.about.image_url}
                  alt="About section"
                  className="h-40 w-full rounded-lg object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                />
              </div>
            )}
          </SectionCard>

          {/* ── Why Choose Us ── */}
          <SectionCard {...sectionDefs[2]}>
            <Field label="Section Title">
              <input value={content.whyUs.title} onChange={(e) => setWhyUs("title", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Description">
              <AutoTextarea value={content.whyUs.description} onChange={(v) => setWhyUs("description", v)} />
            </Field>
            <div className="mt-2">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-300">Feature Cards</p>
                <button onClick={addFeature} className="inline-flex items-center gap-1.5 text-xs font-medium text-red-400 transition-colors hover:text-red-300">
                  <Plus className="h-3.5 w-3.5" /> Add Feature
                </button>
              </div>
              <div className="space-y-4">
                {content.whyUs.features.map((feature, i) => (
                  <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500">Feature {i + 1}</span>
                      <button onClick={() => removeFeature(i)} className="text-gray-600 transition-colors hover:text-red-400">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <input value={feature.title} onChange={(e) => updateFeature(i, "title", e.target.value)} className={inputCls} placeholder="Feature title" />
                      <AutoTextarea value={feature.desc} onChange={(v) => updateFeature(i, "desc", v)} placeholder="Feature description" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>

          {/* ── Statistics ── */}
          <SectionCard {...sectionDefs[3]}>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm text-gray-400">Define the key metrics shown on your homepage</p>
              <button onClick={addStat} className="inline-flex items-center gap-1.5 text-xs font-medium text-red-400 transition-colors hover:text-red-300">
                <Plus className="h-3.5 w-3.5" /> Add Statistic
              </button>
            </div>
            <div className="space-y-4">
              {content.stats.map((stat, i) => (
                <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500">Statistic {i + 1}</span>
                    <button onClick={() => removeStat(i)} className="text-gray-600 transition-colors hover:text-red-400">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Field label="Number">
                      <input
                        type="number"
                        value={stat.value || ""}
                        onChange={(e) => updateStat(i, "value", parseInt(e.target.value) || 0)}
                        className={inputCls}
                        placeholder="20"
                      />
                    </Field>
                    <Field label="Suffix">
                      <input
                        value={stat.suffix}
                        onChange={(e) => updateStat(i, "suffix", e.target.value)}
                        className={inputCls}
                        placeholder="+ or %"
                      />
                    </Field>
                    <Field label="Label">
                      <input
                        value={stat.label}
                        onChange={(e) => updateStat(i, "label", e.target.value)}
                        className={inputCls}
                        placeholder="Years Experience"
                      />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* ── CTA Section ── */}
          <SectionCard {...sectionDefs[4]}>
            <Field label="CTA Title">
              <input value={content.cta.title} onChange={(e) => setCta("title", e.target.value)} className={inputCls} />
            </Field>
            <Field label="CTA Description">
              <AutoTextarea value={content.cta.description} onChange={(v) => setCta("description", v)} placeholder="Optional description below the title" />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Button Text">
                <input value={content.cta.button_text} onChange={(e) => setCta("button_text", e.target.value)} className={inputCls} />
              </Field>
              <Field label="Button Link">
                <input value={content.cta.button_link} onChange={(e) => setCta("button_link", e.target.value)} className={inputCls} placeholder="/quote" />
              </Field>
            </div>
          </SectionCard>
        </div>
      )}

      {/* Sticky save bar */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {showUnsaved && (
          <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-400">
            Unsaved changes
          </span>
        )}
        <button
          onClick={handleReset}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#1e293b] px-4 py-2.5 text-sm font-medium text-gray-300 shadow-lg transition-colors hover:border-white/20 hover:text-white"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition-colors hover:bg-red-500 disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Section card wrapper                                               */
/* ------------------------------------------------------------------ */

function SectionCard({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string
  description: string
  icon: LucideIcon
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#111827]/80 transition-colors hover:border-white/[0.1]">
      <button
        type="button"
        onClick={() => setCollapsed((p) => !p)}
        className="flex w-full items-center gap-4 px-6 py-5 text-left transition-colors hover:bg-white/[0.02]"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.04]">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <p className="mt-0.5 text-sm text-gray-500">{description}</p>
        </div>
        {collapsed ? (
          <ChevronDown className="h-5 w-5 shrink-0 text-gray-500" />
        ) : (
          <ChevronUp className="h-5 w-5 shrink-0 text-gray-500" />
        )}
      </button>
      {!collapsed && (
        <div className="border-t border-white/[0.06] px-6 py-6">
          <div className="space-y-5">{children}</div>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Field + Input helpers                                              */
/* ------------------------------------------------------------------ */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-300">{label}</label>
      {children}
    </div>
  )
}

const inputCls =
  "w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-gray-600 focus:border-red-500/40 focus:bg-white/[0.05]"
