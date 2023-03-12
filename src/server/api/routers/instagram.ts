import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const instagramRouter = createTRPCRouter({
  imageFetcher: publicProcedure
    .input(z.object({ url: z.string() }))
    .query(({ input }) => {
      return {
        imgSrc: `${input.url}`,
      };
    }),
});
