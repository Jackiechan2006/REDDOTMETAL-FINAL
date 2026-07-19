-- ============================================================
-- RED DOT METALS — Missing Tables Migration
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

-- ─── Extensions ──────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. site_content
-- ============================================================

CREATE TABLE IF NOT EXISTS public.site_content (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kind          TEXT NOT NULL CHECK (kind IN ('price','testimonial','service','image','setting','homepage')),
  title         TEXT NOT NULL,
  subtitle      TEXT,
  body          TEXT,
  value         TEXT,
  unit          TEXT,
  company       TEXT,
  rating        INTEGER CHECK (rating >= 0 AND rating <= 5),
  image_url     TEXT,
  icon_key      TEXT,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  status        TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft','active','inactive','pending','approved','rejected','deleted')),
  approved      BOOLEAN NOT NULL DEFAULT FALSE,
  approved_at   TIMESTAMPTZ,
  approved_by   TEXT,
  metadata      JSONB,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at    TIMESTAMPTZ
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow admin select on site_content"
  ON public.site_content FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow public read active prices"
  ON public.site_content FOR SELECT
  TO anon
  USING (kind = 'price' AND is_active = true AND status != 'deleted');

CREATE POLICY "Allow public read active homepage"
  ON public.site_content FOR SELECT
  TO anon
  USING (kind = 'homepage' AND is_active = true AND status != 'deleted');

CREATE POLICY "Allow admin insert on site_content"
  ON public.site_content FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow admin update on site_content"
  ON public.site_content FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow admin delete on site_content"
  ON public.site_content FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_site_content_kind_active_sort
  ON public.site_content(kind, is_active, sort_order, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_site_content_status
  ON public.site_content(status);

-- ─── Seed: initial scrap metal prices ────────────────────────

INSERT INTO public.site_content (kind, title, value, body, unit, sort_order, is_active, status, approved)
VALUES
  ('price', 'Copper (Bright)',       '8.50 – 9.20',  'Clean, uncoated',          'S$/kg', 1,  true, 'active', true),
  ('price', 'Copper (Mixed)',        '6.80 – 7.50',  'Insulated, mixed grades',  'S$/kg', 2,  true, 'active', true),
  ('price', 'Aluminium (Extrusions)','1.80 – 2.20',  'Clean, dry',               'S$/kg', 3,  true, 'active', true),
  ('price', 'Aluminium (Mixed)',     '1.20 – 1.60',  'With contaminants',        'S$/kg', 4,  true, 'active', true),
  ('price', 'Stainless Steel 304',   '1.50 – 1.90',  'Clean, solids',            'S$/kg', 5,  true, 'active', true),
  ('price', 'Stainless Steel 316',   '2.00 – 2.50',  'Clean, solids',            'S$/kg', 6,  true, 'active', true),
  ('price', 'Brass',                 '4.50 – 5.20',  'Clean, solids',            'S$/kg', 7,  true, 'active', true),
  ('price', 'Lead',                  '1.80 – 2.30',  'Clean, solids',            'S$/kg', 8,  true, 'active', true),
  ('price', 'Steel / Iron (Light)',  '0.15 – 0.25',  'Light scrap',              'S$/kg', 9,  true, 'active', true),
  ('price', 'Steel (Heavy)',         '0.25 – 0.35',  'Heavy melting',            'S$/kg', 10, true, 'active', true),
  ('price', 'Zinc',                  '1.00 – 1.40',  'Clean, solids',            'S$/kg', 11, true, 'active', true),
  ('price', 'Electric Motors',       '0.80 – 1.20',  'Complete units',           'S$/kg', 12, true, 'active', true),
  ('price', 'Copper Wire (Insulated)','3.50 – 4.50', 'PVC insulated',            'S$/kg', 13, true, 'active', true),
  ('price', 'Aluminium Cans',        '0.60 – 0.90',  'Compressed, clean',        'S$/kg', 14, true, 'active', true);

-- ============================================================
-- 2. site_settings
-- ============================================================

CREATE TABLE IF NOT EXISTS public.site_settings (
  key         TEXT PRIMARY KEY,
  value       TEXT,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on site_settings"
  ON public.site_settings FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow admin select on site_settings"
  ON public.site_settings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow admin insert on site_settings"
  ON public.site_settings FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow admin update on site_settings"
  ON public.site_settings FOR UPDATE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_site_settings_updated
  ON public.site_settings(updated_at DESC);

-- ─── Seed: default settings ─────────────────────────────────

INSERT INTO public.site_settings (key, value)
VALUES
  ('phone',         '+65 8867 3343'),
  ('whatsapp',      'https://wa.me/6588673343'),
  ('email',         'info@reddotmetals.com'),
  ('address',       'Singapore'),
  ('business_name', 'Red Dot Metals'),
  ('show_prices',   'true'),
  ('show_services', 'true'),
  ('show_about',    'true'),
  ('maintenance_mode', 'false')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- 3. activity_log
-- ============================================================

CREATE TABLE IF NOT EXISTS public.activity_log (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_user_id  UUID,
  actor_email    TEXT,
  entity_type    TEXT NOT NULL,
  entity_id      TEXT,
  action         TEXT NOT NULL,
  before_json    JSONB,
  after_json     JSONB,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow admin select on activity_log"
  ON public.activity_log FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow admin insert on activity_log"
  ON public.activity_log FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_activity_log_created
  ON public.activity_log(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_activity_log_entity
  ON public.activity_log(entity_type, entity_id);

-- ============================================================
-- 4. Homepage content seed
-- ============================================================

INSERT INTO public.site_content (kind, title, body, sort_order, is_active, status, approved)
SELECT 'homepage', 'sections',
  '{"hero":{"title":"Singapore''s Reliable Scrap Metal Recycling & Trading","subtitle":"","button_text":"Request Pickup","button_link":"/quote","secondary_button_text":"Our Services","secondary_button_link":"/services"},"about":{"title":"About Red Dot Metal","description":"Red Dot Metal is a Singapore-based B2B scrap metal recycling and trading company dedicated to providing reliable, transparent, and environmentally responsible metal waste management solutions.","image_url":""},"whyUs":{"title":"Why Choose Red Dot Metal","description":"We make scrap metal recycling easy, transparent, and profitable","features":[{"title":"Same-Day Service","desc":"We respond within hours and pick up on the same day."},{"title":"Free Pickup","desc":"No hidden fees. We collect your scrap metal at no cost."},{"title":"Immediate Payment","desc":"Get paid immediately via PayNow, bank transfer, or cash."},{"title":"Transparent Pricing","desc":"Real-time market rates with clear weight and price breakdown."},{"title":"Licensed & Certified","desc":"Fully licensed by NEA. Compliant with all regulations."},{"title":"We Cover All Areas","desc":"Serving all of Singapore — East, West, North, South, Central."}]},"stats":[{"value":20,"suffix":"+","label":"Years Experience","sort_order":1},{"value":50000,"suffix":"+","label":"Tons Collected","sort_order":2},{"value":20,"suffix":"","label":"Clients Served","sort_order":3},{"value":90,"suffix":"%","label":"Same-Day Pickup","sort_order":4}],"cta":{"title":"Ready to turn your scrap into cash?","description":"","button_text":"Schedule a Pickup Today","button_link":"/quote"}}',
  0, true, 'active', true
WHERE NOT EXISTS (
  SELECT 1 FROM public.site_content WHERE kind = 'homepage' AND title = 'sections'
);

-- ============================================================
-- 5. Alter existing databases: add 'homepage' to CHECK constraint
-- ============================================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname LIKE '%kind%'
      AND conrelid = 'public.site_content'::regclass
  ) THEN
    ALTER TABLE public.site_content
      DROP CONSTRAINT IF EXISTS site_content_kind_check;

    ALTER TABLE public.site_content
      ADD CONSTRAINT site_content_kind_check
      CHECK (kind IN ('price','testimonial','service','image','setting','homepage'));
  END IF;
END $$;
