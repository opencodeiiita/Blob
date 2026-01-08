// Mobile SQLite schema
// Keep in sync with packages/db/src/schema/flashcards.ts

export const FLASHCARDS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS flashcards (
  id TEXT PRIMARY KEY NOT NULL,
  topic_id TEXT NOT NULL,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  difficulty TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  source TEXT,
  FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
);
`;

export const FLASHCARDS_INDEX_SQL = `
CREATE INDEX IF NOT EXISTS flashcards_topic_id_idx
ON flashcards (topic_id);
`;
