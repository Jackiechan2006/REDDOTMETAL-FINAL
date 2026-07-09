-- ============================================================
-- RED DOT METALS — Supabase SQL Schema
-- Run this entire file in: Supabase Dashboard → SQL Editor
-- ============================================================

-- ─── Extensions ──────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Table: quote_requests ────────────────────────────────────
-- Stores all customer quote form submissions.
-- Public can INSERT only. Only admins can SELECT/UPDATE/DELETE.

CREATE TABLE IF NOT EXISTS public.quote_requests (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  company_name         TEXT NOT NULL,
  contact_person       TEXT NOT NULL,
  email                TEXT NOT NULL,
  phone_number         TEXT NOT NULL,
  metal_type           TEXT[] NOT NULL,
  estimated_weight     TEXT NOT NULL,
  pickup_address       TEXT NOT NULL,
  preferred_pickup_date TEXT NOT NULL,
  additional_notes     TEXT,
  status               TEXT NOT NULL DEFAULT 'Pending'
    CHECK (status IN ('Pending','Reviewing','Quoted','Accepted','Rejected','Completed','Cancelled'))
);

ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

-- Customers can INSERT (public, no auth required)
CREATE POLICY "Allow public insert on quote_requests"
  ON public.quote_requests FOR INSERT
  TO anon
  WITH CHECK (true);

-- Only authenticated admins can SELECT
CREATE POLICY "Allow admin select on quote_requests"
  ON public.quote_requests FOR SELECT
  TO authenticated
  USING (true);

-- Only authenticated admins can UPDATE
CREATE POLICY "Allow admin update on quote_requests"
  ON public.quote_requests FOR UPDATE
  TO authenticated
  USING (true);

-- ─── Table: contact_requests ──────────────────────────────────
-- Stores all customer contact form submissions.

CREATE TABLE IF NOT EXISTS public.contact_requests (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  customer_name   TEXT NOT NULL,
  company_name    TEXT,
  email           TEXT,
  phone_number    TEXT NOT NULL,
  metal_type      TEXT NOT NULL,
  message         TEXT NOT NULL
);

ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

-- Customers can INSERT
CREATE POLICY "Allow public insert on contact_requests"
  ON public.contact_requests FOR INSERT
  TO anon
  WITH CHECK (true);

-- Only authenticated admins can SELECT
CREATE POLICY "Allow admin select on contact_requests"
  ON public.contact_requests FOR SELECT
  TO authenticated
  USING (true);

-- ─── Table: admin_quote_management ───────────────────────────
-- Internal business management table. Linked to quote_requests.
-- Only admins (authenticated) can access this table.

CREATE TABLE IF NOT EXISTS public.admin_quote_management (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_request_id    UUID NOT NULL REFERENCES public.quote_requests(id) ON DELETE CASCADE,
  assigned_staff      TEXT,
  quotation_amount    NUMERIC(12,2),
  quotation_currency  TEXT NOT NULL DEFAULT 'SGD',
  quotation_status    TEXT NOT NULL DEFAULT 'Pending'
    CHECK (quotation_status IN ('Pending','Reviewing','Quoted','Accepted','Rejected','Completed','Cancelled')),
  pickup_schedule     TIMESTAMPTZ,
  pickup_vehicle      TEXT,
  payment_status      TEXT NOT NULL DEFAULT 'Unpaid'
    CHECK (payment_status IN ('Unpaid','Partial','Paid','Refunded')),
  internal_notes      TEXT,
  customer_priority   TEXT NOT NULL DEFAULT 'Normal'
    CHECK (customer_priority IN ('Low','Normal','High','Urgent')),
  follow_up_date      DATE,
  completed_date      DATE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.admin_quote_management ENABLE ROW LEVEL SECURITY;

-- Only authenticated admins can SELECT
CREATE POLICY "Allow admin select on admin_quote_management"
  ON public.admin_quote_management FOR SELECT
  TO authenticated
  USING (true);

-- Only authenticated admins can INSERT
CREATE POLICY "Allow admin insert on admin_quote_management"
  ON public.admin_quote_management FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only authenticated admins can UPDATE
CREATE POLICY "Allow admin update on admin_quote_management"
  ON public.admin_quote_management FOR UPDATE
  TO authenticated
  USING (true);

-- Only authenticated admins can DELETE
CREATE POLICY "Allow admin delete on admin_quote_management"
  ON public.admin_quote_management FOR DELETE
  TO authenticated
  USING (true);

-- ─── Auto-update updated_at trigger ──────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER admin_quote_management_updated_at
  BEFORE UPDATE ON public.admin_quote_management
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─── Index for performance ────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON public.quote_requests(status);
CREATE INDEX IF NOT EXISTS idx_quote_requests_created ON public.quote_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_mgmt_quote_id ON public.admin_quote_management(quote_request_id);
CREATE INDEX IF NOT EXISTS idx_contact_requests_created ON public.contact_requests(created_at DESC);
