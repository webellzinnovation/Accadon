ALTER TABLE academies ADD COLUMN IF NOT EXISTS published BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE academies ADD COLUMN IF NOT EXISTS onboarding_step INTEGER NOT NULL DEFAULT 0;
ALTER TABLE academies ADD COLUMN IF NOT EXISTS onboarding_data JSONB NOT NULL DEFAULT '{}'::jsonb;
CREATE TABLE IF NOT EXISTS organizer_requests (
  id UUID PRIMARY KEY,
  organizer_id UUID NOT NULL REFERENCES app_users(id),
  academy_id UUID NOT NULL REFERENCES academies(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','declined')),
  decided_by UUID REFERENCES app_users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  decided_at TIMESTAMPTZ
);
CREATE UNIQUE INDEX IF NOT EXISTS organizer_requests_pending_unique ON organizer_requests(organizer_id) WHERE status='pending';
-- Organizers may exist without an academy while their join request is pending.
ALTER TABLE app_users DROP CONSTRAINT app_users_scope_check;
ALTER TABLE app_users ADD CONSTRAINT app_users_scope_check CHECK((role IN ('superadmin','player','parent') AND academy_id IS NULL) OR (role IN ('academy_admin','family') AND academy_id IS NOT NULL) OR (role='organizer'));
