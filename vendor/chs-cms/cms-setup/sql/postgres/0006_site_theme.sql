-- CMS site theme: per-site design tokens (colors + fonts).
-- (mirrors packages/cms-setup/sql/0006_site_theme.sql D1 DDL)

CREATE TABLE IF NOT EXISTS site_theme (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  theme_json TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
