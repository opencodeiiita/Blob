import { z } from "zod";
import { router, secureProcedure } from "../server.js";
import { TRPCError } from "@trpc/server";
import { flashcards, topics } from "@blob/db/schema";
import { eq, and } from "drizzle-orm";

const difficultyEnum = z.enum(["easy", "medium", "hard"]);

export const flashcardsRouter = router({
  // Get all flashcards for a topic
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

      const cards = await ctx.db
        .select()
        .from(flashcards)
        .where(eq(flashcards.topicId, input.topicId));

      return { flashcards: cards };
    }),

  // Get a single flashcard
  getById: secureProcedure
    .input(z.object({ flashcardId: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const [card] = await ctx.db
        .select({
          flashcard: flashcards,
          topic: topics,
        })
        .from(flashcards)
        .innerJoin(topics, eq(flashcards.topicId, topics.id))
        .where(
          and(
            eq(flashcards.id, input.flashcardId),
            eq(topics.userId, ctx.userId),
          ),
        )
        .limit(1);

      if (!card) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Flashcard not found or you don't have access to it",
        });
      }

      return { flashcard: card.flashcard };
    }),

  // Create a single flashcard
  create: secureProcedure
    .input(
      z.object({
        topicId: z.string().uuid(),
        front: z.string().min(1, "Front side is required"),
        back: z.string().min(1, "Back side is required"),
        difficulty: difficultyEnum.optional(),
        source: z.string().optional(),
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

      const [card] = await ctx.db
        .insert(flashcards)
        .values({
          topicId: input.topicId,
          front: input.front,
          back: input.back,
          difficulty: input.difficulty ?? null,
          source: input.source ?? null,
        })
        .returning();

      return { flashcard: card };
    }),

  // Create multiple flashcards (for AI-generated batch)
  createMany: secureProcedure
    .input(
      z.object({
        topicId: z.string().uuid(),
        flashcards: z.array(
          z.object({
            front: z.string().min(1),
            back: z.string().min(1),
            difficulty: difficultyEnum.optional(),
          }),
        ),
        source: z.string().optional(),
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

      const cards = await ctx.db
        .insert(flashcards)
        .values(
          input.flashcards.map((card) => ({
            topicId: input.topicId,
            front: card.front,
            back: card.back,
            difficulty: card.difficulty ?? null,
            source: input.source ?? "ai-generated",
          })),
        )
        .returning();

      return { flashcards: cards };
    }),

  // Update a flashcard
  update: secureProcedure
    .input(
      z.object({
        flashcardId: z.string().uuid(),
        front: z.string().min(1).optional(),
        back: z.string().min(1).optional(),
        difficulty: difficultyEnum.optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Verify ownership through topic
      const [existing] = await ctx.db
        .select({
          flashcard: flashcards,
          topic: topics,
        })
        .from(flashcards)
        .innerJoin(topics, eq(flashcards.topicId, topics.id))
        .where(
          and(
            eq(flashcards.id, input.flashcardId),
            eq(topics.userId, ctx.userId),
          ),
        )
        .limit(1);

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Flashcard not found or you don't have access to it",
        });
      }

      const [updated] = await ctx.db
        .update(flashcards)
        .set({
          ...(input.front && { front: input.front }),
          ...(input.back && { back: input.back }),
          ...(input.difficulty && { difficulty: input.difficulty }),
        })
        .where(eq(flashcards.id, input.flashcardId))
        .returning();

      return { flashcard: updated };
    }),

  // Delete a flashcard
  delete: secureProcedure
    .input(z.object({ flashcardId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      // Verify ownership through topic
      const [existing] = await ctx.db
        .select({
          flashcard: flashcards,
          topic: topics,
        })
        .from(flashcards)
        .innerJoin(topics, eq(flashcards.topicId, topics.id))
        .where(
          and(
            eq(flashcards.id, input.flashcardId),
            eq(topics.userId, ctx.userId),
          ),
        )
        .limit(1);

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Flashcard not found or you don't have access to it",
        });
      }

      await ctx.db
        .delete(flashcards)
        .where(eq(flashcards.id, input.flashcardId));

      return { success: true };
    }),

  // Delete all flashcards for a topic
  deleteByTopic: secureProcedure
    .input(z.object({ topicId: z.string().uuid() }))
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

      await ctx.db
        .delete(flashcards)
        .where(eq(flashcards.topicId, input.topicId));

      return { success: true };
    }),
});
