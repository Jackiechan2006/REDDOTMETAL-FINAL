import { NextRequest, NextResponse } from "next/server"
import { validateAdminRequest, unauthorizedResponse } from "@/lib/adminAuth"
import { getAllQuoteRequests, getQuoteRequestById } from "@/services/quoteService"

export async function GET(req: NextRequest) {
  const user = await validateAdminRequest(req)
  if (!user) return unauthorizedResponse()

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (id) {
    const quote = await getQuoteRequestById(id)
    if (!quote) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json({ quote })
  }

  const quotes = await getAllQuoteRequests()
  return NextResponse.json({ quotes })
}
