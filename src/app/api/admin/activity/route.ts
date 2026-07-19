import { NextRequest, NextResponse } from "next/server"
import { validateAdminRequest, unauthorizedResponse } from "@/lib/adminAuth"
import { getAdminSupabaseClient } from "@/lib/supabase"

export async function GET(req: NextRequest) {
  const user = await validateAdminRequest(req)
  if (!user) return unauthorizedResponse()

  try {
    const { searchParams } = new URL(req.url)
    const limit = Math.min(Number(searchParams.get("limit") ?? 100), 500)
    const offset = Number(searchParams.get("offset") ?? 0)
    const entity_type = searchParams.get("entity_type")
    const action = searchParams.get("action")
    const admin = getAdminSupabaseClient()

    let query = admin
      .from("activity_log")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (entity_type) query = query.eq("entity_type", entity_type)
    if (action) query = query.eq("action", action)

    const { data, error, count } = await query
    if (error) throw error

    return NextResponse.json({ logs: data ?? [], total: count ?? 0 })
  } catch {
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 })
  }
}
