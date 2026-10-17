-- Coaching: coach role, training batches and player assessments.
-- Coaches are academy staff issued by the academy admin (academy-scoped accounts).
-- Batches group active academy memberships under a coach; assessments are recorded
-- per player profile so children without their own login are covered too.
ALTER TABLE app_users DROP CONSTRAINT app_users_role_check;
ALTER TABLE app_users ADD CONSTRAINT app_users_role_check CHECK(role IN ('superadmin','academy_admin','organizer','family','player','parent','coach'));
ALTER TABLE app_users DROP CONSTRAINT app_users_scope_check;
ALTER TABLE app_users ADD CONSTRAINT app_users_scope_check CHECK((role IN ('superadmin','player','parent') AND academy_id IS NULL) OR (role IN ('academy_admin','family','coach') AND academy_id IS NOT NULL) OR (role='organizer' AND academy_id IS NULL));
CREATE TABLE batches (
  id UUID PRIMARY KEY,
  academy_id UUID NOT NULL REFERENCES academies(id),
  name TEXT NOT NULL,
  sport TEXT NOT NULL CHECK(sport IN ('football','badminton','table_tennis','cricket')),
  coach_id UUID REFERENCES app_users(id),
  schedule_label TEXT NOT NULL DEFAULT '',
  venue TEXT NOT NULL DEFAULT '',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE batch_members (
  id UUID PRIMARY KEY,
  batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  membership_id UUID NOT NULL REFERENCES academy_memberships(id),
  added_by UUID NOT NULL REFERENCES app_users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(batch_id,membership_id)
);
CREATE TABLE assessments (
  id UUID PRIMARY KEY,
  academy_id UUID NOT NULL REFERENCES academies(id),
  profile_id UUID NOT NULL REFERENCES player_profiles(id),
  batch_id UUID REFERENCES batches(id),
  coach_id UUID NOT NULL REFERENCES app_users(id),
  assessed_on DATE NOT NULL,
  rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
  strengths TEXT NOT NULL DEFAULT '',
  focus TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX batch_members_batch ON batch_members(batch_id);
CREATE INDEX batches_academy ON batches(academy_id);
CREATE INDEX assessments_profile ON assessments(profile_id,assessed_on DESC);
