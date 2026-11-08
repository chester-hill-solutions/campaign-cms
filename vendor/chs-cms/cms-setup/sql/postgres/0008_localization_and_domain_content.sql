-- Postgres CMS localization, audit and typed domain content
-- (mirrors packages/cms-setup/sql/0007_localization_and_domain_content.sql)
--
-- Same tables and same column names as the D1 dialect; `ddl.test.ts` asserts
-- that and fails on a change that reaches only one side. Types differ where the
-- dialects genuinely differ.
--
-- The epoch-millisecond timestamp columns are BIGINT here, not INTEGER. Epoch
-- milliseconds are around 1.8e12, which overflows a 32-bit INTEGER, so a mirror
-- written by analogy with `version INTEGER` would store 2026 as 1970.

CREATE TABLE IF NOT EXISTS cms_locales (
  locale TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  is_default INTEGER NOT NULL DEFAULT 0 CHECK (is_default IN (0, 1)),
  is_enabled INTEGER NOT NULL DEFAULT 1 CHECK (is_enabled IN (0, 1)),
  fallback_locale TEXT REFERENCES cms_locales(locale)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_cms_locales_single_default
  ON cms_locales(is_default) WHERE is_default = 1;

INSERT INTO cms_locales (locale, label, is_default, is_enabled)
VALUES ('en-CA', 'English (Canada)', 1, 1)
ON CONFLICT (locale) DO NOTHING;

CREATE TABLE IF NOT EXISTS cms_translation_groups (
  id TEXT PRIMARY KEY,
  content_type TEXT NOT NULL,
  source_entry_id TEXT REFERENCES content_entries(id) ON DELETE SET NULL,
  created_at BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS cms_translations (
  group_id TEXT NOT NULL REFERENCES cms_translation_groups(id) ON DELETE CASCADE,
  locale TEXT NOT NULL REFERENCES cms_locales(locale),
  entry_id TEXT UNIQUE REFERENCES content_entries(id) ON DELETE CASCADE,
  state TEXT NOT NULL CHECK (state IN ('missing', 'draft', 'review', 'published')),
  updated_at BIGINT NOT NULL,
  PRIMARY KEY (group_id, locale),
  CHECK ((state = 'missing' AND entry_id IS NULL) OR (state <> 'missing' AND entry_id IS NOT NULL))
);

CREATE INDEX IF NOT EXISTS idx_cms_translations_locale_state
  ON cms_translations(locale, state, updated_at DESC);

CREATE TABLE IF NOT EXISTS cms_admin_audit (
  id TEXT PRIMARY KEY,
  actor_email TEXT NOT NULL,
  action TEXT NOT NULL,
  entry_id TEXT,
  summary TEXT NOT NULL,
  created_at BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_cms_admin_audit_created
  ON cms_admin_audit(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_cms_admin_audit_actor
  ON cms_admin_audit(actor_email, created_at DESC);

CREATE TABLE IF NOT EXISTS cms_content_entries (
  id TEXT PRIMARY KEY NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('trip', 'stop', 'business', 'notice')),
  slug TEXT NOT NULL,
  locale TEXT NOT NULL REFERENCES cms_locales(locale),
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  draft_revision_id TEXT,
  published_revision_id TEXT,
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL,
  published_at BIGINT,
  UNIQUE (content_type, slug, locale)
);

CREATE INDEX IF NOT EXISTS idx_cms_content_entries_type_updated
  ON cms_content_entries(content_type, updated_at DESC);

-- The payload CHECK differs from the D1 file by necessity. `json_valid()` is a
-- SQLite function with no Postgres equivalent, so this dialect uses the SQL/JSON
-- `IS JSON` predicate instead. A copy of the SQLite form here passes every static
-- gate -- the shape parity test compares column names and nothing else -- and then
-- fails on the first insert, which is how this was found.
--
-- Written above the statement rather than inside it, because a comma inside a
-- comment in a table definition body is parsed as a column separator by cmsTables
-- in cms-setup/src/ddl.ts. Two traps here, then: this file walked into both. The
-- other one is that writing the two words of that statement's keyword pair on one
-- line in a comment makes the table-name reader count the next word as a table.
CREATE TABLE IF NOT EXISTS cms_content_revisions (
  id TEXT PRIMARY KEY NOT NULL,
  entry_id TEXT NOT NULL REFERENCES cms_content_entries(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  locale TEXT NOT NULL REFERENCES cms_locales(locale),
  title TEXT NOT NULL DEFAULT '',
  payload TEXT NOT NULL CHECK (payload IS JSON),
  author_email TEXT NOT NULL,
  created_at BIGINT NOT NULL,
  message TEXT NOT NULL DEFAULT '',
  UNIQUE (entry_id, version)
);

CREATE INDEX IF NOT EXISTS idx_cms_content_revisions_entry
  ON cms_content_revisions(entry_id, version DESC);

CREATE TABLE IF NOT EXISTS cms_domain_translations (
  entry_id TEXT NOT NULL REFERENCES cms_content_entries(id) ON DELETE CASCADE,
  locale TEXT NOT NULL REFERENCES cms_locales(locale),
  translation_group_id TEXT NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('draft', 'review', 'published')),
  updated_at BIGINT NOT NULL,
  PRIMARY KEY (entry_id, locale),
  UNIQUE (translation_group_id, locale)
);
