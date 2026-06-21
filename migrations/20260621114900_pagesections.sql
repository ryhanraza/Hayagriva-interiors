-- Page Sections table: represents a dynamic section of a page
CREATE TABLE IF NOT EXISTS page_sections (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page             TEXT NOT NULL,
  type             TEXT NOT NULL, -- 'hero' | 'services' | 'about' | 'portfolio' | 'testimonials' | 'cta' | 'custom'
  title            TEXT,
  subtitle         TEXT,
  description      TEXT,
  content          TEXT,
  images           JSONB DEFAULT '[]'::jsonb, -- array of {url, key}
  buttons          JSONB DEFAULT '[]'::jsonb, -- array of {text, link}
  layout           TEXT, -- 'grid' | 'split' | 'full-width'
  custom_json      JSONB DEFAULT '{}'::jsonb,
  is_visible       BOOLEAN DEFAULT true,
  section_order    INTEGER DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Index for ordering sections within a page
CREATE INDEX IF NOT EXISTS idx_page_sections_page_order ON page_sections (page, section_order);
