import { NextRequest, NextResponse } from "next/server"
import { getAdminSupabaseClient } from "./supabase"

export async function validateAdminRequest(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value
  if (!token) return null

  try {
    const admin = getAdminSupabaseClient()
    const { data: { user }, error } = await admin.auth.getUser(token)
    if (error || !user) return null
    return user
  } catch {
    return null
  }
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}
