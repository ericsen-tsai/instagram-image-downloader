import { type NextApiRequest, type NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const url = req.query.url as string;

  if (typeof url !== "string") {
    res.status(400).json({ error: "Invalid URL" });
  }

  await axios({
    method: "GET",
    url,
    responseType: "arraybuffer",
  })
    .then((response) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const buffer = Buffer.from(response.data, "binary");
      res.setHeader("Content-Type", "image/jpeg");
      res.setHeader("Content-Disposition", 'attachment; filename="image.jpeg"');
      res.send(buffer);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Failed to download image" });
    });
}
