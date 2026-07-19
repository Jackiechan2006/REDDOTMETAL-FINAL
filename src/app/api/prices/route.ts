import { NextRequest, NextResponse } from "next/server"
import { getAdminSupabaseClient } from "@/lib/supabase"
import { validateAdminRequest, unauthorizedResponse } from "@/lib/adminAuth"
import { logAdminAction } from "@/app/api/admin/activity/log"

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
      .select("id,title,value,body,subtitle,unit,metadata,sort_order,updated_at,is_active,status")
      .eq("kind", "price")

    const { data, error } = adminView
      ? await query.order("sort_order", { ascending: true })
      : await query.neq("status", "deleted").eq("is_active", true).order("sort_order", { ascending: true })

    if (error) {
      console.error("GET /api/prices query error:", error.message, error.details)
      return NextResponse.json({ error: "Failed to fetch prices", details: error.message }, { status: 500 })
    }

    return NextResponse.json({
      prices: (data ?? []).map((row) => ({
        id: row.id,
        metal: row.title,
        price: row.value ?? "",
        condition: row.body ?? row.subtitle ?? "",
        unit: row.unit ?? "",
        updated_at: row.updated_at,
        is_active: row.is_active,
        sort_order: row.sort_order,
        status: row.status,
      })),
    })
  } catch (err) {
    console.error("GET /api/prices unexpected error:", err)
    return NextResponse.json({ error: "Failed to fetch prices" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const user = await validateAdminRequest(req)
  if (!user) return unauthorizedResponse()

  try {
    const body = await req.json()

    if (!body.metal || !String(body.metal).trim()) {
      return NextResponse.json({ error: "Metal name is required" }, { status: 400 })
    }
    if (!body.price || !String(body.price).trim()) {
      return NextResponse.json({ error: "Price is required" }, { status: 400 })
    }

    const admin = getAdminSupabaseClient()
    const { data, error } = await admin
      .from("site_content")
      .insert({
        kind: "price",
        title: String(body.metal).trim(),
        value: String(body.price).trim(),
        body: body.condition ? String(body.condition).trim() : null,
        unit: body.unit ? String(body.unit).trim() : "S$/kg",
        sort_order: Number(body.sort_order ?? 0),
        is_active: body.is_active ?? true,
        status: body.status ?? "active",
        approved: true,
        metadata: body.metadata ?? null,
      })
      .select()
      .single()

    if (error) {
      console.error("POST /api/prices insert error:", error.message, error.details, error.hint)
      return NextResponse.json(
        { error: "Failed to save price", details: error.message, hint: error.hint },
        { status: 500 }
      )
    }

    await logAdminAction(req, {
      entity_type: "price",
      entity_id: data.id,
      action: "created",
      after_json: { metal: body.metal, price: body.price, condition: body.condition },
    })

    return NextResponse.json({ success: true, price: data })
  } catch (err) {
    console.error("POST /api/prices unexpected error:", err)
    return NextResponse.json({ error: "Failed to save price" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const user = await validateAdminRequest(req)
  if (!user) return unauthorizedResponse()

  try {
    const body = await req.json()

    if (!body.id) {
      return NextResponse.json({ error: "Price id is required for updates" }, { status: 400 })
    }

    const admin = getAdminSupabaseClient()
    const payload: Record<string, unknown> = {}

    if (body.metal !== undefined) payload.title = String(body.metal).trim()
    if (body.price !== undefined) payload.value = String(body.price).trim()
    if (body.condition !== undefined) payload.body = body.condition ? String(body.condition).trim() : null
    if (body.unit !== undefined) payload.unit = String(body.unit).trim()
    if (body.sort_order !== undefined) payload.sort_order = Number(body.sort_order)
    if (body.is_active !== undefined) payload.is_active = Boolean(body.is_active)
    if (body.status !== undefined) payload.status = body.status
    if (body.metadata !== undefined) payload.metadata = body.metadata

    if (Object.keys(payload).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
    }

    const { data, error } = await admin
      .from("site_content")
      .update(payload)
      .eq("id", body.id)
      .eq("kind", "price")
      .select()
      .single()

    if (error) {
      console.error("PATCH /api/prices update error:", error.message, error.details, error.hint)
      return NextResponse.json(
        { error: "Failed to update price", details: error.message, hint: error.hint },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json({ error: "Price not found" }, { status: 404 })
    }

    await logAdminAction(req, {
      entity_type: "price",
      entity_id: body.id,
      action: "updated",
      after_json: { metal: payload.title, price: payload.value, condition: payload.body },
    })

    return NextResponse.json({ success: true, price: data })
  } catch (err) {
    console.error("PATCH /api/prices unexpected error:", err)
    return NextResponse.json({ error: "Failed to update price" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const user = await validateAdminRequest(req)
  if (!user) return unauthorizedResponse()

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 })

  try {
    const admin = getAdminSupabaseClient()
    const { error } = await admin
      .from("site_content")
      .update({ status: "deleted", is_active: false, deleted_at: new Date().toISOString() })
      .eq("id", id)
      .eq("kind", "price")

    if (error) {
      console.error("DELETE /api/prices error:", error.message, error.details, error.hint)
      return NextResponse.json(
        { error: "Failed to delete price", details: error.message },
        { status: 500 }
      )
    }

    await logAdminAction(req, { entity_type: "price", entity_id: id, action: "deleted" })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("DELETE /api/prices unexpected error:", err)
    return NextResponse.json({ error: "Failed to delete price" }, { status: 500 })
  }
}
