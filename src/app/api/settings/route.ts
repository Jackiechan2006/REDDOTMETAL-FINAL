import { NextRequest, NextResponse } from "next/server"
import { getAdminSupabaseClient } from "@/lib/supabase"
import { validateAdminRequest, unauthorizedResponse } from "@/lib/adminAuth"
import { logAdminAction } from "@/app/api/admin/activity/log"

const fallbackSettings = {
  company_name: "Red Dot Metal",
  phone: "",
  whatsapp: "",
  email: "",
  address: "",
  google_maps_url: "",
  business_hours: "",
  footer_text: "Singapore's trusted B2B scrap metal recycling partner.",
  facebook_url: "",
  instagram_url: "",
  linkedin_url: "",
  carousell_url: "",
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