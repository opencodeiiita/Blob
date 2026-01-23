// Mobile SQLite schema
// Keep in sync with packages/db/src/schema/mindMaps.ts

export const MIND_MAPS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS mind_maps (
  id TEXT PRIMARY KEY NOT NULL,
  topic_id TEXT NOT NULL,
  json TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
);
`;

export const MIND_MAPS_INDEX_SQL = `
CREATE INDEX IF NOT EXISTS mind_maps_topic_id_idx
ON mind_maps (topic_id);
`;
