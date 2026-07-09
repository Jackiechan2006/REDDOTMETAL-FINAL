"use client"

import { useLocale } from "next-intl"
import { usePathname, useRouter } from "@/i18n/routing"
import { useTransition, useState, useRef, useEffect } from "react"
import { Globe, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const locales = [
  { code: "en", label: "English" },
  { code: "ms", label: "Bahasa Melayu" },
  { code: "zh", label: "中文" },
  { code: "ta", label: "தமிழ்" },
  { code: "bn", label: "বাংলা" },
]

export default function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleOutside)
    return () => document.removeEventListener("mousedown", handleOutside)
  }, [])

  const current = locales.find((l) => l.code === locale) || locales[0]

  const handleChange = (newLocale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale as "en" | "ms" | "zh" | "ta" | "bn" })
      setOpen(false)
    })
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-sm text-gray-300 transition-colors hover:border-red-500/50 hover:text-red-400"
        disabled={isPending}
      >
        <Globe className="h-3.5 w-3.5" />
        <span>{current.label}</span>
        <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-48 rounded-xl border border-white/10 bg-[#1e293b] p-1.5 shadow-xl backdrop-blur z-50">
          {locales.map((l) => (
            <button
              key={l.code}
              onClick={() => handleChange(l.code)}
              disabled={isPending}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                locale === l.code
                  ? "bg-red-600/20 text-red-400"
                  : "text-gray-300 hover:bg-white/5 hover:text-red-400"
              }`}
            >
              <span>{l.label}</span>
              {locale === l.code && <span className="ml-auto text-xs text-red-400">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
