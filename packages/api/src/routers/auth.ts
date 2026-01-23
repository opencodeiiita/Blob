import { z } from "zod";
import { router, publicProcedure, secureProcedure } from "../server.js";
import { oauthAccounts, users } from "@blob/db/schema";
import { OAuth2Client } from "google-auth-library";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

const client = new OAuth2Client();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

export const authRouter = router({
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
          console.log(`New user: ${payload.email}`);
        } else {
          console.log(`Existing user: ${payload.email}`);
        }

        const [existingOAuth] = await ctx.db
          .select()
          .from(oauthAccounts)
          .where(eq(oauthAccounts.providerUserId, payload.sub))
          .limit(1);

        if (existingOAuth?.lastLoginAt) {
          console.log(
            `Previous login was at: ${existingOAuth.lastLoginAt.toISOString()}`,
          );
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

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
          expiresIn: "7d",
        });

        return {
          success: true,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          },
          token,
        };
      } catch (error) {
        console.error("Google token verification failed:", error);
        throw new Error(
          `Token verification failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    }),

  getMe: secureProcedure.query(async ({ ctx }) => {
    const [user] = await ctx.db
      .select()
      .from(users)
      .where(eq(users.id, ctx.userId))
      .limit(1);

    if (!user) {
      throw new Error("User not found");
    }

    return { user };
  }),

  // TODO: Implement sign out - invalidate token on server side
  // For now, client-side logout is sufficient (clearing stored token)
  signOut: secureProcedure.mutation(async ({ ctx }) => {
    // In a production app, you would:
    // 1. Add the token to a blacklist/revoked tokens table
    // 2. Or use short-lived tokens with refresh token rotation
    // For now, return success - client handles clearing the token
    return { success: true };
  }),
});
