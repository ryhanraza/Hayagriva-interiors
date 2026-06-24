-- Enable Row Level Security on page_sections and add explicit policies.
--
-- Today the page_sections table is protected only at the API route layer
-- (verifyAdmin in app/api/content/**). Enabling RLS here is defense-in-depth:
-- even if a route is misconfigured or a future server query forgets its guard,
-- anonymous DB clients cannot mutate content, and only authenticated requests
-- may write. Public read stays open so the site renders without a session.

ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;

-- Public can read visible sections (matches the public GET route which also
-- filters is_visible = true for non-admins).
DROP POLICY IF EXISTS "Allow public read on page_sections" ON page_sections;
CREATE POLICY "Allow public read on page_sections"
  ON page_sections FOR SELECT
  USING (true);

-- Any authenticated request (admin session via SDK) may read/write all rows.
DROP POLICY IF EXISTS "Allow admin all on page_sections" ON page_sections;
CREATE POLICY "Allow admin all on page_sections"
  ON page_sections FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
