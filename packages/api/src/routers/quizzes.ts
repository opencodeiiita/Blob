import { z } from "zod";
import { router, secureProcedure } from "../server.js";
import { TRPCError } from "@trpc/server";
import { quizzes, quizQuestions, quizOptions, topics } from "@blob/db/schema";
import { eq, and } from "drizzle-orm";

export const quizzesRouter = router({
  // Get all quizzes for a topic
  getByTopic: secureProcedure
    .input(z.object({ topicId: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      // Verify user owns the topic
      const [topic] = await ctx.db
        .select()
        .from(topics)
        .where(and(eq(topics.id, input.topicId), eq(topics.userId, ctx.userId)))
        .limit(1);

      if (!topic) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Topic not found or you don't have access to it",
        });
      }

      const quizList = await ctx.db
        .select()
        .from(quizzes)
        .where(eq(quizzes.topicId, input.topicId));

      return { quizzes: quizList };
    }),

  // Get a quiz with all its questions and options
  getById: secureProcedure
    .input(z.object({ quizId: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      // Get quiz and verify ownership
      const [quizData] = await ctx.db
        .select({
          quiz: quizzes,
          topic: topics,
        })
        .from(quizzes)
        .innerJoin(topics, eq(quizzes.topicId, topics.id))
        .where(and(eq(quizzes.id, input.quizId), eq(topics.userId, ctx.userId)))
        .limit(1);

      if (!quizData) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Quiz not found or you don't have access to it",
        });
      }

      // Get all questions for this quiz
      const questions = await ctx.db
        .select()
        .from(quizQuestions)
        .where(eq(quizQuestions.quizId, input.quizId));

      // Get all options for all questions
      const questionIds = questions.map((q) => q.id);
      const options =
        questionIds.length > 0
          ? await ctx.db.select().from(quizOptions).where(
              eq(
                quizOptions.questionId,
                questionIds[0], // TODO: Use inArray when needed
              ),
            )
          : [];

      // Organize questions with their options
      const questionsWithOptions = questions.map((question) => ({
        ...question,
        options: options.filter((o) => o.questionId === question.id),
      }));

      return {
        quiz: quizData.quiz,
        questions: questionsWithOptions,
      };
    }),

  // Create a quiz with questions and options (for AI-generated content)
  create: secureProcedure
    .input(
      z.object({
        topicId: z.string().uuid(),
        title: z.string().min(1, "Title is required"),
        description: z.string().optional(),
        questions: z
          .array(
            z.object({
              question: z.string().min(1),
              options: z.array(
                z.object({
                  text: z.string().min(1),
                  isCorrect: z.boolean(),
                }),
              ),
            }),
          )
          .optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Verify user owns the topic
      const [topic] = await ctx.db
        .select()
        .from(topics)
        .where(and(eq(topics.id, input.topicId), eq(topics.userId, ctx.userId)))
        .limit(1);

      if (!topic) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Topic not found or you don't have access to it",
        });
      }

      // Create the quiz
      const [quiz] = await ctx.db
        .insert(quizzes)
        .values({
          topicId: input.topicId,
          title: input.title,
          description: input.description ?? null,
        })
        .returning();

      // If questions provided, create them with options
      if (input.questions && input.questions.length > 0) {
        for (const q of input.questions) {
          const [question] = await ctx.db
            .insert(quizQuestions)
            .values({
              quizId: quiz.id,
              question: q.question,
            })
            .returning();

          if (q.options && q.options.length > 0) {
            await ctx.db.insert(quizOptions).values(
              q.options.map((opt) => ({
                questionId: question.id,
                optionText: opt.text,
                isCorrect: opt.isCorrect,
              })),
            );
          }
        }
      }

      return { quiz };
    }),

  // Add a question to an existing quiz
  addQuestion: secureProcedure
    .input(
      z.object({
        quizId: z.string().uuid(),
        question: z.string().min(1),
        options: z.array(
          z.object({
            text: z.string().min(1),
            isCorrect: z.boolean(),
          }),
        ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Verify ownership
      const [quizData] = await ctx.db
        .select({
          quiz: quizzes,
          topic: topics,
        })
        .from(quizzes)
        .innerJoin(topics, eq(quizzes.topicId, topics.id))
        .where(and(eq(quizzes.id, input.quizId), eq(topics.userId, ctx.userId)))
        .limit(1);

      if (!quizData) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Quiz not found or you don't have access to it",
        });
      }

      const [question] = await ctx.db
        .insert(quizQuestions)
        .values({
          quizId: input.quizId,
          question: input.question,
        })
        .returning();

      const options = await ctx.db
        .insert(quizOptions)
        .values(
          input.options.map((opt) => ({
            questionId: question.id,
            optionText: opt.text,
            isCorrect: opt.isCorrect,
          })),
        )
        .returning();

      return { question: { ...question, options } };
    }),

  // Delete a quiz (cascades to questions and options)
  delete: secureProcedure
    .input(z.object({ quizId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      // Verify ownership
      const [quizData] = await ctx.db
        .select({
          quiz: quizzes,
          topic: topics,
        })
        .from(quizzes)
        .innerJoin(topics, eq(quizzes.topicId, topics.id))
        .where(and(eq(quizzes.id, input.quizId), eq(topics.userId, ctx.userId)))
        .limit(1);

      if (!quizData) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Quiz not found or you don't have access to it",
        });
      }

      await ctx.db.delete(quizzes).where(eq(quizzes.id, input.quizId));

      return { success: true };
    }),

  // Delete a specific question
  deleteQuestion: secureProcedure
    .input(z.object({ questionId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      // Verify ownership through quiz -> topic
      const [questionData] = await ctx.db
        .select({
          question: quizQuestions,
          quiz: quizzes,
          topic: topics,
        })
        .from(quizQuestions)
        .innerJoin(quizzes, eq(quizQuestions.quizId, quizzes.id))
        .innerJoin(topics, eq(quizzes.topicId, topics.id))
        .where(
          and(
            eq(quizQuestions.id, input.questionId),
            eq(topics.userId, ctx.userId),
          ),
        )
        .limit(1);

      if (!questionData) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Question not found or you don't have access to it",
        });
      }

      await ctx.db
        .delete(quizQuestions)
        .where(eq(quizQuestions.id, input.questionId));

      return { success: true };
    }),
});
