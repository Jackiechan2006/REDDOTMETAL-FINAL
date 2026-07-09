import { NextRequest, NextResponse } from "next/server"
import { validateAdminRequest, unauthorizedResponse } from "@/lib/adminAuth"
import { getAllContactRequests } from "@/services/contactService"

export async function GET(req: NextRequest) {
  const user = await validateAdminRequest(req)
  if (!user) return unauthorizedResponse()

  const contacts = await getAllContactRequests()
  return NextResponse.json({ contacts })
}
