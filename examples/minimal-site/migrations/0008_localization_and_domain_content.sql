-- Localization, audit and typed domain content.
--
-- These tables were app-owned until now. A site with typed records of its own —
-- a tour, a stop, a business, a notice — hand-rolled cms_content_entries and
-- cms_content_revisions, so the shared store and the agent tools could not reach
-- that content at all. They ship here so one schema serves every consumer, and
-- so `readD1Ddl()` can build a database the domain adapter is tested against.
--
-- Two notes for whoever changes this file.
--
-- 1. Timestamps in this family are INTEGER epoch milliseconds, not the TEXT
--    timestamps the page tables use. That difference is inherited from the
--    application that introduced these tables, and it is kept explicit rather
--    than normalised, because normalising it is a data migration.
-- 2. cms_locales is a foreign-key target for every `locale` column here, so it
--    is defined first and its default row is seeded. Without a locale row a
--    fresh database cannot accept any localized content, which is a schema that
--    installs cleanly and then rejects its first write.

CREATE TABLE IF NOT EXISTS cms_locales (
  locale TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  is_default INTEGER NOT NULL DEFAULT 0 CHECK (is_default IN (0, 1)),
  is_enabled INTEGER NOT NULL DEFAULT 1 CHECK (is_enabled IN (0, 1)),
  fallback_locale TEXT REFERENCES cms_locales(locale)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_cms_locales_single_default
  ON cms_locales(is_default) WHERE is_default = 1;

INSERT OR IGNORE INTO cms_locales (locale, label, is_default, is_enabled)
VALUES ('en-CA', 'English (Canada)', 1, 1);

-- Groups the per-locale entries that are the same record in different languages.
CREATE TABLE IF NOT EXISTS cms_translation_groups (
  id TEXT PRIMARY KEY,
  content_type TEXT NOT NULL,
  source_entry_id TEXT REFERENCES content_entries(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL
);

-- The CHECK below states the editor's invariant: 'missing' is the only state
-- without a translation behind it and every other state needs one. It is written
-- above the statement rather than inside it because a comment inside a CREATE
-- TABLE body is split on its commas by the shape parser in ddl.ts.
CREATE TABLE IF NOT EXISTS cms_translations (
  group_id TEXT NOT NULL REFERENCES cms_translation_groups(id) ON DELETE CASCADE,
  locale TEXT NOT NULL REFERENCES cms_locales(locale),
  entry_id TEXT UNIQUE REFERENCES content_entries(id) ON DELETE CASCADE,
  state TEXT NOT NULL CHECK (state IN ('missing', 'draft', 'review', 'published')),
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (group_id, locale),
  CHECK ((state = 'missing' AND entry_id IS NULL) OR (state <> 'missing' AND entry_id IS NOT NULL))
);

CREATE INDEX IF NOT EXISTS idx_cms_translations_locale_state
  ON cms_translations(locale, state, updated_at DESC);

-- Staff and agent CMS actions are auditable without recording payloads or secrets.
CREATE TABLE IF NOT EXISTS cms_admin_audit (
  id TEXT PRIMARY KEY,
  actor_email TEXT NOT NULL,
  action TEXT NOT NULL,
  entry_id TEXT,
  summary TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_cms_admin_audit_created
  ON cms_admin_audit(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_cms_admin_audit_actor
  ON cms_admin_audit(actor_email, created_at DESC);

-- Typed domain content. Same draft/published pointer model as the page tables,
-- different tables and a host-defined payload per content type.
CREATE TABLE IF NOT EXISTS cms_content_entries (
  id TEXT PRIMARY KEY NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('trip', 'stop', 'business', 'notice')),
  slug TEXT NOT NULL,
  locale TEXT NOT NULL REFERENCES cms_locales(locale),
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  draft_revision_id TEXT,
  published_revision_id TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  published_at INTEGER,
  UNIQUE (content_type, slug, locale)
);

CREATE INDEX IF NOT EXISTS idx_cms_content_entries_type_updated
  ON cms_content_entries(content_type, updated_at DESC);

-- `title` is NOT NULL with an empty default rather than a nullable column:
-- per-revision titles arrived after the first entries already existed.
CREATE TABLE IF NOT EXISTS cms_content_revisions (
  id TEXT PRIMARY KEY NOT NULL,
  entry_id TEXT NOT NULL REFERENCES cms_content_entries(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  locale TEXT NOT NULL REFERENCES cms_locales(locale),
  title TEXT NOT NULL DEFAULT '',
  payload TEXT NOT NULL CHECK (json_valid(payload)),
  author_email TEXT NOT NULL,
  created_at INTEGER NOT NULL,
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
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (entry_id, locale),
  UNIQUE (translation_group_id, locale)
);
