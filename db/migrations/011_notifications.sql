CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY,
  account_id uuid NOT NULL REFERENCES app_users(id),
  academy_id uuid REFERENCES academies(id),
  kind text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  link text,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS notifications_account_created ON notifications(account_id, created_at DESC);
CREATE TABLE IF NOT EXISTS notification_prefs (
  account_id uuid PRIMARY KEY REFERENCES app_users(id),
  email_enabled boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS notification_email_outbox (
  id uuid PRIMARY KEY,
  notification_id uuid REFERENCES notifications(id),
  account_id uuid NOT NULL REFERENCES app_users(id),
  to_email text NOT NULL,
  subject text NOT NULL,
  body text NOT NULL,
  status text NOT NULL DEFAULT 'queued',
  provider text,
  error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  sent_at timestamptz
);
CREATE INDEX IF NOT EXISTS notification_email_outbox_account ON notification_email_outbox(account_id, created_at DESC);
