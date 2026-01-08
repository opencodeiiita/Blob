// Mobile SQLite schema
// Keep in sync with packages/db/src/schema/quizzes.ts

export const QUIZZES_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS quizzes (
  id TEXT PRIMARY KEY NOT NULL,
  topic_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
);
`;

export const QUIZZES_INDEX_SQL = `
CREATE INDEX IF NOT EXISTS quizzes_topic_id_idx
ON quizzes (topic_id);
`;

export const QUIZ_QUESTIONS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS quiz_questions (
  id TEXT PRIMARY KEY NOT NULL,
  quiz_id TEXT NOT NULL,
  question TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);
`;

export const QUIZ_QUESTIONS_INDEX_SQL = `
CREATE INDEX IF NOT EXISTS quiz_questions_quiz_id_idx
ON quiz_questions (quiz_id);
`;

export const QUIZ_OPTIONS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS quiz_options (
  id TEXT PRIMARY KEY NOT NULL,
  question_id TEXT NOT NULL,
  option_text TEXT NOT NULL,
  is_correct INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (question_id) REFERENCES quiz_questions(id) ON DELETE CASCADE
);
`;

export const QUIZ_OPTIONS_INDEX_SQL = `
CREATE INDEX IF NOT EXISTS quiz_options_question_id_idx
ON quiz_options (question_id);
`;
