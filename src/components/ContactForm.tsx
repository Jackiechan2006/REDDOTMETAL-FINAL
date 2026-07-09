"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2, Send } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

const schema = z.object({
  name: z.string().min(1),
  company: z.string().optional(),
  phone: z.string().min(1),
  metalType: z.string().min(1),
  message: z.string().min(1),
})

type FormData = z.infer<typeof schema>

export default function ContactForm() {
  const t = useTranslations("contact.form")
  const metalOptions = useTranslations("contact").raw("metalOptions") as { value: string; label: string }[]
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Failed")
      toast.toast({ title: "Success", description: t("success"), variant: "success" })
      reset()
    } catch {
      toast.toast({ title: "Error", description: t("error"), variant: "error" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">{t("name")}</Label>
            <Input id="name" placeholder={t("placeholders.name")} {...register("name")} />
            {errors.name && <p className="text-xs text-red-400">Required</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">{t("company")}</Label>
            <Input id="company" placeholder={t("placeholders.company")} {...register("company")} />
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="phone">{t("phone")}</Label>
            <Input id="phone" placeholder={t("placeholders.phone")} {...register("phone")} />
            {errors.phone && <p className="text-xs text-red-400">Required</p>}
          </div>
          <div className="space-y-2">
            <Label>{t("metalType")}</Label>
            <Select onValueChange={(v) => setValue("metalType", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {metalOptions.map(
                  (opt: { value: string; label: string }) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">{t("message")}</Label>
          <Textarea
            id="message"
            rows={4}
            placeholder={t("placeholders.message")}
            {...register("message")}
          />
          {errors.message && <p className="text-xs text-red-400">Required</p>}
        </div>
        <Button type="submit" disabled={loading} className="w-full bg-red-600 text-white hover:bg-red-500 font-semibold">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("sending")}
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" /> {t("submit")}
            </>
          )}
        </Button>
      </form>
      <Toaster />
    </>
  )
}
