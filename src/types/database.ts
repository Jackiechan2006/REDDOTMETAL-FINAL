export type QuoteStatus =
  | "Pending"
  | "Reviewing"
  | "Quoted"
  | "Accepted"
  | "Rejected"
  | "Completed"
  | "Cancelled"

export type PaymentStatus = "Unpaid" | "Partial" | "Paid" | "Refunded"

export type CustomerPriority = "Low" | "Normal" | "High" | "Urgent"

export type ContentKind = "price" | "testimonial" | "service" | "image" | "setting" | "homepage"

export type ContentStatus = "draft" | "active" | "inactive" | "pending" | "approved" | "rejected" | "deleted"

// ─── site_content ────────────────────────────────────────────────────────────
export interface SiteContent {
  id: string
  kind: ContentKind
  title: string
  subtitle?: string | null
  body?: string | null
  value?: string | null
  unit?: string | null
  company?: string | null
  rating?: number | null
  image_url?: string | null
  icon_key?: string | null
  sort_order: number
  is_active: boolean
  status: ContentStatus
  approved: boolean
  approved_at?: string | null
  approved_by?: string | null
  metadata?: Record<string, unknown> | null
  created_at: string
  updated_at: string
  deleted_at?: string | null
}

export type InsertSiteContent = Omit<SiteContent, "id" | "created_at" | "updated_at">

export type UpdateSiteContent = Partial<Omit<SiteContent, "id" | "kind" | "created_at" | "updated_at">>

// ─── site_settings ──────────────────────────────────────────────────────────
export interface SiteSetting {
  key: string
  value: string | null
  updated_at: string
}

export interface SiteSettingsPayload {
  company_name?: string
  logo_url?: string
  phone?: string
  whatsapp?: string
  email?: string
  address?: string
  google_maps_url?: string
  business_hours?: string
  facebook?: string
  instagram?: string
  linkedin?: string
  footer_text?: string
}

// ─── activity_log ───────────────────────────────────────────────────────────
export interface ActivityLog {
  id: string
  actor_user_id?: string | null
  actor_email?: string | null
  entity_type: string
  entity_id?: string | null
  action: string
  before_json?: Record<string, unknown> | null
  after_json?: Record<string, unknown> | null
  created_at: string
}

// ─── quote_requests ───────────────────────────────────────────────────────────
export interface QuoteRequest {
  id: string
  created_at: string
  company_name: string
  contact_person: string
  email: string
  phone_number: string
  metal_type: string[]
  estimated_weight: string
  pickup_address: string
  preferred_pickup_date: string
  additional_notes?: string
  status: QuoteStatus
}

export type InsertQuoteRequest = Omit<QuoteRequest, "id" | "created_at" | "status">

// ─── contact_requests ─────────────────────────────────────────────────────────
export interface ContactRequest {
  id: string
  created_at: string
  customer_name: string
  company_name?: string
  email?: string
  phone_number: string
  metal_type: string
  message: string
}

export type InsertContactRequest = Omit<ContactRequest, "id" | "created_at">

// ─── admin_quote_management ───────────────────────────────────────────────────
export interface AdminQuoteManagement {
  id: string
  quote_request_id: string
  assigned_staff?: string
  quotation_amount?: number
  quotation_currency: string
  quotation_status: QuoteStatus
  pickup_schedule?: string
  pickup_vehicle?: string
  payment_status: PaymentStatus
  internal_notes?: string
  customer_priority: CustomerPriority
  follow_up_date?: string
  completed_date?: string
  created_at: string
  updated_at: string
}

export type InsertAdminQuoteManagement = Omit<
  AdminQuoteManagement,
  "id" | "created_at" | "updated_at"
>

export type UpdateAdminQuoteManagement = Partial<
  Omit<AdminQuoteManagement, "id" | "quote_request_id" | "created_at" | "updated_at">
>

// ─── Joined type for admin dashboard ─────────────────────────────────────────
export interface QuoteRequestWithManagement extends QuoteRequest {
  admin_quote_management?: AdminQuoteManagement[]
}
