-- project_images: extra gallery pictures attached to a single portfolio project
CREATE TABLE IF NOT EXISTS project_images (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  image_url   TEXT NOT NULL,
  image_key   TEXT,
  caption     TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Fast lookup of all images for a project, in display order
CREATE INDEX IF NOT EXISTS idx_project_images_project
  ON project_images (project_id, sort_order);

-- Enable Row Level Security (public read, no public write — admin service key bypasses)
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;

-- Public can read gallery images (matches public read pattern for projects)
DROP POLICY IF EXISTS "project_images_read_all" ON project_images;
CREATE POLICY "project_images_read_all"
  ON project_images FOR SELECT
  USING (true);
