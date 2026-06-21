-- SEO Settings table: one row per page, scalable without schema changes.
CREATE TABLE IF NOT EXISTS seo_settings (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page             TEXT NOT NULL UNIQUE,
  seo_title        TEXT,
  meta_description TEXT,
  meta_keywords    TEXT,
  canonical_url    TEXT,
  og_title         TEXT,
  og_description   TEXT,
  og_image         TEXT,
  og_image_key     TEXT,
  robots           TEXT DEFAULT 'index, follow',
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast page-level lookups
CREATE INDEX IF NOT EXISTS idx_seo_settings_page ON seo_settings (page);
