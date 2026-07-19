import { NextRequest, NextResponse } from "next/server"
import { getAdminSupabaseClient } from "@/lib/supabase"
import { validateAdminRequest, unauthorizedResponse } from "@/lib/adminAuth"

const fallbackServices = [
  { id: "1", title: "Scrap Collection", body: "Regular and on-demand scrap metal collection services.", icon_key: "Truck", sort_order: 1 },
  { id: "2", title: "Metal Trading", body: "Buy and sell ferrous and non-ferrous metals.", icon_key: "Scale", sort_order: 2 },
  { id: "3", title: "Recycling", body: "Environmentally responsible recycling.", icon_key: "Recycle", sort_order: 3 },
  { id: "4", title: "On-Site Pickup", body: "We come to your location.", icon_key: "MapPin", sort_order: 4 },
]

export async function GET(req: NextRequest) {
  try {
    const adminView = new URL(req.url).searchParams.get("admin") === "1"
    if (adminView) {
      const user = await validateAdminRequest(req)
      if (!user) return unauthorizedResponse()
    }

    const admin = getAdminSupabaseClient()
    const query = admin
      .from("site_content")
      .select("id,title,body,subtitle,icon_key,sort_order,is_active,status")
      .eq("kind", "service")

    const { data, error } = adminView
      ? await query.order("sort_order", { ascending: true })
      : await query.neq("status", "deleted").eq("is_active", true).order("sort_order", { ascending: true })

    if (error) throw error
    return NextResponse.json({ services: data ?? [] })
  } catch {
    return NextResponse.json({ services: fallbackServices })
  }
}

export async function POST(req: NextRequest) {
  const user = await validateAdminRequest(req)
  if (!user) return unauthorizedResponse()

  try {
    const body = await req.json()
    const admin = getAdminSupabaseClient()
    const { data, error } = await admin
      .from("site_content")
      .insert({
        kind: "service",
        title: body.title,
        body: body.body ?? null,
        subtitle: body.subtitle ?? null,
        icon_key: body.icon_key ?? null,
        sort_order: Number(body.sort_order ?? 0),
        is_active: body.is_active ?? true,
        status: body.status ?? "active",
        approved: true,
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ success: true, service: data })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

export async function PATCH(req: NextRequest) {
  const user = await validateAdminRequest(req)
  if (!user) return unauthorizedResponse()

  try {
    const body = await req.json()
    const admin = getAdminSupabaseClient()
    const { id, ...rest } = body as { id?: string } & Record<string, unknown>
    const payload = {
      title: rest.title,
      body: rest.body ?? null,
      subtitle: rest.subtitle ?? null,
      icon_key: rest.icon_key ?? null,
      sort_order: Number(rest.sort_order ?? 0),
      is_active: rest.is_active ?? true,
      status: rest.status ?? "active",
      approved: true,
    }

    const query = id ? admin.from("site_content").update(payload).eq("id", id) : admin.from("site_content").upsert({ kind: "service", ...payload })
    const { data, error } = await query.select().single()

    if (error) throw error
    return NextResponse.json({ success: true, service: data })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}