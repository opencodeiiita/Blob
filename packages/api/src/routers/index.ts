import { z } from "zod";
import { router, publicProcedure } from "../server.js";
import { users } from "@blob/db/schema";
import { OAuth2Client } from "google-auth-library";
import {eq} from "drizzle-orm";

const client = new OAuth2Client();

export const appRouter = router({
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
  testDB: publicProcedure.query(({ ctx }) => {
    return ctx.db.select().from(users);
  }),

  verifyGoogleToken: publicProcedure
    .input(z.object({ idToken: z.string() }))
    .mutation(async ({ input,ctx }) => {
      try {
        const ticket = await client.verifyIdToken({
          idToken: input.idToken,
        });
        const payload = ticket.getPayload();

        console.log("user data:", payload);
        if(!payload?.email){
          throw new Error("no email found");
        }

          const existingUser = await ctx.db
          .select()
          .from(users)
          .where(eq(users.email, payload.email))
          .limit(1);

        if (existingUser.length > 0) {
          await ctx.db
            .update(users)
            .set({ 
              lastLoginAt: new Date(),
              updatedAt: new Date()
            })
            .where(eq(users.email, payload.email));

            const lastlogin = existingUser[0].lastLoginAt;
          console.log(` previous login was at ${lastlogin}`);
          
     
        } else {
          await ctx.db.insert(users).values({
            name: payload.name || "Unknown",
            email: payload.email,
            image: payload.picture || null,
            lastLoginAt: new Date(),
          });
          
          console.log(`new user: ${payload.email}`);
        }

        return {
          success: true,
          user: payload,
        };
      } catch (error) {
        console.error("google token verification failed:", error);
        throw new Error(
          `token verification failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    }),
});

export type AppRouter = typeof appRouter;
