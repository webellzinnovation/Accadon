-- Independent organizers: registration and tournament ownership without an academy.
-- Academy membership is now exclusive to academy_admin and family accounts.
ALTER TABLE tournaments ALTER COLUMN academy_id DROP NOT NULL;
CREATE TABLE IF NOT EXISTS organizer_subscriptions (
  id UUID PRIMARY KEY,
  organizer_id UUID NOT NULL UNIQUE REFERENCES app_users(id),
  plan_id TEXT NOT NULL REFERENCES plans(id),
  status TEXT NOT NULL DEFAULT 'trial' CHECK(status IN ('trial','active','past_due','cancelled')),
  tournaments_credit INTEGER NOT NULL DEFAULT 2 CHECK(tournaments_credit >= 0),
  notes TEXT NOT NULL DEFAULT '',
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Existing organizers become independent and keep their tournaments as owner-run events.
UPDATE tournaments SET academy_id=NULL WHERE owner_id IN (SELECT id FROM app_users WHERE role='organizer');
UPDATE app_users SET academy_id=NULL WHERE role='organizer';
INSERT INTO organizer_subscriptions(id,organizer_id,plan_id,status,tournaments_credit)
  SELECT gen_random_uuid(),id,'free','trial',2 FROM app_users WHERE role='organizer'
  ON CONFLICT(organizer_id) DO NOTHING;
-- The join-request-to-an-academy flow is removed: organizers are independent from registration.
DROP TABLE IF EXISTS organizer_requests;
-- Tighten the account scope rule: organizers never belong to an academy.
ALTER TABLE app_users DROP CONSTRAINT app_users_scope_check;
ALTER TABLE app_users ADD CONSTRAINT app_users_scope_check CHECK((role IN ('superadmin','player','parent') AND academy_id IS NULL) OR (role IN ('academy_admin','family') AND academy_id IS NOT NULL) OR (role='organizer' AND academy_id IS NULL));
