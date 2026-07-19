-- ============================================================
-- Homepage Manager — Incremental Migration
-- Safe to run on existing databases.
-- ============================================================

-- ─── 1. Add 'homepage' to the kind CHECK constraint ────────

DO $$
BEGIN
  -- Only alter if 'homepage' is not already allowed
  IF NOT (
    SELECT EXISTS (
      SELECT 1
      FROM pg_constraint c
      JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = ANY(c.conkey)
      WHERE c.conrelid = 'public.site_content'::regclass
        AND c.contype = 'c'
        AND pg_get_constraintdef(c.oid) LIKE '%homepage%'
    )
  ) THEN
    ALTER TABLE public.site_content
      DROP CONSTRAINT IF EXISTS site_content_kind_check;

    ALTER TABLE public.site_content
      ADD CONSTRAINT site_content_kind_check
      CHECK (kind IN ('price','testimonial','service','image','setting','homepage'));
  END IF;
END $$;

-- ─── 2. Allow anon read access to homepage rows ────────────

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'site_content'
      AND policyname = 'Allow public read active homepage'
  ) THEN
    CREATE POLICY "Allow public read active homepage"
      ON public.site_content FOR SELECT
      TO anon
      USING (kind = 'homepage' AND is_active = true AND status != 'deleted');
  END IF;
END $$;

-- ─── 3. Insert homepage seed data (only if missing) ────────

INSERT INTO public.site_content (kind, title, body, sort_order, is_active, status, approved)
SELECT
  'homepage',
  'sections',
  $BODY$
{
  "hero": {
    "title": "Singapore's Reliable Scrap Metal Recycling & Trading",
    "subtitle": "",
    "button_text": "Request Pickup",
    "button_link": "/quote",
    "secondary_button_text": "Our Services",
    "secondary_button_link": "/services"
  },
  "about": {
    "title": "About Red Dot Metal",
    "description": "Red Dot Metal is a Singapore-based B2B scrap metal recycling and trading company dedicated to providing reliable, transparent, and environmentally responsible metal waste management solutions.",
    "image_url": ""
  },
  "whyUs": {
    "title": "Why Choose Red Dot Metal",
    "description": "We make scrap metal recycling easy, transparent, and profitable",
    "features": [
      { "title": "Same-Day Service", "desc": "We respond within hours and pick up on the same day." },
      { "title": "Free Pickup", "desc": "No hidden fees. We collect your scrap metal at no cost." },
      { "title": "Immediate Payment", "desc": "Get paid immediately via PayNow, bank transfer, or cash." },
      { "title": "Transparent Pricing", "desc": "Real-time market rates with clear weight and price breakdown." },
      { "title": "Licensed & Certified", "desc": "Fully licensed by NEA. Compliant with all regulations." },
      { "title": "We Cover All Areas", "desc": "Serving all of Singapore — East, West, North, South, Central." }
    ]
  },
  "stats": [
    { "value": 20, "suffix": "+", "label": "Years Experience", "sort_order": 1 },
    { "value": 50000, "suffix": "+", "label": "Tons Collected", "sort_order": 2 },
    { "value": 20, "suffix": "", "label": "Clients Served", "sort_order": 3 },
    { "value": 90, "suffix": "%", "label": "Same-Day Pickup", "sort_order": 4 }
  ],
  "cta": {
    "title": "Ready to turn your scrap into cash?",
    "description": "",
    "button_text": "Schedule a Pickup Today",
    "button_link": "/quote"
  }
}
$BODY$,
  0,
  true,
  'active',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.site_content
  WHERE kind = 'homepage' AND title = 'sections'
);
