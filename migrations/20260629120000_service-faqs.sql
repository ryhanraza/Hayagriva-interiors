-- Service-specific FAQs: one row per Q&A, scoped to a service slug.
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

-- Public site reads only active FAQs (defense-in-depth; public API also filters).
DROP POLICY IF EXISTS "Allow public read active service_faqs" ON service_faqs;
CREATE POLICY "Allow public read active service_faqs"
  ON service_faqs FOR SELECT
  USING (is_active = true);

-- Authenticated admin sessions may manage all rows.
DROP POLICY IF EXISTS "Allow admin all on service_faqs" ON service_faqs;
CREATE POLICY "Allow admin all on service_faqs"
  ON service_faqs FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
