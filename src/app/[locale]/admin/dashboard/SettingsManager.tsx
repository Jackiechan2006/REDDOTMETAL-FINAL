"use client"

import { useEffect, useState } from "react"
import { Save, RotateCcw, Settings2, ToggleLeft, ToggleRight } from "lucide-react"

type SettingsState = Record<string, string>

const defaultSettings: SettingsState = {
  company_name: "Red Dot Metal",
  logo_url: "",
  phone: "+65 8867 3343",
  whatsapp: "https://wa.me/6588673343",
  email: "sgreddotmetal@gmail.com",
  address: "Blk 236, #05-141, Bukit Batok East Ave 5, Singapore 650236",
  google_maps_url: "https://www.google.com/maps/search/?api=1&query=Blk%20236,%20%2305-141,%20Bukit%20Batok%20East%20Ave%205,%20Singapore%20650236",
  business_hours: "7:00 AM – 11:00 PM (Daily)",
  footer_text: "Singapore's trusted B2B scrap metal recycling partner.",
  hero_title: "Singapore's trusted scrap metal partner",
  hero_subtitle: "Fast collection, transparent pricing, and same-day service for businesses across Singapore.",
  about_section: "Red Dot Metal is a Singapore-based B2B scrap metal recycling and trading company dedicated to providing reliable, transparent, and environmentally responsible metal waste management solutions.",
  why_choose_us: "We make scrap metal recycling easy, transparent, and profitable. Same-day pickup, free collection, instant payment, and fully NEA-licensed operations.",
  cta_title: "Ready to turn your scrap into cash?",
  cta_button: "Schedule a Pickup Today",
  cta_whatsapp: "Chat on WhatsApp",
  cta_call: "Call for Best Price",
  seo_title: "Red Dot Metal | Scrap Metal Recycling Singapore",
  seo_description: "Singapore's trusted B2B scrap metal recycling and collection partner.",
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

const textFields = [
  ["company_name", "Company Name"],
  ["logo_url", "Logo URL"],
  ["phone", "Phone Number"],
  ["whatsapp", "WhatsApp URL"],
  ["email", "Email"],
  ["address", "Address"],
  ["google_maps_url", "Google Maps URL"],
  ["business_hours", "Business Hours"],
  ["hero_title", "Hero Title"],
  ["hero_subtitle", "Hero Subtitle"],
  ["about_section", "About Section"],
  ["why_choose_us", "Why Choose Us"],
  ["cta_title", "CTA Title"],
  ["cta_button", "CTA Button"],
  ["cta_whatsapp", "CTA WhatsApp Label"],
  ["cta_call", "CTA Call Label"],
  ["footer_text", "Footer Text"],
  ["seo_title", "SEO Title"],
  ["seo_description", "SEO Description"],
  ["maintenance_message", "Maintenance Message"],
] as const

const toggleFields = [
  ["website_enabled", "Website ON/OFF"],
  ["maintenance_mode", "Maintenance Mode"],
  ["show_homepage_sections", "Show Homepage Sections"],
  ["show_testimonials", "Show Testimonials"],
  ["show_feedback_form", "Show Feedback Form"],
  ["show_prices", "Show Prices"],
  ["show_contact_form", "Show Contact Form"],
  ["show_quote_form", "Show Quote Form"],
  ["show_cta", "Show CTA"],
] as const

export default function SettingsManager() {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const response = await fetch("/api/settings", { cache: "no-store" })
        const payload = await response.json()
        const siteSettings = (payload as { settings?: SettingsState })?.settings ?? {}
        setSettings((current) => ({ ...current, ...siteSettings }))
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const updateField = (key: string, value: string) => {
    setSettings((current) => ({ ...current, [key]: value }))
  }

  const updateToggle = (key: string, checked: boolean) => {
    setSettings((current) => ({ ...current, [key]: checked ? "true" : "false" }))
  }

  const handleReset = () => {
    setSettings(defaultSettings)
    setMessage("Reset to defaults. Remember to save if you want to persist this state.")
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage("")
    try {
      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      if (!response.ok) throw new Error("Failed to save settings")

      setMessage("Website settings saved.")
    } catch {
      setMessage("Failed to save settings.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 rounded-2xl border border-white/10 bg-[#111827] p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">Website Settings</h2>
          <p className="mt-1 text-sm text-gray-400">Control the public website without touching code.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleReset} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 transition-colors hover:border-white/20 hover:text-white">
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
          <button onClick={handleSave} disabled={saving || loading} className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-500 disabled:opacity-60">
            <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>

      {message && <p className="text-sm text-gray-300">{message}</p>}

      {loading ? (
        <div className="py-10 text-center text-gray-400">Loading settings...</div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4 rounded-xl border border-white/10 bg-[#0f172a] p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-300"><Settings2 className="h-4 w-4 text-red-400" /> Business Info</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {textFields.slice(0, 8).map(([key, label]) => (
                <Field key={key} label={label}>
                  <input value={settings[key] ?? ""} onChange={(event) => updateField(key, event.target.value)} className={inputClass} />
                </Field>
              ))}
            </div>
            {settings.logo_url && (
              <div className="rounded-lg border border-white/10 bg-[#111827] p-3">
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-400">Logo Preview</p>
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={settings.logo_url} alt="Company Logo" className="h-12 w-auto object-contain rounded bg-white p-1" onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }} />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4 rounded-xl border border-white/10 bg-[#0f172a] p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">Homepage Content</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {textFields.slice(8, 17).map(([key, label]) => (
                <Field key={key} label={label}>
                  {(key === "about_section" || key === "why_choose_us" || key === "hero_subtitle" || key === "footer_text") ? (
                    <textarea rows={3} value={settings[key] ?? ""} onChange={(event) => updateField(key, event.target.value)} className={`${inputClass} resize-none`} />
                  ) : (
                    <input value={settings[key] ?? ""} onChange={(event) => updateField(key, event.target.value)} className={inputClass} />
                  )}
                </Field>
              ))}
            </div>
          </div>

          <div className="space-y-4 rounded-xl border border-white/10 bg-[#0f172a] p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">SEO & Maintenance</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {textFields.slice(17).map(([key, label]) => (
                <Field key={key} label={label}>
                  {key === "seo_description" || key === "maintenance_message" ? (
                    <textarea rows={3} value={settings[key] ?? ""} onChange={(event) => updateField(key, event.target.value)} className={`${inputClass} resize-none`} />
                  ) : (
                    <input value={settings[key] ?? ""} onChange={(event) => updateField(key, event.target.value)} className={inputClass} />
                  )}
                </Field>
              ))}
            </div>
          </div>

          <div className="space-y-4 rounded-xl border border-white/10 bg-[#0f172a] p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">Website Toggles</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {toggleFields.map(([key, label]) => {
                const enabled = settings[key] === "true"
                return (
                  <button key={key} type="button" onClick={() => updateToggle(key, !enabled)} className="flex items-center justify-between rounded-lg border border-white/10 px-4 py-3 text-left text-sm text-gray-200 transition-colors hover:border-red-500/40">
                    <span>{label}</span>
                    {enabled ? <ToggleRight className="h-5 w-5 text-green-400" /> : <ToggleLeft className="h-5 w-5 text-gray-500" />}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-1.5">
      <span className="text-xs font-medium uppercase tracking-wider text-gray-400">{label}</span>
      {children}
    </label>
  )
}

const inputClass = "w-full rounded-lg border border-white/10 bg-[#111827] px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-gray-500 focus:border-red-500"
