CREATE TABLE sport_definitions (
 id TEXT PRIMARY KEY CHECK(id ~ '^[a-z][a-z0-9_]{1,40}$'), name TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1,
 enabled BOOLEAN NOT NULL DEFAULT true, scoring_enabled BOOLEAN NOT NULL DEFAULT false,
 definition JSONB NOT NULL DEFAULT '{}', updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Product configuration, not customer/demo records. Scoring is gated pending research.
INSERT INTO sport_definitions(id,name,definition) VALUES
 ('table_tennis','Table tennis','{"participant":"player","venue":"table","scoreUnit":"points","researchStatus":"pending"}'),
 ('badminton','Badminton','{"participant":"player","venue":"court","scoreUnit":"points","researchStatus":"pending"}'),
 ('football','Football','{"participant":"team","venue":"pitch","scoreUnit":"goals","researchStatus":"pending"}'),
 ('cricket','Cricket','{"participant":"team","venue":"ground","scoreUnit":"runs","researchStatus":"pending"}'),
 ('pickleball','Pickleball','{"participant":"player","venue":"court","scoreUnit":"points","researchStatus":"pending"}');
ALTER TABLE tournaments DROP CONSTRAINT tournaments_sport_check;
ALTER TABLE tournaments ADD CONSTRAINT tournaments_sport_fkey FOREIGN KEY(sport) REFERENCES sport_definitions(id);
ALTER TABLE academy_memberships DROP CONSTRAINT academy_memberships_sport_check;
ALTER TABLE academy_memberships ADD CONSTRAINT academy_memberships_sport_fkey FOREIGN KEY(sport) REFERENCES sport_definitions(id);
ALTER TABLE app_users DROP CONSTRAINT app_users_role_check;
ALTER TABLE app_users DROP CONSTRAINT app_users_check;
ALTER TABLE app_users ADD CONSTRAINT app_users_role_check CHECK(role IN ('superadmin','academy_admin','organizer','family','player','parent'));
ALTER TABLE app_users ADD CONSTRAINT app_users_scope_check CHECK((role IN ('superadmin','player','parent') AND academy_id IS NULL) OR (role IN ('academy_admin','organizer','family') AND academy_id IS NOT NULL));
CREATE TABLE parent_profiles (
 account_id UUID PRIMARY KEY REFERENCES app_users(id), name TEXT NOT NULL, address TEXT NOT NULL DEFAULT '',
 location TEXT NOT NULL DEFAULT '', mobile TEXT NOT NULL DEFAULT '', updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE profile_sports (
 profile_id UUID NOT NULL REFERENCES player_profiles(id), sport_id TEXT NOT NULL REFERENCES sport_definitions(id),
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(), PRIMARY KEY(profile_id,sport_id)
);
-- The registration belongs to a profile; its submitting account may be a guardian.
ALTER TABLE tournament_entries DROP CONSTRAINT tournament_entries_tournament_id_player_id_key;
ALTER TABLE tournament_entries ADD CONSTRAINT tournament_entries_profile_unique UNIQUE(tournament_id,profile_id);
ALTER TABLE academy_memberships DROP CONSTRAINT academy_memberships_status_check;
ALTER TABLE academy_memberships ADD CONSTRAINT academy_memberships_status_check CHECK(status IN ('requested','invited','active','declined','ended'));
