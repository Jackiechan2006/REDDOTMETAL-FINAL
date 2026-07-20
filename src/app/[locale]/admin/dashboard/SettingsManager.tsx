"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import {
  Save,
  RotateCcw,
  ChevronDown,
  Building2,
  Phone,
  Globe,
  Megaphone,
  Share2,
  PanelBottom,
  Search,
  ToggleLeft,
  ToggleRight,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react"

type SettingsState = Record<string, string>

/* ------------------------------------------------------------------ */
/*  Defaults (unchanged logic)                                         */
/* ------------------------------------------------------------------ */

const defaultSettings: SettingsState = {
  company_name: "Red Dot Metal",
  logo_url: "",
  phone: "+65 8867 3343",
  whatsapp: "https://wa.me/6588673343",
  email: "info@reddotmetals.com",
  address: "Blk 236, #05-141, Bukit Batok East Ave 5, Singapore 650236",
  google_maps_url:
    "https://www.google.com/maps/search/?api=1&query=Blk%20236,%20%2305-141,%20Bukit%20Batok%20East%20Ave%205,%20Singapore%20650236",
  business_hours: "7:00 AM – 11:00 PM (Daily)",
  footer_text: "Singapore's trusted B2B scrap metal recycling partner.",
  facebook_url: "",
  instagram_url: "",
  linkedin_url: "",
  carousell_url: "",
  hero_title: "Singapore's trusted scrap metal partner",
  hero_subtitle:
    "Fast collection, transparent pricing, and same-day service for businesses across Singapore.",
  about_section:
    "Red Dot Metal is a Singapore-based B2B scrap metal recycling and trading company dedicated to providing reliable, transparent, and environmentally responsible metal waste management solutions.",
  why_choose_us:
    "We make scrap metal recycling easy, transparent, and profitable. Same-day pickup, free collection, instant payment, and fully NEA-licensed operations.",
  cta_title: "Ready to turn your scrap into cash?",
  cta_button: "Schedule a Pickup Today",
  cta_whatsapp: "Chat on WhatsApp",
  cta_call: "Call for Best Price",
  seo_title: "Red Dot Metal | Scrap Metal Recycling Singapore",
  seo_description:
    "Singapore's trusted B2B scrap metal recycling and collection partner.",
  maintenance_mode: "false",
  website_enabled: "true",
  show_homepage_sections: "true",
  show_testimonials: "true",
  show_feedback_form: "true",
  show_prices: "true",
  show_contact_form: "true",
  show_quote_form: "true",
  show_cta: "true",
  maintenance_message: "We are currently performing scheduled maintenance.",
}

/* ------------------------------------------------------------------ */
/*  Toggle keys (unchanged)                                            */
/* ------------------------------------------------------------------ */

const booleanKeys = new Set([
  "maintenance_mode",
  "website_enabled",
  "show_homepage_sections",
  "show_testimonials",
  "show_feedback_form",
  "show_prices",
  "show_contact_form",
  "show_quote_form",
  "show_cta",
])

/* ------------------------------------------------------------------ */
/*  Section definitions                                                */
/* ------------------------------------------------------------------ */

interface FieldDef {
  key: string
  label: string
  type?: "input" | "textarea" | "toggle"
}

interface SectionDef {
  id: string
  title: string
  description: string
  icon: LucideIcon
  fields: FieldDef[]
}

const sections: SectionDef[] = [
  {
    id: "business",
    title: "Business Information",
    description: "Core company identity and branding",
    icon: Building2,
    fields: [
      { key: "company_name", label: "Company Name" },
      { key: "logo_url", label: "Logo URL" },
    ],
  },
  {
    id: "contact",
    title: "Contact Information",
    description: "Phone, email, address, and business hours",
    icon: Phone,
    fields: [
      { key: "phone", label: "Phone Number" },
      { key: "whatsapp", label: "WhatsApp URL" },
      { key: "email", label: "Email Address" },
      { key: "address", label: "Address", type: "textarea" },
      { key: "google_maps_url", label: "Google Maps URL" },
      { key: "business_hours", label: "Business Hours" },
    ],
  },
  {
    id: "homepage",
    title: "Homepage Content",
    description: "Hero section, about text, and value proposition",
    icon: Globe,
    fields: [
      { key: "hero_title", label: "Hero Title" },
      { key: "hero_subtitle", label: "Hero Subtitle", type: "textarea" },
      { key: "about_section", label: "About Section", type: "textarea" },
      { key: "why_choose_us", label: "Why Choose Us", type: "textarea" },
    ],
  },
  {
    id: "cta",
    title: "CTA Section",
    description: "Call-to-action banners and button labels",
    icon: Megaphone,
    fields: [
      { key: "cta_title", label: "CTA Title" },
      { key: "cta_button", label: "Primary Button Text" },
      { key: "cta_whatsapp", label: "WhatsApp Button Label" },
      { key: "cta_call", label: "Call Button Label" },
    ],
  },
  {
    id: "social",
    title: "Social Media",
    description: "Facebook, Instagram, LinkedIn, and Carousell profiles",
    icon: Share2,
    fields: [
      { key: "facebook_url", label: "Facebook URL" },
      { key: "instagram_url", label: "Instagram URL" },
      { key: "linkedin_url", label: "LinkedIn URL" },
      { key: "carousell_url", label: "Carousell URL" },
    ],
  },
  {
    id: "footer",
    title: "Footer",
    description: "Footer tagline and copyright text",
    icon: PanelBottom,
    fields: [
      { key: "footer_text", label: "Footer Text" },
    ],
  },
  {
    id: "seo",
    title: "SEO & Maintenance",
    description: "Meta tags, SEO description, and maintenance mode",
    icon: Search,
    fields: [
      { key: "seo_title", label: "SEO Title" },
      { key: "seo_description", label: "SEO Description", type: "textarea" },
      { key: "maintenance_message", label: "Maintenance Message", type: "textarea" },
    ],
  },
]

/* Toggle section — separate from accordion sections */
const toggleFields: FieldDef[] = [
  { key: "website_enabled", label: "Website ON/OFF", type: "toggle" },
  { key: "maintenance_mode", label: "Maintenance Mode", type: "toggle" },
  { key: "show_homepage_sections", label: "Show Homepage Sections", type: "toggle" },
  { key: "show_testimonials", label: "Show Testimonials", type: "toggle" },
  { key: "show_feedback_form", label: "Show Feedback Form", type: "toggle" },
  { key: "show_prices", label: "Show Prices", type: "toggle" },
  { key: "show_contact_form", label: "Show Contact Form", type: "toggle" },
  { key: "show_quote_form", label: "Show Quote Form", type: "toggle" },
  { key: "show_cta", label: "Show CTA", type: "toggle" },
]

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function SettingsManager() {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [openSection, setOpenSection] = useState<string | null>(null)
  const hasChanges = useRef(false)
  const [showUnsaved, setShowUnsaved] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await fetch("/api/settings", { cache: "no-store" })
        const payload = await res.json()
        const s = (payload as { settings?: SettingsState })?.settings ?? {}
        setSettings((prev) => ({ ...prev, ...s }))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  /* ---- helpers ---- */

  const markChanged = useCallback(() => {
    hasChanges.current = true
    setShowUnsaved(true)
  }, [])

  const updateField = useCallback(
    (key: string, value: string) => {
      setSettings((prev) => ({ ...prev, [key]: value }))
      markChanged()
    },
    [markChanged],
  )

  const updateToggle = useCallback(
    (key: string, checked: boolean) => {
      setSettings((prev) => ({ ...prev, [key]: checked ? "true" : "false" }))
      markChanged()
    },
    [markChanged],
  )

  const handleReset = () => {
    setSettings(defaultSettings)
    hasChanges.current = false
    setShowUnsaved(false)
    setMessage("Reset to defaults. Remember to save if you want to persist this state.")
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage("")
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })
      if (!res.ok) throw new Error("Failed to save settings")
      hasChanges.current = false
      setShowUnsaved(false)
      setMessage("Settings saved successfully.")
    } catch {
      setMessage("Failed to save settings.")
    } finally {
      setSaving(false)
    }
  }

  const toggleSection = (id: string) => {
    setOpenSection((prev) => (prev === id ? null : id))
  }

  /* ---- render ---- */

  return (
    <div className="min-h-[70vh] pb-28">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/10">
            <Globe className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Website Settings</h2>
            <p className="mt-0.5 text-sm text-gray-400">
              Manage your public website content and configuration
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
        <div className="py-20 text-center text-gray-400">Loading settings...</div>
      ) : (
        <div className="space-y-6">
          {/* Accordion sections */}
          {sections.map((section) => {
            const isOpen = openSection === section.id
            const Icon = section.icon
            return (
              <div
                key={section.id}
                className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#111827]/80 transition-colors hover:border-white/[0.1]"
              >
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className="flex w-full items-center gap-4 px-6 py-5 text-left transition-colors hover:bg-white/[0.02]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.04]">
                    <Icon className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-white">
                      {section.title}
                    </h3>
                    <p className="mt-0.5 text-sm text-gray-500">
                      {section.description}
                    </p>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-gray-500 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-white/[0.06] px-6 py-6">
                    <div className="space-y-5">
                      {section.fields.map((field) => (
                        <div key={field.key}>
                          <label className="mb-1.5 block text-sm font-medium text-gray-300">
                            {field.label}
                          </label>
                          {field.type === "textarea" ? (
                            <AutoTextarea
                              value={settings[field.key] ?? ""}
                              onChange={(v) => updateField(field.key, v)}
                            />
                          ) : (
                            <input
                              value={settings[field.key] ?? ""}
                              onChange={(e) => updateField(field.key, e.target.value)}
                              className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-gray-600 focus:border-red-500/40 focus:bg-white/[0.05]"
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Logo preview */}
                    {section.id === "business" && settings.logo_url && (
                      <div className="mt-6 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                          Logo Preview
                        </p>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={settings.logo_url}
                          alt="Company Logo"
                          className="h-14 w-auto rounded-lg bg-white p-2 object-contain"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).style.display = "none"
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}

          {/* Website Toggles — always visible, not collapsible */}
          <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#111827]/80">
            <div className="flex items-center gap-4 px-6 py-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.04]">
                <ToggleRight className="h-5 w-5 text-gray-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">
                  Website Toggles
                </h3>
                <p className="mt-0.5 text-sm text-gray-500">
                  Show or hide sections across the website
                </p>
              </div>
            </div>

            <div className="border-t border-white/[0.06] px-6 py-6">
              <div className="grid gap-3 sm:grid-cols-2">
                {toggleFields.map((field) => {
                  const enabled = settings[field.key] === "true"
                  return (
                    <button
                      key={field.key}
                      type="button"
                      onClick={() => updateToggle(field.key, !enabled)}
                      className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-4 text-left text-sm text-gray-300 transition-colors hover:border-white/[0.12] hover:bg-white/[0.04]"
                    >
                      <span>{field.label}</span>
                      {enabled ? (
                        <ToggleRight className="h-6 w-6 shrink-0 text-green-400" />
                      ) : (
                        <ToggleLeft className="h-6 w-6 shrink-0 text-gray-600" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
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
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Auto-expanding textarea                                            */
/* ------------------------------------------------------------------ */

function AutoTextarea({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const ref = useRef<HTMLTextAreaElement>(null)

  const resize = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = el.scrollHeight + "px"
  }, [])

  useEffect(() => {
    resize()
  }, [value, resize])

  return (
    <textarea
      ref={ref}
      value={value}
      onInput={(e) => {
        onChange((e.target as HTMLTextAreaElement).value)
      }}
      rows={1}
      className="w-full resize-none overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-sm leading-relaxed text-white outline-none transition-colors placeholder:text-gray-600 focus:border-red-500/40 focus:bg-white/[0.05]"
    />
  )
}
