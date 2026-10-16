-- Website builder: one optional public site per academy, data-driven template skins.
CREATE TABLE IF NOT EXISTS academy_websites(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id UUID NOT NULL UNIQUE REFERENCES academies(id),
  template_id TEXT NOT NULL DEFAULT 'vibrant-pulse',
  slug TEXT NOT NULL UNIQUE CHECK(slug ~ '^[a-z0-9][a-z0-9-]{1,60}$'),
  published BOOLEAN NOT NULL DEFAULT false,
  sections JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS academy_websites_slug_idx ON academy_websites(slug) WHERE published;
