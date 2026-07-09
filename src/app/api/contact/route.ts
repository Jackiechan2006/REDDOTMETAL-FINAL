import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { submitContactForm } from "@/lib/resend"
import { createContactRequest } from "@/services/contactService"

const schema = z.object({
  name: z.string().min(1).max(200),
  company: z.string().max(200).optional(),
  phone: z.string().min(1).max(50),
  metalType: z.string().min(1).max(100),
  message: z.string().min(1).max(2000),
  email: z.string().email().optional().or(z.literal("")),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    // Save to Supabase
    await createContactRequest({
      customer_name: data.name,
      company_name: data.company,
      email: data.email || undefined,
      phone_number: data.phone,
      metal_type: data.metalType,
      message: data.message,
    })

    // Send emails
    await submitContactForm(data)

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error("Contact API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
