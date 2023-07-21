import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

import { getIGPostImgSRCs } from "../libs/IGImg";

export const instagramRouter = createTRPCRouter({
  imageFetcher: publicProcedure
    .input(z.object({ url: z.string().url() }))
    .query(async ({ input }) => {
      const res = await getIGPostImgSRCs({ postUrl: input.url });
      const imgSRCs = res.urls;
      if (imgSRCs.length === 0 || !imgSRCs[0]) {
        return { error: "I just cannot", raw: res.raw };
      }
      return {
        imgSrc: imgSRCs[0],
        imgSrcs: imgSRCs,
      };
    }),
});
