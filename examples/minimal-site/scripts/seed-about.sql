-- Seed: published About page (entry page-about, slug about)
INSERT OR REPLACE INTO content_entries
  (id, type, slug, title, status, published_revision_id, draft_revision_id, created_at, updated_at, published_at)
VALUES
  (
    'page-about',
    'page_doc',
    'about',
    'About',
    'published',
    'rev_seed_about',
    'rev_seed_about',
    datetime('now'),
    datetime('now'),
    datetime('now')
  );

INSERT OR REPLACE INTO content_revisions
  (id, entry_id, payload, version, created_at, created_by, message, parent_revision_id)
VALUES
  (
    'rev_seed_about',
    'page-about',
    '{"kind":"pageDoc","version":1,"slug":"about","title":"About","dek":"A minimal Campaign CMS example page.","enabled":1,"showInNav":1,"navLabel":"About","seoTitle":"About | Campaign CMS Example","seoDescription":"Learn how Campaign CMS renders block-based pages.","blocks":[{"id":"blk_hero","type":"hero","layout":{"width":"contained","background":"none","spacing":"normal","align":"left"},"kicker":"Campaign CMS","heading":"Block-based pages on Cloudflare","dek":"Edit this page at /admin/pages/page-about","primaryCta":{"label":"Read the docs","href":"https://github.com/chester-hill-solutions/campaign-cms","variant":"primary"}},{"id":"blk_intro","type":"richText","layout":{"width":"contained","background":"none","spacing":"normal","align":"left"},"markdown":"This site demonstrates **@campaign/cms-core**, **@campaign/cms-server**, and **@campaign/cms-react** with D1 persistence and the admin page builder.\n\n- Public route loads published content\n- Editor route saves drafts and publishes\n- No auth in this demo — add your own before production"},{"id":"blk_cta","type":"ctaStrip","layout":{"width":"contained","background":"muted","spacing":"normal","align":"center"},"heading":"Ready to wire your campaign site?","body":"Clone the repo and follow docs/getting-started.md.","primaryCta":{"label":"View on GitHub","href":"https://github.com/chester-hill-solutions/campaign-cms","variant":"primary"}}]}',
    1,
    datetime('now'),
    'seed',
    'initial',
    NULL
  );
