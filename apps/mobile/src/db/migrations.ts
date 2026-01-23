import * as SQLite from 'expo-sqlite';

import {
  TOPICS_TABLE_SQL,
  TOPICS_INDEX_SQL,
  QUIZZES_TABLE_SQL,
  QUIZZES_INDEX_SQL,
  QUIZ_QUESTIONS_TABLE_SQL,
  QUIZ_QUESTIONS_INDEX_SQL,
  QUIZ_OPTIONS_TABLE_SQL,
  QUIZ_OPTIONS_INDEX_SQL,
  FLASHCARDS_TABLE_SQL,
  FLASHCARDS_INDEX_SQL,
  MIND_MAPS_TABLE_SQL,
  MIND_MAPS_INDEX_SQL,
} from '@blob/db/mobile';

export async function runMigrations(db: SQLite.SQLiteDatabase) {
  // meta table (already there)
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS meta (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);

  // enable foreign keys
  await db.execAsync(`PRAGMA foreign_keys = ON;`);

  // order matters
  await db.execAsync(TOPICS_TABLE_SQL);
  await db.execAsync(TOPICS_INDEX_SQL);

  await db.execAsync(QUIZZES_TABLE_SQL);
  await db.execAsync(QUIZZES_INDEX_SQL);

  await db.execAsync(QUIZ_QUESTIONS_TABLE_SQL);
  await db.execAsync(QUIZ_QUESTIONS_INDEX_SQL);

  await db.execAsync(QUIZ_OPTIONS_TABLE_SQL);
  await db.execAsync(QUIZ_OPTIONS_INDEX_SQL);

  await db.execAsync(FLASHCARDS_TABLE_SQL);
  await db.execAsync(FLASHCARDS_INDEX_SQL);

  await db.execAsync(MIND_MAPS_TABLE_SQL);
  await db.execAsync(MIND_MAPS_INDEX_SQL);
}
