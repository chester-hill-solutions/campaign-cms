-- CMS analytics configuration: providers, custom scripts, and event tracking.
-- (mirrors packages/cms-setup/sql/0005_analytics_config.sql D1 DDL)

CREATE TABLE IF NOT EXISTS analytics_config (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  config_json TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
