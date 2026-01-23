import { pgTable, text, timestamp, uuid, unique } from "drizzle-orm/pg-core";
import { users } from "./users";

export const settings = pgTable("settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  geminiApiKey: text("gemini_api_key"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
}, (table) => ({
  userIdUnique: unique().on(table.userId),
}));

export type Setting = typeof settings.$inferSelect;
export type NewSetting = typeof settings.$inferInsert;
