import { NextRequest } from "next/server"
import { logActivity } from "@/lib/siteContent"

export async function logAdminAction(
  req: NextRequest,
  entry: {
    entity_type: string
    entity_id?: string | null
    action: string
    before_json?: Record<string, unknown> | null
    after_json?: Record<string, unknown> | null
  }
) {
  try {
    const { validateAdminRequest } = await import("@/lib/adminAuth")
    const user = await validateAdminRequest(req)

    await logActivity({
      actor_user_id: user?.id ?? null,
      actor_email: user?.email ?? null,
      entity_type: entry.entity_type,
      entity_id: entry.entity_id ?? null,
      action: entry.action,
      before_json: entry.before_json ?? null,
      after_json: entry.after_json ?? null,
    })
  } catch {
    // Silently fail — activity logging should never break the main flow
  }
}
