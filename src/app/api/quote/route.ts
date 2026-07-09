import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { submitQuoteForm } from "@/lib/resend"
import { createQuoteRequest } from "@/services/quoteService"

const schema = z.object({
  companyName: z.string().min(1).max(200),
  contactPerson: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().min(1).max(50),
  metalTypes: z.array(z.string().min(1)).min(1).max(20),
  estimatedWeight: z.string().min(1).max(50),
  pickupAddress: z.string().min(1).max(500),
  preferredDate: z.string().min(1),
  notes: z.string().max(2000).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    // Save to Supabase
    await createQuoteRequest({
      company_name: data.companyName,
      contact_person: data.contactPerson,
      email: data.email,
      phone_number: data.phone,
      metal_type: data.metalTypes,
      estimated_weight: data.estimatedWeight,
      pickup_address: data.pickupAddress,
      preferred_pickup_date: data.preferredDate,
      additional_notes: data.notes,
    })

    // Send emails
    await submitQuoteForm(data)

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error("Quote API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
