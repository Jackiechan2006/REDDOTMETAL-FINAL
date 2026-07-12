import { getAdminSupabaseClient } from "@/lib/supabase"
import type {
  AdminQuoteManagement,
  InsertAdminQuoteManagement,
  UpdateAdminQuoteManagement,
} from "@/types/database"

/**
 * Create a new admin management record linked to a quote request.
 */
export async function createAdminRecord(
  data: InsertAdminQuoteManagement
): Promise<AdminQuoteManagement> {
  const admin = getAdminSupabaseClient()
  const { data: record, error } = await admin
    .from("admin_quote_management")
    .insert(data)
    .select()
    .single()

  if (error) throw new Error(`Failed to create admin record: ${error.message}`)
  return record as AdminQuoteManagement
}

/**
 * Update an existing admin management record.
 */
export async function updateAdminRecord(
  id: string,
  updates: UpdateAdminQuoteManagement
): Promise<AdminQuoteManagement> {
  const admin = getAdminSupabaseClient()
  const { data: record, error } = await admin
    .from("admin_quote_management")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw new Error(`Failed to update admin record: ${error.message}`)

  if (updates.quotation_status) {
    await admin
      .from("quote_requests")
      .update({
        status: updates.quotation_status,
      })
      .eq("id", record.quote_request_id)
  }

  return record as AdminQuoteManagement
}

/**
 * Get admin record by quote_request_id.
 */
export async function getAdminRecordByQuoteId(
  quoteRequestId: string
): Promise<AdminQuoteManagement | null> {
  const admin = getAdminSupabaseClient()
  const { data, error } = await admin
    .from("admin_quote_management")
    .select("*")
    .eq("quote_request_id", quoteRequestId)
    .maybeSingle()

  if (error) return null
  return data as AdminQuoteManagement | null
}

/**
 * Get all admin management records.
 */
export async function getAllAdminRecords(): Promise<AdminQuoteManagement[]> {
  const admin = getAdminSupabaseClient()
  const { data, error } = await admin
    .from("admin_quote_management")
    .select("*")
    .order("updated_at", { ascending: false })

  if (error) throw new Error(`Failed to fetch admin records: ${error.message}`)
  return (data ?? []) as AdminQuoteManagement[]
}
