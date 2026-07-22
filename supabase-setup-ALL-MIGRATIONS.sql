-- ============================================================
-- HAYAGRIVA INTERIORS — FULL DATABASE SETUP FOR SUPABASE
-- Paste this entire file into Supabase SQL Editor and click Run.
-- ============================================================

-- 1. SEO Settings
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
CREATE INDEX IF NOT EXISTS idx_seo_settings_page ON seo_settings (page);

-- 2. Page Sections
CREATE TABLE IF NOT EXISTS page_sections (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page             TEXT NOT NULL,
  type             TEXT NOT NULL,
  title            TEXT,
  subtitle         TEXT,
  description      TEXT,
  content          TEXT,
  images           JSONB DEFAULT '[]'::jsonb,
  buttons          JSONB DEFAULT '[]'::jsonb,
  layout           TEXT,
  custom_json      JSONB DEFAULT '{}'::jsonb,
  is_visible       BOOLEAN DEFAULT true,
  section_order    INTEGER DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_page_sections_page_order ON page_sections (page, section_order);
ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read on page_sections" ON page_sections;
CREATE POLICY "Allow public read on page_sections"
  ON page_sections FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow admin all on page_sections" ON page_sections;
CREATE POLICY "Allow admin all on page_sections"
  ON page_sections FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- 3. Custom Pages
CREATE TABLE IF NOT EXISTS custom_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE custom_pages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public select on custom_pages" ON custom_pages;
CREATE POLICY "Allow public select on custom_pages"
  ON custom_pages FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow admin all on custom_pages" ON custom_pages;
CREATE POLICY "Allow admin all on custom_pages"
  ON custom_pages FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- 4. Projects
CREATE TABLE IF NOT EXISTS projects (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  category    TEXT,
  location    TEXT,
  budget      TEXT,
  year        TEXT,
  area        TEXT,
  materials   TEXT,
  desc_text   TEXT,
  image       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "projects_read_all" ON projects;
CREATE POLICY "projects_read_all"
  ON projects FOR SELECT USING (true);

-- 5. Project Images
CREATE TABLE IF NOT EXISTS project_images (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  image_url   TEXT NOT NULL,
  image_key   TEXT,
  caption     TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_project_images_project ON project_images (project_id, sort_order);
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "project_images_read_all" ON project_images;
CREATE POLICY "project_images_read_all"
  ON project_images FOR SELECT USING (true);

-- 6. Service FAQs
CREATE TABLE IF NOT EXISTS service_faqs (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id     TEXT NOT NULL,
  question       TEXT NOT NULL,
  answer         TEXT NOT NULL,
  display_order  INTEGER NOT NULL DEFAULT 0,
  is_active      BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_service_faqs_service_id ON service_faqs (service_id);
CREATE INDEX IF NOT EXISTS idx_service_faqs_order ON service_faqs (service_id, display_order);
ALTER TABLE service_faqs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read active service_faqs" ON service_faqs;
CREATE POLICY "Allow public read active service_faqs"
  ON service_faqs FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Allow admin all on service_faqs" ON service_faqs;
CREATE POLICY "Allow admin all on service_faqs"
  ON service_faqs FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- 7. SEO Internal Links
CREATE TABLE IF NOT EXISTS seo_internal_links (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword          TEXT UNIQUE NOT NULL,
  target_url       TEXT NOT NULL,
  open_in_new_tab  BOOLEAN NOT NULL DEFAULT false,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_seo_internal_links_keyword ON seo_internal_links (keyword);
ALTER TABLE seo_internal_links ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public select on seo_internal_links" ON seo_internal_links;
CREATE POLICY "Allow public select on seo_internal_links"
  ON seo_internal_links FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow admin all on seo_internal_links" ON seo_internal_links;
CREATE POLICY "Allow admin all on seo_internal_links"
  ON seo_internal_links FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- 8. Contacts
CREATE TABLE IF NOT EXISTS contacts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  email      TEXT,
  phone      TEXT NOT NULL,
  message    TEXT,
  source     TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow admin all on contacts" ON contacts;
CREATE POLICY "Allow admin all on contacts"
  ON contacts FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- DONE! All 8 tables created.
