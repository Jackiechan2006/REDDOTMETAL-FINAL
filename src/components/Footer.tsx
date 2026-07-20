"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react"
import LanguageSwitcher from "./LanguageSwitcher"
import Image from "next/image"
import { useRemoteJson } from "@/lib/useRemoteJson"

type SiteSettings = {
  company_name: string
  phone: string
  whatsapp: string
  email: string
  address: string
  google_maps_url: string
  business_hours: string
  footer_text: string
  facebook_url: string
  instagram_url: string
  linkedin_url: string
  carousell_url: string
}

const footerLinks = [
  { href: "/", label: "home" },
  { href: "/about", label: "about" },
  { href: "/services", label: "services" },
  { href: "/testimonials", label: "testimonials" },
  { href: "/service-area", label: "serviceArea" },
  { href: "/prices", label: "prices" },
  { href: "/contact", label: "contact" },
  { href: "/quote", label: "quote" },
]

const facebookIcon = (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const instagramIcon = (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
)

const linkedinIcon = (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const carousellIcon = (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4.877 2.702C5.722 1.54 7.147.88 8.626.88c1.478 0 2.904.66 3.749 1.822l3.807 5.26-1.768 1.277-3.807-5.26c-.428-.592-1.08-.938-1.762-.938-.682 0-1.335.346-1.763.938L2.86 13.05l-1.768 1.277 5.784-8.068L4.877 2.702zM19.123 21.298c-.845 1.162-2.27 1.822-3.749 1.822-1.478 0-2.904-.66-3.749-1.822l-3.807-5.26 1.768-1.277 3.807 5.26c.428.592 1.08.938 1.762.938.682 0 1.335-.346 1.763-.938l3.807-5.26 1.768 1.277-5.784 8.068zM12 7.058l-3.705 5.164L12 17.386l3.705-5.164L12 7.058z"/>
  </svg>
)

export default function Footer() {
  const t = useTranslations("common")
  const settings = useRemoteJson<SiteSettings>("/api/settings", {
    company_name: "Red Dot Metal",
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    google_maps_url: "",
    business_hours: "",
    footer_text: t("footer.description"),
    facebook_url: "",
    instagram_url: "",
    linkedin_url: "",
    carousell_url: "",
  }, (payload) => {
    const s = (payload as { settings?: Partial<SiteSettings> })?.settings ?? {}
    return {
      company_name: s.company_name ?? "Red Dot Metal",
      phone: s.phone ?? "",
      whatsapp: s.whatsapp ?? "",
      email: s.email ?? "",
      address: s.address ?? "",
      google_maps_url: s.google_maps_url ?? "",
      business_hours: s.business_hours ?? "",
      footer_text: s.footer_text ?? t("footer.description"),
      facebook_url: s.facebook_url ?? "",
      instagram_url: s.instagram_url ?? "",
      linkedin_url: s.linkedin_url ?? "",
      carousell_url: s.carousell_url ?? "",
    }
  })

  const hasContactInfo = settings.phone || settings.whatsapp || settings.email || settings.address
  const hasSocialLinks = settings.facebook_url || settings.instagram_url || settings.linkedin_url || settings.carousell_url

  return (
    <footer className="border-t border-white/10 bg-[#0f172a]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.jpeg" alt="Red Dot Metals" width={120} height={40} className="h-10 w-auto object-contain" />
            </Link>
            <p className="text-sm text-gray-400">{settings.footer_text}</p>
            <div className="flex gap-3 pt-1">
              {settings.whatsapp && (
                <a href={settings.whatsapp} target="_blank" rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10 text-green-400 transition-colors hover:bg-green-500/20">
                  <MessageCircle className="h-4 w-4" />
                </a>
              )}
              {settings.phone && (
                <a href={`tel:${settings.phone.replace(/\s+/g, "")}`}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-red-400 transition-colors hover:bg-red-500/20">
                  <Phone className="h-4 w-4" />
                </a>
              )}
              {settings.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white">
                  {facebookIcon}
                </a>
              )}
              {settings.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white">
                  {instagramIcon}
                </a>
              )}
              {settings.linkedin_url && (
                <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white">
                  {linkedinIcon}
                </a>
              )}
              {settings.carousell_url && (
                <a href={settings.carousell_url} target="_blank" rel="noopener noreferrer" aria-label="Carousell"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white">
                  {carousellIcon}
                </a>
              )}
            </div>
            <div className="pt-2">
              <LanguageSwitcher />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-300">{t("footer.quickLinks")}</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 transition-colors hover:text-red-400">
                    {t(`nav.${link.label}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          {hasContactInfo && (
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-300">{t("footer.contact")}</h3>
              <ul className="space-y-3">
                {settings.phone && (
                  <li className="flex items-start gap-2 text-sm text-gray-400">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                    <a href={`tel:${settings.phone.replace(/\s+/g, "")}`} className="hover:text-red-400 transition-colors">{settings.phone}</a>
                  </li>
                )}
                {settings.whatsapp && (
                  <li>
                    <a href={settings.whatsapp} target="_blank" rel="noopener noreferrer"
                      className="flex items-start gap-2 text-sm text-gray-400 transition-colors hover:text-green-400">
                      <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                      WhatsApp: {settings.phone}
                    </a>
                  </li>
                )}
                {settings.email && (
                  <li className="flex items-start gap-2 text-sm text-gray-400">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                    <a href={`mailto:${settings.email}`} className="hover:text-red-400 transition-colors break-all">{settings.email}</a>
                  </li>
                )}
                {settings.address && (
                  <li className="flex items-start gap-2 text-sm text-gray-400">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                    <a
                      href={settings.google_maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-red-400"
                    >
                      {settings.address}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Hours + Social */}
          <div className="space-y-4">
            {settings.business_hours && (
              <>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">Operating Hours</h3>
                <div className="flex items-start gap-2 text-sm text-gray-400">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                  <span>{settings.business_hours}</span>
                </div>
              </>
            )}
            {hasSocialLinks && (
              <div className={settings.business_hours ? "pt-2" : ""}>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-300">Follow Us</h3>
                <div className="flex flex-col gap-2">
                  {settings.facebook_url && (
                    <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-red-400">
                      {facebookIcon}
                      Facebook
                    </a>
                  )}
                  {settings.instagram_url && (
                    <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-red-400">
                      {instagramIcon}
                      Instagram
                    </a>
                  )}
                  {settings.linkedin_url && (
                    <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-red-400">
                      {linkedinIcon}
                      LinkedIn
                    </a>
                  )}
                  {settings.carousell_url && (
                    <a href={settings.carousell_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-red-400">
                      {carousellIcon}
                      Carousell
                    </a>
                  )}
                </div>
              </div>
            )}
            <div className={settings.business_hours || hasSocialLinks ? "pt-2" : ""}>
              <Link href="/admin">
                <span className="text-xs text-gray-600 transition-colors hover:text-gray-400 cursor-pointer">Admin Panel</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-8 text-center text-sm text-gray-500">
          {t("footer.copyright")}
        </div>
      </div>
    </footer>
  )
}
