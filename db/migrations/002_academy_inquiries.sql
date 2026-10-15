-- Preserve historical coaching inquiries while accepting the multi-sport SaaS audience.
ALTER TABLE inquiries DROP CONSTRAINT IF EXISTS inquiries_interest_check;
ALTER TABLE inquiries ADD CONSTRAINT inquiries_interest_check CHECK (interest IN ('communities','schools','academies','one-to-one','tournaments','coaching','both'));
ALTER TABLE inquiries ADD COLUMN sport VARCHAR(120);
ALTER TABLE inquiries ADD COLUMN requester_role VARCHAR(80);
