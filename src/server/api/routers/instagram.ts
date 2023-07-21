import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

import { getIGPostImgSRCs } from "../libs/IGImg";

export const instagramRouter = createTRPCRouter({
  imageFetcher: publicProcedure
    .input(z.object({ url: z.string().url() }))
    .query(async ({ input }) => {
      const res = await getIGPostImgSRCs({ postUrl: input.url });
      const imgs = res.imgs;
      if (imgs.length === 0 || !imgs[0]) {
        return { error: "I just cannot" };
      }
      return {
        imgSrc: imgs[0].url,
        imgs,
      };
    }),
});
