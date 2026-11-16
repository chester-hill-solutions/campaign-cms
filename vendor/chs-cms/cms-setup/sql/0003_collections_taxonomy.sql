-- CMS collections and taxonomy: reusable content organization primitives.

CREATE TABLE IF NOT EXISTS cms_collections (
  id TEXT PRIMARY KEY NOT NULL,
  label TEXT NOT NULL,
  description TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS cms_collection_categories (
  id TEXT PRIMARY KEY NOT NULL,
  collection_id TEXT NOT NULL REFERENCES cms_collections (id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  UNIQUE (collection_id, slug)
);

CREATE TABLE IF NOT EXISTS cms_tags (
  id TEXT PRIMARY KEY NOT NULL,
  label TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT
);

CREATE TABLE IF NOT EXISTS cms_collection_fields (
  id TEXT PRIMARY KEY NOT NULL,
  collection_id TEXT NOT NULL REFERENCES cms_collections (id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  label TEXT NOT NULL,
  type TEXT NOT NULL,
  required INTEGER NOT NULL DEFAULT 0,
  config_json TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  UNIQUE (collection_id, key)
);

CREATE TABLE IF NOT EXISTS cms_entry_collections (
  entry_id TEXT NOT NULL REFERENCES content_entries (id) ON DELETE CASCADE,
  collection_id TEXT NOT NULL REFERENCES cms_collections (id) ON DELETE CASCADE,
  category_id TEXT REFERENCES cms_collection_categories (id) ON DELETE SET NULL,
  featured INTEGER NOT NULL DEFAULT 0,
  sort_date TEXT,
  PRIMARY KEY (entry_id, collection_id)
);

CREATE TABLE IF NOT EXISTS cms_entry_tags (
  entry_id TEXT NOT NULL REFERENCES content_entries (id) ON DELETE CASCADE,
  tag_id TEXT NOT NULL REFERENCES cms_tags (id) ON DELETE CASCADE,
  PRIMARY KEY (entry_id, tag_id)
);

CREATE TABLE IF NOT EXISTS cms_entry_metadata_values (
  entry_id TEXT NOT NULL REFERENCES content_entries (id) ON DELETE CASCADE,
  collection_id TEXT NOT NULL REFERENCES cms_collections (id) ON DELETE CASCADE,
  field_key TEXT NOT NULL,
  value_json TEXT NOT NULL,
  PRIMARY KEY (entry_id, collection_id, field_key)
);

CREATE INDEX IF NOT EXISTS idx_cms_entry_collections_collection ON cms_entry_collections (collection_id, featured, sort_date DESC);
CREATE INDEX IF NOT EXISTS idx_cms_entry_tags_tag ON cms_entry_tags (tag_id);
CREATE INDEX IF NOT EXISTS idx_cms_entry_metadata_collection_field ON cms_entry_metadata_values (collection_id, field_key);
