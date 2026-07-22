-- SEO Internal Links configuration table
CREATE TABLE IF NOT EXISTS seo_internal_links (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword          TEXT UNIQUE NOT NULL,
  target_url       TEXT NOT NULL,
  open_in_new_tab  BOOLEAN NOT NULL DEFAULT false,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup/sorting by keyword
CREATE INDEX IF NOT EXISTS idx_seo_internal_links_keyword ON seo_internal_links (keyword);

ALTER TABLE seo_internal_links ENABLE ROW LEVEL SECURITY;

-- Public site reads all configured links to perform replacement
DROP POLICY IF EXISTS "Allow public select on seo_internal_links" ON seo_internal_links;
CREATE POLICY "Allow public select on seo_internal_links"
  ON seo_internal_links FOR SELECT
  USING (true);

-- Authenticated admin sessions can manage all rows
DROP POLICY IF EXISTS "Allow admin all on seo_internal_links" ON seo_internal_links;
CREATE POLICY "Allow admin all on seo_internal_links"
  ON seo_internal_links FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
