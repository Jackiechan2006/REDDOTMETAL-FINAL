import { getAdminSupabaseClient } from "@/lib/supabase"
import type {
  ActivityLog,
  ContentKind,
  InsertSiteContent,
  SiteContent,
  SiteSettingsPayload,
  UpdateSiteContent,
} from "@/types/database"

type SiteSettingRow = { key: string; value: string | null; updated_at: string }

function compactPayload(payload: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined))
}

export async function fetchSiteContent(kind: ContentKind) {
  const admin = getAdminSupabaseClient()
  const { data, error } = await admin
    .from("site_content")
    .select("*")
    .eq("kind", kind)
    .neq("status", "deleted")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("updated_at", { ascending: false })

  if (error) throw new Error(`Failed to fetch ${kind} content: ${error.message}`)
  return (data ?? []) as SiteContent[]
}

export async function upsertSiteContentRow(data: InsertSiteContent | UpdateSiteContent & { kind?: ContentKind }) {
  const admin = getAdminSupabaseClient()
  const payload = compactPayload(data as Record<string, unknown>)
  const { data: record, error } = await admin.from("site_content").upsert(payload).select().single()

  if (error) throw new Error(`Failed to save content: ${error.message}`)
  return record as SiteContent
}

export async function softDeleteSiteContent(id: string) {
  const admin = getAdminSupabaseClient()
  const { data: record, error } = await admin
    .from("site_content")
    .update({ status: "deleted", is_active: false, deleted_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw new Error(`Failed to delete content: ${error.message}`)
  return record as SiteContent
}

export async function fetchSiteSettings() {
  const admin = getAdminSupabaseClient()
  const { data, error } = await admin.from("site_settings").select("*")

  if (error) throw new Error(`Failed to fetch site settings: ${error.message}`)
  return (data ?? []) as SiteSettingRow[]
}

export async function saveSiteSettings(settings: SiteSettingsPayload) {
  const admin = getAdminSupabaseClient()
  const rows = Object.entries(compactPayload(settings as Record<string, unknown>)).map(([key, value]) => ({
    key,
    value: value === null ? null : String(value),
  }))

  if (rows.length === 0) return []

  const { data, error } = await admin.from("site_settings").upsert(rows, { onConflict: "key" }).select()
  if (error) throw new Error(`Failed to save site settings: ${error.message}`)
  return (data ?? []) as SiteSettingRow[]
}

export async function logActivity(entry: {
  actor_user_id?: string | null
  actor_email?: string | null
  entity_type: string
  entity_id?: string | null
  action: string
  before_json?: Record<string, unknown> | null
  after_json?: Record<string, unknown> | null
}) {
  const admin = getAdminSupabaseClient()
  const { error } = await admin.from("activity_log").insert({
    actor_user_id: entry.actor_user_id ?? null,
    actor_email: entry.actor_email ?? null,
    entity_type: entry.entity_type,
    entity_id: entry.entity_id ?? null,
    action: entry.action,
    before_json: entry.before_json ?? null,
    after_json: entry.after_json ?? null,
  })

  if (error) throw new Error(`Failed to write activity log: ${error.message}`)
}

export function formatDisplayDate(isoString: string) {
  const date = new Date(isoString)
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  return `${day}/${month}/${year} ${hours}:${minutes}`
}

export function formatDisplayDateOnly(isoString: string) {
  const date = new Date(isoString)
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

export type { ActivityLog }