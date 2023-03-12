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

export { crawlInstagramToGetImgSRCs };
