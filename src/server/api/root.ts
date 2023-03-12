import { createTRPCRouter } from "@/server/api/trpc";
import { instagramRouter } from "@/server/api/routers/instagram";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  instagram: instagramRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
