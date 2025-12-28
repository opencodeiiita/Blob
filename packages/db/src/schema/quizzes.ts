import { index, pgTable, text, timestamp, uuid, boolean } from "drizzle-orm/pg-core";
import { topics } from "./topics";

export const quizzes = pgTable("quizzes", {
        id: uuid("id").defaultRandom().primaryKey(),
        topicId: uuid("topic_id")
            .notNull()
            .references(() => topics.id, { onDelete: "cascade" }),
        title: text("title").notNull(),
        description: text("description"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .notNull()
            .$onUpdate(() => new Date()),
    },
    (table) => ({
        topicIdx: index("quizzes_topic_id_idx").on(table.topicId)
    })
);

export const quizQuestions = pgTable("quiz_questions", {
        id: uuid("id").defaultRandom().primaryKey(),
        quizId: uuid("quiz_id")
            .notNull()
            .references(() => quizzes.id, { onDelete: "cascade" }),
        question: text("question").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .notNull()
            .$onUpdate(() => new Date()),
    },
    (table) => ({
        quizIdx: index("quiz_questions_quiz_id_idx").on(table.quizId)
    })
);

export const quizOptions = pgTable("quiz_options", {
        id: uuid("id").defaultRandom().primaryKey(),
        questionId: uuid("question_id")
            .notNull()
            .references(() => quizQuestions.id, { onDelete: "cascade" }),
        optionText: text("option_text").notNull(),
        isCorrect: boolean("is_correct").default(false).notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => ({
        questionIdx: index("quiz_options_question_id_idx").on(table.questionId)
    })
);

export type Quiz = typeof quizzes.$inferSelect;
export type NewQuiz = typeof quizzes.$inferInsert;
export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type NewQuizQuestion = typeof quizQuestions.$inferInsert;
export type QuizOption = typeof quizOptions.$inferSelect;
export type NewQuizOption = typeof quizOptions.$inferInsert;
