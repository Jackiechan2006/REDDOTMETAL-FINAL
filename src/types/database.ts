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
