import { getAdminSupabaseClient } from "@/lib/supabase"
import type { InsertQuoteRequest, QuoteRequest, QuoteRequestWithManagement } from "@/types/database"

/**
 * Insert a new quote request. Called from the public API route.
 * Uses service role client so the anon user can INSERT via API route (server-side only).
 */
export async function createQuoteRequest(data: InsertQuoteRequest): Promise<QuoteRequest> {
  const admin = getAdminSupabaseClient()
  const { data: record, error } = await admin
    .from("quote_requests")
    .insert({ ...data, status: "Pending" })
    .select()
    .single()

  if (error) throw new Error(`Failed to create quote request: ${error.message}`)
  return record as QuoteRequest
}

/**
 * Fetch all quote requests. Admin dashboard only.
 */
export async function getAllQuoteRequests(): Promise<QuoteRequestWithManagement[]> {
  const admin = getAdminSupabaseClient()
  const { data, error } = await admin
    .from("quote_requests")
    .select("*, admin_quote_management(*)")
    .order("created_at", { ascending: false })

  if (error) throw new Error(`Failed to fetch quote requests: ${error.message}`)
  return (data ?? []) as QuoteRequestWithManagement[]
}

/**
 * Fetch a single quote request by ID. Admin dashboard only.
 */
export async function getQuoteRequestById(id: string): Promise<QuoteRequestWithManagement | null> {
  const admin = getAdminSupabaseClient()
  const { data, error } = await admin
    .from("quote_requests")
    .select("*, admin_quote_management(*)")
    .eq("id", id)
    .single()

  if (error) return null
  return data as QuoteRequestWithManagement
}
