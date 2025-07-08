import { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { q } = req.query;

  try {
    const response = await axios.get("https://serpapi.com/search.json", {
      params: {
        api_key: process.env.SERP_API_KEY,
        q,
        num: 50,
        hl: "tr",
        gl: "tr",
      },
    });

    res.status(200).json(response.data);
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      console.error("Proxy API hatası:", err.message);
      res.status(500).json({ error: "Proxy API hatası: " + err.message });
    } else {
      console.error("Bilinmeyen hata:", err);
      res.status(500).json({ error: "Bilinmeyen bir hata oluştu." });
    }
  }
}
