-- Payments (test mode only): each academy connects its own gateway. Entry fees
-- are recorded in paise; when no gateway is configured the payment is honestly
-- recorded as skipped_no_config - nothing pretends to charge.
CREATE TABLE IF NOT EXISTS academy_payment_settings (
  academy_id uuid PRIMARY KEY REFERENCES academies(id),
  provider text NOT NULL DEFAULT 'razorpay' CHECK(provider='razorpay'),
  mode text NOT NULL DEFAULT 'test' CHECK(mode='test'),
  key_id text NOT NULL,
  key_secret text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS entry_fee_paise integer NOT NULL DEFAULT 0 CHECK(entry_fee_paise>=0);
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY,
  academy_id uuid REFERENCES academies(id),
  tournament_id uuid NOT NULL REFERENCES tournaments(id),
  entry_id uuid NOT NULL REFERENCES tournament_entries(id),
  account_id uuid NOT NULL REFERENCES app_users(id),
  amount_paise integer NOT NULL CHECK(amount_paise>0),
  currency text NOT NULL DEFAULT 'INR',
  status text NOT NULL DEFAULT 'created' CHECK(status IN ('created','paid','failed','skipped_no_config')),
  provider text NOT NULL DEFAULT 'razorpay',
  provider_order_id text,
  provider_payment_id text,
  receipt_no text UNIQUE,
  error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  paid_at timestamptz
);
CREATE INDEX IF NOT EXISTS payments_academy_created ON payments(academy_id, created_at DESC);
CREATE INDEX IF NOT EXISTS payments_account_created ON payments(account_id, created_at DESC);
CREATE INDEX IF NOT EXISTS payments_entry ON payments(entry_id);
