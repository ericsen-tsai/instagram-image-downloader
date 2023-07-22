import { env } from "@/env.mjs";
import puppeteer from "puppeteer";

const crawlInstagramToGetImgSRCs = async ({ postUrl }: { postUrl: string }) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(postUrl, {
    waitUntil: "networkidle0",
  });

  await new Promise((r) => setTimeout(r, 1500));
  const imgSelector = await page.$$("article > div > div:first-child img");

  const imgs = await Promise.all(
    imgSelector?.map(async (el) => await el.evaluate((e) => e.src))
  );

  await browser.close();

  return imgs;
};

type IGResponse = {
  items: {
    carousel_media?: {
      image_versions2: {
        candidates: {
          url: string;
          width: number;
          height: number;
        }[];
      };
    }[];
    image_versions2?: {
      candidates: {
        url: string;
        width: number;
        height: number;
      }[];
    };
  }[];
};

const getIGPostImgSRCs = async ({ postUrl }: { postUrl: string }) => {
  const url = new URL(postUrl);
  const res = await fetch(
    url.origin + url.pathname + "?" + env.SECRET_QUERY_STRING,
    {
      headers: {
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        Cookie: env.SECRET_COOKIE,
      },
    }
  );
  const data = (await res.json()) as IGResponse;
  return {
    imgs:
      data.items[0]?.carousel_media?.map((media) => ({
        ...media.image_versions2.candidates[0],
      })) ||
      (data.items[0]?.image_versions2
        ? [data.items[0]?.image_versions2?.candidates[0]]
        : []),
  };
};

export { crawlInstagramToGetImgSRCs, getIGPostImgSRCs };
