CREATE TABLE IF NOT EXISTS custom_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE custom_pages ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Allow public select on custom_pages"
  ON custom_pages FOR SELECT USING (true);

CREATE POLICY "Allow admin all on custom_pages"
  ON custom_pages FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
