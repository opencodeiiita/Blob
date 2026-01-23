import { getDatabase } from './database';
import { runMigrations } from './migrations';

export async function initDatabase() {
  const db = await getDatabase();
  await runMigrations(db);
}

export * from './topicsRepository';