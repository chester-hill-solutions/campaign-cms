-- Campaign CMS core: entries and revisions (draft/publish model)

CREATE TABLE IF NOT EXISTS content_entries (
  id TEXT PRIMARY KEY NOT NULL,
  type TEXT NOT NULL,
  slug TEXT UNIQUE,
  title TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  published_revision_id TEXT,
  draft_revision_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  published_at TEXT
);

CREATE TABLE IF NOT EXISTS content_revisions (
  id TEXT PRIMARY KEY NOT NULL,
  entry_id TEXT NOT NULL REFERENCES content_entries (id) ON DELETE CASCADE,
  payload TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  created_by TEXT,
  message TEXT,
  parent_revision_id TEXT REFERENCES content_revisions (id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_content_entries_type ON content_entries (type);
CREATE INDEX IF NOT EXISTS idx_content_entries_slug ON content_entries (slug);
CREATE INDEX IF NOT EXISTS idx_content_revisions_entry_id ON content_revisions (entry_id);
