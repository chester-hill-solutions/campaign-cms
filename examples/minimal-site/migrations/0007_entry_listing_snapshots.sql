-- Freeze entry listing data alongside the page revision.
-- Current draft/published pointers inherit the only provable legacy state.
-- Unreferenced historical revisions deliberately keep an empty snapshot.
ALTER TABLE content_revisions ADD COLUMN listing_snapshot_json TEXT;
UPDATE content_revisions SET listing_snapshot_json = '{"version":1,"collections":[],"tags":[]}';

UPDATE content_revisions
SET listing_snapshot_json = json_object(
  'version', 1,
  'collections', json(COALESCE((
    SELECT json_group_array(json_object(
      'collectionId', ec.collection_id, 'collectionLabel', c.label,
      'category', CASE WHEN cc.id IS NULL THEN NULL ELSE json_object('id', cc.id, 'label', cc.label, 'slug', cc.slug) END,
      'featured', CASE WHEN ec.featured = 1 THEN 1 ELSE 0 END, 'sortDate', ec.sort_date,
      'metadata', json(COALESCE((
        SELECT json_group_object(m.field_key, CASE WHEN json_valid(m.value_json) THEN json(m.value_json) ELSE m.value_json END)
        FROM cms_entry_metadata_values m
        WHERE m.entry_id = ec.entry_id AND m.collection_id = ec.collection_id
      ), '{}'))
    ))
    FROM cms_entry_collections ec JOIN cms_collections c ON c.id = ec.collection_id
    LEFT JOIN cms_collection_categories cc ON cc.id = ec.category_id AND cc.collection_id = ec.collection_id
    WHERE ec.entry_id = content_revisions.entry_id
  ), '[]')),
  'tags', json(COALESCE((
    SELECT json_group_array(json_patch(json_object('id', t.id, 'label', t.label, 'slug', t.slug), CASE WHEN t.description IS NULL THEN '{}' ELSE json_object('description', t.description) END))
    FROM cms_entry_tags et JOIN cms_tags t ON t.id = et.tag_id
    WHERE et.entry_id = content_revisions.entry_id
  ), '[]'))
)
WHERE EXISTS (
  SELECT 1 FROM content_entries e
  WHERE e.id = content_revisions.entry_id
    AND (e.draft_revision_id = content_revisions.id OR e.published_revision_id = content_revisions.id)
);

-- Fail closed for old writers that do not know about complete revisions.
CREATE TRIGGER content_revisions_listing_snapshot_insert
BEFORE INSERT ON content_revisions WHEN NEW.listing_snapshot_json IS NULL
BEGIN
  SELECT RAISE(ABORT, 'A complete listing snapshot is required for every revision');
END;

CREATE TRIGGER content_revisions_listing_snapshot_update
BEFORE UPDATE OF listing_snapshot_json ON content_revisions WHEN NEW.listing_snapshot_json IS NULL
BEGIN
  SELECT RAISE(ABORT, 'A complete listing snapshot is required for every revision');
END;
