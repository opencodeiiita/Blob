import { z } from "zod";
import { router, publicProcedure } from "../server.js";
import { oauthAccounts, users } from "@blob/db/schema";
import { OAuth2Client } from "google-auth-library";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

const client = new OAuth2Client();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

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
    .mutation(async ({ input, ctx }) => {
      try {
        const ticket = await client.verifyIdToken({
          idToken: input.idToken,
        });
        const payload = ticket.getPayload();

        if (!payload?.email || !payload?.sub) {
          throw new Error("No email or user ID found");
        }
        let [user] = await ctx.db
          .select()
          .from(users)
          .where(eq(users.email, payload.email))
          .limit(1);

        if (!user) {
          [user] = await ctx.db
            .insert(users)
            .values({
              name: payload.name || "Unknown",
              email: payload.email,
              image: payload.picture || null,
            })
            .returning();
          console.log(`New guy : ${payload.email}`);
        } else {
          console.log(`Current guy ${payload.email}`);
        }

        
        const [existingOAuth] = await ctx.db
          .select()
          .from(oauthAccounts)
          .where(eq(oauthAccounts.providerUserId, payload.sub))
          .limit(1);

        if (existingOAuth?.lastLoginAt) {
          console.log(`Previous login was at: ${existingOAuth.lastLoginAt.toISOString()}`);
        }

        
        await ctx.db
          .insert(oauthAccounts)
          .values({
            userId: user.id,
            providerId: "google",
            providerUserId: payload.sub,
            lastLoginAt: new Date(),
          })
          .onConflictDoUpdate({
            target: [oauthAccounts.providerId, oauthAccounts.providerUserId],
            set: {
              lastLoginAt: new Date(),
              updatedAt: new Date(),
            },
          });

        // Generate JWT with only the userId
        const token = jwt.sign(
          { userId: user.id },
          JWT_SECRET,
          { expiresIn: "7d" }
        );

        return {
          success: true,
          user: payload,
          token,
        };
      } catch (error) {
        console.error("Google token verification failed:", error);
        throw new Error(
          `Token verification failed: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }),
});

export type AppRouter = typeof appRouter;
