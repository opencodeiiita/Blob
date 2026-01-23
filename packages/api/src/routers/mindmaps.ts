import { z } from "zod";
import { router, secureProcedure } from "../server.js";
import { TRPCError } from "@trpc/server";
import { mindMaps, topics } from "@blob/db/schema";
import { eq, and } from "drizzle-orm";

// Schema for mind map data structure
const mindMapNodeSchema = z.object({
  id: z.string(),
  label: z.string(),
  parentId: z.string().optional(),
});

const mindMapDataSchema = z.object({
  root: z.string(),
  nodes: z.array(mindMapNodeSchema),
});

export const mindMapsRouter = router({
  // Get all mind maps for a topic
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

      const maps = await ctx.db
        .select()
        .from(mindMaps)
        .where(eq(mindMaps.topicId, input.topicId));

      return { mindMaps: maps };
    }),

  // Get a single mind map
  getById: secureProcedure
    .input(z.object({ mindMapId: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const [mapData] = await ctx.db
        .select({
          mindMap: mindMaps,
          topic: topics,
        })
        .from(mindMaps)
        .innerJoin(topics, eq(mindMaps.topicId, topics.id))
        .where(
          and(eq(mindMaps.id, input.mindMapId), eq(topics.userId, ctx.userId)),
        )
        .limit(1);

      if (!mapData) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Mind map not found or you don't have access to it",
        });
      }

      return { mindMap: mapData.mindMap };
    }),

  // Create a mind map
  create: secureProcedure
    .input(
      z.object({
        topicId: z.string().uuid(),
        data: mindMapDataSchema,
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

      const [mindMap] = await ctx.db
        .insert(mindMaps)
        .values({
          topicId: input.topicId,
          data: input.data,
        })
        .returning();

      return { mindMap };
    }),

  // Update a mind map
  update: secureProcedure
    .input(
      z.object({
        mindMapId: z.string().uuid(),
        data: mindMapDataSchema,
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Verify ownership
      const [existing] = await ctx.db
        .select({
          mindMap: mindMaps,
          topic: topics,
        })
        .from(mindMaps)
        .innerJoin(topics, eq(mindMaps.topicId, topics.id))
        .where(
          and(eq(mindMaps.id, input.mindMapId), eq(topics.userId, ctx.userId)),
        )
        .limit(1);

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Mind map not found or you don't have access to it",
        });
      }

      const [updated] = await ctx.db
        .update(mindMaps)
        .set({ data: input.data })
        .where(eq(mindMaps.id, input.mindMapId))
        .returning();

      return { mindMap: updated };
    }),

  // Delete a mind map
  delete: secureProcedure
    .input(z.object({ mindMapId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      // Verify ownership
      const [existing] = await ctx.db
        .select({
          mindMap: mindMaps,
          topic: topics,
        })
        .from(mindMaps)
        .innerJoin(topics, eq(mindMaps.topicId, topics.id))
        .where(
          and(eq(mindMaps.id, input.mindMapId), eq(topics.userId, ctx.userId)),
        )
        .limit(1);

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Mind map not found or you don't have access to it",
        });
      }

      await ctx.db.delete(mindMaps).where(eq(mindMaps.id, input.mindMapId));

      return { success: true };
    }),
});
