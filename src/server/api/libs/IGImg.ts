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
  graphql: {
    shortcode_media: {
      display_resources: {
        src: string;
      }[];
    };
  };
};

const getIGPostImgSRCs = async ({ postUrl }: { postUrl: string }) => {
  const url = new URL(postUrl);
  const res = await fetch(
    url.origin + url.pathname + "?" + env.SECRET_QUERY_STRING,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = (await res.json()) as IGResponse;

  return (
    data?.graphql?.shortcode_media.display_resources.map(
      (resource) => resource.src
    ) || []
  );
};

export { crawlInstagramToGetImgSRCs, getIGPostImgSRCs };
