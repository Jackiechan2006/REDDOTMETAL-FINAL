import { getAdminSupabaseClient } from "@/lib/supabase"
import type { ContactRequest, InsertContactRequest } from "@/types/database"

/**
 * Insert a new contact request. Called from public API route (server-side only).
 */
export async function createContactRequest(data: InsertContactRequest): Promise<ContactRequest> {
  const admin = getAdminSupabaseClient()
  const { data: record, error } = await admin
    .from("contact_requests")
    .insert(data)
    .select()
    .single()

  if (error) throw new Error(`Failed to create contact request: ${error.message}`)
  return record as ContactRequest
}

/**
 * Fetch all contact requests. Admin dashboard only.
 */
export async function getAllContactRequests(): Promise<ContactRequest[]> {
  const admin = getAdminSupabaseClient()
  const { data, error } = await admin
    .from("contact_requests")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw new Error(`Failed to fetch contact requests: ${error.message}`)
  return (data ?? []) as ContactRequest[]
}
