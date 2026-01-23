import { z } from "zod";
import { router, secureProcedure } from "../server.js";
import { TRPCError } from "@trpc/server";
import { userSettings } from "@blob/db/schema";
import { eq } from "drizzle-orm";

const aiProviderSchema = z.enum(["google", "openai"]);

export const settingsRouter = router({
  // Get user settings
  get: secureProcedure.query(async ({ ctx }) => {
    const [settings] = await ctx.db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, ctx.userId))
      .limit(1);

    if (!settings) {
      // Return default settings if none exist
      return {
        settings: {
          aiProvider: "google" as const,
          hasApiKey: false,
          preferredModel: null,
        },
      };
    }

    return {
      settings: {
        aiProvider: settings.aiProvider,
        hasApiKey: !!settings.encryptedApiKey,
        preferredModel: settings.preferredModel,
      },
    };
  }),

  // Update AI provider settings
  updateAiProvider: secureProcedure
    .input(
      z.object({
        provider: aiProviderSchema,
        apiKey: z.string().min(1, "API key is required"),
        model: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // TODO: In production, encrypt the API key before storing
      // For now, storing as-is (NOT secure for production)
      const encryptedKey = input.apiKey; // Replace with actual encryption

      const [existing] = await ctx.db
        .select()
        .from(userSettings)
        .where(eq(userSettings.userId, ctx.userId))
        .limit(1);

      if (existing) {
        const [updated] = await ctx.db
          .update(userSettings)
          .set({
            aiProvider: input.provider,
            encryptedApiKey: encryptedKey,
            preferredModel: input.model ?? null,
          })
          .where(eq(userSettings.userId, ctx.userId))
          .returning();

        return { success: true, provider: updated.aiProvider };
      } else {
        const [created] = await ctx.db
          .insert(userSettings)
          .values({
            userId: ctx.userId,
            aiProvider: input.provider,
            encryptedApiKey: encryptedKey,
            preferredModel: input.model ?? null,
          })
          .returning();

        return { success: true, provider: created.aiProvider };
      }
    }),

  // Remove API key
  removeApiKey: secureProcedure.mutation(async ({ ctx }) => {
    await ctx.db
      .update(userSettings)
      .set({
        encryptedApiKey: null,
      })
      .where(eq(userSettings.userId, ctx.userId));

    return { success: true };
  }),

  // Validate API key (test if it works)
  validateApiKey: secureProcedure.mutation(async ({ ctx }) => {
    const [settings] = await ctx.db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, ctx.userId))
      .limit(1);

    if (!settings?.encryptedApiKey) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No API key configured",
      });
    }

    // TODO: Actually test the API key by making a simple request
    // For now, just return success if key exists
    return { valid: true };
  }),
});
