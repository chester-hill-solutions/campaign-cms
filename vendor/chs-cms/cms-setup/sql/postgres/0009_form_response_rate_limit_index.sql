-- (mirrors packages/cms-setup/sql/0009_form_response_rate_limit_index.sql D1 DDL)
--
-- The anonymous per-IP rate limiter filters on ip and submitted_at
-- (packages/cms-store-postgres/src/postgres-persistence.ts). Without this index the predicate
-- is a full scan of form_responses, so the control's cost grows with the number of responses
-- the site has retained.
--
-- A separate migration, because 0004 has already been applied by the databases that exist.
CREATE INDEX IF NOT EXISTS idx_form_responses_ip_time ON form_responses (ip, submitted_at DESC);
