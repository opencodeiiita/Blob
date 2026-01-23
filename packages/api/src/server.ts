import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { db } from "@blob/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

export const createTRPCContext = async (opts: { headers: Headers }) => {
  return {
    db,
    headers: opts.headers,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

/**
 * Protected procedure that requires a valid JWT token.
 * Extracts userId from the token and makes it available in ctx.userId
 */
export const secureProcedure = t.procedure.use(async ({ ctx, next }) => {
  const authHeader = ctx.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Missing or invalid authorization header",
    });
  }

  const token = authHeader.slice(7); // Remove "Bearer " prefix

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };

    return next({
      ctx: {
        ...ctx,
        userId: payload.userId,
      },
    });
  } catch (error) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid or expired token",
    });
  }
});
