-- Freeze entry listing data alongside the page revision.
-- Current draft/published pointers inherit the only provable legacy state.
-- Unreferenced historical revisions deliberately keep an empty snapshot.
ALTER TABLE content_revisions ADD COLUMN listing_snapshot_json TEXT;
UPDATE content_revisions SET listing_snapshot_json = '{"version":1,"collections":[],"tags":[]}';

UPDATE content_revisions
SET listing_snapshot_json = json_build_object(
  'version', 1,
  'collections', COALESCE((
    SELECT json_agg(json_build_object(
      'collectionId', ec.collection_id, 'collectionLabel', c.label,
      'category', CASE WHEN cc.id IS NULL THEN NULL ELSE json_build_object('id', cc.id, 'label', cc.label, 'slug', cc.slug) END,
      'featured', CASE WHEN ec.featured = 1 THEN 1 ELSE 0 END, 'sortDate', ec.sort_date,
      'metadata', COALESCE((
        SELECT json_object_agg(m.field_key, CASE WHEN pg_input_is_valid(m.value_json, 'json') THEN m.value_json::json ELSE to_json(m.value_json) END)
        FROM cms_entry_metadata_values m
        WHERE m.entry_id = ec.entry_id AND m.collection_id = ec.collection_id
      ), '{}'::json)
    ) ORDER BY ec.collection_id)
    FROM cms_entry_collections ec JOIN cms_collections c ON c.id = ec.collection_id
    LEFT JOIN cms_collection_categories cc ON cc.id = ec.category_id AND cc.collection_id = ec.collection_id
    WHERE ec.entry_id = content_revisions.entry_id
  ), '[]'::json),
  'tags', COALESCE((
    SELECT json_agg(json_strip_nulls(json_build_object('id', t.id, 'label', t.label, 'slug', t.slug, 'description', t.description)) ORDER BY t.id)
    FROM cms_entry_tags et JOIN cms_tags t ON t.id = et.tag_id
    WHERE et.entry_id = content_revisions.entry_id
  ), '[]'::json)
)::text
WHERE EXISTS (
  SELECT 1 FROM content_entries e
  WHERE e.id = content_revisions.entry_id
    AND (e.draft_revision_id = content_revisions.id OR e.published_revision_id = content_revisions.id)
);

ALTER TABLE content_revisions ALTER COLUMN listing_snapshot_json SET NOT NULL;
