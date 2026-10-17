-- Superadmin console: subscription plans, per-academy subscriptions and impersonation support.
CREATE TABLE plans (
 id TEXT PRIMARY KEY CHECK(id ~ '^[a-z0-9-]{2,40}$'),
 name TEXT NOT NULL CHECK(length(name) BETWEEN 2 AND 60),
 monthly_price_inr INTEGER NOT NULL DEFAULT 0 CHECK(monthly_price_inr >= 0),
 -- Entitlement shape: {tournaments: <cap per period|null>, website: bool, custom_domain: bool, staff_seats: <n|null>}
 limits JSONB NOT NULL DEFAULT '{}',
 active BOOLEAN NOT NULL DEFAULT true,
 sort INTEGER NOT NULL DEFAULT 0,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE academy_subscriptions (
 id UUID PRIMARY KEY,
 academy_id UUID NOT NULL UNIQUE REFERENCES academies(id),
 plan_id TEXT NOT NULL REFERENCES plans(id),
 status TEXT NOT NULL DEFAULT 'trial' CHECK(status IN ('trial','active','past_due','cancelled')),
 -- Free tournaments remaining before the academy needs a paid plan. Decremented on publish.
 tournaments_credit INTEGER NOT NULL DEFAULT 2 CHECK(tournaments_credit >= 0),
 notes TEXT NOT NULL DEFAULT '',
 started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Impersonation: a session minted by a superadmin acting as another user. Every request
-- carrying it is traceable; audit_events records start and end.
ALTER TABLE app_sessions ADD COLUMN IF NOT EXISTS impersonator_id UUID REFERENCES app_users(id);
CREATE INDEX IF NOT EXISTS audit_events_academy_idx ON audit_events(academy_id);
CREATE INDEX IF NOT EXISTS audit_events_created_idx ON audit_events(created_at DESC);
-- Seed plans. Superadmin edits these in the console; ids are stable slugs.
INSERT INTO plans(id,name,monthly_price_inr,limits,sort) VALUES
 ('free','Free',0,'{"tournaments":2,"website":false,"custom_domain":false,"staff_seats":2}',0),
 ('pro','Pro',999,'{"tournaments":null,"website":true,"custom_domain":false,"staff_seats":10}',1),
 ('premium','Premium',2499,'{"tournaments":null,"website":true,"custom_domain":true,"staff_seats":null}',2)
ON CONFLICT (id) DO NOTHING;
