CREATE TABLE academies (
 id UUID PRIMARY KEY, name TEXT NOT NULL CHECK(length(name) BETWEEN 2 AND 120), city TEXT NOT NULL DEFAULT '', created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE app_users (
 id UUID PRIMARY KEY, email TEXT NOT NULL UNIQUE, display_name TEXT NOT NULL, password_hash TEXT NOT NULL,
 role TEXT NOT NULL CHECK(role IN ('superadmin','academy_admin','organizer','family','player')),
 academy_id UUID REFERENCES academies(id), active BOOLEAN NOT NULL DEFAULT true, created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 CHECK((role IN ('superadmin','player') AND academy_id IS NULL) OR (role IN ('academy_admin','organizer','family') AND academy_id IS NOT NULL))
);
CREATE TABLE app_sessions (
 token_hash TEXT PRIMARY KEY, user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
 expires_at TIMESTAMPTZ NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX app_sessions_user_idx ON app_sessions(user_id);
CREATE TABLE tournaments (
 id UUID PRIMARY KEY, academy_id UUID NOT NULL REFERENCES academies(id), owner_id UUID NOT NULL REFERENCES app_users(id),
 name TEXT NOT NULL, sport TEXT NOT NULL CHECK(sport IN ('football','badminton','table_tennis','cricket')),
 format TEXT NOT NULL CHECK(format IN ('round_robin','single_elimination','groups_elimination','double_elimination','swiss','league_playoffs')),
 status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','published','completed','cancelled')),
 venue TEXT NOT NULL DEFAULT '', starts_on DATE, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX tournaments_academy_idx ON tournaments(academy_id);
CREATE TABLE audit_events (
 id UUID PRIMARY KEY, actor_id UUID NOT NULL REFERENCES app_users(id), academy_id UUID REFERENCES academies(id),
 action TEXT NOT NULL, entity_id UUID NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE tournament_entries (
 id UUID PRIMARY KEY, tournament_id UUID NOT NULL REFERENCES tournaments(id), player_id UUID NOT NULL REFERENCES app_users(id),
 status TEXT NOT NULL DEFAULT 'submitted' CHECK(status IN ('submitted','accepted','rejected','withdrawn')),
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 UNIQUE(tournament_id,player_id)
);
CREATE INDEX tournament_entries_player_idx ON tournament_entries(player_id);
-- Global identity is independent of academy membership. Email ownership verification,
-- mobile verification, child claims and invitation acceptance are later stages.
CREATE TABLE player_profiles (
 id UUID PRIMARY KEY, account_id UUID UNIQUE REFERENCES app_users(id), display_name TEXT NOT NULL,
 verified_mobile TEXT UNIQUE, mobile_verified_at TIMESTAMPTZ, created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 CHECK((verified_mobile IS NULL AND mobile_verified_at IS NULL) OR (verified_mobile IS NOT NULL AND mobile_verified_at IS NOT NULL))
);
CREATE TABLE academy_memberships (
 id UUID PRIMARY KEY, academy_id UUID NOT NULL REFERENCES academies(id), profile_id UUID NOT NULL REFERENCES player_profiles(id),
 sport TEXT NOT NULL CHECK(sport IN ('football','badminton','table_tennis','cricket')),
 status TEXT NOT NULL CHECK(status IN ('invited','active','declined','ended')),
 invited_by UUID NOT NULL REFERENCES app_users(id), accepted_at TIMESTAMPTZ,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(), UNIQUE(academy_id,profile_id,sport),
 CHECK(status<>'active' OR accepted_at IS NOT NULL)
);

-- Each child has a separate profile even when siblings share a guardian contact.
CREATE TABLE guardian_profile_links (
 guardian_account_id UUID NOT NULL REFERENCES app_users(id), child_profile_id UUID NOT NULL REFERENCES player_profiles(id),
 relationship TEXT NOT NULL CHECK(relationship IN ('parent','guardian')),
 status TEXT NOT NULL CHECK(status IN ('pending','verified','revoked')), verified_at TIMESTAMPTZ,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(), PRIMARY KEY(guardian_account_id,child_profile_id),
 CHECK(status<>'verified' OR verified_at IS NOT NULL)
);
-- Tournament entries carry the stable profile identity. In this stage self-entry
-- also keeps player_id for account authorization; guardian entry is not enabled.
ALTER TABLE tournament_entries ADD COLUMN profile_id UUID REFERENCES player_profiles(id);
