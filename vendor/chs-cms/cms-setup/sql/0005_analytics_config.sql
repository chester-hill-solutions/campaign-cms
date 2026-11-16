-- CMS analytics configuration: providers, custom scripts, and event tracking.

CREATE TABLE IF NOT EXISTS analytics_config (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  config_json TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
