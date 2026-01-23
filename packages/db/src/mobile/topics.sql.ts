// Mobile SQLite schema
// Keep in sync with packages/db/src/schema/topics.ts
// NOTE: user_id has NO foreign key on mobile

export const TOPICS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS topics (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
`;

export const TOPICS_INDEX_SQL = `
CREATE INDEX IF NOT EXISTS topics_user_id_idx
ON topics (user_id);
`;
