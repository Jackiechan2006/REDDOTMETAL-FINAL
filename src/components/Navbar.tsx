"use client"

import { useState, useRef, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Link, usePathname } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown, Phone, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import LanguageSwitcher from "./LanguageSwitcher"
import Image from "next/image"
import { useRemoteJson } from "@/lib/useRemoteJson"

type SiteSettings = {
  phone: string
  whatsapp: string
}

const navLinks: { href: string; label: string; dropdown?: { href: string; label: string }[] }[] = [
  { href: "/", label: "home" },
  {
    href: "/about",
    label: "about",
    dropdown: [
      { href: "/what-we-collect", label: "whatWeCollect" },
      { href: "/who-we-serve", label: "whoWeServe" },
      { href: "/why-us", label: "whyUs" },
    ],
  },
  { href: "/services", label: "services" },
  { href: "/testimonials", label: "testimonials" },
  { href: "/service-area", label: "serviceArea" },
  { href: "/prices", label: "prices" },
  { href: "/contact", label: "contact" },
]

export default function Navbar() {
  const t = useTranslations("common.nav")
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const settings = useRemoteJson<SiteSettings>("/api/settings", {
    phone: "+65 8867 3343",
    whatsapp: "https://wa.me/6588673343",
  }, (payload) => {
    const siteSettings = (payload as { settings?: Partial<SiteSettings> })?.settings ?? {}
    return {
      phone: siteSettings.phone ?? "+65 8867 3343",
      whatsapp: siteSettings.whatsapp ?? "https://wa.me/6588673343",
    }
  })

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  const closeNav = () => {
    setOpen(false)
    setDropdownOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0f172a]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0f172a]/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.jpeg" alt="Red Dot Metals" width={120} height={40} className="h-10 w-auto object-contain" priority />
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) =>
            link.dropdown ? (
              <div key={link.href} className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={cn(
                    "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-red-400",
                    isActive(link.href) ? "text-red-400" : "text-gray-300"
                  )}
                >
                  {t(link.label)}
                  <ChevronDown className={cn("h-3 w-3 transition-transform", dropdownOpen && "rotate-180")} />
                </button>
                {dropdownOpen && (
                  <div className="absolute left-0 top-full mt-1 w-56 rounded-xl border border-white/10 bg-[#1e293b] p-2 shadow-xl backdrop-blur">
                    {link.dropdown.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={closeNav}
                        className="block rounded-lg px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-red-400"
                      >
                        {t(sub.label)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-red-400",
                  isActive(link.href) ? "text-red-400" : "text-gray-300"
                )}
              >
                {t(link.label)}
              </Link>
            )
          )}
          <div className="ml-2 flex items-center gap-2">
            <LanguageSwitcher />
            <a href={`tel:${settings.phone.replace(/\s+/g, "")}`} className="inline-flex items-center gap-1.5 rounded-md border border-white/10 px-3 py-1.5 text-sm text-gray-300 transition-colors hover:border-red-500/50 hover:text-red-400">
              <Phone className="h-3.5 w-3.5" />
              <span className="hidden xl:inline">Call</span>
            </a>
            <a
              href={settings.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-white/10 px-3 py-1.5 text-sm text-gray-300 transition-colors hover:border-green-500/50 hover:text-green-400"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span className="hidden xl:inline">WhatsApp</span>
            </a>
            <Link href="/quote">
              <Button className="bg-red-600 text-white hover:bg-red-500 font-semibold">
                {t("quote")}
              </Button>
            </Link>
          </div>
        </div>

        <button
          className="lg:hidden text-white"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-[#0f172a] lg:hidden">
          <div className="space-y-1 px-4 py-4">
            {navLinks.map((link) => (
              <div key={link.href}>
                <Link
                  href={link.href}
                  onClick={closeNav}
                  className={cn(
                    "block rounded px-3 py-2 text-sm font-medium transition-colors hover:bg-white/5 hover:text-red-400",
                    isActive(link.href) ? "text-red-400" : "text-gray-300"
                  )}
                >
                  {t(link.label)}
                </Link>
                {link.dropdown?.map((sub) => (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    onClick={closeNav}
                    className="block rounded px-6 py-1.5 text-sm text-gray-400 transition-colors hover:text-red-400"
                  >
                    {t(sub.label)}
                  </Link>
                ))}
              </div>
            ))}
            <div className="flex items-center gap-3 pt-3">
                <a
                  href={`tel:${settings.phone.replace(/\s+/g, "")}`}
                className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-300 hover:border-red-500/50"
              >
                <Phone className="h-4 w-4" /> Call
              </a>
                <a
                  href={settings.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-300 hover:border-green-500/50"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </div>
            <div className="pt-2">
              <LanguageSwitcher />
            </div>
            <Link href="/quote" onClick={closeNav} className="block pt-2">
              <Button className="w-full bg-red-600 text-white hover:bg-red-500 font-semibold">
                {t("quote")}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
