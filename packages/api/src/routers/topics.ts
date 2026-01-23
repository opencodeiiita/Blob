import { z } from "zod";
import { router, secureProcedure } from "../server.js";
import { TRPCError } from "@trpc/server";
import { topics } from "@blob/db/schema";
import { eq, and } from "drizzle-orm";

export const topicsRouter = router({
  getAll: secureProcedure.query(async ({ ctx }) => {
    const topicsList = await ctx.db
      .select()
      .from(topics)
      .where(eq(topics.userId, ctx.userId));

    return { topics: topicsList };
  }),

  getById: secureProcedure
    .input(z.object({ topicId: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
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

      return { topic };
    }),

  create: secureProcedure
    .input(
      z.object({
        title: z.string().min(1, "Title is required"),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const [topic] = await ctx.db
        .insert(topics)
        .values({
          userId: ctx.userId,
          title: input.title,
          description: input.description ?? null,
        })
        .returning();

      return { topic };
    }),

  update: secureProcedure
    .input(
      z.object({
        topicId: z.string().uuid(),
        title: z.string().min(1).optional(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const [existing] = await ctx.db
        .select()
        .from(topics)
        .where(and(eq(topics.id, input.topicId), eq(topics.userId, ctx.userId)))
        .limit(1);

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Topic not found or you don't have access to it",
        });
      }

      const [updated] = await ctx.db
        .update(topics)
        .set({
          ...(input.title && { title: input.title }),
          ...(input.description !== undefined && {
            description: input.description,
          }),
        })
        .where(eq(topics.id, input.topicId))
        .returning();

      return { topic: updated };
    }),

  delete: secureProcedure
    .input(z.object({ topicId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const [existing] = await ctx.db
        .select()
        .from(topics)
        .where(and(eq(topics.id, input.topicId), eq(topics.userId, ctx.userId)))
        .limit(1);

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Topic not found or you don't have access to it",
        });
      }

      await ctx.db.delete(topics).where(eq(topics.id, input.topicId));

      return { success: true };
    }),
});
