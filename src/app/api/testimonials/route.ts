import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { validateAdminRequest, unauthorizedResponse } from "@/lib/adminAuth"
import { getAdminSupabaseClient } from "@/lib/supabase"
import { logAdminAction } from "@/app/api/admin/activity/log"

const fallbackTestimonials = [
  { id: "1", name: "Ahmed Ibrahim", company: "Ibrahim Construction", text: "Great service!", rating: 5 },
]

const testimonialSchema = z.object({
  name: z.string().min(1).max(200),
  company: z.string().max(200).optional().or(z.literal("")),
  text: z.string().min(1).max(5000),
  rating: z.coerce.number().int().min(1).max(5),
})

function readFlag(metadata: unknown, key: string) {
  return Boolean(metadata && typeof metadata === "object" && key in metadata && (metadata as Record<string, unknown>)[key])
}

function sortTestimonials<T extends { featured: boolean; pinned: boolean; sort_order: number; updated_at?: string }>(items: T[]) {
  return [...items].sort((left, right) => {
    const featureScore = Number(right.featured) - Number(left.featured)
    if (featureScore !== 0) return featureScore

    const pinScore = Number(right.pinned) - Number(left.pinned)
    if (pinScore !== 0) return pinScore

    if (left.sort_order !== right.sort_order) return left.sort_order - right.sort_order

    return new Date(right.updated_at ?? 0).getTime() - new Date(left.updated_at ?? 0).getTime()
  })
}

export async function GET(req: NextRequest) {
  try {
    const adminView = new URL(req.url).searchParams.get("admin") === "1"
    if (adminView) {
      const user = await validateAdminRequest(req)
      if (!user) return unauthorizedResponse()
    }

    const admin = getAdminSupabaseClient()
    const { data, error } = await admin
      .from("site_content")
      .select("id,title,company,body,rating,sort_order,updated_at,is_active,status,approved,metadata")
      .eq("kind", "testimonial")

    const rows = adminView
      ? data
      : (data ?? []).filter((row) => row.approved && row.status !== "deleted" && row.is_active)

    if (error) throw error

    const testimonials = sortTestimonials(
      (rows ?? []).map((row) => ({
        id: row.id,
        name: row.title,
        company: row.company ?? "",
        text: row.body ?? "",
        rating: row.rating ?? 5,
        featured: readFlag(row.metadata, "featured"),
        pinned: readFlag(row.metadata, "pinned"),
        sort_order: row.sort_order ?? 0,
        updated_at: row.updated_at,
      }))
    )

    const totalReviews = testimonials.length
    const averageRating = totalReviews > 0 ? Math.round((testimonials.reduce((sum, item) => sum + item.rating, 0) / totalReviews) * 10) / 10 : 0

    return NextResponse.json({
      testimonials,
      summary: { totalReviews, averageRating },
    })
  } catch {
    return NextResponse.json({ testimonials: fallbackTestimonials, summary: { totalReviews: fallbackTestimonials.length, averageRating: 5 } })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = testimonialSchema.parse(await req.json())
    const admin = getAdminSupabaseClient()
    const { data, error } = await admin
      .from("site_content")
      .insert({
        kind: "testimonial",
        title: body.name,
        company: body.company?.trim() ? body.company : null,
        body: body.text,
        rating: body.rating,
        sort_order: 0,
        is_active: true,
        status: "pending",
        approved: false,
        metadata: { featured: false, pinned: false },
      })
      .select()
      .single()

    if (error) throw error
    await logAdminAction(req, { entity_type: "testimonial", entity_id: data.id, action: "submitted", after_json: { name: body.name, company: body.company, rating: body.rating } })
    return NextResponse.json({ success: true, testimonial: data })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

export async function PATCH(req: NextRequest) {
  const user = await validateAdminRequest(req)
  if (!user) return unauthorizedResponse()

  try {
    const body = (await req.json()) as Record<string, unknown>
    const id = z.string().uuid().parse(body.id)
    const action = z.enum(["approve", "reject", "feature", "pin", "update"]).default("update").parse(body.action)
    const admin = getAdminSupabaseClient()
    const metadata = body.metadata && typeof body.metadata === "object" ? (body.metadata as Record<string, unknown>) : {}

    const payload: Record<string, unknown> = {}

    if (body.name !== undefined) payload.title = z.string().min(1).max(200).parse(body.name)
    if (body.company !== undefined) payload.company = body.company ? z.string().max(200).parse(body.company) : null
    if (body.text !== undefined) payload.body = z.string().min(1).max(5000).parse(body.text)
    if (body.rating !== undefined) payload.rating = z.coerce.number().int().min(1).max(5).parse(body.rating)
    if (body.sort_order !== undefined) payload.sort_order = z.coerce.number().int().parse(body.sort_order)

    if (action === "approve") {
      payload.approved = true
      payload.status = "approved"
      payload.approved_at = new Date().toISOString()
      payload.approved_by = user.email ?? user.id
      payload.is_active = true
    }

    if (action === "reject") {
      payload.approved = false
      payload.status = "rejected"
      payload.is_active = false
    }

    if (action === "feature") {
      payload.metadata = { ...metadata, featured: Boolean(body.featured ?? true), pinned: Boolean(body.pinned ?? metadata.pinned) }
    }

    if (action === "pin") {
      payload.metadata = { ...metadata, pinned: Boolean(body.pinned ?? true), featured: Boolean(body.featured ?? metadata.featured) }
    }

    if (body.status !== undefined) payload.status = z.enum(["draft", "active", "inactive", "pending", "approved", "rejected", "deleted"]).parse(body.status)
    if (body.is_active !== undefined) payload.is_active = Boolean(body.is_active)

    const { data, error } = await admin.from("site_content").update(payload).eq("id", id).select().single()
    if (error) throw error
    await logAdminAction(req, { entity_type: "testimonial", entity_id: id, action, after_json: { name: payload.title, status: payload.status, featured: (payload.metadata as Record<string, unknown>)?.featured, pinned: (payload.metadata as Record<string, unknown>)?.pinned } })
    return NextResponse.json({ success: true, testimonial: data })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest) {
  const user = await validateAdminRequest(req)
  if (!user) return unauthorizedResponse()

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

  try {
    const admin = getAdminSupabaseClient()
    const { error } = await admin
      .from("site_content")
      .update({ status: "deleted", is_active: false, approved: false, deleted_at: new Date().toISOString() })
      .eq("id", id)

    if (error) throw error
    await logAdminAction(req, { entity_type: "testimonial", entity_id: id, action: "deleted" })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: true })
  }
}
