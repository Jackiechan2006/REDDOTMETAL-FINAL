import { NextRequest, NextResponse } from "next/server"
import { getAdminSupabaseClient } from "@/lib/supabase"
import { validateAdminRequest, unauthorizedResponse } from "@/lib/adminAuth"
import { logAdminAction } from "@/app/api/admin/activity/log"

const fallbackSettings = {
  company_name: "Red Dot Metal",
  phone: "+65 8867 3343",
  whatsapp: "https://wa.me/6588673343",
  email: "sgreddotmetal@gmail.com",
  address: "Blk 236, #05-141, Bukit Batok East Ave 5, Singapore 650236",
  google_maps_url:
    "https://www.google.com/maps/search/?api=1&query=Blk%20236,%20%2305-141,%20Bukit%20Batok%20East%20Ave%205,%20Singapore%20650236",
  business_hours: "7:00 AM – 11:00 PM (Daily)",
  footer_text: "Singapore's trusted B2B scrap metal recycling partner.",
}

export async function GET() {
  try {
    const admin = getAdminSupabaseClient()
    const { data, error } = await admin.from("site_settings").select("key,value")
    if (error) throw error

    const settings = Object.fromEntries((data ?? []).map((row) => [row.key, row.value]))
    return NextResponse.json({ settings: { ...fallbackSettings, ...settings } })
  } catch {
    return NextResponse.json({ settings: fallbackSettings })
  }
}

export async function PATCH(req: NextRequest) {
  const user = await validateAdminRequest(req)
  if (!user) return unauthorizedResponse()

  try {
    const body = await req.json()
    const admin = getAdminSupabaseClient()
    const rows = Object.entries(body as Record<string, string | null | undefined>)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => ({ key, value: value ?? null }))

    const { data, error } = await admin.from("site_settings").upsert(rows, { onConflict: "key" }).select()
    if (error) throw error
    await logAdminAction(req, { entity_type: "settings", action: "updated", after_json: Object.fromEntries(rows.map((r) => [r.key, r.value])) })
    return NextResponse.json({ success: true, settings: data })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}