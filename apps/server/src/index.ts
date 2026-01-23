import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { appRouter, createTRPCContext } from "@blob/api";
import { cors } from "hono/cors";
const app = new Hono();

app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS", "DELETE", "PUT"],
  }),
);

// app.get("/health", async (c) => {
//   return c.json({ message: "healthy", status: "ok" });
// });

// implemented Health Check Endpoint 
app.get("/health", (c) => {
  return c.json({
    status: "ok",
    service: "blob-server",
    timestamp: new Date().toISOString(),
  });
});

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: (opts) => createTRPCContext({ headers: opts.req.headers }),
  }),
);

const port = Number(process.env.PORT) || 8787;

// detect runtime using bun's golal context
const isBun = typeof (globalThis as any).Bun !== "undefined";

if (isBun) {
  // use bun for prod
  console.log(`🚀 Server running on Bun runtime at http://0.0.0.0:${port}`);
} else {
  // nodejs for dev, because not everyone has bun installted
  const { serve } = await import("@hono/node-server");

  serve({
    fetch: app.fetch,
    port,
    hostname: "0.0.0.0",
  });

  console.log(`🔧 Server running on Node.js runtime at http://0.0.0.0:${port}`);
}

// exports for the bun runtime
export default {
  port,
  hostname: "0.0.0.0",
  fetch: app.fetch,
};
