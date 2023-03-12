import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

import { crawlInstagramToGetImgSRCs } from "../libs/web-crawl";

export const instagramRouter = createTRPCRouter({
  imageFetcher: publicProcedure
    .input(z.object({ url: z.string().url() }))
    .query(async ({ input }) => {
      const imgSRCs = await crawlInstagramToGetImgSRCs({ postUrl: input.url });
      if (imgSRCs.length === 0 || !imgSRCs[0]) {
        return { error: "I just cannot" };
      }
      return {
        imgSrc: imgSRCs[0],
      };
    }),
});
