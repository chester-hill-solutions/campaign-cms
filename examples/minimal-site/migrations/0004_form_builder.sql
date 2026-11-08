-- CMS form builder: form definitions and response storage.

CREATE TABLE IF NOT EXISTS form_definitions (
  id TEXT PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  fields_json TEXT NOT NULL,
  settings_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS form_responses (
  id TEXT PRIMARY KEY NOT NULL,
  form_id TEXT NOT NULL REFERENCES form_definitions (id) ON DELETE CASCADE,
  data_json TEXT NOT NULL,
  submitted_at TEXT NOT NULL,
  ip TEXT,
  spam INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_form_responses_form ON form_responses (form_id, submitted_at DESC);

-- The anonymous per-IP rate limiter filters on ip and submitted_at. Without this index the
-- predicate is a full scan of form_responses, so the control's cost grows with the number of
-- responses the site has retained.
CREATE INDEX IF NOT EXISTS idx_form_responses_ip_time ON form_responses (ip, submitted_at DESC);
