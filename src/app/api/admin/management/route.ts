import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { validateAdminRequest, unauthorizedResponse } from "@/lib/adminAuth"
import { createAdminRecord, updateAdminRecord, getAdminRecordByQuoteId } from "@/services/adminService"

const createSchema = z.object({
  quote_request_id: z.string().uuid(),
  assigned_staff: z.string().max(200).optional(),
  quotation_amount: z.number().positive().optional(),
  quotation_currency: z.string().default("SGD"),
  quotation_status: z.enum(["Pending","Reviewing","Quoted","Accepted","Rejected","Completed","Cancelled"]).default("Pending"),
  pickup_schedule: z.string().optional(),
  pickup_vehicle: z.string().max(200).optional(),
  payment_status: z.enum(["Unpaid","Partial","Paid","Refunded"]).default("Unpaid"),
  internal_notes: z.string().max(5000).optional(),
  customer_priority: z.enum(["Low","Normal","High","Urgent"]).default("Normal"),
  follow_up_date: z.string().optional(),
  completed_date: z.string().optional(),
})

const updateSchema = createSchema.partial().omit({ quote_request_id: true }).extend({
  id: z.string().uuid(),
})

export async function POST(req: NextRequest) {
  const user = await validateAdminRequest(req)
  if (!user) return unauthorizedResponse()

  try {
    const body = await req.json()
    const data = createSchema.parse(body)
    const record = await createAdminRecord(data)
    return NextResponse.json({ record })
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.issues }, { status: 400 })
    console.error("Management POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const user = await validateAdminRequest(req)
  if (!user) return unauthorizedResponse()

  try {
    const body = await req.json()
    const { id, ...updates } = updateSchema.parse(body)
    const record = await updateAdminRecord(id, updates)
    return NextResponse.json({ record })
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.issues }, { status: 400 })
    console.error("Management PATCH error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const user = await validateAdminRequest(req)
  if (!user) return unauthorizedResponse()

  const { searchParams } = new URL(req.url)
  const quoteId = searchParams.get("quote_request_id")
  if (!quoteId) return NextResponse.json({ error: "quote_request_id required" }, { status: 400 })

  const record = await getAdminRecordByQuoteId(quoteId)
  return NextResponse.json({ record })
}
