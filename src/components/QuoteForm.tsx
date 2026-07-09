"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, FileText } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

const schema = z.object({
  companyName: z.string().min(1, "Required"),
  contactPerson: z.string().min(1, "Required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Required"),
  metalTypes: z.array(z.string()).min(1, "Select at least one"),
  estimatedWeight: z.string().min(1, "Required"),
  pickupAddress: z.string().min(1, "Required"),
  preferredDate: z.string().min(1, "Required"),
  notes: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function QuoteForm() {
  const t = useTranslations("quote.form")
  const tq = useTranslations("quote")
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { metalTypes: [] },
  })

  const selectedTypes = watch("metalTypes") || []

  const toggleMetalType = (value: string) => {
    const current = selectedTypes.includes(value)
      ? selectedTypes.filter((v) => v !== value)
      : [...selectedTypes, value]
    setValue("metalTypes", current, { shouldValidate: true })
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const res = await fetch("/api/quote", {
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

  const metalOptions = tq.raw("metalOptions") as unknown as {
    value: string
    label: string
  }[]

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="companyName">{t("companyName")}</Label>
            <Input id="companyName" {...register("companyName")} />
            {errors.companyName && <p className="text-xs text-red-400">{errors.companyName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactPerson">{t("contactPerson")}</Label>
            <Input id="contactPerson" {...register("contactPerson")} />
            {errors.contactPerson && <p className="text-xs text-red-400">{errors.contactPerson.message}</p>}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email">{t("email")}</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">{t("phone")}</Label>
            <Input id="phone" {...register("phone")} />
            {errors.phone && <p className="text-xs text-red-400">{errors.phone.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label>{t("metalType")}</Label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {metalOptions.map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-2 rounded border border-white/10 px-3 py-2 text-sm text-gray-300 hover:border-red-500/50 transition-colors"
              >
                <Checkbox
                  checked={selectedTypes.includes(opt.value)}
                  onCheckedChange={() => toggleMetalType(opt.value)}
                />
                {opt.label}
              </label>
            ))}
          </div>
          {errors.metalTypes && <p className="text-xs text-red-400">{errors.metalTypes.message}</p>}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="estimatedWeight">{t("estimatedWeight")}</Label>
            <Input id="estimatedWeight" type="number" {...register("estimatedWeight")} />
            {errors.estimatedWeight && <p className="text-xs text-red-400">{errors.estimatedWeight.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="preferredDate">{t("preferredDate")}</Label>
            <Input id="preferredDate" type="date" {...register("preferredDate")} />
            {errors.preferredDate && <p className="text-xs text-red-400">{errors.preferredDate.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pickupAddress">{t("pickupAddress")}</Label>
          <Textarea id="pickupAddress" rows={2} {...register("pickupAddress")} />
          {errors.pickupAddress && <p className="text-xs text-red-400">{errors.pickupAddress.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">{t("notes")}</Label>
          <Textarea id="notes" rows={3} {...register("notes")} />
        </div>

        <Button type="submit" disabled={loading} className="w-full bg-red-600 text-white hover:bg-red-500 font-semibold">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("sending")}
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" /> {t("submit")}
            </>
          )}
        </Button>
      </form>
      <Toaster />
    </>
  )
}
