import { NextRequest, NextResponse } from "next/server"
import { getAdminSupabaseClient } from "@/lib/supabase"
import { validateAdminRequest, unauthorizedResponse } from "@/lib/adminAuth"
import { logAdminAction } from "@/app/api/admin/activity/log"

type HomepageContent = {
  hero: { title: string; subtitle: string; button_text: string; button_link: string; secondary_button_text: string; secondary_button_link: string }
  about: { title: string; description: string; image_url: string }
  whyUs: { title: string; description: string; features: { title: string; desc: string }[] }
  stats: { value: number; suffix: string; label: string; sort_order: number }[]
  cta: { title: string; description: string; button_text: string; button_link: string }
}

async function findHomepageRow(admin: ReturnType<typeof getAdminSupabaseClient>) {
  const { data } = await admin
    .from("site_content")
    .select("id, body")
    .eq("kind", "homepage")
    .eq("title", "sections")
    .eq("is_active", true)
    .neq("status", "deleted")
    .limit(1)
    .single()
  return data as { id: string; body: string | null } | null
}

function parseBody(raw: string | null): HomepageContent | null {
  if (!raw) return null
  try {
    return JSON.parse(raw) as HomepageContent
  } catch {
    return null
  }
}

export async function GET(req: NextRequest) {
  try {
    const adminView = new URL(req.url).searchParams.get("admin") === "1"
    if (adminView) {
      const user = await validateAdminRequest(req)
      if (!user) return unauthorizedResponse()
    }

    const admin = getAdminSupabaseClient()
    const row = await findHomepageRow(admin)
    const content = parseBody(row?.body ?? null)

    return NextResponse.json({ content })
  } catch {
    return NextResponse.json({ content: null })
  }
}

export async function PATCH(req: NextRequest) {
  const user = await validateAdminRequest(req)
  if (!user) return unauthorizedResponse()

  try {
    const body = await req.json() as Record<string, unknown>
    const admin = getAdminSupabaseClient()

    const existing = await findHomepageRow(admin)
    const serialized = JSON.stringify(body)

    if (existing) {
      const { error } = await admin
        .from("site_content")
        .update({ body: serialized, updated_at: new Date().toISOString() })
        .eq("id", existing.id)
      if (error) throw error

      await logAdminAction(req, {
        entity_type: "homepage",
        entity_id: existing.id,
        action: "update",
        before_json: parseBody(existing.body) as unknown as Record<string, unknown>,
        after_json: body as Record<string, unknown>,
      })

      return NextResponse.json({ success: true })
    }

    const { data, error } = await admin
      .from("site_content")
      .insert({
        kind: "homepage",
        title: "sections",
        body: serialized,
        sort_order: 0,
        is_active: true,
        status: "active",
        approved: true,
      })
      .select("id")
      .single()

    if (error) throw error

    await logAdminAction(req, {
      entity_type: "homepage",
      entity_id: data.id,
      action: "create",
      after_json: body as Record<string, unknown>,
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to save homepage content" }, { status: 400 })
  }
}
