import { z } from "zod";
import { router, publicProcedure } from "../server.js";
import { users } from "@blob/db/schema";
import { generateRouter } from "./generate.js";

// Import modular routers
import { authRouter } from "./auth.js";
import { topicsRouter } from "./topics.js";
import { flashcardsRouter } from "./flashcards.js";
import { quizzesRouter } from "./quizzes.js";
import { mindMapsRouter } from "./mindmaps.js";
import { settingsRouter } from "./settings.js";
import { generateRouter } from "./generate.js";

export const appRouter = router({
  // Public utility routes
  hello: publicProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.name ?? "World"}!`,
      };
    }),

  getTime: publicProcedure.query(() => {
    return {
      time: new Date().toISOString(),
    };
  }),

  echo: publicProcedure
    .input(z.object({ message: z.string() }))
    .mutation(({ input }) => {
      return {
        message: input.message,
      };
    }),
  testDB: publicProcedure
    .query(({ ctx }) => {
      return ctx.db.select().from(users)
    }),
  
  generate: generateRouter,
});

export type AppRouter = typeof appRouter;

// Re-export individual routers for direct access if needed
export {
  authRouter,
  topicsRouter,
  flashcardsRouter,
  quizzesRouter,
  mindMapsRouter,
  settingsRouter,
  generateRouter,
};
