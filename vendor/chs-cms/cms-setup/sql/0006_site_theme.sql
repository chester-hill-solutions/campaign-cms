-- CMS site theme: per-site design tokens (colors + fonts).

CREATE TABLE IF NOT EXISTS site_theme (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  theme_json TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
