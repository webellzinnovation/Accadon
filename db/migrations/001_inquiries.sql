CREATE TABLE IF NOT EXISTS inquiries (
 id UUID PRIMARY KEY,
 idempotency_key UUID NOT NULL UNIQUE,
 payload_hash TEXT NOT NULL,
 requester_name VARCHAR(100) NOT NULL,
 phone VARCHAR(20) NOT NULL,
 email VARCHAR(254),
 interest VARCHAR(30) NOT NULL CHECK (interest IN ('communities','schools','academies','one-to-one')),
 locality VARCHAR(120) NOT NULL,
 learner_name VARCHAR(100),
 age_group VARCHAR(30),
 institution VARCHAR(160),
 message VARCHAR(2000) NOT NULL DEFAULT '',
 source VARCHAR(30) NOT NULL DEFAULT 'website',
 contact_consent BOOLEAN NOT NULL CHECK (contact_consent),
 consent_version VARCHAR(50) NOT NULL,
 consent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 pipeline_status VARCHAR(30) NOT NULL DEFAULT 'New' CHECK (pipeline_status IN ('New','Contacted','Trial/Discussion','Onboarding','Enrolled','Closed')),
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS inquiries_pipeline_created_idx ON inquiries(pipeline_status,created_at DESC);
CREATE TABLE IF NOT EXISTS crm_activities (
 id UUID PRIMARY KEY,
 inquiry_id UUID NOT NULL REFERENCES inquiries(id) ON DELETE RESTRICT,
 activity_type VARCHAR(40) NOT NULL,
 safe_summary TEXT NOT NULL,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS crm_activities_inquiry_idx ON crm_activities(inquiry_id,created_at);
