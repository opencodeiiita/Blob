import { z } from "zod";
import { router, publicProcedure } from "../server.js";
import { settings, flashcards, topics } from "@blob/db/schema";
import { eq } from "drizzle-orm";
import { generateFlashcards } from "../utils/gemini.js";
import { TRPCError } from "@trpc/server";

export const generateRouter = router({
  /**
   * Generate flashcards from topic content using Gemini API
   */
  flashcards: publicProcedure
    .input(
      z.object({
        topicId: z.string().uuid("Invalid topic ID"),
        content: z.string().min(1, "Content cannot be empty"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { topicId, content } = input;

      // Verify topic exists and get userId
      const topic = await ctx.db
        .select()
        .from(topics)
        .where(eq(topics.id, topicId))
        .limit(1);

      if (topic.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Topic not found",
        });
      }

      const userId = topic[0].userId;

      // Fetch user's API key from settings
      const userSettings = await ctx.db
        .select()
        .from(settings)
        .where(eq(settings.userId, userId))
        .limit(1);

      if (userSettings.length === 0 || !userSettings[0].geminiApiKey) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Gemini API key not found. Please configure your API key in settings.",
        });
      }

      const apiKey = userSettings[0].geminiApiKey;

      // Generate flashcards using Gemini API
      let generatedFlashcards;
      try {
        generatedFlashcards = await generateFlashcards(apiKey, content);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to generate flashcards";
        
        // Check for specific error types
        if (errorMessage.includes("API key") || errorMessage.includes("permission")) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: errorMessage,
          });
        }
        
        if (errorMessage.includes("rate limit")) {
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: errorMessage,
          });
        }
        
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: errorMessage,
        });
      }

      // Save flashcards to database
      const flashcardInserts = generatedFlashcards.map((card) => ({
        topicId,
        front: card.front,
        back: card.back,
        difficulty: card.difficulty || null,
        source: "gemini",
      }));

      try {
        const insertedFlashcards = await ctx.db
          .insert(flashcards)
          .values(flashcardInserts)
          .returning();

        return {
          success: true,
          flashcards: insertedFlashcards,
          count: insertedFlashcards.length,
        };
      } catch (dbError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to save flashcards to database: ${dbError instanceof Error ? dbError.message : "Unknown error"}`,
        });
      }
    }),
});
