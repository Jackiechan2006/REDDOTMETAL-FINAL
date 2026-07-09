"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react"
import LanguageSwitcher from "./LanguageSwitcher"
import Image from "next/image"

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

const socialLinks = [
  {
    name: "Carousell",
    href: "https://carousell.app.link/OopEaY8Wk4b",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
      </svg>
    ),
    label: "Carousell",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/red-dot-metal-164bb3411",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    label: "LinkedIn",
  },
]

export default function Footer() {
  const t = useTranslations("common")

  return (
    <footer className="border-t border-white/10 bg-[#0f172a]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.jpeg" alt="Red Dot Metals" width={120} height={40} className="h-10 w-auto object-contain" />
            </Link>
            <p className="text-sm text-gray-400">{t("footer.description")}</p>
            <div className="flex gap-3 pt-1">
              <a href="https://wa.me/6588673343" target="_blank" rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10 text-green-400 transition-colors hover:bg-green-500/20">
                <MessageCircle className="h-4 w-4" />
              </a>
              <a href="tel:+6588673343"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-red-400 transition-colors hover:bg-red-500/20">
                <Phone className="h-4 w-4" />
              </a>
              {socialLinks.map((s) => (
                <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white">
                  {s.icon}
                </a>
              ))}
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
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-300">{t("footer.contact")}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                <a href="tel:+6588673343" className="hover:text-red-400 transition-colors">+65 8867 3343</a>
              </li>
              <li>
                <a href="https://wa.me/6588673343" target="_blank" rel="noopener noreferrer"
                  className="flex items-start gap-2 text-sm text-gray-400 transition-colors hover:text-green-400">
                  <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                  WhatsApp: +65 8867 3343
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                <a href="mailto:sgreddotmetal@gmail.com" className="hover:text-red-400 transition-colors break-all">sgreddotmetal@gmail.com</a>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                <span>Blk 236, #05-141, Bukit Batok East Ave 5, Singapore 650236</span>
              </li>
            </ul>
          </div>

          {/* Hours + Social */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">Operating Hours</h3>
            <div className="flex items-start gap-2 text-sm text-gray-400">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
              <span>7:00 AM – 11:00 PM (Daily)</span>
            </div>
            <div className="pt-2">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-300">Follow Us</h3>
              <div className="flex flex-col gap-2">
                {socialLinks.map((s) => (
                  <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-red-400">
                    {s.icon}
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
            <div className="pt-2">
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
